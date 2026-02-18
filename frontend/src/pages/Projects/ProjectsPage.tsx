import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Mountains, Snowflake, Waves, Users, CalendarBlank, CaretRight } from '@phosphor-icons/react';
import { useProjectStore } from '../../store/projectStore';
import type { Project } from '../../types';

const typeIcons: Record<string, any> = { hiking: Mountains, ski: Snowflake, water: Waves };
const typeLabels: Record<string, string> = { hiking: 'Пеший', ski: 'Лыжный', water: 'Водный' };
const seasonLabels: Record<string, string> = { winter: 'Зима', spring: 'Весна', summer: 'Лето', autumn: 'Осень' };

export function ProjectsPage() {
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
            <div className="page-header">
                <h1 className="page-title">🏔 Походный Сборщик</h1>
                <p className="page-subtitle">Совместное планирование походов</p>
            </div>

            <div className="flex gap-3 mb-3">
                <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => setShowCreate(true)}>
                    <Plus size={16} /> Создать
                </button>
                <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => setShowJoin(true)}>
                    Присоединиться
                </button>
            </div>

            <div className="list-gap">
                <AnimatePresence>
                    {projects.map((project, i) => {
                        const Icon = typeIcons[project.type] || Mountains;
                        return (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                className="glass-card"
                                style={{ padding: '20px', cursor: 'pointer' }}
                                onClick={() => navigate(`/project/${project.id}`)}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div style={{
                                            width: 40, height: 40, borderRadius: 12,
                                            background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <Icon size={20} color="#fff" weight="bold" />
                                        </div>
                                        <div>
                                            <div className="font-semibold">{project.title}</div>
                                            <div className="text-xs text-muted">
                                                {typeLabels[project.type]} • {seasonLabels[project.season]}
                                            </div>
                                        </div>
                                    </div>
                                    <CaretRight size={18} className="text-muted" />
                                </div>

                                <div className="flex items-center justify-between mt-3">
                                    <div className="flex items-center gap-2">
                                        <Users size={14} className="text-secondary" />
                                        <span className="text-sm text-secondary">{project.members?.length || 0}</span>
                                        {project.startDate && (
                                            <>
                                                <CalendarBlank size={14} className="text-secondary" style={{ marginLeft: 8 }} />
                                                <span className="text-sm text-secondary">
                                                    {new Date(project.startDate).toLocaleDateString('ru')}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    {project.readiness !== undefined && (
                                        <span className={`badge ${project.readiness === 100 ? 'badge-accent' : 'badge-primary'}`}>
                                            {project.readiness}%
                                        </span>
                                    )}
                                </div>

                                {project.readiness !== undefined && (
                                    <div className="progress-bar mt-2">
                                        <div className="progress-fill" style={{ width: `${project.readiness}%` }} />
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {!loading && projects.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-state-icon">🏕</div>
                        <div className="empty-state-title">Пока нет проектов</div>
                        <div className="empty-state-text">Создайте первый поход или присоединитесь по приглашению</div>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            <AnimatePresence>
                {showCreate && (
                    <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setShowCreate(false)}>
                        <motion.div className="modal-sheet" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25 }} onClick={(e) => e.stopPropagation()}>
                            <div className="modal-handle" />
                            <h2 className="modal-title">Новый поход</h2>
                            <div className="form-group">
                                <label className="input-label">Название</label>
                                <input className="input" placeholder="Например: Алтай 2026" value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="input-label">Описание</label>
                                <input className="input" placeholder="Краткое описание маршрута" value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="input-label">Тип похода</label>
                                    <select className="select" value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                                        <option value="hiking">🥾 Пеший</option>
                                        <option value="ski">⛷ Лыжный</option>
                                        <option value="water">🚣 Водный</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="input-label">Сезон</label>
                                    <select className="select" value={formData.season}
                                        onChange={(e) => setFormData({ ...formData, season: e.target.value })}>
                                        <option value="summer">☀️ Лето</option>
                                        <option value="autumn">🍂 Осень</option>
                                        <option value="winter">❄️ Зима</option>
                                        <option value="spring">🌱 Весна</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="input-label">Начало</label>
                                    <input className="input" type="date" value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="input-label">Конец</label>
                                    <input className="input" type="date" value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
                                </div>
                            </div>
                            <button className="btn btn-primary btn-full btn-lg mt-4" onClick={handleCreate}>
                                Создать проект
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Join Modal */}
            <AnimatePresence>
                {showJoin && (
                    <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setShowJoin(false)}>
                        <motion.div className="modal-sheet" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25 }} onClick={(e) => e.stopPropagation()}>
                            <div className="modal-handle" />
                            <h2 className="modal-title">Присоединиться</h2>
                            <div className="form-group">
                                <label className="input-label">Код приглашения</label>
                                <input className="input" placeholder="Введите код" value={inviteCode}
                                    onChange={(e) => setInviteCode(e.target.value)} />
                            </div>
                            <button className="btn btn-primary btn-full btn-lg mt-4" onClick={handleJoin}>
                                Присоединиться
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
