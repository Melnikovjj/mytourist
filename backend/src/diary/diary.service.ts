import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class DiaryService {
    constructor(private prisma: PrismaService) { }

    async getProjectDiary(projectId: string, userId: string) {
        // Confirm user is a member or owner
        const isMember = await this.prisma.projectMember.findFirst({
            where: { projectId, userId }
        });
        const project = await this.prisma.project.findUnique({ where: { id: projectId } });

        if (!isMember && project?.ownerId !== userId) {
            throw new ForbiddenException('You must be a member of this project to view the diary.');
        }

        return this.prisma.diaryEntry.findMany({
            where: { projectId },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatarUrl: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async addDiaryEntry(projectId: string, userId: string, content: string, imageUrl?: string) {
        // Need to be a member
        const isMember = await this.prisma.projectMember.findFirst({
            where: { projectId, userId }
        });
        const project = await this.prisma.project.findUnique({ where: { id: projectId } });

        if (!isMember && project?.ownerId !== userId) {
            throw new ForbiddenException('You must be a member of this project to post to the diary.');
        }

        return this.prisma.diaryEntry.create({
            data: {
                projectId,
                userId,
                content,
                imageUrl
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatarUrl: true
                    }
                }
            }
        });
    }
}
