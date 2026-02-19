import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShareNetwork, Trash, Gear, ForkKnife, CheckSquare, Users } from '@phosphor-icons/react';
import { useProjectStore } from '../../store/projectStore';
import { useAuthStore } from '../../store/authStore';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { GearTab } from './Tabs/GearTab';
import { FoodTab } from './Tabs/FoodTab';
import { ChecklistTab } from './Tabs/ChecklistTab';

type TabType = 'gear' | 'food' | 'checklist';

export function ProjectDetailPage() {
    const { projectId } = useParams<{ projectId: string }>();
    const { currentProject, fetchProject, deleteProject } = useProjectStore();
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabType>('gear');

    useEffect(() => {
        if (projectId) fetchProject(projectId);
    }, [projectId]);

    const handleCopyInvite = () => {
        if (currentProject?.inviteCode) {
            navigator.clipboard.writeText(currentProject.inviteCode);
            window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success');
        }
    };

    const handleDelete = async () => {
        if (projectId) {
            if (window.confirm('Вы уверены, что хотите удалить этот поход?')) {
                await deleteProject(projectId);
                navigate('/');
            }
        }
    };

    const handleShare = () => {
        if (!currentProject?.inviteCode) return;

        const link = `https://t.me/TuristProPlanner_bot?start=proj_${currentProject.inviteCode}`;
        const text = `Присоединяйся к походу «${currentProject.title}»! 🏔`;
        const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`;

        const tg = window.Telegram?.WebApp as any;
        if (tg && tg.openTelegramLink) {
            tg.openTelegramLink(shareUrl);
        } else {
            window.open(shareUrl, '_blank');
        }
    };

    if (!currentProject) return null;

    const isOwner = currentProject.ownerId === user?.id;

    return (
        <div className="min-h-screen pb-24 pt-4 px-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <button
                    onClick={() => navigate('/')}
                    className="p-2 -ml-2 rounded-full hover:bg-white/20 transition-colors text-white"
                >
                    <ArrowLeft size={24} />
                </button>
                <div className="flex gap-2">
                    {isOwner && (
                        <button
                            onClick={handleDelete}
                            className="p-2 rounded-full hover:bg-white/20 transition-colors text-white/80 hover:text-red-400"
                        >
                            <Trash size={20} />
                        </button>
                    )}
                    <button
                        onClick={handleShare}
                        className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors"
                    >
                        <ShareNetwork size={20} weight="bold" />
                    </button>
                </div>
            </div>

            {/* Project Card */}
            <GlassCard className="p-6 relative overflow-hidden border-white/20 dark:border-white/10 bg-white/60 dark:bg-white/5 shadow-xl dark:shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Gear size={160} weight="duotone" className="text-[var(--text-primary)]" />
                </div>

                <div className="relative z-10">
                    <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2 tracking-tight">{currentProject.title}</h1>
                    {currentProject.description && (
                        <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2 leading-relaxed">
                            {currentProject.description}
                        </p>
                    )}

                    {currentProject.startDate && (
                        <div className="flex items-center gap-2 mb-4 text-[var(--text-secondary)] text-sm">
                            <div className="w-1 h-1 rounded-full bg-[var(--text-primary)] opacity-50" />
                            {new Date(currentProject.startDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                            {currentProject.endDate ? ` — ${new Date(currentProject.endDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}` : ''}
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2 mb-5">
                        <Badge variant="outline" className="bg-white/50 dark:bg-white/10 border-white/40 dark:border-white/20 text-[var(--text-primary)] backdrop-blur-md">
                            {currentProject.type === 'hiking' ? '🥾 Пеший' : currentProject.type === 'ski' ? '⛷ Лыжный' : '🚣 Водный'}
                        </Badge>
                        <Badge variant="outline" className="bg-white/50 dark:bg-white/10 border-white/40 dark:border-white/20 text-[var(--text-primary)] backdrop-blur-md">
                            {currentProject.season === 'summer' ? '☀️ Лето' : currentProject.season === 'winter' ? '❄️ Зима' : currentProject.season === 'spring' ? '🌱 Весна' : '🍂 Осень'}
                        </Badge>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/5 backdrop-blur-sm" onClick={handleCopyInvite}>
                        <div className="flex -space-x-3">
                            {currentProject.members?.slice(0, 4).map((m) => (
                                <div key={m.id} className="w-9 h-9 rounded-full border-2 border-white dark:border-black/30 bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-white overflow-hidden shadow-sm">
                                    {m.user.avatarUrl ? (
                                        <img src={m.user.avatarUrl} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <span>{m.user.firstName?.[0] || m.user.username?.[0] || '?'}</span>
                                    )}
                                </div>
                            ))}
                            {(currentProject.members?.length || 0) > 4 && (
                                <div className="w-9 h-9 rounded-full border-2 border-white dark:border-black/30 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-500 dark:text-white shadow-sm">
                                    +{currentProject.members!.length - 4}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-semibold">Код доступа</span>
                            <span className="text-sm font-mono text-[#4AC7FA] tracking-wider">{currentProject.inviteCode}</span>
                        </div>
                    </div>
                </div>
            </GlassCard>

            {/* Tabs */}
            <div className="flex p-1.5 bg-gray-100/50 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-xl rounded-[18px]">
                <button
                    onClick={() => setActiveTab('gear')}
                    className={`flex-1 py-2.5 text-sm font-semibold rounded-[14px] transition-all flex items-center justify-center gap-2 ${activeTab === 'gear'
                        ? 'bg-white dark:bg-white/15 text-[var(--color-primary)] dark:text-white shadow-md dark:shadow-lg border border-black/5 dark:border-white/10'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/50 dark:hover:bg-white/5'
                        }`}
                >
                    <Gear size={18} weight={activeTab === 'gear' ? 'fill' : 'regular'} />
                    Снаряжение
                </button>
                <button
                    onClick={() => setActiveTab('food')}
                    className={`flex-1 py-2.5 text-sm font-semibold rounded-[14px] transition-all flex items-center justify-center gap-2 ${activeTab === 'food'
                        ? 'bg-white dark:bg-white/15 text-[var(--color-primary)] dark:text-white shadow-md dark:shadow-lg border border-black/5 dark:border-white/10'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/50 dark:hover:bg-white/5'
                        }`}
                >
                    <ForkKnife size={18} weight={activeTab === 'food' ? 'fill' : 'regular'} />
                    Еда
                </button>
                <button
                    onClick={() => setActiveTab('checklist')}
                    className={`flex-1 py-2.5 text-sm font-semibold rounded-[14px] transition-all flex items-center justify-center gap-2 ${activeTab === 'checklist'
                        ? 'bg-white dark:bg-white/15 text-[var(--color-primary)] dark:text-white shadow-md dark:shadow-lg border border-black/5 dark:border-white/10'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/50 dark:hover:bg-white/5'
                        }`}
                >
                    <CheckSquare size={18} weight={activeTab === 'checklist' ? 'fill' : 'regular'} />
                    Чек-лист
                </button>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'gear' && <GearTab />}
                    {activeTab === 'food' && <FoodTab />}
                    {activeTab === 'checklist' && <ChecklistTab />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
