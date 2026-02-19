import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from '@phosphor-icons/react';
import api from '../../../api/client';
import { getSocket, joinProjectRoom, leaveProjectRoom } from '../../../api/socket';
import { useAuthStore } from '../../../store/authStore';
import { useParams } from 'react-router-dom';
import { GlassCard } from '../../../components/ui/GlassCard';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import type { ChecklistItem } from '../../../types';

export function ChecklistTab() {
    const { projectId } = useParams<{ projectId: string }>();
    const { user } = useAuthStore();
    const [items, setItems] = useState<ChecklistItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (projectId) {
            api.get(`/checklist/project/${projectId}`).then((res) => {
                setItems(res.data);
                setLoading(false);
            });

            if (user) joinProjectRoom(projectId, user.id);
            const socket = getSocket();
            socket.on('checklist_updated', (data: ChecklistItem) => {
                setItems((prev) => prev.map((item) => (item.id === data.id ? { ...item, checked: !item.checked } : item)));
            });

            return () => {
                if (projectId) leaveProjectRoom(projectId);
                socket.off('checklist_updated');
            };
        }
    }, [projectId, user]);

    const toggleItem = async (itemId: string) => {
        await api.patch(`/checklist/${itemId}/toggle`);
        setItems((prev) =>
            prev.map((item) => (item.id === itemId ? { ...item, checked: !item.checked } : item)),
        );
        window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
    };

    const categories = [...new Set(items.map((i) => i.category).filter(Boolean))];
    const checkedCount = items.filter((i) => i.checked).length;
    const progress = items.length > 0 ? Math.round((checkedCount / items.length) * 100) : 0;

    return (
        <div className="space-y-6">
            <GlassCard className="p-4 bg-white/40">
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <h3 className="font-semibold text-gray-800">Прогресс сборов</h3>
                        <p className="text-xs text-gray-500">{checkedCount} из {items.length} готово</p>
                    </div>
                    <span className="text-xl font-bold text-[#2F80ED]">{progress}%</span>
                </div>
                <ProgressBar progress={progress} className="h-2" />
            </GlassCard>

            {categories.map((cat) => (
                <div key={cat} className="space-y-2">
                    <h3 className="font-semibold text-sm text-gray-500 ml-1">{cat}</h3>
                    <div className="space-y-2">
                        {items.filter((i) => i.category === cat).map((item, idx) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: idx * 0.02 }}
                            >
                                <GlassCard
                                    className={`p-3 flex items-center gap-3 cursor-pointer border transition-colors ${item.checked ? 'bg-[#34C759]/10 border-[#34C759]/30' : 'bg-white/40 border-white/40'
                                        }`}
                                    onClick={() => toggleItem(item.id)}
                                >
                                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${item.checked ? 'bg-[#34C759] border-[#34C759]' : 'border-gray-400'
                                        }`}>
                                        {item.checked && <Check size={12} color="#fff" weight="bold" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className={`text-sm ${item.checked ? 'text-gray-500 line-through' : 'text-[#1C1C1E]'}`}>
                                            {item.name}
                                        </div>
                                        {item.assignedToName && (
                                            <div className="text-xs text-blue-500 mt-0.5">{item.assignedToName}</div>
                                        )}
                                    </div>
                                    {item.weight && (
                                        <span className="text-xs text-gray-400 font-mono">{(item.weight).toFixed(1)}кг</span>
                                    )}
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>
                </div>
            ))}

            {items.length === 0 && !loading && (
                <div className="text-center py-8">
                    <div className="text-4xl mb-2">✅</div>
                    <div className="text-lg font-medium text-gray-900">Чек-лист пуст</div>
                    <p className="text-sm text-gray-500">Добавьте снаряжение, чтобы создать список</p>
                </div>
            )}
        </div>
    );
}
