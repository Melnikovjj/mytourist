import { Controller, Get, Post, Delete, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { EquipmentService } from './equipment.service';

@ApiTags('Equipment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('equipment')
export class EquipmentController {
    constructor(private equipmentService: EquipmentService) { }

    @Get('catalog')
    getCatalog() {
        return this.equipmentService.getCatalog();
    }

    @Post('project/:projectId/auto-generate')
    autoGenerate(@Param('projectId') projectId: string) {
        return this.equipmentService.autoGenerate(projectId);
    }

    @Get('project/:projectId')
    getProjectEquipment(@Param('projectId') projectId: string) {
        return this.equipmentService.getProjectEquipment(projectId);
    }

    @Post('project/:projectId/add')
    addToProject(
        @Param('projectId') projectId: string,
        @Body('equipmentId') equipmentId: string,
    ) {
        return this.equipmentService.addToProject(projectId, equipmentId);
    }

    @Delete(':id')
    removeFromProject(@Param('id') id: string) {
        return this.equipmentService.removeFromProject(id);
    }

    @Patch(':id/assign')
    assignToUser(
        @Param('id') id: string,
        @Body('userId') userId: string,
        @Body('projectId') projectId: string,
    ) {
        return this.equipmentService.assignToUser(id, userId, projectId);
    }

    @Patch(':id/status')
    updateStatus(@Param('id') id: string, @Body('status') status: any) {
        return this.equipmentService.updateStatus(id, status);
    }

    @Get('project/:projectId/redistribute')
    suggestRedistribution(@Param('projectId') projectId: string) {
        return this.equipmentService.suggestRedistribution(projectId);
    }
}
