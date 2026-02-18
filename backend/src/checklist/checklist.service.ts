import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

export interface ChecklistItem {
    id: string;
    type: 'equipment' | 'food';
    name: string;
    assignedTo?: string;
    assignedToName?: string;
    checked: boolean;
    category?: string;
    weight?: number;
}

@Injectable()
export class ChecklistService {
    constructor(private prisma: PrismaService) { }

    async generateChecklist(projectId: string): Promise<ChecklistItem[]> {
        const items: ChecklistItem[] = [];

        // Equipment items
        const equipment = await this.prisma.projectEquipment.findMany({
            where: { projectId },
            include: { equipment: true, assignedTo: true },
            orderBy: { equipment: { category: 'asc' } },
        });

        for (const e of equipment) {
            items.push({
                id: e.id,
                type: 'equipment',
                name: e.equipment.name,
                assignedTo: e.assignedToId || undefined,
                assignedToName: e.assignedTo?.firstName || e.assignedTo?.username || undefined,
                checked: e.status === 'packed',
                category: e.equipment.category,
                weight: e.customWeight || e.equipment.weight,
            });
        }

        return items;
    }

    async toggleItem(itemId: string) {
        const item = await this.prisma.projectEquipment.findUnique({
            where: { id: itemId },
        });
        if (!item) return null;

        const newStatus = item.status === 'packed' ? 'planned' : 'packed';
        return this.prisma.projectEquipment.update({
            where: { id: itemId },
            data: { status: newStatus as any },
            include: { equipment: true, assignedTo: true },
        });
    }
}
