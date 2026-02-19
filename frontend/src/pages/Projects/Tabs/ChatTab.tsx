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

            const handleNewMessage = (msg: Message) => {
                setMessages((prev) => {
                    // Prevent duplicates
                    if (prev.some(m => m.id === msg.id)) return prev;
                    return [...prev, msg];
                });
                // Haptic feedback for new messages
                if (msg.senderId !== user?.id) {
                    window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success');
                }
            };

            socket.on('new_message', handleNewMessage);

            return () => {
                socket.off('new_message', handleNewMessage);
                // Optional: leave room
                socket.emit('leave_project', { projectId });
            };
        }
    }, [projectId, user]);

    const handleSend = () => {
        if (!input.trim() || !projectId || !user) return;

        const socket = getSocket();
        // Emit message to server. Server will save to DB and broadcast 'new_message'
        socket.emit('send_message', {
            projectId,
            userId: user.id,
            content: input.trim()
        });

        setInput('');
    };

    // Wait, I need to implement POST /messages in backend first if I go that route.
    // I'll stick to what I have: I implemented `handleSendMessage` in Gateway.
    // I need to make sure it saves to DB.
    // I'll update Gateway to use MessagesService.

    // For now, let's assume the socket works for "live" chat, but history won't be saved
    // unless I fix the backend. I will fix the backend in a moment.
    // Let's write the frontend assuming the socket sends the message.



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
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button
                        onClick={handleSend}
                        className="p-2 bg-[#2F80ED] rounded-xl text-white active:scale-95 transition-transform"
                    >
                        <PaperPlaneRight size={20} weight="fill" />
                    </button>
                </GlassCard>
            </div>
        </div>
    );
}
