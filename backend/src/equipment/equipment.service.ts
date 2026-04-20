import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';


@Injectable()
export class EquipmentService {
    constructor(private prisma: PrismaService) { }

    // ── Catalog ───────────────────────────────────────
    async getCatalog() {
        return this.prisma.equipmentItem.findMany({
            orderBy: { category: 'asc' },
        });
    }

    // ── Auto-generate gear list based on project type/season ──
    async autoGenerate(projectId: string) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            include: { equipment: true },
        });
        if (!project) throw new NotFoundException('Project not found');

        // Filter equipment by project type
        const excludeCategories: string[] = [];
        if (project.type !== 'ski') excludeCategories.push('Зимнее');
        if (project.type !== 'water') excludeCategories.push('Водное');

        const items = await this.prisma.equipmentItem.findMany({
            where: {
                category: { notIn: excludeCategories },
            },
        });

        // Define core gear by project type
        const filteredItems = items.filter((item) => {
            // Seasonal filters
            if (project.season === 'summer' && item.name.includes('зима')) return false;
            if (project.season === 'winter' && item.name.includes('лето')) return false;
            
            // Type filters
            if (project.type === 'hiking') {
                if (item.category === 'Водное' || item.category === 'Зимнее') return false;
            }
            if (project.type === 'water' && item.category === 'Зимнее') return false;
            
            return true;
        });

        // Check existing equipment
        const existingIds = new Set(project.equipment.map((e) => e.equipmentId));

        const toCreate = filteredItems
            .filter((item) => !existingIds.has(item.id))
            .map((item) => ({
                projectId,
                equipmentId: item.id,
                status: 'planned',
            }));

        if (toCreate.length > 0) {
            await this.prisma.projectEquipment.createMany({ data: toCreate });
        }

        return this.getProjectEquipment(projectId);
    }

    // ── Project Equipment CRUD ────────────────────────
    async getProjectEquipment(projectId: string) {
        return this.prisma.projectEquipment.findMany({
            where: { projectId },
            include: { equipment: true, assignedTo: true },
            orderBy: { equipment: { category: 'asc' } },
        });
    }

    async addToProject(projectId: string, equipmentId: string) {
        return this.prisma.projectEquipment.create({
            data: { projectId, equipmentId },
            include: { equipment: true },
        });
    }

    async removeFromProject(id: string) {
        return this.prisma.projectEquipment.delete({ where: { id } });
    }

    async assignToUser(id: string, userId: string, projectId: string) {
        // Check for group item duplication
        const pe = await this.prisma.projectEquipment.findUnique({
            where: { id },
            include: { equipment: true },
        });
        if (!pe) throw new NotFoundException();

        if (pe.equipment.isGroupItem) {
            const alreadyAssigned = await this.prisma.projectEquipment.findFirst({
                where: {
                    projectId,
                    equipmentId: pe.equipmentId,
                    assignedToId: { not: null },
                    id: { not: id },
                },
            });
            if (alreadyAssigned) {
                throw new ConflictException('Group item already assigned to another member');
            }
        }

        return this.prisma.projectEquipment.update({
            where: { id },
            data: { assignedToId: userId },
            include: { equipment: true, assignedTo: true },
        });
    }

    async updateStatus(id: string, status: string) {
        return this.prisma.projectEquipment.update({
            where: { id },
            data: { status },
            include: { equipment: true },
        });
    }

    // ── Weight redistribution algorithm ──────────────
    async suggestRedistribution(projectId: string) {
        // Fetch project to know type for modifiers
        const project = await this.prisma.project.findUnique({ where: { id: projectId } });
        let modifier = 0.25;
        if (project?.type === 'water') modifier = 0.50;
        if (project?.type === 'ski') modifier = 0.35;

        const members = await this.prisma.projectMember.findMany({
            where: { projectId },
            include: { user: true },
        });

        // Get group equipment
        const groupEquipment = await this.prisma.projectEquipment.findMany({
            where: { projectId, equipment: { isGroupItem: true } },
            include: { equipment: true },
        });

        // Get personal equipment to calculate base load for everyone
        const personalEquipment = await this.prisma.projectEquipment.findMany({
            where: { projectId, equipment: { isGroupItem: false } },
            include: { equipment: true },
        });

        const basePersonalWeight = personalEquipment.reduce(
            (sum, e) => sum + (e.customWeight || e.equipment.weight),
            0,
        );

        // First pass: Calculate current loads and capacities
        let memberStats = members.map((m) => {
            const userEq = groupEquipment.filter((e) => e.assignedToId === m.userId);
            const userGroupWeight = userEq.reduce(
                (sum, e) => sum + (e.customWeight || e.equipment.weight),
                0,
            );
            const currentWeight = basePersonalWeight + userGroupWeight;
            const maxWeight = (m.user.weight || 70) * modifier;
            return {
                userId: m.userId,
                currentWeight,
                maxWeight,
                availableCapacity: maxWeight - currentWeight,
                equipmentItems: userEq
            };
        });

        const updates: { id: string; assignedToId: string }[] = [];

        // Distribute completely unassigned group items first
        const unassignedGroupItems = groupEquipment.filter(e => e.assignedToId === null).sort((a, b) => {
            const wA = a.customWeight || a.equipment.weight;
            const wB = b.customWeight || b.equipment.weight;
            return wB - wA; // Heaviest first
        });

        for (const item of unassignedGroupItems) {
            // Find member with most available capacity
            memberStats.sort((a, b) => b.availableCapacity - a.availableCapacity);
            const bestReceiver = memberStats[0];
            if (bestReceiver) {
                const itemWeight = item.customWeight || item.equipment.weight;
                updates.push({ id: item.id, assignedToId: bestReceiver.userId });
                bestReceiver.availableCapacity -= itemWeight;
                bestReceiver.equipmentItems.push(item);
            }
        }

        // Separate into overloaded and underloaded
        const overloaded = memberStats.filter(m => m.availableCapacity < 0).sort((a, b) => a.availableCapacity - b.availableCapacity); // Most overloaded first
        const underloaded = memberStats.filter(m => m.availableCapacity > 0).sort((a, b) => b.availableCapacity - a.availableCapacity); // Most capacity first

        // Try to move items from overloaded to underloaded
        for (const over of overloaded) {
            // Sort items by weight descending
            const items = over.equipmentItems.sort((a, b) => {
                const wA = a.customWeight || a.equipment.weight;
                const wB = b.customWeight || b.equipment.weight;
                return wB - wA;
            });

            for (const item of items) {
                if (over.availableCapacity >= 0) break; // Not overloaded anymore

                const itemWeight = item.customWeight || item.equipment.weight;

                // Find someone with enough capacity
                const receiver = underloaded.find(u => u.availableCapacity >= itemWeight);
                if (receiver) {
                    const existingUpdate = updates.find(u => u.id === item.id);
                    if (existingUpdate) {
                        existingUpdate.assignedToId = receiver.userId;
                    } else {
                        updates.push({ id: item.id, assignedToId: receiver.userId });
                    }
                    // Update running totals
                    receiver.availableCapacity -= itemWeight;
                    over.availableCapacity += itemWeight;
                }
            }
        }

        // Apply updates
        for (const update of updates) {
            await this.prisma.projectEquipment.update({
                where: { id: update.id },
                data: { assignedToId: update.assignedToId }
            });
        }

        return this.getProjectEquipment(projectId);
    }
}
