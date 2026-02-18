import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import apiClient from '../../api/client';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
    id: string;
    telegramId: string;
    username: string;
    firstName: string;
    lastName?: string;
    avatarUrl?: string;
    weight: number;
    inviteCode?: string;
    memberships: { project: any }[];
}

export function ProfilePage() {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState<'link' | 'code' | null>(null);

    const botUsername = 'TuristProPlanner_bot';
    const inviteLink = profile?.inviteCode
        ? `https://t.me/${botUsername}?start=ref_${profile.inviteCode}`
        : `https://t.me/${botUsername}`;

    const handleCopy = (text: string, type: 'link' | 'code') => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(type);
            setTimeout(() => setCopied(null), 2000);
        });
    };

    useEffect(() => {
        apiClient.get('/users/me')
            .then(res => setProfile(res.data))
            .catch(err => {
                console.error('Profile fetch error:', err);
                setError('Не удалось загрузить профиль');
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div style={{
                width: 48, height: 48, borderRadius: '50%',
                border: '3px solid rgba(255,255,255,0.1)',
                borderTopColor: 'var(--color-primary)',
                animation: 'spin 1s linear infinite'
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
    );

    if (error) return (
        <div className="page">
            <div className="empty-state">
                <div className="empty-state-icon">⚠️</div>
                <div className="empty-state-title">{error}</div>
                <div className="empty-state-text">Попробуйте открыть приложение через Telegram</div>
                <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/')}>
                    На главную
                </button>
            </div>
        </div>
    );

    if (!profile) return null;

    const displayName = [profile.firstName, profile.lastName].filter(Boolean).join(' ') || 'Турист';
    const avatarUrl = profile.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0ea5e9&color=fff&size=128`;
    const projectCount = profile.memberships?.length || 0;

    return (
        <div className="page">
            {/* Profile Header */}
            <div className="glass-card-static" style={{ padding: 24, textAlign: 'center', marginBottom: 16 }}>
                <div style={{
                    width: 88, height: 88, borderRadius: '50%', margin: '0 auto 16px',
                    border: '3px solid var(--color-primary)',
                    overflow: 'hidden', boxShadow: '0 0 24px rgba(14,165,233,0.3)'
                }}>
                    <img
                        src={avatarUrl}
                        alt="avatar"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>
                <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{displayName}</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                    @{profile.username || 'user'}
                </p>
            </div>

            {/* Referral Section */}
            <div className="glass-card-static" style={{ padding: 20, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <span style={{ fontSize: 20 }}>🎁</span>
                    <h2 style={{ fontSize: 16, fontWeight: 600 }}>Пригласить друзей</h2>
                </div>

                <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Ваша ссылка:</div>
                    <div style={{
                        display: 'flex', gap: 8, background: 'rgba(255,255,255,0.05)',
                        padding: '8px 12px', borderRadius: 12, border: '1px solid var(--glass-border)'
                    }}>
                        <div style={{
                            flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            fontSize: 13, color: 'var(--color-primary)'
                        }}>
                            {inviteLink}
                        </div>
                        <button
                            onClick={() => handleCopy(inviteLink, 'link')}
                            style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: 18, cursor: 'pointer', padding: 0 }}
                        >
                            {copied === 'link' ? '✅' : '📋'}
                        </button>
                    </div>
                </div>

                <div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Код приглашения:</div>
                    <div style={{
                        display: 'flex', gap: 8, background: 'rgba(255,255,255,0.05)',
                        padding: '8px 12px', borderRadius: 12, border: '1px solid var(--glass-border)'
                    }}>
                        <div style={{ flex: 1, fontWeight: 700, letterSpacing: '2px', color: 'var(--color-accent)' }}>
                            {profile.inviteCode || '--------'}
                        </div>
                        <button
                            onClick={() => profile.inviteCode && handleCopy(profile.inviteCode, 'code')}
                            style={{ background: 'none', border: 'none', color: 'var(--color-accent)', fontSize: 18, cursor: 'pointer', padding: 0 }}
                        >
                            {copied === 'code' ? '✅' : '📋'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}

            {/* Settings */}
            <div className="glass-card-static" style={{ overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--glass-border)' }}>
                    <h2 style={{ fontSize: 15, fontWeight: 600 }}>Настройки</h2>
                </div>
                <button style={{
                    width: '100%', textAlign: 'left', padding: '14px 16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: 'none', border: 'none', color: 'var(--text-primary)',
                    fontFamily: 'var(--font-family)', fontSize: 14, cursor: 'pointer',
                    borderBottom: '1px solid var(--glass-border)'
                }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span>⚖️</span><span>Мой вес снаряжения</span>
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Soon</span>
                </button>
                <button style={{
                    width: '100%', textAlign: 'left', padding: '14px 16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: 'none', border: 'none', color: 'var(--text-primary)',
                    fontFamily: 'var(--font-family)', fontSize: 14, cursor: 'pointer'
                }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span>🔔</span><span>Уведомления</span>
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Вкл</span>
                </button>
            </div>

            {/* Back Button */}
            <button
                className="btn btn-ghost btn-full"
                style={{ marginTop: 20 }}
                onClick={() => navigate('/')}
            >
                Вернуться к проектам
            </button>
        </div>
    );
}
