import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightning, UserCircle, Trash, Warning, Scales } from '@phosphor-icons/react';
import { useEquipmentStore } from '../../../store/equipmentStore';
import { useProjectStore } from '../../../store/projectStore';
import { useAuthStore } from '../../../store/authStore';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { useParams } from 'react-router-dom';
import type { ProjectEquipment } from '../../../types';

export function GearTab() {
    const { projectId } = useParams<{ projectId: string }>();
    const { user: currentUser } = useAuthStore();
    const { projectEquipment, loading, fetchProjectEquipment, autoGenerate, redistribute, updateStatus, removeFromProject } = useEquipmentStore();
    const { currentProject, fetchProject } = useProjectStore();
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        if (projectId) {
            fetchProjectEquipment(projectId);
            if (!currentProject) fetchProject(projectId);
        }
    }, [projectId]);

    const myEquipment = projectEquipment.filter(item => item.assignedToId === currentUser?.id);
    const myTotalWeight = myEquipment.reduce((sum, item) => sum + (item.customWeight || item.equipment.weight), 0);
    const userWeight = currentUser?.weight || 70;
    const weightPercentage = (myTotalWeight / userWeight) * 100;
    const isOverweight = weightPercentage > 25;

    const categories = [...new Set(projectEquipment.map((e) => e.equipment.category))];
    const filtered = filter === 'all' ? projectEquipment : projectEquipment.filter((e) => e.equipment.category === filter);

    const handleAutoGenerate = async () => {
        if (projectId) {
            await autoGenerate(projectId);
            window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success');
        }
    };

    const handleRedistribute = async () => {
        if (projectId) {
            await redistribute(projectId);
            window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success');
        }
    };

    const toggleStatus = async (item: ProjectEquipment) => {
        const newStatus = item.status === 'packed' ? 'planned' : 'packed';
        await updateStatus(item.id, newStatus);
        window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
    };

    return (
        <div className="space-y-4">
            {/* Weight Dashboard */}
            <GlassCard className={`p-4 border-l-4 transition-all ${isOverweight ? 'border-l-red-500 bg-red-500/5' : 'border-l-green-500 bg-green-500/5'}`}>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Scales size={20} className={isOverweight ? 'text-red-500' : 'text-green-500'} />
                        <span className="font-bold text-[var(--text-primary)]">Ваша нагрузка</span>
                    </div>
                    <Badge status={isOverweight ? 'error' : 'success'}>
                        {weightPercentage.toFixed(1)}% от веса тела
                    </Badge>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(weightPercentage, 100)}%` }}
                        className={`h-full ${isOverweight ? 'bg-red-500' : 'bg-green-500'}`}
                    />
                </div>
                <div className="flex justify-between mt-2 text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-bold">
                    <span>{myTotalWeight.toFixed(1)} кг</span>
                    <span>Рекомендуемый лимит: {(userWeight * 0.25).toFixed(1)} кг (25%)</span>
                </div>
                {isOverweight && (
                    <div className="mt-3 p-2 bg-red-500/10 rounded-lg flex items-center gap-2 text-[10px] text-red-600 font-medium">
                        <Warning size={14} />
                        Внимание! Вес рюкзака превышает рекомендуемую норму (25%). Рассмотрите возможность перераспределения группового снаряжения.
                    </div>
                )}
            </GlassCard>

            <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1 gap-2" onClick={handleAutoGenerate}>
                    <Lightning size={16} /> Сгенерировать
                </Button>
                <Button variant="secondary" size="sm" className="flex-1 gap-2 bg-[#2F80ED]/10 text-[#2F80ED] border border-[#2F80ED]/20 hover:bg-[#2F80ED]/20" onClick={handleRedistribute}>
                    Умное распределение
                </Button>
            </div>

            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                <button
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${filter === 'all' ? 'bg-[#2F80ED] text-white shadow-lg shadow-blue-500/20' : 'bg-white/40 dark:bg-white/10 text-[var(--text-secondary)] hover:bg-white/60 dark:hover:bg-white/20'
                        }`}
                    onClick={() => setFilter('all')}
                >
                    Все
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${filter === cat ? 'bg-[#2F80ED] text-white shadow-lg shadow-blue-500/20' : 'bg-white/40 dark:bg-white/10 text-[var(--text-secondary)] hover:bg-white/60 dark:hover:bg-white/20'
                            }`}
                        onClick={() => setFilter(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                    {filtered.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: i * 0.03 }}
                        >
                            <GlassCard
                                className={`p-3 flex items-center gap-3 cursor-pointer border transition-colors ${item.status === 'packed' ? 'bg-[#34C759]/10 border-[#34C759]/30 dark:bg-[#34C759]/20' : 'bg-white/40 dark:bg-white/5 border-white/40 dark:border-white/10'
                                    }`}
                                onClick={() => toggleStatus(item)}
                            >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${item.status === 'packed' ? 'bg-[#34C759] border-[#34C759]' : 'border-gray-400 dark:border-gray-600'
                                    }`}>
                                    {item.status === 'packed' && <span className="text-white text-[10px] font-bold">✓</span>}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className={`font-medium text-sm truncate ${item.status === 'packed' ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-[var(--text-primary)]'}`}>
                                        {item.equipment.name}
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-xs text-[var(--text-secondary)]">{(item.customWeight || item.equipment.weight).toFixed(1)} кг</span>
                                        {item.equipment.isGroupItem && (
                                            <Badge status="warning" className="px-1.5 py-0 text-[10px]">Групповое</Badge>
                                        )}
                                        {item.assignedTo && (
                                            <span className="text-xs text-[#2F80ED] flex items-center gap-1">
                                                <UserCircle size={12} weight="fill" /> {item.assignedTo.firstName || item.assignedTo.username}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <button
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                                    onClick={(e) => { e.stopPropagation(); removeFromProject(item.id); }}
                                >
                                    <Trash size={16} />
                                </button>
                            </GlassCard>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {projectEquipment.length === 0 && !loading && (
                <div className="text-center py-8">
                    <div className="text-4xl mb-2">🎒</div>
                    <div className="text-lg font-medium text-[var(--text-primary)]">Список пуст</div>
                    <p className="text-sm text-[var(--text-secondary)]">Нажми Авто-генерация для начала</p>
                </div>
            )}
        </div>
    );
}
