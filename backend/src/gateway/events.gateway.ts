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
}
