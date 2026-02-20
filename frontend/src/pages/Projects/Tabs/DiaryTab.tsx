import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Button } from '../../../components/ui/Button';
import { Image, PaperPlaneRight, UserCircle } from '@phosphor-icons/react';
import api from '../../../api/client';
import { motion, AnimatePresence } from 'framer-motion';

interface DiaryEntry {
    id: string;
    content: string;
    imageUrl?: string | null;
    createdAt: string;
    user: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        avatarUrl: string | null;
    };
}

export function DiaryTab() {
    const { projectId } = useParams<{ projectId: string }>();
    const { user } = useAuthStore();
    const [entries, setEntries] = useState<DiaryEntry[]>([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showImageInput, setShowImageInput] = useState(false);

    useEffect(() => {
        fetchDiary();
    }, [projectId]);

    const fetchDiary = async () => {
        try {
            const res = await api.get(`/diary/project/${projectId}`);
            setEntries(res.data);
        } catch (error) {
            console.error('Failed to fetch diary', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!content.trim()) return;
        setIsSubmitting(true);
        try {
            const res = await api.post(`/diary/project/${projectId}`, {
                content: content.trim(),
                imageUrl: imageUrl.trim() || undefined
            });
            setEntries([res.data, ...entries]);
            setContent('');
            setImageUrl('');
            setShowImageInput(false);
            window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success');
        } catch (error) {
            window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="text-center py-10 opacity-50 text-sm">Загрузка дневника...</div>;

    return (
        <div className="space-y-4 pb-20">
            {/* Input area */}
            <GlassCard className="p-3">
                <textarea
                    className="w-full bg-transparent border-none outline-none resize-none text-sm min-h-[60px] placeholder:text-gray-400 mb-2"
                    placeholder="Как прошел день? Запишите впечатления..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                <AnimatePresence>
                    {showImageInput && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mb-3 overflow-hidden"
                        >
                            <input
                                type="url"
                                placeholder="Ссылка на фото (https://...)"
                                className="w-full bg-black/5 dark:bg-white/10 rounded-xl px-3 py-2 text-xs outline-none"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex justify-between items-center">
                    <button
                        className={`p-2 rounded-full transition-colors ${showImageInput || imageUrl ? 'text-[#2F80ED] bg-[#2F80ED]/10' : 'text-gray-400 hover:bg-black/5'}`}
                        onClick={() => setShowImageInput(!showImageInput)}
                    >
                        <Image size={20} />
                    </button>

                    <Button
                        size="sm"
                        disabled={!content.trim() || isSubmitting}
                        onClick={handleSubmit}
                        className="px-4 py-1.5 rounded-full"
                    >
                        {isSubmitting ? 'Отправка...' : <span className="flex items-center gap-1">Опубликовать <PaperPlaneRight weight="fill" /></span>}
                    </Button>
                </div>
            </GlassCard>

            {/* Entries Feed */}
            {entries.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm">
                    Дневник пока пуст. Будьте первыми, кто оставит запись!
                </div>
            ) : (
                <div className="space-y-4">
                    {entries.map(entry => {
                        const date = new Date(entry.createdAt);
                        const isMe = entry.user.id === user?.id;

                        return (
                            <GlassCard key={entry.id} className="p-4 overflow-hidden relative">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        {entry.user.avatarUrl ? (
                                            <img src={entry.user.avatarUrl} alt="" className="w-6 h-6 rounded-full" />
                                        ) : (
                                            <UserCircle size={24} className="text-gray-400" />
                                        )}
                                        <span className="font-medium text-sm text-[var(--text-primary)]">
                                            {isMe ? 'Вы' : (entry.user.firstName || entry.user.lastName || 'Участник')}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>

                                <p className="text-sm text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed">
                                    {entry.content}
                                </p>

                                {entry.imageUrl && (
                                    <div className="mt-3 rounded-xl overflow-hidden bg-black/5">
                                        <img src={entry.imageUrl} alt="Memory" className="w-full object-cover max-h-[300px]" loading="lazy" />
                                    </div>
                                )}
                            </GlassCard>
                        )
                    })}
                </div>
            )}
        </div>
    );
}
