import { Info, Pill, FirstAid, Warning } from '@phosphor-icons/react';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Badge } from '../../../components/ui/Badge';

export function MedicineTab() {
    const recommendations = [
        {
            category: 'Обязательное (Личное)',
            items: [
                { name: 'Бинт стерильный', desc: '1 шт. (7см х 14см)' },
                { name: 'Пластырь рулонный', desc: '1 шт.' },
                { name: 'Пластырь бактерицидный', desc: '10 шт.' },
                { name: 'Индивидуальные лекарства', desc: 'По личным показаниям' },
            ]
        },
        {
            category: 'Групповая аптечка (Ремнабор)',
            items: [
                { name: 'Перекись водорода / Хлоргексидин', desc: 'Антисептик для ран' },
                { name: 'Обезболивающее (Нимесулид/Ибупрофен)', desc: 'От боли и воспаления' },
                { name: 'Жаропонижающее (Парацетамол)', desc: 'При высокой температуре' },
                { name: 'Антигистаминное (Супрастин)', desc: 'При аллергии' },
                { name: 'Сорбенты (Активированный уголь)', desc: 'При отравлениях' },
            ]
        }
    ];

    const tips = [
        "Всегда проверяйте срок годности лекарств перед походом.",
        "Аптечка должна храниться в герметичном и легкодоступном месте.",
        "Руководитель группы должен знать о хронических заболеваниях участников.",
        "В случае серьезной травмы — немедленно прекратите маршрут и вызовите помощь."
    ];

    return (
        <div className="space-y-4">
            <GlassCard className="p-4 bg-orange-500/5 border-l-4 border-l-orange-500">
                <div className="flex items-center gap-2 mb-2 text-orange-600">
                    <Warning size={20} weight="fill" />
                    <span className="font-bold uppercase tracking-wider text-xs">Важное примечание</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Этот список является рекомендательным. Состав аптечки может меняться в зависимости от сложности и длительности маршрута. Консультируйтесь с врачом.
                </p>
            </GlassCard>

            <div className="space-y-6">
                {recommendations.map((section, idx) => (
                    <div key={idx} className="space-y-3">
                        <div className="flex items-center gap-2">
                            <FirstAid size={18} className="text-[var(--primary-start)]" />
                            <h3 className="font-bold text-[var(--text-primary)]">{section.category}</h3>
                        </div>
                        <div className="grid gap-2">
                            {section.items.map((item, i) => (
                                <GlassCard key={i} className="p-3 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-[var(--text-primary)]">{item.name}</span>
                                        <span className="text-[10px] text-[var(--text-secondary)]">{item.desc}</span>
                                    </div>
                                    <Badge variant="outline">Рекомендовано</Badge>
                                </GlassCard>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                    <Info size={18} className="text-blue-500" />
                    <h3 className="font-bold text-[var(--text-primary)]">Советы по медицине</h3>
                </div>
                <div className="space-y-2">
                    {tips.map((tip, i) => (
                        <div key={i} className="flex gap-3 text-sm text-[var(--text-secondary)] leading-tight italic">
                            <span className="text-blue-500">•</span>
                            <span>{tip}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
