import { GlassCard } from '../../../components/ui/GlassCard';
import { Pill, Warning, BookBookmark, Info } from '@phosphor-icons/react';

const MEDICAL_GUIDE = [
    {
        category: 'Обезболивающие',
        items: [
            { name: 'Ибупрофен (Нурофен)', desc: 'От головной, зубной боли, температуры. 400 мг 1-3 раза в день.' },
            { name: 'Кеторолак (Кетанов)', desc: 'Сильное обезболивающее (травмы, ожоги). Не более 4 таблеток в день.' }
        ]
    },
    {
        category: 'ЖКТ и Отравления',
        items: [
            { name: 'Лоперамид (Имодиум)', desc: 'От острой диареи. 2 капсулы сразу, затем по 1 после каждого эпизода.' },
            { name: 'Смекта / Полисорб', desc: 'Сорбент при отравлениях. Разводить в воде.' },
            { name: 'Панкреатин (Мезим)', desc: 'Для улучшения пищеварения при переедании тяжелой походной еды.' }
        ]
    },
    {
        category: 'Раны и Травмы',
        items: [
            { name: 'Хлоргексидин', desc: 'Антисептик для промывания ран. Не щиплет.' },
            { name: 'Пантенол (Спрей)', desc: 'При ожогах (солнечных или костровых).' },
            { name: 'Бинт эластичный', desc: 'При растяжениях суставов. Фиксировать туго, но не перетягивать.' }
        ]
    },
    {
        category: 'Аллергия',
        items: [
            { name: 'Цетиризин (Зиртек)', desc: 'Антигистаминное. По 1 таблетке в день. Не вызывает сонливость.' },
            { name: 'Супрастин', desc: 'Экстренное средство при сильной реакции (укусы насекомых). Вызывает сонливость.' }
        ]
    }
];

export function GuideTab() {
    return (
        <div className="space-y-4 pb-4">
            <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-2xl flex gap-3 text-yellow-600 dark:text-yellow-400">
                <Warning size={24} color="currentColor" weight="fill" className="shrink-0" />
                <p className="text-sm">Данный справочник носит рекомендательный характер. При серьезных травмах всегда обращайтесь к инструктору или вызывайте МЧС.</p>
            </div>

            {MEDICAL_GUIDE.map((section, idx) => (
                <GlassCard key={idx} className="p-4">
                    <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-[#1C1C1E]">
                        {idx === 0 && <Pill color="#2F80ED" weight="fill" />}
                        {idx === 1 && <Info color="#34C759" weight="fill" />}
                        {idx === 2 && <Info color="#FF3B30" weight="fill" />}
                        {idx === 3 && <BookBookmark color="#FF9500" weight="fill" />}
                        {section.category}
                    </h3>

                    <div className="space-y-3">
                        {section.items.map((item, i) => (
                            <div key={i} className="bg-white/50 dark:bg-white/5 p-3 rounded-xl">
                                <h4 className="font-semibold text-sm mb-1">{item.name}</h4>
                                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            ))}
        </div>
    );
}
