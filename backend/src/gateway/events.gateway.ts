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

            // Convert BigInt to string to prevent JSON.stringify TypeError during emit
            const serializedMessage = JSON.parse(JSON.stringify(message, (key, value) =>
                typeof value === 'bigint' ? value.toString() : value
            ));

            client.broadcast.to(`project:${data.projectId}`).emit('new_message', serializedMessage);

            // Notify offline members via Telegram
            const members = await this.prisma.projectMember.findMany({
                where: { projectId: data.projectId },
                include: { user: true, project: true },
            });

            console.log(`Found ${members.length} members for project ${data.projectId}`);
            for (const member of members) {
                console.log(`Checking member ${member.userId} vs sender ${data.userId}. TelegramId: ${member.user.telegramId}`);
                if (member.userId !== data.userId && member.user.telegramId) {

                    // Escape basic HTML characters to prevent Telegram API errors with parse_mode: HTML
                    const escapeHtml = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    const safeContent = escapeHtml(data.content);
                    const safeName = escapeHtml(message.sender.firstName || 'Участника');

                    const baseUrl = process.env.WEBAPP_URL || 'https://t.me/TuristProPlanner_bot/app';
                    const notifyText = `💬 <b>Новое сообщение</b> в походе «${escapeHtml(member.project.title)}»\n\nОт ${safeName}:\n<i>${safeContent}</i>\n\n<a href="${baseUrl}?start_param=proj_${member.project.inviteCode}">Открыть чат</a>`;

                    console.log(`Sending notification to telegramId: ${member.user.telegramId}`);
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
