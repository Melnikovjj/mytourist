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
                            <img src="https://yastatic.net/s3/home/icons/favicon/yandex.ico" alt="Yandex" style={{ width: '20px', height: '20px' }} />
                            Войти через Яндекс
                        </button>

                        <button 
                            type="button"
                            style={{...socialButtonStyle, background: '#005ff9', color: '#fff', border: 'none'}}
                            onClick={() => window.location.href = (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') : '/api') + '/auth/mailru'}
                        >
                            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#005ff9' }}></div>
                            </div>
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
