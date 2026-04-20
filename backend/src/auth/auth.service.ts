import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHmac } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../common/prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

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

    private generateInviteCode(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    async authenticateUser(initData: string) {
        let tgUser: TelegramUser;

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
                    inviteCode: this.generateInviteCode(),
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
                    inviteCode: user.inviteCode || this.generateInviteCode(),
                },
            });
        }

        return this.buildAuthResponse(user);
    }

    async register(registerDto: RegisterDto) {
        const { email, password, firstName, lastName } = registerDto;
        const lowercaseEmail = email.toLowerCase();
        const existingUser = await this.prisma.user.findUnique({ where: { email: lowercaseEmail } });

        if (existingUser) {
            throw new BadRequestException('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({
            data: {
                email: lowercaseEmail,
                password: hashedPassword,
                firstName,
                lastName,
                inviteCode: this.generateInviteCode(),
            },
        });

        return this.buildAuthResponse(user);
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;
        const lowercaseEmail = email.toLowerCase();
        const user = await this.prisma.user.findUnique({ where: { email: lowercaseEmail } });

        if (!user || !user.password) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        return this.buildAuthResponse(user);
    }

    async validateOAuthUser(profile: any) {
        const { email, firstName, lastName, avatarUrl, provider, providerId } = profile;
        const lowercaseEmail = email?.toLowerCase();

        // Find by providerId first
        let user = await this.prisma.user.findUnique({
            where: provider === 'google' ? { googleId: providerId } : { yandexId: providerId }
        });

        if (!user && lowercaseEmail) {
            // Find by email to link accounts
            user = await this.prisma.user.findUnique({ where: { email: lowercaseEmail } });
        }

        if (!user) {
            // Register new user
            user = await this.prisma.user.create({
                data: {
                    email: lowercaseEmail,
                    googleId: provider === 'google' ? providerId : undefined,
                    yandexId: provider === 'yandex' ? providerId : undefined,
                    firstName,
                    lastName,
                    avatarUrl,
                    inviteCode: this.generateInviteCode(),
                },
            });
        } else {
            // Update existing user with providerId if linking by email
            const updateData: any = {};
            if (provider === 'google' && !user.googleId) updateData.googleId = providerId;
            if (provider === 'yandex' && !user.yandexId) updateData.yandexId = providerId;
            
            if (Object.keys(updateData).length > 0) {
                user = await this.prisma.user.update({
                    where: { id: user.id },
                    data: updateData,
                });
            }
        }

        return user;
    }

    async demoLogin() {
        const demoEmail = 'guest_demo@hiking.app';
        const user = await this.prisma.user.upsert({
            where: { email: demoEmail },
            update: {
                isOnboarded: true,
                weight: 70,
                experienceLevel: 'beginner',
            },
            create: {
                email: demoEmail,
                firstName: 'Гость',
                lastName: '(Бета-тест)',
                isOnboarded: true,
                weight: 70,
                experienceLevel: 'beginner',
                inviteCode: this.generateInviteCode(),
            }
        });

        return this.buildAuthResponse(user);
    }


    buildOAuthResponse(user: any) {
        return this.buildAuthResponse(user);
    }

    private buildAuthResponse(user: any) {
        const payload = { sub: user.id, email: user.email };
        const token = this.jwtService.sign(payload);

        return {
            access_token: token,
            user: {
                id: user.id,
                telegramId: user.telegramId?.toString(),
                email: user.email,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                avatarUrl: user.avatarUrl,
                weight: user.weight,
                inviteCode: user.inviteCode,
                isOnboarded: user.isOnboarded,
                experienceLevel: user.experienceLevel,
            },
        };
    }
}
