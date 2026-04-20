import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, AlertCircle, ChevronRight, Mountain } from 'lucide-react';
import '../../styles/theme.css';

export function LandingPage() {
    const { loginWithEmail, registerWithEmail, demoLogin, loading, error } = useAuthStore();
    const navigate = useNavigate();
    
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [localError, setLocalError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError('');
        
        if (!email || !password) {
            setLocalError('Пожалуйста, заполните все обязательные поля');
            return;
        }

        try {
            if (isLogin) {
                await loginWithEmail(email, password);
            } else {
                await registerWithEmail(email, password, firstName, lastName);
            }
            navigate('/', { replace: true });
        } catch (err: any) {
            console.error('Auth error', err);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            width: '100vw',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // Defaulting to the global body gradient from theme.css
            overflow: 'hidden'
        }}>
            <div className="glass-card" style={{
                width: '100%',
                maxWidth: '420px',
                padding: '2.5rem',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                margin: '1rem',
                boxSizing: 'border-box'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, var(--primary-start) 0%, var(--primary-end) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 32px rgba(47,128,237,0.4)',
                        marginBottom: '0.5rem'
                    }}>
                        <Mountain size={36} color="white" />
                    </div>
                    <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>
                        Походный Сборщик
                    </h1>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center' }}>
                        Организуй свои приключения с легкостью
                    </p>
                </div>

                {/* Form Elements */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {(error || localError) && (
                        <div style={{
                            padding: '0.75rem',
                            borderRadius: '12px',
                            background: 'rgba(255, 59, 48, 0.1)',
                            border: '1px solid rgba(255, 59, 48, 0.3)',
                            color: 'var(--status-error)',
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <AlertCircle size={16} />
                            <span>{localError || error}</span>
                        </div>
                    )}

                    {!isLogin && (
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ position: 'relative', flex: 1 }}>
                                <User size={18} color="var(--text-caption)" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem' }}/>
                                <input
                                    type="text"
                                    placeholder="Имя"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                            <div style={{ position: 'relative', flex: 1 }}>
                                <input
                                    type="text"
                                    placeholder="Фамилия"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    style={{...inputStyle, paddingLeft: '1rem'}}
                                />
                            </div>
                        </div>
                    )}

                    <div style={{ position: 'relative' }}>
                        <Mail size={18} color="var(--text-caption)" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem' }}/>
                        <input
                            type="email"
                            placeholder="Электронная почта"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Lock size={18} color="var(--text-caption)" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem' }}/>
                        <input
                            type="password"
                            placeholder="Пароль"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={inputStyle}
                        />
                    </div>

                    <button 
                        className="glass-button-primary"
                        type="submit" 
                        disabled={loading}
                        style={{
                            padding: '0.875rem',
                            borderRadius: '12px',
                            border: 'none',
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            marginTop: '0.5rem',
                            transition: 'all 0.2s ease',
                            opacity: loading ? 0.7 : 1,
                        }}
                    >
                        {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
                        {!loading && <ChevronRight size={18} />}
                    </button>
                </form>

                <div style={{ display: 'flex', alignItems: 'center', margin: '0.5rem 0' }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
                    <span style={{ padding: '0 1rem', fontSize: '0.85rem', color: 'var(--text-caption)' }}>Или</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <button 
                        type="button"
                        onClick={demoLogin}
                        disabled={loading}
                        style={{
                            ...socialButtonStyle,
                            background: 'rgba(52, 199, 89, 0.1)',
                            border: '1px solid rgba(52, 199, 89, 0.3)',
                            color: 'var(--status-success)',
                            fontWeight: 600
                        }}
                    >
                        Попробовать Beta-версию (без регистрации)
                    </button>

                    <button 
                        type="button"
                        style={socialButtonStyle}
                        onClick={() => window.location.href = '/api/auth/yandex'}
                    >
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#FC3F1D', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px' }}>Я</div>
                        Войти через Яндекс
                    </button>

                    <button 
                        type="button"
                        style={socialButtonStyle}
                        onClick={() => window.location.href = '/api/auth/google'}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Войти через Google
                    </button>
                </div>

                <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>
                        {isLogin ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
                    </span>
                    <button 
                        type="button"
                        onClick={() => { setIsLogin(!isLogin); setLocalError(''); }}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--primary-start)',
                            cursor: 'pointer',
                            fontWeight: 600,
                            padding: 0,
                            fontSize: '0.9rem'
                        }}
                    >
                        {isLogin ? 'Зарегистрироваться' : 'Войти'}
                    </button>
                </div>
            </div>
        </div>
    );
}

const inputStyle = {
    width: '100%',
    padding: '0.875rem 1rem 0.875rem 2.75rem',
    borderRadius: '12px',
    background: 'var(--glass-bg)',
    border: '1px solid var(--glass-border)',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    boxSizing: 'border-box' as const,
    outline: 'none',
    transition: 'border-color 0.2s',
};

const socialButtonStyle = {
    padding: '0.75rem',
    borderRadius: '12px',
    border: '1px solid var(--glass-border)',
    background: 'var(--glass-bg)',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    cursor: 'pointer',
    transition: 'background 0.2s',
    fontWeight: 500,
};
