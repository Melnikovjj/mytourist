import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FirstAid, Drop, Notebook } from '@phosphor-icons/react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';

const firstAidItems = [
    'Стерильный бинт', 'Эластичный бинт', 'Пластыри (набор)', 'Антисептик',
    'Перекись водорода', 'Обезболивающее', 'Жаропонижающее', 'Антигистаминное',
    'От диареи', 'Активированный уголь', 'Одеяло спасателя',
    'Медицинские ножницы', 'Пинцет', 'Перчатки',
];

export function ReferencePage() {
    const [activeTab, setActiveTab] = useState<'aid' | 'water' | 'diary'>('aid');
    const [waterWeight, setWaterWeight] = useState(70);
    const [waterTemp, setWaterTemp] = useState(25);
    const [waterIntensity, setWaterIntensity] = useState<'light' | 'medium' | 'heavy'>('medium');
    const [diaryEntries, setDiaryEntries] = useState<{ text: string; date: string }[]>([]);
    const [diaryText, setDiaryText] = useState('');

    // Water calculation: base + activity + heat adjustments
    const waterCalc = () => {
        const base = waterWeight * 30; // ml
        const activityMultiplier = waterIntensity === 'light' ? 1.2 : waterIntensity === 'medium' ? 1.5 : 1.8;
        const tempBonus = waterTemp > 25 ? (waterTemp - 25) * 20 : 0;
        return Math.round((base * activityMultiplier + tempBonus) / 100) / 10; // liters
    };

    const addDiaryEntry = () => {
        if (!diaryText.trim()) return;
        setDiaryEntries([
            { text: diaryText, date: new Date().toLocaleString() },
            ...diaryEntries,
        ]);
        setDiaryText('');
    };

    const intensityLabels: Record<string, string> = {
        light: 'Легкий',
        medium: 'Средний',
        heavy: 'Высокий'
    };

    return (
        <div className="min-h-screen pb-24 pt-6 px-4 space-y-6">
            <header>
                <h1 className="text-2xl font-bold text-[#1C1C1E]">Справочник</h1>
                <p className="text-[#1C1C1E]/60 text-sm">Полезные инструменты</p>
            </header>

            <div className="flex p-1 bg-gray-100/50 backdrop-blur-sm rounded-[14px]">
                <button
                    onClick={() => setActiveTab('aid')}
                    className={`flex-1 py-2 text-sm font-semibold rounded-[10px] transition-all flex items-center justify-center gap-1.5 ${activeTab === 'aid'
                        ? 'bg-white text-[#2F80ED] shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <FirstAid size={18} weight={activeTab === 'aid' ? 'fill' : 'regular'} />
                    Аптечка
                </button>
                <button
                    onClick={() => setActiveTab('water')}
                    className={`flex-1 py-2 text-sm font-semibold rounded-[10px] transition-all flex items-center justify-center gap-1.5 ${activeTab === 'water'
                        ? 'bg-white text-[#2F80ED] shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Drop size={18} weight={activeTab === 'water' ? 'fill' : 'regular'} />
                    Вода
                </button>
                <button
                    onClick={() => setActiveTab('diary')}
                    className={`flex-1 py-2 text-sm font-semibold rounded-[10px] transition-all flex items-center justify-center gap-1.5 ${activeTab === 'diary'
                        ? 'bg-white text-[#2F80ED] shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Notebook size={18} weight={activeTab === 'diary' ? 'fill' : 'regular'} />
                    Дневник
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'aid' && (
                    <motion.div
                        key="aid"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <GlassCard className="p-5">
                            <h3 className="font-semibold mb-2 text-lg">🏥 Базовая аптечка</h3>
                            <p className="text-xs text-gray-400 mb-4 bg-yellow-50 text-yellow-700 p-2 rounded-lg">
                                Внимание: Это лишь базовые рекомендации. Не является медицинской консультацией.
                            </p>
                            <div className="space-y-2">
                                {firstAidItems.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                        <span className="text-sm text-gray-700">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    </motion.div>
                )}

                {activeTab === 'water' && (
                    <motion.div
                        key="water"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <GlassCard className="p-6 space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-3 bg-blue-100 rounded-full text-blue-500">
                                    <Drop size={24} weight="fill" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Калькулятор воды</h3>
                                    <p className="text-xs text-gray-500">Расчет дневной нормы</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Вес (кг)</label>
                                    <input className="input w-full p-3 rounded-xl bg-gray-50 border-gray-200" type="number"
                                        value={waterWeight} onChange={(e) => setWaterWeight(parseFloat(e.target.value))} />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Температура (°C)</label>
                                    <input className="input w-full p-3 rounded-xl bg-gray-50 border-gray-200" type="number"
                                        value={waterTemp} onChange={(e) => setWaterTemp(parseFloat(e.target.value))} />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Уровень активности</label>
                                    <div className="flex p-1 bg-gray-100 rounded-lg">
                                        {(['light', 'medium', 'heavy'] as const).map((val) => (
                                            <button key={val}
                                                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${waterIntensity === val ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
                                                    }`}
                                                onClick={() => setWaterIntensity(val)}
                                            >
                                                {intensityLabels[val]}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-6 rounded-2xl text-center border border-blue-100">
                                <div className="text-sm text-blue-600 mb-1">Рекомендуемая норма</div>
                                <div className="text-4xl font-bold text-blue-500">
                                    {waterCalc()} <span className="text-lg font-medium text-blue-400">л/день</span>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                )}

                {activeTab === 'diary' && (
                    <motion.div
                        key="diary"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <GlassCard className="p-5 mb-4">
                            <h3 className="font-semibold mb-3">📝 Дневник похода</h3>
                            <textarea
                                className="input w-full p-3 rounded-xl bg-gray-50 border-gray-200 min-h-[100px] mb-3"
                                placeholder="Опиши свой день..."
                                value={diaryText} onChange={(e) => setDiaryText(e.target.value)}
                            />
                            <Button fullWidth onClick={addDiaryEntry} disabled={!diaryText.trim()}>
                                Добавить запись
                            </Button>
                        </GlassCard>

                        <div className="space-y-3">
                            {diaryEntries.map((entry, i) => (
                                <GlassCard key={i} className="p-4">
                                    <div className="text-xs text-gray-400 mb-1">{entry.date}</div>
                                    <div className="text-sm text-gray-800 whitespace-pre-wrap">{entry.text}</div>
                                </GlassCard>
                            ))}
                            {diaryEntries.length === 0 && (
                                <div className="text-center py-8 text-gray-400 italic">
                                    Записей нет. Начни писать!
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
