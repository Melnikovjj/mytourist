import { useState } from 'react';
import { motion } from 'framer-motion';
import { FirstAid, Drop, Notebook } from '@phosphor-icons/react';

const firstAidItems = [
    'Бинт стерильный', 'Бинт эластичный', 'Пластыри разные', 'Антисептик',
    'Перекись водорода', 'Обезболивающее', 'Жаропонижающее', 'Антигистаминное',
    'Противодиарейное', 'Активированный уголь', 'Спасательное одеяло',
    'Ножницы медицинские', 'Пинцет', 'Перчатки одноразовые',
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
            { text: diaryText, date: new Date().toLocaleString('ru') },
            ...diaryEntries,
        ]);
        setDiaryText('');
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1 className="page-title">📚 Справочник</h1>
            </div>

            <div className="tabs">
                <button className={`tab ${activeTab === 'aid' ? 'active' : ''}`} onClick={() => setActiveTab('aid')}>
                    <FirstAid size={16} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Аптечка
                </button>
                <button className={`tab ${activeTab === 'water' ? 'active' : ''}`} onClick={() => setActiveTab('water')}>
                    <Drop size={16} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Вода
                </button>
                <button className={`tab ${activeTab === 'diary' ? 'active' : ''}`} onClick={() => setActiveTab('diary')}>
                    <Notebook size={16} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Дневник
                </button>
            </div>

            {activeTab === 'aid' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="glass-card-static" style={{ padding: '16px' }}>
                        <h3 className="font-semibold mb-3">🏥 Базовая аптечка туриста</h3>
                        <p className="text-xs text-muted mb-3">Рекомендуемый набор. Не является медицинской рекомендацией.</p>
                        <div className="list-gap">
                            {firstAidItems.map((item, i) => (
                                <div key={i} className="flex items-center gap-2" style={{ padding: '8px 0', borderBottom: '1px solid var(--glass-border)' }}>
                                    <span style={{ color: 'var(--color-accent)' }}>•</span>
                                    <span className="text-sm">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}

            {activeTab === 'water' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="glass-card-static" style={{ padding: '20px' }}>
                        <h3 className="font-semibold mb-3">💧 Калькулятор воды</h3>
                        <div className="form-group">
                            <label className="input-label">Вес (кг)</label>
                            <input className="input" type="number" value={waterWeight}
                                onChange={(e) => setWaterWeight(parseFloat(e.target.value))} />
                        </div>
                        <div className="form-group">
                            <label className="input-label">Температура воздуха (°C)</label>
                            <input className="input" type="number" value={waterTemp}
                                onChange={(e) => setWaterTemp(parseFloat(e.target.value))} />
                        </div>
                        <div className="form-group">
                            <label className="input-label">Интенсивность</label>
                            <div className="tabs">
                                {(['light', 'medium', 'heavy'] as const).map((val) => (
                                    <button key={val} className={`tab ${waterIntensity === val ? 'active' : ''}`}
                                        onClick={() => setWaterIntensity(val)}>
                                        {val === 'light' ? 'Лёгкая' : val === 'medium' ? 'Средняя' : 'Тяжёлая'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="glass-card-static" style={{ padding: '16px', textAlign: 'center', marginTop: '16px', background: 'rgba(14, 165, 233, 0.1)' }}>
                            <div className="text-sm text-secondary">Рекомендуемый объём</div>
                            <div className="font-bold" style={{ fontSize: '32px', color: 'var(--color-primary)' }}>
                                {waterCalc()} л/день
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {activeTab === 'diary' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="glass-card-static" style={{ padding: '20px', marginBottom: '16px' }}>
                        <h3 className="font-semibold mb-3">📝 Походный дневник</h3>
                        <textarea className="input" rows={3} placeholder="Запишите впечатления дня..."
                            value={diaryText} onChange={(e) => setDiaryText(e.target.value)}
                            style={{ resize: 'vertical' }} />
                        <button className="btn btn-primary btn-sm btn-full mt-2" onClick={addDiaryEntry}>
                            Добавить запись
                        </button>
                    </div>
                    <div className="list-gap">
                        {diaryEntries.map((entry, i) => (
                            <div key={i} className="glass-card-static" style={{ padding: '14px' }}>
                                <div className="text-xs text-muted mb-1">{entry.date}</div>
                                <div className="text-sm">{entry.text}</div>
                            </div>
                        ))}
                        {diaryEntries.length === 0 && (
                            <p className="text-sm text-muted" style={{ textAlign: 'center', padding: '20px' }}>
                                Пока нет записей
                            </p>
                        )}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
