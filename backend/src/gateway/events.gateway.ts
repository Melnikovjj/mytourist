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

    @SubscribeMessage('send_message')
    async handleSendMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { projectId: string; userId: string; content: string },
    ) {
        console.log(`New message in ${data.projectId} from ${data.userId}: ${data.content}`);

        // Save to DB
        // ideally we should inject MessagesService here, but Gateway circular dependency can be tricky.
        // For now, let's assume the frontend calls the API to save, OR we inject it.
        // Let's inject it properly.

        this.server.to(`project:${data.projectId}`).emit('new_message', {
            id: Math.random().toString(), // temp, real ID from DB if we save here
            content: data.content,
            senderId: data.userId,
            createdAt: new Date(),
            sender: { id: data.userId } // simplified
        });
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
