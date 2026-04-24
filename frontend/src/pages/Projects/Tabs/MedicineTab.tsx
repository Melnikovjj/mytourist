import { Info, Pill, FirstAid, Warning } from '@phosphor-icons/react';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Badge } from '../../../components/ui/Badge';

export function MedicineTab() {
    const recommendations = [
        {
            category: 'Обязательная групповая аптечка (неавтономные походы)',
            items: [
                { name: 'Перчатки медицинские', desc: '4 пары' },
                { name: 'Маска медицинская', desc: '6 шт.' },
                { name: 'Кровоостанавливающий жгут (Эсмарха)', desc: '3,5-4 см - 1 шт.' },
                { name: 'Бинт марлевый медицинский', desc: '5 шт. разного размера' },
                { name: 'Косынка медицинская', desc: '1 шт.' },
                { name: 'Салфетки стерильные', desc: '2 пачки' },
                { name: 'Спиртовые салфетки', desc: '20 шт.' },
                { name: 'Бинт эластичный', desc: '1 шт.' },
                { name: 'Гемостатическая губка или аналог', desc: '1 упаковка' },
                { name: 'Гипотермический охлаждающий пакет', desc: '1 шт.' },
                { name: 'Термоодеяло', desc: '1 шт.' },
                { name: 'Устройство для проведения искусственной вентиляции лёгких', desc: '2 шт.' },
                { name: 'Ножницы Листера', desc: '1 шт.' },
                { name: 'Лейкопластырь рулонный', desc: '1 шт.' },
                { name: 'Бактерицидный лейкопластырь разных размеров', desc: '1 упаковка' },
                { name: 'Блокнот, маркер', desc: '1 шт.' },
                { name: 'Хлоргексидин', desc: '1 фл. на 5 дней' },
                { name: 'Антисептик', desc: '1 бут.' },
                { name: 'Салфетки антибактериальные', desc: '1 пачка' },
            ]
        },
        {
            category: 'Дополнительная групповая аптечка (автономные походы)',
            items: [
                { name: 'Фурацилин, табл.', desc: '1 упаковка' },
                { name: 'Перекись водорода 3%', desc: '1 бут.' },
                { name: 'Окомистин', desc: '2 флакона' },
                { name: 'Инокаин / Диклоф', desc: '1 флакон' },
                { name: 'Отипакс', desc: '1 флакон' },
                { name: 'Анальгин', desc: '10 табл.' },
                { name: 'Цитрамон', desc: '10 табл.' },
                { name: 'Парацетамол', desc: '10 табл.' },
                { name: 'Ибупрофен', desc: '1 блистер' },
                { name: 'Нимесулид', desc: '1 блистер' },
                { name: 'Корвалол', desc: '1 флакон' },
                { name: 'Каптоприл', desc: '10 табл.' },
                { name: 'Моксонидин', desc: '10 табл.' },
                { name: 'Глицин', desc: '20 табл.' },
                { name: 'Лоратадин / Левицетиризин', desc: '20 табл.' },
                { name: 'Дротаверин / Но-шпа', desc: '20 табл.' },
                { name: 'Оксиметазолин', desc: '1 флакон' },
                { name: 'Лизобакт', desc: '1 упаковка' },
                { name: 'Стопангин аэрозоль', desc: '1 флакон' },
                { name: 'Аскорил', desc: '1 упаковка' },
                { name: 'Стрепсилс', desc: '20 табл.' },
                { name: 'Шприц 20 мл (для промывки носа)', desc: '2 шт.' },
                { name: 'Сенаде / Микролакс', desc: '1 упаковка' },
                { name: 'Лоперамид', desc: '10 табл.' },
                { name: 'Панкреатин', desc: '20 табл.' },
                { name: 'Смекта / Полисорб', desc: '20 саше' },
                { name: 'Церукал', desc: '10 табл.' },
                { name: 'Омепрозол', desc: '10 табл.' },
                { name: 'Нифуроксазид', desc: '20 табл.' },
                { name: 'Регидрон', desc: '3 саше' },
                { name: 'Ингаверин 60', desc: '1 уп.' },
                { name: 'Вольтарен / Ибупрофен / Диклофенак', desc: '1 туба' },
                { name: 'Троксевазин / Гепариновая мазь / Троксерутин', desc: '1 туба' },
                { name: 'Фенистил / Акридерм', desc: '1 туба' },
                { name: 'Левосин', desc: '1 туба' },
                { name: 'Декспантенол', desc: '1 туба' },
                { name: 'Пантенол аэрозоль', desc: '1 флакон' },
                { name: 'Пинцет / зажим', desc: '1 шт.' },
                { name: 'Термометр медицинский', desc: '1 шт.' },
                { name: 'Шпатель деревянный', desc: '10 шт.' },
                { name: 'Таблетки от укачивания «Драмина»', desc: 'По необходимости' },
                { name: 'Крем от загара (SPF не менее 50)', desc: '1 шт.' },
                { name: 'Очки от солнца (3 ст. защиты)', desc: 'По необходимости' },
                { name: 'Спрей от клещей', desc: '1 шт.' },
                { name: 'Спрей от комаров', desc: '1 шт.' },
                { name: 'Ватные палочки', desc: '1 упаковка' },
            ]
        },
        {
            category: 'Личная аптечка',
            items: [
                { name: 'Бинт стерильный', desc: '1 шт.' },
                { name: 'Бинт эластичный', desc: '1 шт.' },
                { name: 'Пластырь рулонный', desc: '1 шт.' },
                { name: 'Смекта', desc: '3 саше' },
                { name: 'Регидрон', desc: '1 саше' },
                { name: 'Окомистин', desc: '1 флакон' },
                { name: 'Косынка медицинская', desc: '1 шт.' },
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
