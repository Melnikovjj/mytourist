import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class MessagesService {
    constructor(private prisma: PrismaService) { }

    async create(senderId: string, projectId: string, content: string) {
        return this.prisma.message.create({
            data: {
                senderId,
                projectId,
                content,
            },
            include: {
                sender: true,
            },
        });
    }

    async findAllByProject(projectId: string) {
        return this.prisma.message.findMany({
            where: { projectId },
            include: {
                sender: true,
            },
            orderBy: {
                createdAt: 'asc',
            },
            take: 100, // Limit to last 100 messages for now
        });
    }
}
