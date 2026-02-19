import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Mountains, Snowflake, Waves, Users, CalendarBlank as Calendar, CaretRight } from '@phosphor-icons/react';
import { useProjectStore } from '../../store/projectStore';
import { useAuthStore } from '../../store/authStore';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import type { Project } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';

const typeIcons: Record<string, any> = { hiking: Mountains, ski: Snowflake, water: Waves };
const typeLabels: Record<string, string> = { hiking: 'Пеший', ski: 'Лыжный', water: 'Водный' };
const seasonLabels: Record<string, string> = { winter: 'Зима', spring: 'Весна', summer: 'Лето', autumn: 'Осень' };

const getProjectImage = (type: string) => {
    switch (type) {
        case 'ski': return 'https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&q=80&w=800';
        case 'water': return 'https://images.unsplash.com/photo-1544551763-46a813d9ca9d?auto=format&fit=crop&q=80&w=800';
        default: return 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=800';
    }
};

export function ProjectsPage() {
    const { user } = useAuthStore();
    const { projects, loading, fetchProjects, createProject, joinProject } = useProjectStore();
    const [showCreate, setShowCreate] = useState(false);
    const [showJoin, setShowJoin] = useState(false);
    const [inviteCode, setInviteCode] = useState('');
    const [formData, setFormData] = useState({ title: '', description: '', type: 'hiking', season: 'summer', startDate: '', endDate: '' });
    const navigate = useNavigate();

    useEffect(() => { fetchProjects(); }, []);

    const handleCreate = async () => {
        if (!formData.title.trim()) return;
        const project = await createProject(formData);
        setShowCreate(false);
        setFormData({ title: '', description: '', type: 'hiking', season: 'summer', startDate: '', endDate: '' });
        navigate(`/project/${project.id}`);
    };

    const handleJoin = async () => {
        if (!inviteCode.trim()) return;
        const result = await joinProject(inviteCode);
        setShowJoin(false);
        setInviteCode('');
        if (result.projectId) navigate(`/project/${result.projectId}`);
    };

    return (
        <div className="page">
            <div className="space-y-8 pb-24 page px-4 pt-6">
                {/* Header */}
                <header className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-semibold text-[#1C1C1E]">Hello, {user?.firstName || user?.username || 'Traveler'}</h1>
                        <p className="text-[#1C1C1E]/60 text-sm">Ready for your next adventure?</p>
                    </div>
                    <Avatar src={user?.avatarUrl} fallback={user?.username?.[0] || 'U'} glow />
                </header>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-4">
                    <GlassCard
                        className="p-4 flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform cursor-pointer"
                        onClick={() => setShowCreate(true)}
                    >
                        <div className="w-10 h-10 rounded-full bg-[#4AC7FA]/10 flex items-center justify-center text-[#4AC7FA]">
                            <Plus size={24} />
                        </div>
                        <span className="font-medium text-sm">New Trip</span>
                    </GlassCard>

                    <GlassCard
                        className="p-4 flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform cursor-pointer"
                        onClick={() => setShowJoin(true)}
                    >
                        <div className="w-10 h-10 rounded-full bg-[#34C759]/10 flex items-center justify-center text-[#34C759]">
                            <Users size={24} />
                        </div>
                        <span className="font-medium text-sm">Join Party</span>
                    </GlassCard>
                </div>

                {/* Projects List */}
                <section className="space-y-4">
                    <div className="flex justify-between items-end">
                        <h2 className="text-xl font-semibold">My Trips</h2>
                        {projects.length > 0 && <span className="text-[#2F80ED] text-sm font-medium">{projects.length} Active</span>}
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-center py-10 text-gray-400">Loading trips...</div>
                        ) : projects.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">No trips yet. Create or join one!</div>
                        ) : (
                            projects.map((project) => (
                                <GlassCard
                                    key={project.id}
                                    className="p-0 overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
                                    onClick={() => navigate(`/project/${project.id}`)}
                                >
                                    <div className="relative h-32">
                                        <img src={getProjectImage(project.type)} alt={project.title} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <div className="absolute bottom-3 left-4 text-white">
                                            <Badge status="neutral" className="mb-2 backdrop-blur-md bg-white/20 border-white/30 text-white">
                                                {project.type.charAt(0).toUpperCase() + project.type.slice(1)}
                                            </Badge>
                                            <h3 className="text-lg font-semibold leading-tight">{project.title}</h3>
                                        </div>
                                    </div>

                                    <div className="p-4 space-y-4">
                                        <div className="flex justify-between text-sm text-[#1C1C1E]/70">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={16} />
                                                <span>{project.season === 'summer' ? 'Summer' : project.season === 'winter' ? 'Winter' : 'Any'}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Users size={16} />
                                                <span>{project.members?.length || 1} people</span>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <div className="flex justify-between text-xs font-medium text-[#1C1C1E]/60">
                                                <span>Preparation</span>
                                                {/* Mock progress for now, implementation would require backend logic */}
                                                <span>30%</span>
                                            </div>
                                            <ProgressBar progress={30} />
                                        </div>
                                    </div>
                                </GlassCard>
                            ))
                        )}
                    </div>
                </section>

                {/* Create Modal */}
                <AnimatePresence>
                    {showCreate && (
                        <motion.div className="modal-overlay fixed inset-0 bg-black/50 z-50 flex items-end"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowCreate(false)}>
                            <motion.div
                                className="bg-white rounded-t-[32px] w-full p-6 pb-12"
                                initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                                transition={{ type: 'spring', damping: 25 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />
                                <h2 className="text-xl font-bold mb-6">Create New Trip</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 mb-1 block">Trip Name</label>
                                        <input className="input w-full p-3 rounded-xl bg-gray-50 border border-gray-200"
                                            placeholder="e.g., Elbrus Ascent"
                                            value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 mb-1 block">Type</label>
                                            <select className="input w-full p-3 rounded-xl bg-gray-50 border border-gray-200"
                                                value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                                                <option value="hiking">Hiking</option>
                                                <option value="ski">Skiing</option>
                                                <option value="water">Water</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 mb-1 block">Season</label>
                                            <select className="input w-full p-3 rounded-xl bg-gray-50 border border-gray-200"
                                                value={formData.season} onChange={(e) => setFormData({ ...formData, season: e.target.value })}>
                                                <option value="summer">Summer</option>
                                                <option value="winter">Winter</option>
                                                <option value="spring">Spring</option>
                                                <option value="autumn">Autumn</option>
                                            </select>
                                        </div>
                                    </div>
                                    <Button className="w-full mt-4" onClick={handleCreate}>
                                        Create Project
                                    </Button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Join Modal */}
                <AnimatePresence>
                    {showJoin && (
                        <motion.div className="modal-overlay fixed inset-0 bg-black/50 z-50 flex items-end"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowJoin(false)}>
                            <motion.div
                                className="bg-white rounded-t-[32px] w-full p-6 pb-12"
                                initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                                transition={{ type: 'spring', damping: 25 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />
                                <h2 className="text-xl font-bold mb-6">Join a Trip</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 mb-1 block">Invite Code</label>
                                        <input className="input w-full p-3 rounded-xl bg-gray-50 border border-gray-200"
                                            placeholder="Enter code"
                                            value={inviteCode} onChange={(e) => setInviteCode(e.target.value)}
                                        />
                                    </div>
                                    <Button className="w-full mt-4" onClick={handleJoin}>
                                        Join Project
                                    </Button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
