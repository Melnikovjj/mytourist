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
        case 'ski': return 'https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&q=80&w=800'; // Skiing
        case 'water': return 'https://images.unsplash.com/photo-1544551763-46a813d9ca9d?auto=format&fit=crop&q=80&w=800'; // Kayak
        default: return 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=800'; // Hiking
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
                <header className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Привет, {user?.firstName || user?.username || 'Турист'}</h1>
                        <p className="text-[var(--text-primary)] opacity-60 text-sm">Готов к приключениям?</p>
                    </div>
                    <Avatar src={user?.avatarUrl} fallback={user?.username?.[0] || 'U'} glow />
                </header>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-4">
                    <GlassCard
                        className="p-4 flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform cursor-pointer hover:bg-white/10"
                        onClick={() => setShowCreate(true)}
                    >
                        <div className="w-10 h-10 rounded-full bg-[#4AC7FA]/20 flex items-center justify-center text-[#4AC7FA]">
                            <Plus size={24} />
                        </div>
                        <span className="font-medium text-sm text-white/90">Создать</span>
                    </GlassCard>

                    <GlassCard
                        className="p-4 flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform cursor-pointer hover:bg-white/10"
                        onClick={() => setShowJoin(true)}
                    >
                        <div className="w-10 h-10 rounded-full bg-[#34C759]/20 flex items-center justify-center text-[#34C759]">
                            <Users size={24} />
                        </div>
                        <span className="font-medium text-sm text-white/90">Вступить</span>
                    </GlassCard>
                </div>

                {/* Projects List */}
                <section className="space-y-4">
                    <div className="flex justify-between items-end">
                        <h2 className="text-xl font-semibold text-[var(--text-primary)]">Мои Походы</h2>
                        {projects.length > 0 && <span className="text-[#2F80ED] text-sm font-medium">{projects.length} Активных</span>}
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-center py-10 text-white/40">Загрузка походов...</div>
                        ) : projects.length === 0 ? (
                            <div className="text-center py-10 text-white/50">Пока нет походов. Создай или присоединись!</div>
                        ) : (
                            projects.map((project) => (
                                <GlassCard
                                    key={project.id}
                                    className="p-0 overflow-hidden cursor-pointer active:scale-[0.98] transition-transform border-white/10"
                                    onClick={() => navigate(`/project/${project.id}`)}
                                >
                                    <div className="relative h-36">
                                        <img src={getProjectImage(project.type)} alt={project.title} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                        <div className="absolute bottom-3 left-4 text-white right-4">
                                            <div className="flex justify-between items-start mb-1">
                                                <Badge status="neutral" className="backdrop-blur-md bg-white/20 border-white/30 text-white">
                                                    {typeLabels[project.type] || project.type}
                                                </Badge>
                                                {/* Facepile */}
                                                <div className="flex -space-x-2">
                                                    {project.members?.slice(0, 3).map((m: any) => (
                                                        <div key={m.id || m.userId} className="w-6 h-6 rounded-full border border-black/50 bg-gray-600 flex items-center justify-center text-[10px] text-white overflow-hidden">
                                                            {m.user?.avatarUrl ? (
                                                                <img src={m.user.avatarUrl} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <span>{m.user?.firstName?.[0] || '?'}</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                    {(project.members?.length || 0) > 3 && (
                                                        <div className="w-6 h-6 rounded-full border border-black/50 bg-gray-700 flex items-center justify-center text-[8px] font-medium text-white">
                                                            +{project.members!.length - 3}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <h3 className="text-xl font-bold leading-tight mb-0.5">{project.title}</h3>
                                            {project.startDate && (
                                                <p className="text-xs text-white/70">
                                                    {new Date(project.startDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                                                    {project.endDate ? ` — ${new Date(project.endDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}` : ''}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-4 space-y-3 bg-white/5">
                                        <div className="flex justify-between text-sm text-white/70">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={16} />
                                                <span>{seasonLabels[project.season] || project.season}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <div className="flex justify-between text-xs font-medium text-white/60">
                                                <span>Подготовка</span>
                                                <span>{project.readiness || 0}%</span>
                                            </div>
                                            <ProgressBar progress={project.readiness || 0} />
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
                                <h2 className="text-xl font-bold mb-6">Создать Новый Поход</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 mb-1 block">Название</label>
                                        <input className="input w-full p-3 rounded-xl bg-gray-50 border border-gray-200"
                                            placeholder="Например: Эльбрус 2024"
                                            value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 mb-1 block">Тип</label>
                                            <select className="input w-full p-3 rounded-xl bg-gray-50 border border-gray-200"
                                                value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                                                <option value="hiking">Пеший</option>
                                                <option value="ski">Лыжный</option>
                                                <option value="water">Водный</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 mb-1 block">Сезон</label>
                                            <select className="input w-full p-3 rounded-xl bg-gray-50 border border-gray-200"
                                                value={formData.season} onChange={(e) => setFormData({ ...formData, season: e.target.value })}>
                                                <option value="summer">Лето</option>
                                                <option value="winter">Зима</option>
                                                <option value="spring">Весна</option>
                                                <option value="autumn">Осень</option>
                                            </select>
                                        </div>
                                    </div>
                                    <Button className="w-full mt-4" onClick={handleCreate}>
                                        Создать Поход
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
                                <h2 className="text-xl font-bold mb-6">Вступить в Поход</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 mb-1 block">Код Приглашения</label>
                                        <input className="input w-full p-3 rounded-xl bg-gray-50 border border-gray-200"
                                            placeholder="Введите код"
                                            value={inviteCode} onChange={(e) => setInviteCode(e.target.value)}
                                        />
                                    </div>
                                    <Button className="w-full mt-4" onClick={handleJoin}>
                                        Вступить
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
