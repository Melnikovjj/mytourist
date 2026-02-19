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
            if (window.confirm('Are you sure you want to delete this project?')) {
                await deleteProject(projectId);
                navigate('/');
            }
        }
    };

    const handleShare = () => {
        if (!currentProject?.inviteCode) return;

        const link = `https://t.me/TuristProPlanner_bot?start=proj_${currentProject.inviteCode}`;
        const text = `Join my trip «${currentProject.title}»! 🏔`;
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
            <GlassCard className="p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <Gear size={120} weight="duotone" />
                </div>

                <div className="relative z-10">
                    <h1 className="text-2xl font-bold text-[#1C1C1E] mb-2">{currentProject.title}</h1>
                    {currentProject.description && (
                        <p className="text-sm text-[#1C1C1E]/60 mb-4 line-clamp-2">
                            {currentProject.description}
                        </p>
                    )}

                    <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="outline" className="bg-white/50 border-white/50">
                            {currentProject.type === 'hiking' ? '🥾 Hiking' : currentProject.type === 'ski' ? '⛷ Skiing' : '🚣 Water'}
                        </Badge>
                        <Badge variant="outline" className="bg-white/50 border-white/50">
                            {currentProject.season === 'summer' ? '☀️ Summer' : currentProject.season === 'winter' ? '❄️ Winter' : currentProject.season === 'spring' ? '🌱 Spring' : '🍂 Autumn'}
                        </Badge>
                    </div>

                    <div className="flex items-center gap-2" onClick={handleCopyInvite}>
                        <div className="flex -space-x-2">
                            {currentProject.members?.slice(0, 3).map((m) => (
                                <div key={m.id} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                    {m.user.firstName?.[0] || m.user.username?.[0] || '?'}
                                </div>
                            ))}
                            {(currentProject.members?.length || 0) > 3 && (
                                <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500">
                                    +{currentProject.members!.length - 3}
                                </div>
                            )}
                        </div>
                        <div className="text-xs text-[#2F80ED] font-medium ml-1">
                            Invite Code: <span className="font-mono">{currentProject.inviteCode}</span>
                        </div>
                    </div>
                </div>
            </GlassCard>

            {/* Tabs */}
            <div className="flex p-1 bg-gray-100/50 backdrop-blur-sm rounded-[14px]">
                <button
                    onClick={() => setActiveTab('gear')}
                    className={`flex-1 py-2 text-sm font-semibold rounded-[10px] transition-all flex items-center justify-center gap-1.5 ${activeTab === 'gear'
                            ? 'bg-white text-[#2F80ED] shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Gear size={18} weight={activeTab === 'gear' ? 'fill' : 'regular'} />
                    Gear
                </button>
                <button
                    onClick={() => setActiveTab('food')}
                    className={`flex-1 py-2 text-sm font-semibold rounded-[10px] transition-all flex items-center justify-center gap-1.5 ${activeTab === 'food'
                            ? 'bg-white text-[#2F80ED] shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <ForkKnife size={18} weight={activeTab === 'food' ? 'fill' : 'regular'} />
                    Food
                </button>
                <button
                    onClick={() => setActiveTab('checklist')}
                    className={`flex-1 py-2 text-sm font-semibold rounded-[10px] transition-all flex items-center justify-center gap-1.5 ${activeTab === 'checklist'
                            ? 'bg-white text-[#2F80ED] shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <CheckSquare size={18} weight={activeTab === 'checklist' ? 'fill' : 'regular'} />
                    Checklist
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
