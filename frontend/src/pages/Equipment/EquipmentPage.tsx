import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Lightning, UserCircle, Package, Trash } from '@phosphor-icons/react';
import { useEquipmentStore } from '../../store/equipmentStore';
import { useProjectStore } from '../../store/projectStore';
import type { ProjectEquipment } from '../../types';

export function EquipmentPage() {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
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

    const totalWeight = projectEquipment.reduce((s, e) => s + (e.customWeight || e.equipment.weight), 0);
    const packedCount = projectEquipment.filter((e) => e.status === 'packed').length;

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
        <div className="page">
            <button className="btn btn-ghost btn-sm mb-3" onClick={() => navigate(`/project/${projectId}`)}>
                <ArrowLeft size={16} /> Назад
            </button>

            <div className="page-header">
                <h1 className="page-title">🎒 Снаряжение</h1>
                <p className="page-subtitle">
                    {projectEquipment.length} предметов • {totalWeight.toFixed(1)} кг • {packedCount} собрано
                </p>
            </div>

            <button className="btn btn-accent btn-sm btn-full mb-3" onClick={handleAutoGenerate}>
                <Lightning size={16} /> Автогенерация списка
            </button>

            {/* Category tabs */}
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', marginBottom: '16px', paddingBottom: '4px' }}>
                <button className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter('all')}>
                    Все
                </button>
                {categories.map((cat) => (
                    <button key={cat} className={`btn btn-sm ${filter === cat ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setFilter(cat)} style={{ whiteSpace: 'nowrap' }}>
                        {cat}
                    </button>
                ))}
            </div>

            <div className="list-gap">
                <AnimatePresence>
                    {filtered.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: i * 0.03 }}
                            className={`checkbox-item ${item.status === 'packed' ? 'checked' : ''}`}
                            onClick={() => toggleStatus(item)}
                        >
                            <div className={`checkbox-box ${item.status === 'packed' ? 'checked' : ''}`}>
                                {item.status === 'packed' && <span style={{ color: '#fff', fontSize: 14 }}>✓</span>}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div className="checkbox-label">{item.equipment.name}</div>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-muted">{(item.customWeight || item.equipment.weight).toFixed(1)} кг</span>
                                    {item.equipment.isGroupItem && (
                                        <span className="badge badge-warning" style={{ fontSize: '10px', padding: '2px 6px' }}>Групповое</span>
                                    )}
                                    {item.assignedTo && (
                                        <span className="text-xs text-secondary">
                                            <UserCircle size={12} style={{ verticalAlign: 'middle' }} /> {item.assignedTo.firstName || item.assignedTo.username}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button
                                className="btn btn-ghost btn-sm"
                                style={{ padding: '6px' }}
                                onClick={(e) => { e.stopPropagation(); removeFromProject(item.id); }}
                            >
                                <Trash size={14} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {projectEquipment.length === 0 && !loading && (
                <div className="empty-state">
                    <div className="empty-state-icon">🎒</div>
                    <div className="empty-state-title">Список пуст</div>
                    <div className="empty-state-text">Нажмите «Автогенерация» для создания списка</div>
                </div>
            )}
        </div>
    );
}
