import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Backpack, ForkKnife, Barbell, CheckSquare, Users, LinkSimple, ArrowLeft, Trash } from '@phosphor-icons/react';
import { useProjectStore } from '../../store/projectStore';
import { useAuthStore } from '../../store/authStore';

export function ProjectDetailPage() {
    const { projectId } = useParams<{ projectId: string }>();
    const { currentProject, fetchProject, deleteProject } = useProjectStore();
    const { user } = useAuthStore();
    const navigate = useNavigate();

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
            await deleteProject(projectId);
            navigate('/');
        }
    };

    if (!currentProject) return null;

    const isOwner = currentProject.ownerId === user?.id;
    const modules = [
        { path: 'equipment', label: 'Снаряжение', icon: Backpack, color: '#0ea5e9' },
        { path: 'meals', label: 'Питание', icon: ForkKnife, color: '#06d6a0' },
        { path: 'weight', label: 'Вес', icon: Barbell, color: '#f59e0b' },
        { path: 'checklist', label: 'Чек-лист', icon: CheckSquare, color: '#8b5cf6' },
    ];

    return (
        <div className="page">
            <button className="btn btn-ghost btn-sm mb-3" onClick={() => navigate('/')}>
                <ArrowLeft size={16} /> Назад
            </button>

            <div className="glass-card-static" style={{ padding: '24px', marginBottom: '20px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
                    {currentProject.title}
                </h1>
                {currentProject.description && (
                    <p className="text-secondary text-sm" style={{ marginBottom: '16px' }}>
                        {currentProject.description}
                    </p>
                )}

                <div className="flex items-center gap-3" style={{ flexWrap: 'wrap' }}>
                    <span className="badge badge-primary">
                        {currentProject.type === 'hiking' ? '🥾 Пеший' : currentProject.type === 'ski' ? '⛷ Лыжный' : '🚣 Водный'}
                    </span>
                    <span className="badge badge-accent">
                        {currentProject.season === 'summer' ? '☀️ Лето' : currentProject.season === 'winter' ? '❄️ Зима' : currentProject.season === 'spring' ? '🌱 Весна' : '🍂 Осень'}
                    </span>
                </div>

                {/* Members */}
                <div style={{ marginTop: '20px' }}>
                    <div className="flex items-center gap-2 mb-2">
                        <Users size={16} className="text-secondary" />
                        <span className="text-sm font-semibold">Участники ({currentProject.members?.length || 0})</span>
                    </div>
                    <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                        {currentProject.members?.map((m) => (
                            <span key={m.id} className="badge badge-primary">
                                {m.user.firstName || m.user.username || 'Участник'}
                                {m.role === 'owner' && ' 👑'}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Invite section */}
                {currentProject.inviteCode && (
                    <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                        <div className="flex items-center gap-2 mb-3">
                            <LinkSimple size={16} className="text-secondary" />
                            <span className="text-sm font-semibold">Поделиться планом</span>
                        </div>
                        <div className="flex gap-2">
                            <div style={{
                                flex: 1, background: 'rgba(0,0,0,0.2)', padding: '8px 12px', borderRadius: '8px',
                                fontSize: '12px', color: 'var(--color-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                            }}>
                                {`t.me/TuristProPlanner_bot?start=proj_${currentProject.inviteCode}`}
                            </div>
                            <button className="btn btn-primary btn-sm" onClick={() => {
                                const link = `https://t.me/TuristProPlanner_bot?start=proj_${currentProject.inviteCode}`;
                                navigator.clipboard.writeText(link);
                                window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success');
                            }}>
                                📋
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Module grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {modules.map((mod, i) => (
                    <motion.div
                        key={mod.path}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card"
                        style={{ padding: '20px', textAlign: 'center', cursor: 'pointer' }}
                        onClick={() => navigate(`/project/${projectId}/${mod.path}`)}
                    >
                        <div style={{
                            width: 48, height: 48, borderRadius: 16, margin: '0 auto 12px',
                            background: `${mod.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <mod.icon size={24} color={mod.color} weight="duotone" />
                        </div>
                        <div className="font-semibold text-sm">{mod.label}</div>
                    </motion.div>
                ))}
            </div>

            {isOwner && (
                <button className="btn btn-danger btn-sm btn-full mt-4" onClick={handleDelete}>
                    <Trash size={16} /> Удалить проект
                </button>
            )}
        </div>
    );
}
