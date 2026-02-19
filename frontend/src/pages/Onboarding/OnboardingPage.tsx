import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';

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
                    <GlassCard className="p-8 text-center">
                        <div className="text-6xl mb-6">👋</div>
                        <h1 className="text-2xl font-bold mb-4 text-[#1C1C1E]">Добро пожаловать!</h1>
                        <p className="text-[#1C1C1E]/60 mb-8">
                            Давай настроим твой профиль. Как тебя зовут?
                        </p>
                        <div className="mb-8">
                            <label className="block text-left text-sm font-medium text-gray-500 mb-2">Имя пользователя</label>
                            <input
                                type="text"
                                className="input w-full p-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#2F80ED] transition-colors"
                                value={form.username}
                                onChange={e => setForm({ ...form, username: e.target.value })}
                                placeholder="@username"
                            />
                        </div>
                        <Button
                            fullWidth
                            disabled={!form.username}
                            onClick={() => setStep(2)}
                        >
                            Продолжить
                        </Button>
                    </GlassCard>
                );
            case 2:
                return (
                    <GlassCard className="p-8 text-center">
                        <div className="text-6xl mb-6">⚖️</div>
                        <h1 className="text-2xl font-bold mb-4 text-[#1C1C1E]">Твой вес</h1>
                        <p className="text-[#1C1C1E]/60 mb-8">
                            Нужен для расчета нагрузки и подбора снаряжения.
                        </p>
                        <input
                            type="range"
                            min="40"
                            max="150"
                            step="1"
                            value={form.weight}
                            onChange={e => setForm({ ...form, weight: parseInt(e.target.value) })}
                            className="w-full mb-6 accent-[#2F80ED]"
                        />
                        <div className="text-4xl font-bold text-[#2F80ED] mb-8">
                            {form.weight} кг
                        </div>
                        <div className="flex gap-4">
                            <Button variant="ghost" onClick={() => setStep(1)} className="flex-1">Назад</Button>
                            <Button className="flex-1" onClick={() => setStep(3)}>Далее</Button>
                        </div>
                    </GlassCard>
                );
            case 3:
                return (
                    <GlassCard className="p-8 text-center">
                        <div className="text-6xl mb-6">🏔️</div>
                        <h1 className="text-2xl font-bold mb-4 text-[#1C1C1E]">Твой опыт</h1>
                        <p className="text-[#1C1C1E]/60 mb-8">
                            Уровень подготовки для персональных советов.
                        </p>
                        <div className="space-y-3 mb-8">
                            {['beginner', 'intermediate', 'pro'].map(level => (
                                <div
                                    key={level}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all flex justify-between items-center text-left ${form.experienceLevel === level
                                        ? 'border-[#2F80ED] bg-[#2F80ED]/5 shadow-sm'
                                        : 'border-gray-200 hover:border-gray-300 bg-white/50'
                                        }`}
                                    onClick={() => setForm({ ...form, experienceLevel: level })}
                                >
                                    <span className="font-semibold text-[#1C1C1E]">
                                        {level === 'beginner' ? 'Новичок' : level === 'intermediate' ? 'Любитель' : 'Профи'}
                                    </span>
                                    {form.experienceLevel === level && <span className="text-[#2F80ED]">●</span>}
                                </div>
                            ))}
                        </div>
                        {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}
                        <div className="flex gap-4">
                            <Button variant="ghost" onClick={() => setStep(2)} className="flex-1">Назад</Button>
                            <Button
                                className="flex-1"
                                isLoading={loading}
                                onClick={handleFinish}
                            >
                                Погнали!
                            </Button>
                        </div>
                    </GlassCard>
                );
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 pb-12">
            <div className="w-full max-w-md">
                {renderStep()}
                <div className="flex justify-center gap-2 mt-8">
                    {[1, 2, 3].map(s => (
                        <div
                            key={s}
                            className={`w-2 h-2 rounded-full transition-colors ${step === s ? 'bg-[#2F80ED]' : 'bg-gray-300'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
