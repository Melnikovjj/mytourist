import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightning, UserCircle, Trash } from '@phosphor-icons/react';
import { useEquipmentStore } from '../../../store/equipmentStore';
import { useProjectStore } from '../../../store/projectStore';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { useParams } from 'react-router-dom';
import type { ProjectEquipment } from '../../../types';

export function GearTab() {
    const { projectId } = useParams<{ projectId: string }>();
    const { projectEquipment, loading, fetchProjectEquipment, autoGenerate, updateStatus, removeFromProject } = useEquipmentStore();
    const { currentProject, fetchProject } = useProjectStore();
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        if (projectId) {
            fetchProjectEquipment(projectId);
            if (!currentProject) fetchProject(projectId);
        }
    }, [projectId]);

    const categories = [...new Set(projectEquipment.map((e) => e.equipment.category))];
    const filtered = filter === 'all' ? projectEquipment : projectEquipment.filter((e) => e.equipment.category === filter);

    const handleAutoGenerate = async () => {
        if (projectId) {
            await autoGenerate(projectId);
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
            <Button variant="secondary" size="sm" className="w-full gap-2" onClick={handleAutoGenerate}>
                <Lightning size={16} /> Auto-Generate List
            </Button>

            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                <button
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${filter === 'all' ? 'bg-[#2F80ED] text-white' : 'bg-white/40 text-gray-600 hover:bg-white/60'
                        }`}
                    onClick={() => setFilter('all')}
                >
                    All
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${filter === cat ? 'bg-[#2F80ED] text-white' : 'bg-white/40 text-gray-600 hover:bg-white/60'
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
                                className={`p-3 flex items-center gap-3 cursor-pointer border transition-colors ${item.status === 'packed' ? 'bg-[#34C759]/10 border-[#34C759]/30' : 'bg-white/40 border-white/40'
                                    }`}
                                onClick={() => toggleStatus(item)}
                            >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${item.status === 'packed' ? 'bg-[#34C759] border-[#34C759]' : 'border-gray-400'
                                    }`}>
                                    {item.status === 'packed' && <span className="text-white text-[10px] font-bold">✓</span>}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className={`font-medium text-sm truncate ${item.status === 'packed' ? 'text-gray-500 line-through' : 'text-[#1C1C1E]'}`}>
                                        {item.equipment.name}
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-xs text-[#1C1C1E]/60">{(item.customWeight || item.equipment.weight).toFixed(1)} kg</span>
                                        {item.equipment.isGroupItem && (
                                            <Badge status="warning" className="px-1.5 py-0 text-[10px]">Group</Badge>
                                        )}
                                        {item.assignedTo && (
                                            <span className="text-xs text-[#2F80ED] flex items-center gap-1">
                                                <UserCircle size={12} weight="fill" /> {item.assignedTo.firstName || item.assignedTo.username}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <button
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
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
                    <div className="text-lg font-medium text-gray-900">List is empty</div>
                    <p className="text-sm text-gray-500">Tap Auto-Generate to start</p>
                </div>
            )}
        </div>
    );
}
