import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
    MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from '../messages/messages.service';
import { BotService } from '../bot/bot.service';
import { PrismaService } from '../common/prisma/prisma.service';

@WebSocketGateway({
    cors: { origin: '*' },
    namespace: '/',
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private connectedUsers = new Map<string, string>(); // socketId -> userId

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this.connectedUsers.delete(client.id);
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('join_project')
    handleJoinProject(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { projectId: string; userId: string },
    ) {
        client.join(`project:${data.projectId}`);
        this.connectedUsers.set(client.id, data.userId);
        console.log(`User ${data.userId} joined project room: ${data.projectId}`);
    }

    @SubscribeMessage('leave_project')
    handleLeaveProject(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { projectId: string },
    ) {
        client.leave(`project:${data.projectId}`);
    }

    constructor(
        private readonly messagesService: MessagesService,
        private readonly botService: BotService,
        private readonly prisma: PrismaService,
    ) { }

    @SubscribeMessage('send_message')
    async handleSendMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { projectId: string; userId: string; content: string },
    ) {
        console.log(`New message in ${data.projectId} from ${data.userId}: ${data.content}`);

        try {
            const message = await this.messagesService.create(data.userId, data.projectId, data.content);
            this.server.to(`project:${data.projectId}`).emit('new_message', message);

            // Notify offline members via Telegram
            const members = await this.prisma.projectMember.findMany({
                where: { projectId: data.projectId },
                include: { user: true, project: true },
            });

            for (const member of members) {
                if (member.userId !== data.userId && member.user.telegramId) {
                    const notifyText = `💬 <b>Новое сообщение</b> в походе «${member.project.title}»\n\nОт ${message.sender.firstName || 'Участника'}:\n<i>${data.content}</i>\n\n<a href="${process.env.WEBAPP_URL}?start_param=proj_${member.project.inviteCode}">Открыть чат</a>`;
                    await this.botService.sendNotification(member.user.telegramId, notifyText);
                }
            }

        } catch (error) {
            console.error('Error saving/sending message:', error);
            // Optionally emit error back to sender
        }
    }

    // ── Emit methods used by services ─────────────────
    emitEquipmentUpdated(projectId: string, data: any) {
        this.server.to(`project:${projectId}`).emit('equipment_updated', data);
    }

    emitChecklistUpdated(projectId: string, data: any) {
        this.server.to(`project:${projectId}`).emit('checklist_updated', data);
    }

    emitWeightRecalculated(projectId: string, data: any) {
        this.server.to(`project:${projectId}`).emit('weight_recalculated', data);
    }

    emitMemberJoined(projectId: string, data: any) {
        this.server.to(`project:${projectId}`).emit('member_joined', data);
    }

    emitMealUpdated(projectId: string, data: any) {
        this.server.to(`project:${projectId}`).emit('meal_updated', data);
    }

    emitNewMessage(projectId: string, message: any) {
        this.server.to(`project:${projectId}`).emit('new_message', message);
    }
}
