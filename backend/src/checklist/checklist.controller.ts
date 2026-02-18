import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ChecklistService } from './checklist.service';

@ApiTags('Checklist')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('checklist')
export class ChecklistController {
    constructor(private checklistService: ChecklistService) { }

    @Get('project/:projectId')
    generateChecklist(@Param('projectId') projectId: string) {
        return this.checklistService.generateChecklist(projectId);
    }

    @Patch(':itemId/toggle')
    toggleItem(@Param('itemId') itemId: string) {
        return this.checklistService.toggleItem(itemId);
    }
}
