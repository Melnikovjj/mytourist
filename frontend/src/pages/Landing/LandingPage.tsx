import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, AlertCircle, ChevronRight, Mountain } from 'lucide-react';
import '../../styles/theme.css';

export function LandingPage() {
    const { loginWithEmail, requestCode, registerWithEmail, demoLogin, loading, error } = useAuthStore();
    const navigate = useNavigate();
    
    // UI states
    const [showLoginOptions, setShowLoginOptions] = useState(false);

    return (
        <div style={{
            minHeight: '100vh',
            width: '100vw',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            overflow: 'hidden',
            backgroundColor: '#060E0B'
        }}>
            {/* Fullscreen Background */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: 'url(/landing-bg.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                zIndex: 0,
                opacity: 0.6,
            }} />
            
            {/* Deep Dark Bottom Gradient to blend text */}
            <div style={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0, height: '70vh',
                background: 'linear-gradient(to top, rgba(6, 14, 11, 1) 0%, rgba(6, 14, 11, 0.8) 40%, transparent 100%)',
                zIndex: 1
            }}/>

            <div style={{
                position: 'relative',
                zIndex: 10,
                padding: '2rem',
                paddingBottom: '3.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                width: '100%',
                maxWidth: '480px',
                margin: '0 auto'
            }}>
                {/* Logo & Text Block */}
                {!showLoginOptions && (
                    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div style={{
                            width: '4rem', height: '4rem',
                            background: 'linear-gradient(135deg, #3AB54A, #125212)',
                            borderRadius: '16px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 8px 25px rgba(34, 139, 34, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.3)'
                        }}>
                            <Mountain size={36} color="white" weight="fill" />
                        </div>

                        <h1 style={{
                            fontSize: '2.5rem',
                            fontWeight: 800,
                            color: '#FFFFFF',
                            lineHeight: 1.1,
                            letterSpacing: '-1px',
                            margin: 0
                        }}>
                            Походный<br/>Сборщик
                        </h1>

                        <p style={{
                            fontSize: '1.05rem',
                            color: '#9AAFA5',
                            lineHeight: 1.4,
                            margin: 0,
                            maxWidth: '80%'
                        }}>
                            Твой умный помощник<br/>в каждом походе
                        </p>
                    </div>
                )}

                {/* Login Options Block */}
                {showLoginOptions && (
                    <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500 glass-card p-6 border-white/10" style={{ background: 'rgba(13, 24, 20, 0.7)' }}>
                        <h2 className="text-xl font-bold text-white mb-2 text-center">Вход в систему</h2>
                        <button 
                            type="button"
                            style={{
                                ...socialButtonStyle, 
                                background: 'rgba(255, 255, 255, 0.05)', 
                                color: '#fff', 
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.05)'
                            }}
                            className="hover:bg-white/10 transition-colors"
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
                            style={{
                                ...socialButtonStyle, 
                                background: 'rgba(0, 95, 249, 0.15)', 
                                color: '#fff', 
                                border: '1px solid rgba(0, 95, 249, 0.4)',
                                boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.1)'
                            }}
                            className="hover:bg-[rgba(0,95,249,0.25)] transition-colors"
                            onClick={() => window.location.href = (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') : '/api') + '/auth/mailru'}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#005ff9" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.61 12c0 1.99-1.62 3.61-3.61 3.61-1.99 0-3.61-1.62-3.61-3.61 0-1.99 1.62-3.61 3.61-3.61 1.99 0 3.61 1.62 3.61 3.61M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12c2.424 0 4.761-.722 6.76-2.087l.034-.024-1.617-1.879-.027.017A9.494 9.494 0 0 1 12 21.54c-5.26 0-9.54-4.28-9.54-9.54 0-5.26 4.28-9.54 9.54-9.54 5.26 0 9.54 4.28 9.54 9.54a9.63 9.63 0 0 1-.225 2.05c-.301 1.239-1.169 1.618-1.82 1.568-.654-.053-1.42-.52-1.426-1.661V12A6.076 6.076 0 0 0 12 5.93 6.076 6.076 0 0 0 5.93 12 6.076 6.076 0 0 0 12 18.07a6.02 6.02 0 0 0 4.3-1.792 3.9 3.9 0 0 0 3.32 1.805c.874 0 1.74-.292 2.437-.821.719-.547 1.256-1.336 1.553-2.285.047-.154.135-.504.135-.507l.002-.013c.175-.76.253-1.52.253-2.457 0-6.617-5.383-12-12-12"/>
                            </svg>
                            Войти через Mail.ru
                        </button>
                        
                        <button 
                            type="button"
                            onClick={() => setShowLoginOptions(false)}
                            className="mt-2 text-sm text-[#9AAFA5] hover:text-white transition-colors py-2"
                        >
                            Назад
                        </button>
                    </div>
                )}

                {/* Buttons Block */}
                {!showLoginOptions && (
                    <div className="flex flex-col gap-4 mt-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
                        <button 
                            type="button"
                            onClick={demoLogin}
                            disabled={loading}
                            className="glass-button-primary"
                            style={{
                                padding: '1rem',
                                borderRadius: '14px',
                                color: '#fff',
                                fontWeight: 600,
                                fontSize: '1.05rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                background: 'linear-gradient(135deg, var(--primary-start) 0%, var(--primary-end) 100%)',
                                boxShadow: '0 8px 25px rgba(34, 139, 34, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.3)'
                            }}
                        >
                            <span style={{flex: 1, textAlign: 'center', paddingLeft: '24px'}}>Начать</span>
                            <ChevronRight size={24} color="rgba(255,255,255,0.8)" />
                        </button>

                        <button 
                            type="button"
                            onClick={() => setShowLoginOptions(true)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#FFFFFF',
                                fontWeight: 500,
                                fontSize: '1rem',
                                padding: '0.75rem',
                                cursor: 'pointer',
                            }}
                            className="hover:opacity-80 transition-opacity"
                        >
                            Войти
                        </button>
                    </div>
                )}
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
