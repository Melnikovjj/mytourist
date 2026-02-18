import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ProjectsService } from './projects.service';

@ApiTags('Projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
    constructor(private projectsService: ProjectsService) { }

    @Post()
    create(@CurrentUser() user: any, @Body() data: any) {
        return this.projectsService.create(user.id, data);
    }

    @Get()
    findAll(@CurrentUser() user: any) {
        return this.projectsService.findAllForUser(user.id);
    }

    @Get(':projectId')
    findOne(@Param('projectId') projectId: string, @CurrentUser() user: any) {
        return this.projectsService.findById(projectId, user.id);
    }

    @Post('join/:inviteCode')
    join(@Param('inviteCode') inviteCode: string, @CurrentUser() user: any) {
        return this.projectsService.joinByInviteCode(user.id, inviteCode);
    }

    @Delete(':projectId')
    delete(@Param('projectId') projectId: string, @CurrentUser() user: any) {
        return this.projectsService.deleteProject(projectId, user.id);
    }
}
