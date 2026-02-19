import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MessagesService } from './messages.service';

@ApiTags('Messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
    constructor(private messagesService: MessagesService) { }

    @Get('project/:projectId')
    async getProjectMessages(@Param('projectId') projectId: string) {
        const messages = await this.messagesService.findAllByProject(projectId);
        return messages.map((msg: any) => ({
            ...msg,
            sender: {
                ...msg.sender,
                telegramId: msg.sender.telegramId.toString(),
            }
        }));
    }
}
