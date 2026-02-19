import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

export default function OnboardingPage() {
    const { user, completeOnboarding } = useAuthStore();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState({
        username: user?.username || '',
        weight: user?.weight || 75,
        experienceLevel: 'intermediate'
    });

    const handleFinish = async () => {
        setLoading(true);
        setError(null);
        try {
            await completeOnboarding(form);
            navigate('/');
        } catch (err: any) {
            setError('Ошибка сохранения. Попробуйте снова.');
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="glass-card-static" style={{ padding: 24, textAlign: 'center' }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>👋</div>
                        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Добро пожаловать!</h1>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
                            Для начала настроим ваш профиль. Как вас называть?
                        </p>
                        <div className="form-group">
                            <label className="form-label" style={{ textAlign: 'left', display: 'block' }}>Имя пользователя</label>
                            <input
                                type="text"
                                className="form-input"
                                value={form.username}
                                onChange={e => setForm({ ...form, username: e.target.value })}
                                placeholder="@username"
                            />
                        </div>
                        <button
                            className="btn btn-primary btn-full"
                            style={{ marginTop: 20 }}
                            disabled={!form.username}
                            onClick={() => setStep(2)}
                        >
                            Продолжить
                        </button>
                    </div>
                );
            case 2:
                return (
                    <div className="glass-card-static" style={{ padding: 24, textAlign: 'center' }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>⚖️</div>
                        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Ваш вес</h1>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
                            Это нужно для точного расчета нагрузки и категорий снаряжения.
                        </p>
                        <input
                            type="range"
                            min="40"
                            max="150"
                            step="1"
                            value={form.weight}
                            onChange={e => setForm({ ...form, weight: parseInt(e.target.value) })}
                            style={{ width: '100%', marginBottom: 12 }}
                        />
                        <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--color-primary)', marginBottom: 24 }}>
                            {form.weight} кг
                        </div>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button className="btn btn-ghost" onClick={() => setStep(1)}>Назад</button>
                            <button className="btn btn-primary btn-full" onClick={() => setStep(3)}>Далее</button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="glass-card-static" style={{ padding: 24, textAlign: 'center' }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>🏔️</div>
                        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Ваш опыт</h1>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
                            Выберите уровень подготовки для персональных советов.
                        </p>
                        <div style={{ display: 'grid', gap: 12, marginBottom: 24 }}>
                            {['beginner', 'intermediate', 'pro'].map(level => (
                                <button
                                    key={level}
                                    style={{
                                        padding: '16px',
                                        borderRadius: '12px',
                                        border: form.experienceLevel === level ? '2px solid var(--color-primary)' : '1px solid var(--glass-border)',
                                        background: form.experienceLevel === level ? 'rgba(14,165,233,0.1)' : 'rgba(255,255,255,0.02)',
                                        color: 'var(--text-primary)',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        textAlign: 'left'
                                    }}
                                    onClick={() => setForm({ ...form, experienceLevel: level })}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>
                                            {level === 'beginner' ? 'Новичок' : level === 'intermediate' ? 'Любитель' : 'Профессионал'}
                                        </span>
                                        {form.experienceLevel === level && <span>✅</span>}
                                    </div>
                                </button>
                            ))}
                        </div>
                        {error && <div style={{ color: '#ef4444', marginBottom: 12, fontSize: 14 }}>{error}</div>}
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button className="btn btn-ghost" onClick={() => setStep(2)}>Назад</button>
                            <button
                                className="btn btn-primary btn-full"
                                disabled={loading}
                                onClick={handleFinish}
                            >
                                {loading ? 'Сохранение...' : 'Погнали!'}
                            </button>
                        </div>
                    </div>
                );
        }
    }

    return (
        <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', paddingBottom: 20 }}>
            <div style={{ width: '100%', maxWidth: 400 }}>
                {renderStep()}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
                    {[1, 2, 3].map(s => (
                        <div
                            key={s}
                            style={{
                                width: 8, height: 8, borderRadius: '50%',
                                background: step === s ? 'var(--color-primary)' : 'var(--glass-border)'
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
