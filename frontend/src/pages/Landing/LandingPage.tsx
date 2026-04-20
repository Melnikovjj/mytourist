import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
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
                            <svg width="20" height="20" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="50" cy="50" r="50" fill="#FC3F1D"/>
                                <path d="M59 74V28.3h-7.8v29.6c0 2.8-1 4.5-2.6 4.3-1.6-.2-1.9-2.1-1.9-5.7V28.3H38.8v18.4c0 6 3.3 9.3 9.3 9.3h2.3v7c-3.4 0-5.7-.9-7.7-3.3l-8 10h12.8c4.2 0 5.4.1 7.2-.6 1.8-.7 3.5-1.9 4-4.1.5-2.2-.3-4.3-3.6-6.6l4-5.3V74H59z" fill="white"/>
                            </svg>
                            Войти через Яндекс
                        </button>

                        <button 
                            type="button"
                            style={{...socialButtonStyle, background: '#005ff9', color: '#fff', border: 'none'}}
                            onClick={() => window.location.href = (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') : '/api') + '/auth/mailru'}
                        >
                            <svg width="20" height="20" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="80" cy="80" r="80" fill="white"/>
                                <path d="M124.6 35.4c-24.6-24.6-64.6-24.6-89.2 0s-24.6 64.6 0 89.2 64.6 24.6 89.2 0 24.6-64.6 0-89.2zm-44.6 74.6c-16.6 0-30-13.4-30-30s13.4-30 30-30 30 13.4 30 30-13.4 30-30 30z" fill="#005FF9"/>
                                <circle cx="80" cy="80" r="16" fill="#FDD700"/>
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
                    <a href="/data-management" style={{ color: 'var(--primary-start)', textDecoration: 'none' }}>правилами хранения данных</a>
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
