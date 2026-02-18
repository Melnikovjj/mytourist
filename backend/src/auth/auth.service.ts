import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHmac } from 'crypto';
import { PrismaService } from '../common/prisma/prisma.service';

interface TelegramUser {
    id: number;
    first_name?: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
}

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    validateInitData(initData: string): TelegramUser {
        const params = new URLSearchParams(initData);
        const hash = params.get('hash');
        if (!hash) throw new UnauthorizedException('Missing hash');

        params.delete('hash');
        const dataCheckArr = Array.from(params.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => `${key}=${value}`);
        const dataCheckString = dataCheckArr.join('\n');

        const botToken = process.env.BOT_TOKEN || '';
        const secretKey = createHmac('sha256', 'WebAppData').update(botToken).digest();
        const calculatedHash = createHmac('sha256', secretKey)
            .update(dataCheckString)
            .digest('hex');

        if (calculatedHash !== hash) {
            throw new UnauthorizedException('Invalid Telegram signature');
        }

        const userStr = params.get('user');
        if (!userStr) throw new UnauthorizedException('Missing user data');

        return JSON.parse(userStr);
    }

    async authenticateUser(initData: string) {
        let tgUser: TelegramUser;

        // Dev fallback for browser testing (outside Telegram)
        if (initData === 'dev_mode=true') {
            tgUser = {
                id: 123456789,
                first_name: 'Тест',
                last_name: 'Пользователь',
                username: 'test_user',
            };
        } else {
            tgUser = this.validateInitData(initData);
        }

        let user = await this.prisma.user.findUnique({
            where: { telegramId: BigInt(tgUser.id) },
        });

        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    telegramId: BigInt(tgUser.id),
                    username: tgUser.username,
                    firstName: tgUser.first_name,
                    lastName: tgUser.last_name,
                    avatarUrl: tgUser.photo_url,
                },
            });
        } else {
            user = await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    username: tgUser.username,
                    firstName: tgUser.first_name,
                    lastName: tgUser.last_name,
                    avatarUrl: tgUser.photo_url,
                },
            });
        }

        const payload = { sub: user.id, telegramId: tgUser.id.toString() };
        const token = this.jwtService.sign(payload);

        return {
            access_token: token,
            user: {
                id: user.id,
                telegramId: user.telegramId.toString(),
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                avatarUrl: user.avatarUrl,
                weight: user.weight,
            },
        };
    }
}
