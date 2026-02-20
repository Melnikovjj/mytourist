import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DiaryService } from './diary.service';

@ApiTags('Diary')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('diary')
export class DiaryController {
    constructor(private readonly diaryService: DiaryService) { }

    @ApiOperation({ summary: 'Get all diary entries for a project' })
    @Get('project/:projectId')
    async getProjectDiary(
        @Param('projectId') projectId: string,
        @Request() req: any
    ) {
        return this.diaryService.getProjectDiary(projectId, req.user.id);
    }

    @ApiOperation({ summary: 'Add a new entry to the project diary' })
    @Post('project/:projectId')
    async addDiaryEntry(
        @Param('projectId') projectId: string,
        @Body() body: { content: string, imageUrl?: string },
        @Request() req: any
    ) {
        return this.diaryService.addDiaryEntry(projectId, req.user.id, body.content, body.imageUrl);
    }
}
