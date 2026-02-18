import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || '/';

let socket: Socket | null = null;

export function getSocket(): Socket {
    if (!socket) {
        socket = io(SOCKET_URL, {
            transports: ['websocket'],
            autoConnect: true,
        });
    }
    return socket;
}

export function joinProjectRoom(projectId: string, userId: string) {
    const s = getSocket();
    s.emit('join_project', { projectId, userId });
}

export function leaveProjectRoom(projectId: string) {
    const s = getSocket();
    s.emit('leave_project', { projectId });
}
