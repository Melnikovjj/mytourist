import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ProjectsService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, data: {
        title: string;
        description?: string;
        type?: string;
        season?: string;
        startDate?: string;
        endDate?: string;
    }) {
        const inviteCode = uuid().slice(0, 8);

        const project = await this.prisma.project.create({
            data: {
                title: data.title,
                description: data.description,
                type: (data.type as any) || 'hiking',
                season: (data.season as any) || 'summer',
                startDate: data.startDate ? new Date(data.startDate) : null,
                endDate: data.endDate ? new Date(data.endDate) : null,
                inviteCode,
                ownerId: userId,
                members: {
                    create: { userId, role: 'owner' },
                },
            },
            include: { members: { include: { user: true } } },
        });

        return this.serializeProject(project);
    }

    async findAllForUser(userId: string) {
        const memberships = await this.prisma.projectMember.findMany({
            where: { userId },
            include: {
                project: {
                    include: {
                        members: { include: { user: true } },
                        equipment: true,
                    },
                },
            },
        });

        return memberships.map((m) => {
            const project = this.serializeProject(m.project);
            const totalEquipment = m.project.equipment.length;
            const packedEquipment = m.project.equipment.filter((e) => e.status === 'packed').length;
            const readiness = totalEquipment > 0
                ? Math.round((packedEquipment / totalEquipment) * 100)
                : 0;
            return { ...project, role: m.role, readiness };
        });
    }

    async findById(projectId: string, userId: string) {
        const member = await this.prisma.projectMember.findUnique({
            where: { projectId_userId: { projectId, userId } },
        });
        if (!member) throw new ForbiddenException('Not a member of this project');

        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            include: {
                members: { include: { user: true } },
                equipment: { include: { equipment: true, assignedTo: true } },
                meals: { include: { products: true } },
            },
        });
        if (!project) throw new NotFoundException('Project not found');
        return { ...this.serializeProject(project), role: member.role };
    }

    async joinByInviteCode(userId: string, inviteCode: string) {
        const project = await this.prisma.project.findUnique({
            where: { inviteCode },
        });
        if (!project) throw new NotFoundException('Invalid invite code');

        const existing = await this.prisma.projectMember.findUnique({
            where: { projectId_userId: { projectId: project.id, userId } },
        });
        if (existing) return { message: 'Already a member', projectId: project.id };

        await this.prisma.projectMember.create({
            data: { projectId: project.id, userId, role: 'editor' },
        });

        return { message: 'Joined successfully', projectId: project.id };
    }

    async updateMemberRole(projectId: string, targetUserId: string, role: string) {
        return this.prisma.projectMember.update({
            where: { projectId_userId: { projectId, userId: targetUserId } },
            data: { role },
        });
    }

    async deleteProject(projectId: string, userId: string) {
        const project = await this.prisma.project.findUnique({ where: { id: projectId } });
        if (!project) throw new NotFoundException();
        if (project.ownerId !== userId) throw new ForbiddenException('Only the owner can delete');
        await this.prisma.project.delete({ where: { id: projectId } });
        return { message: 'Project deleted' };
    }

    async updateProject(projectId: string, userId: string, data: any) {
        const project = await this.prisma.project.findUnique({ where: { id: projectId } });
        if (!project) throw new NotFoundException();
        if (project.ownerId !== userId) throw new ForbiddenException('Only the owner can update');

        const updated = await this.prisma.project.update({
            where: { id: projectId },
            data: {
                title: data.title,
                description: data.description,
                type: data.type,
                season: data.season,
                startDate: data.startDate ? new Date(data.startDate) : undefined,
                endDate: data.endDate ? new Date(data.endDate) : undefined,
            },
            include: { members: { include: { user: true } } },
        });
        return this.serializeProject(updated);
    }

    private serializeProject(project: any) {
        return {
            ...project,
            members: project.members?.map((m: any) => ({
                ...m,
                user: m.user ? { ...m.user, telegramId: m.user.telegramId.toString() } : m.user,
            })),
        };
    }
}
