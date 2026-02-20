import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Warning, User } from '@phosphor-icons/react';
import api from '../../api/client';
import type { WeightReport } from '../../types';
import { GlassCard } from '../../components/ui/GlassCard';
import { Badge } from '../../components/ui/Badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

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
        <div className="min-h-screen pb-24 pt-4 px-4 space-y-4">
            <button
                onClick={() => navigate(`/project/${projectId}`)}
                className="p-2 -ml-2 rounded-full hover:bg-white/20 transition-colors text-white mb-2"
            >
                <ArrowLeft size={24} />
            </button>

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#1C1C1E] mb-1">⚖️ Контроль веса</h1>
                <p className="text-[#1C1C1E]/60 text-sm">Распределение нагрузки</p>
            </div>

            {/* Summary */}
            <GlassCard className="p-4 mb-4">
                <div className="flex flex-col mb-4 items-center">
                    <div className="h-48 w-full mb-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Снаряжение', value: report.summary.totalEquipmentWeight, color: '#2F80ED' },
                                        { name: 'Еда', value: report.summary.totalFoodWeight, color: '#34C759' }
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={45}
                                    outerRadius={65}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {[
                                        { name: 'Снаряжение', value: report.summary.totalEquipmentWeight, color: '#2F80ED' },
                                        { name: 'Еда', value: report.summary.totalFoodWeight, color: '#34C759' }
                                    ].map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    formatter={(value: any) => [`${value} кг`, '']}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="text-center">
                        <div className="text-xs text-gray-500">Снаряжение</div>
                        <div className="font-bold text-xl text-[#2F80ED]">{report.summary.totalEquipmentWeight} кг</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-gray-500">Еда</div>
                        <div className="font-bold text-xl text-[#34C759]">{report.summary.totalFoodWeight} кг</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-gray-500">Общий вес</div>
                        <div className="font-bold text-xl">{report.summary.totalWeight} кг</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-gray-500">Среднее/чел</div>
                        <div className="font-bold text-xl">{report.summary.averagePerPerson} кг</div>
                    </div>
                </div>
            </GlassCard>

            {/* Per member */}
            <h3 className="font-semibold mb-3 text-lg text-[#1C1C1E]">По участникам</h3>
            <div className="space-y-3">
                {report.members.map((member, i) => (
                    <motion.div
                        key={member.userId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <GlassCard className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <User size={18} weight="fill" />
                                    <span className="font-semibold">{member.userName}</span>
                                </div>
                                {member.isOverloaded && (
                                    <Badge status="error" className="flex items-center gap-1">
                                        <Warning size={12} weight="fill" /> Перегруз!
                                    </Badge>
                                )}
                            </div>

                            <div className="flex items-center justify-between text-sm mb-2 text-gray-600">
                                <span>Снаряжение: {member.equipmentWeight} кг</span>
                                <span>Еда: {member.foodWeight} кг</span>
                            </div>

                            <div className="flex items-center justify-between text-sm mb-2">
                                <span className="text-[#1C1C1E]">Итого: <strong>{member.totalWeight} кг</strong></span>
                                <span className="text-gray-400 text-xs">Макс: {member.maxWeight} кг ({member.userWeight}×25%)</span>
                            </div>

                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ${member.loadPercentage > 100 ? 'bg-red-500' : 'bg-[#2F80ED]'}`}
                                    style={{ width: `${Math.min(member.loadPercentage, 100)}%` }}
                                />
                            </div>
                            <div className="text-xs text-gray-400 mt-1 text-right">
                                {member.loadPercentage}% нагрузки
                            </div>

                            {member.smartTip && (
                                <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                                    <div className="flex gap-2 items-start">
                                        <Warning size={16} className="text-red-500 shrink-0 mt-0.5" weight="fill" />
                                        <p className="text-sm text-red-600 dark:text-red-400 leading-tight">
                                            {member.smartTip}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </GlassCard>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
