import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Warning, User } from '@phosphor-icons/react';
import api from '../../api/client';
import type { WeightReport } from '../../types';

export function WeightPage() {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const [report, setReport] = useState<WeightReport | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (projectId) {
            setLoading(true);
            api.get(`/weight/project/${projectId}`).then((res) => {
                setReport(res.data);
                setLoading(false);
            });
        }
    }, [projectId]);

    if (loading || !report) return null;

    return (
        <div className="page">
            <button className="btn btn-ghost btn-sm mb-3" onClick={() => navigate(`/project/${projectId}`)}>
                <ArrowLeft size={16} /> Назад
            </button>

            <div className="page-header">
                <h1 className="page-title">⚖️ Контроль веса</h1>
                <p className="page-subtitle">Распределение нагрузки</p>
            </div>

            {/* Summary */}
            <div className="glass-card-static" style={{ padding: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div className="text-xs text-muted">Снаряжение</div>
                        <div className="font-bold" style={{ fontSize: '20px' }}>{report.summary.totalEquipmentWeight} кг</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div className="text-xs text-muted">Еда</div>
                        <div className="font-bold" style={{ fontSize: '20px' }}>{report.summary.totalFoodWeight} кг</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div className="text-xs text-muted">Общий вес</div>
                        <div className="font-bold" style={{ fontSize: '20px', color: 'var(--color-primary)' }}>{report.summary.totalWeight} кг</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div className="text-xs text-muted">Среднее/чел</div>
                        <div className="font-bold" style={{ fontSize: '20px' }}>{report.summary.averagePerPerson} кг</div>
                    </div>
                </div>
            </div>

            {/* Per member */}
            <h3 className="font-semibold mb-3">По участникам</h3>
            <div className="list-gap">
                {report.members.map((member, i) => (
                    <motion.div
                        key={member.userId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card-static"
                        style={{ padding: '16px' }}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <User size={18} />
                                <span className="font-semibold">{member.userName}</span>
                            </div>
                            {member.isOverloaded && (
                                <span className="badge badge-error">
                                    <Warning size={12} style={{ marginRight: 4 }} /> Перегруз!
                                </span>
                            )}
                        </div>

                        <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-secondary">Снаряжение: {member.equipmentWeight} кг</span>
                            <span className="text-secondary">Еда: {member.foodWeight} кг</span>
                        </div>

                        <div className="flex items-center justify-between text-sm mb-2">
                            <span>Итого: <strong>{member.totalWeight} кг</strong></span>
                            <span className="text-muted">Макс: {member.maxWeight} кг ({member.userWeight}×25%)</span>
                        </div>

                        <div className="progress-bar">
                            <div
                                className={`progress-fill ${member.loadPercentage > 100 ? 'warning' : ''}`}
                                style={{ width: `${Math.min(member.loadPercentage, 100)}%` }}
                            />
                        </div>
                        <div className="text-xs text-muted mt-1" style={{ textAlign: 'right' }}>
                            {member.loadPercentage}% нагрузки
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
