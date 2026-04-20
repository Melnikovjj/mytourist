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
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#FC3F1D"/>
                                <path d="M14.5367 17.5V6.78667H12.5833V13.8867C12.5833 14.5667 12.35 14.9333 11.96 14.9333C11.5767 14.9333 11.1233 14.7333 11.1233 13.8867L11.11 6.78667H9.15668V11.2C9.15668 12.6333 8.35668 13.4333 6.92334 13.4333H6.46334V15.1133H6.92334C7.75668 15.1133 8.31668 14.9 8.79668 14.3333L12.0233 10.4533V15.7133C10.7433 15.7133 9.4 15.82 8.12334 16.0333V17.7C10.2367 17.38 12.3767 17.26 14.5167 17.26H14.5367V17.5Z" fill="white"/>
                            </svg>
                            Войти через Яндекс
                        </button>

                        <button 
                            type="button"
                            style={{...socialButtonStyle, background: '#005ff9', color: '#fff', border: 'none'}}
                            onClick={() => window.location.href = (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') : '/api') + '/auth/mailru'}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="12" fill="white"/>
                                <circle cx="12" cy="12" r="10" fill="#005FF9"/>
                                <circle cx="12" cy="12" r="5" fill="#FFCF00"/>
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
