import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from '@phosphor-icons/react';
import api from '../../api/client';
import { getSocket, joinProjectRoom, leaveProjectRoom } from '../../api/socket';
import { useAuthStore } from '../../store/authStore';
import type { ChecklistItem } from '../../types';

export function ChecklistPage() {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [items, setItems] = useState<ChecklistItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (projectId) {
            api.get(`/checklist/project/${projectId}`).then((res) => {
                setItems(res.data);
                setLoading(false);
            });

            // Join WebSocket room
            if (user) joinProjectRoom(projectId, user.id);
            const socket = getSocket();
            socket.on('checklist_updated', (data: ChecklistItem) => {
                setItems((prev) => prev.map((item) => (item.id === data.id ? { ...item, checked: !item.checked } : item)));
            });

            return () => {
                if (projectId) leaveProjectRoom(projectId);
                socket.off('checklist_updated');
            };
        }
    }, [projectId]);

    const toggleItem = async (itemId: string) => {
        await api.patch(`/checklist/${itemId}/toggle`);
        setItems((prev) =>
            prev.map((item) => (item.id === itemId ? { ...item, checked: !item.checked } : item)),
        );
        window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
    };

    const categories = [...new Set(items.map((i) => i.category).filter(Boolean))];
    const checkedCount = items.filter((i) => i.checked).length;
    const progress = items.length > 0 ? Math.round((checkedCount / items.length) * 100) : 0;

    return (
        <div className="page">
            <button className="btn btn-ghost btn-sm mb-3" onClick={() => navigate(`/project/${projectId}`)}>
                <ArrowLeft size={16} /> Назад
            </button>

            <div className="page-header">
                <h1 className="page-title">✅ Чек-лист</h1>
                <p className="page-subtitle">
                    {checkedCount} из {items.length} собрано ({progress}%)
                </p>
            </div>

            <div className="progress-bar mb-3">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>

            {categories.map((cat) => (
                <div key={cat} style={{ marginBottom: '20px' }}>
                    <h3 className="font-semibold text-sm text-secondary mb-2">{cat}</h3>
                    <div className="list-gap">
                        {items.filter((i) => i.category === cat).map((item, idx) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: idx * 0.02 }}
                                className={`checkbox-item ${item.checked ? 'checked' : ''}`}
                                onClick={() => toggleItem(item.id)}
                            >
                                <div className={`checkbox-box ${item.checked ? 'checked' : ''}`}>
                                    {item.checked && <Check size={14} color="#fff" weight="bold" />}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div className="checkbox-label">{item.name}</div>
                                    {item.assignedToName && (
                                        <div className="text-xs text-muted mt-1">{item.assignedToName}</div>
                                    )}
                                </div>
                                {item.weight && (
                                    <span className="checkbox-meta">{item.weight.toFixed(1)} кг</span>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            ))}

            {items.length === 0 && !loading && (
                <div className="empty-state">
                    <div className="empty-state-icon">✅</div>
                    <div className="empty-state-title">Чек-лист пуст</div>
                    <div className="empty-state-text">Сначала добавьте снаряжение в проект</div>
                </div>
            )}
        </div>
    );
}
