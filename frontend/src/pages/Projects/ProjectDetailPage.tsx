import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShareNetwork, Trash, Gear, ForkKnife, CheckSquare, Users, Calendar, ChatCircle, PencilSimple } from '@phosphor-icons/react';
import { useProjectStore } from '../../store/projectStore';
import { useAuthStore } from '../../store/authStore';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { GearTab } from './Tabs/GearTab';
import { FoodTab } from './Tabs/FoodTab';
import { ChecklistTab } from './Tabs/ChecklistTab';
import { ChatTab } from './Tabs/ChatTab';
import { CalendarTab } from './Tabs/CalendarTab';
import { ParticipantsTab } from './Tabs/ParticipantsTab';
import api from '../../api/client';

type TabType = 'gear' | 'food' | 'checklist' | 'chat' | 'calendar' | 'participants';

export function ProjectDetailPage() {
    const { projectId } = useParams<{ projectId: string }>();
    const { currentProject, fetchProject, deleteProject } = useProjectStore();
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabType>('gear');
    const [showEdit, setShowEdit] = useState(false);
    const [editForm, setEditForm] = useState({ title: '', description: '', startDate: '', endDate: '' });

    useEffect(() => {
        if (projectId) fetchProject(projectId);
    }, [projectId]);

    useEffect(() => {
        if (currentProject) {
            setEditForm({
                title: currentProject.title,
                description: currentProject.description || '',
                startDate: currentProject.startDate ? new Date(currentProject.startDate).toISOString().split('T')[0] : '',
                endDate: currentProject.endDate ? new Date(currentProject.endDate).toISOString().split('T')[0] : '',
            });
        }
    }, [currentProject]);

    const handleCopyInvite = () => {
        if (currentProject?.inviteCode) {
            navigator.clipboard.writeText(currentProject.inviteCode);
            window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success');
        }
    };

    const handleDelete = async () => {
        if (projectId) {
            if (window.confirm('Вы уверены, что хотите удалить этот поход? Это действие нельзя отменить.')) {
                await deleteProject(projectId);
                navigate('/');
            }
        }
    };

    const handleUpdate = async () => {
        if (!projectId) return;
        try {
            await api.post(`/projects/${projectId}`, editForm);
            fetchProject(projectId);
            setShowEdit(false);
            window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success');
        } catch (e) {
            console.error(e);
            window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('error');
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

    const tabs = [
        { id: 'gear', label: 'Снаряжение', icon: Gear },
        { id: 'food', label: 'Еда', icon: ForkKnife },
        { id: 'checklist', label: 'Чек-лист', icon: CheckSquare },
        { id: 'chat', label: 'Чат', icon: ChatCircle },
        { id: 'calendar', label: 'Календарь', icon: Calendar },
        { id: 'participants', label: 'Участники', icon: Users },
    ];

    return (
        <div className="min-h-screen pb-24 pt-4 px-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <button
                    onClick={() => navigate('/')}
                    className="p-2 -ml-2 rounded-full hover:bg-white/20 transition-colors text-[var(--text-primary)]"
                >
                    <ArrowLeft size={24} />
                </button>
                <div className="flex gap-2">
                    {isOwner && (
                        <>
                            <button
                                onClick={() => setShowEdit(true)}
                                className="p-2 rounded-full hover:bg-white/20 transition-colors text-[var(--text-primary)]"
                            >
                                <PencilSimple size={20} />
                            </button>
                            <button
                                onClick={handleDelete}
                                className="p-2 rounded-full hover:bg-white/20 transition-colors text-red-500 hover:text-red-400"
                            >
                                <Trash size={20} />
                            </button>
                        </>
                    )}
                    <button
                        onClick={handleShare}
                        className="p-2 rounded-full bg-white/20 backdrop-blur-md text-[var(--text-primary)] hover:bg-white/30 transition-colors"
                    >
                        <ShareNetwork size={20} weight="bold" />
                    </button>
                </div>
            </div>

            {/* Project Card */}
            <GlassCard className="p-6 relative overflow-hidden shadow-2xl">
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

                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/5 backdrop-blur-sm cursor-pointer active:scale-[0.98] transition-all" onClick={() => setActiveTab('participants')}>
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
                            <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-semibold">Участники</span>
                            <span className="text-xs text-[var(--text-primary)]">Нажмите, чтобы открыть</span>
                        </div>
                    </div>
                </div>
            </GlassCard>

            {/* Tabs */}
            <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabType)}
                        className={`
                            whitespace-nowrap px-4 py-2.5 text-sm font-semibold rounded-[14px] transition-all flex items-center gap-2
                            border
                            ${activeTab === tab.id
                                ? 'bg-white dark:bg-white/15 text-[var(--color-primary)] dark:text-white shadow-md border-transparent'
                                : 'bg-transparent border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/10'
                            }
                        `}
                    >
                        <tab.icon size={18} weight={activeTab === tab.id ? 'fill' : 'regular'} />
                        {tab.label}
                    </button>
                ))}
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
                    {activeTab === 'chat' && <ChatTab />}
                    {activeTab === 'calendar' && <CalendarTab />}
                    {activeTab === 'participants' && <ParticipantsTab />}
                </motion.div>
            </AnimatePresence>

            {/* Edit Modal */}
            <AnimatePresence>
                {showEdit && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
                        onClick={() => setShowEdit(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                            className="bg-white dark:bg-[#1c1c1e] w-full max-w-md rounded-2xl p-6 shadow-2xl border border-white/10"
                            onClick={e => e.stopPropagation()}
                        >
                            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Редактировать поход</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-[var(--text-secondary)] mb-1 block">Название</label>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-100 dark:bg-white/5 border-none rounded-xl p-3 text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                        value={editForm.title}
                                        onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-[var(--text-secondary)] mb-1 block">Описание</label>
                                    <textarea
                                        className="w-full bg-gray-100 dark:bg-white/5 border-none rounded-xl p-3 text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[#2F80ED] h-24 resize-none"
                                        value={editForm.description}
                                        onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-[var(--text-secondary)] mb-1 block">Дата начала</label>
                                        <input
                                            type="date"
                                            className="w-full bg-gray-100 dark:bg-white/5 border-none rounded-xl p-3 text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                            value={editForm.startDate}
                                            onChange={e => setEditForm({ ...editForm, startDate: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-[var(--text-secondary)] mb-1 block">Дата конца</label>
                                        <input
                                            type="date"
                                            className="w-full bg-gray-100 dark:bg-white/5 border-none rounded-xl p-3 text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                            value={editForm.endDate}
                                            onChange={e => setEditForm({ ...editForm, endDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <Button variant="secondary" className="flex-1" onClick={() => setShowEdit(false)}>Отмена</Button>
                                    <Button className="flex-1 bg-[#2F80ED] text-white" onClick={handleUpdate}>Сохранить</Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
