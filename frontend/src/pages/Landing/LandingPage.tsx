import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, AlertCircle, ChevronRight, Mountain } from 'lucide-react';
import '../../styles/theme.css';

export function LandingPage() {
    const { loginWithEmail, requestCode, registerWithEmail, demoLogin, loading, error } = useAuthStore();
    const navigate = useNavigate();
    
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [verificationStep, setVerificationStep] = useState(false);
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
                navigate('/', { replace: true });
            } else {
                if (!verificationStep) {
                    // Step 1: Request Code
                    await requestCode(email);
                    setVerificationStep(true);
                } else {
                    // Step 2: Finalize Registration
                    if (!verificationCode) {
                        setLocalError('Введите код из письма');
                        return;
                    }
                    await registerWithEmail(email, password, verificationCode, firstName, lastName);
                    navigate('/', { replace: true });
                }
            }
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
                    <img 
                        src="/icon-transparent.png" 
                        alt="Походный Сборщик Logo" 
                        style={{
                            width: '96px',
                            height: '96px',
                            filter: 'drop-shadow(0 8px 16px rgba(47,128,237,0.2))',
                            marginBottom: '0.5rem'
                        }}
                    />
                    <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>
                        Походный Сборщик
                    </h1>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center' }}>
                        Организуй свои приключения с легкостью
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', lineHeight: 1.5 }}>
                        Для обеспечения безопасности мы используем вход через доверенные сервисы. <b>Пароли в приложении не хранятся.</b>
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginTop: '0.5rem' }}>
                        <button 
                            type="button"
                            style={{...socialButtonStyle, background: '#fff', color: '#000', border: '1px solid #e5e5e5'}}
                            onClick={() => window.location.href = (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') : '/api') + '/auth/yandex'}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.04 12c0-5.523 4.476-10 10-10 5.522 0 10 4.477 10 10s-4.478 10-10 10c-5.524 0-10-4.477-10-10z" fill="#FC3F1D"/>
                                <path d="M13.32 7.666h-.924c-1.694 0-2.585.858-2.585 2.123 0 1.43.616 2.1 1.881 2.959l1.045.704-3.003 4.487H7.49l2.695-4.014c-1.55-1.111-2.42-2.19-2.42-4.015 0-2.288 1.595-3.85 4.62-3.85h3.003v11.868H13.32V7.666z" fill="#fff"/>
                            </svg>
                            Войти через Яндекс
                        </button>

                        <button 
                            type="button"
                            style={{...socialButtonStyle, background: '#005ff9', color: '#fff', border: 'none'}}
                            onClick={() => window.location.href = (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') : '/api') + '/auth/mailru'}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.61 12c0 1.99-1.62 3.61-3.61 3.61-1.99 0-3.61-1.62-3.61-3.61 0-1.99 1.62-3.61 3.61-3.61 1.99 0 3.61 1.62 3.61 3.61M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12c2.424 0 4.761-.722 6.76-2.087l.034-.024-1.617-1.879-.027.017A9.494 9.494 0 0 1 12 21.54c-5.26 0-9.54-4.28-9.54-9.54 0-5.26 4.28-9.54 9.54-9.54 5.26 0 9.54 4.28 9.54 9.54a9.63 9.63 0 0 1-.225 2.05c-.301 1.239-1.169 1.618-1.82 1.568-.654-.053-1.42-.52-1.426-1.661V12A6.076 6.076 0 0 0 12 5.93 6.076 6.076 0 0 0 5.93 12 6.076 6.076 0 0 0 12 18.07a6.02 6.02 0 0 0 4.3-1.792 3.9 3.9 0 0 0 3.32 1.805c.874 0 1.74-.292 2.437-.821.719-.547 1.256-1.336 1.553-2.285.047-.154.135-.504.135-.507l.002-.013c.175-.76.253-1.52.253-2.457 0-6.617-5.383-12-12-12"/>
                            </svg>
                            Войти через Mail.ru
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', margin: '0.5rem 0' }}>
                            <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
                            <span style={{ padding: '0 1rem', fontSize: '0.85rem', color: 'var(--text-caption)' }}>Или</span>
                            <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
                        </div>

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
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-caption)' }}>
                    Нажимая кнопку входа, вы соглашаетесь с <br/>
                    <Link to="/data-management" style={{ color: 'var(--primary-start)', textDecoration: 'none' }}>правилами хранения данных</Link>
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
