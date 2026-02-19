import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { PaperPlaneRight } from '@phosphor-icons/react';
import api from '../../../api/client';
import { getSocket } from '../../../api/socket';
import { useAuthStore } from '../../../store/authStore';
import { useParams } from 'react-router-dom';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Avatar } from '../../../components/ui/Avatar';
import type { Message } from '../../../types';

export function ChatTab() {
    const { projectId } = useParams<{ projectId: string }>();
    const { user } = useAuthStore();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (projectId) {
            setLoading(true);
            api.get<Message[]>(`/messages/project/${projectId}`)
                .then((res) => {
                    setMessages(res.data);
                    setLoading(false);
                })
                .catch(() => setLoading(false));

            const socket = getSocket();
            // Ensure we are in the room - ProjectDetailPage should handle joining, but safe to ensure

            const handleNewMessage = (msg: Message) => {
                setMessages((prev) => [...prev, msg]);
                window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
            };

            socket.on('new_message', handleNewMessage);

            return () => {
                socket.off('new_message', handleNewMessage);
            };
        }
    }, [projectId]);

    const handleSend = async () => {
        if (!input.trim() || !projectId || !user) return;

        // Optimistic update? No, let's wait for socket/response to avoid dupes
        // Actually, we can emit socket event which server broadcasts, 
        // AND server saves to DB. 
        // In our backend implementation, we emit from gateway but also want to save.
        // Let's call the Gateway via socket to send message effectively?
        // Wait, the backend implementation of handleSendMessage in gateway emits 'new_message'.
        // It should also save to DB.

        const socket = getSocket();
        socket.emit('send_message', {
            projectId,
            userId: user.id,
            content: input.trim()
        });

        // We also need to persist it. Our gateway implementation assumed "frontend calls API to save".
        // Let's fix that discrepancy. I will call an API endpoint to save, 
        // AND the API will trigger the gateway emission.
        // But my gateway implementation has a 'send_message' handler that emits back.
        // Let's use the socket for now as I implemented the handler in Gateway.
        // BUT, the handler in Gateway DOES NOT save to DB in my previous `events.gateway.ts` edit (it had a comment).
        // I need to fix backend to save message to DB if I use socket.
        // OR I create a POST endpoint in MessagesController and use that.
        // Using POST endpoint is robust.

        try {
            // We need a POST endpoint. I didn't create one in MessagesController!
            // I only created GET.
            // Quick fix: I'll use the socket emission which I implemented in Gateway 
            // AND I will add the saving logic to the Gateway (injecting Service).
            // OR simpler: I'll add a POST endpoint to MessagesController now.
            // It's cleaner.

            await api.post('/messages', { projectId, content: input.trim() });
            setInput('');
        } catch (e) {
            console.error(e);
        }
    };

    // Wait, I need to implement POST /messages in backend first if I go that route.
    // I'll stick to what I have: I implemented `handleSendMessage` in Gateway.
    // I need to make sure it saves to DB.
    // I'll update Gateway to use MessagesService.

    // For now, let's assume the socket works for "live" chat, but history won't be saved
    // unless I fix the backend. I will fix the backend in a moment.
    // Let's write the frontend assuming the socket sends the message.

    const sendMessage = () => {
        if (!input.trim() || !projectId || !user) return;
        getSocket().emit('send_message', { projectId, userId: user.id, content: input.trim() });
        setInput('');
    };

    return (
        <div className="flex flex-col h-[60vh]">
            <div className="flex-1 overflow-y-auto space-y-4 p-1 no-scrollbar">
                {loading ? (
                    <div className="text-center py-4 text-gray-500">Загрузка...</div>
                ) : messages.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                        <p>Нет сообщений</p>
                        <p className="text-xs">Напишите первое сообщение!</p>
                    </div>
                ) : (
                    messages.map((msg, i) => {
                        const isMe = msg.senderId === user?.id;
                        const showAvatar = !isMe && (i === 0 || messages[i - 1].senderId !== msg.senderId);

                        return (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                            >
                                {!isMe && (
                                    <div className="w-8 flex-shrink-0 flex flex-col justify-end">
                                        {showAvatar ? (
                                            <Avatar
                                                src={msg.sender.avatarUrl}
                                                fallback={msg.sender.firstName?.[0] || msg.sender.username?.[0] || '?'}
                                                size="sm"
                                            />
                                        ) : <div className="w-8" />}
                                    </div>
                                )}

                                <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${isMe
                                    ? 'bg-[#2F80ED] text-white rounded-tr-sm'
                                    : 'bg-white/60 dark:bg-white/10 backdrop-blur-md border border-white/20 dark:border-white/5 rounded-tl-sm text-[var(--text-primary)]'
                                    }`}>
                                    {!isMe && showAvatar && (
                                        <div className="text-[10px] opacity-70 mb-1">{msg.sender.firstName}</div>
                                    )}
                                    {msg.content}
                                    <div className={`text-[10px] text-right mt-1 ${isMe ? 'text-white/70' : 'text-gray-400'}`}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="mt-4 relative">
                <GlassCard className="p-2 flex gap-2 items-center bg-white/80 dark:bg-[#1c1c1e]/80 backdrop-blur-xl">
                    <input
                        className="flex-1 bg-transparent border-none outline-none pl-2 text-[var(--text-primary)] placeholder-gray-400"
                        placeholder="Сообщение..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <button
                        onClick={sendMessage}
                        className="p-2 bg-[#2F80ED] rounded-xl text-white active:scale-95 transition-transform"
                    >
                        <PaperPlaneRight size={20} weight="fill" />
                    </button>
                </GlassCard>
            </div>
        </div>
    );
}
