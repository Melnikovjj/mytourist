import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findById(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                memberships: {
                    include: {
                        project: true
                    }
                }
            }
        });
        if (!user) throw new NotFoundException('User not found');
        return this.serializeUser(user);
    }

    async updateProfile(id: string, data: { weight?: number; username?: string }) {
        const user = await this.prisma.user.update({
            where: { id },
            data,
        });
        return this.serializeUser(user);
    }

    private serializeUser(user: any) {
        return {
            ...user,
            telegramId: user.telegramId.toString(),
        };
    }
}
