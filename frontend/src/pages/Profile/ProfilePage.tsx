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
    photoUrl?: string;
    weight: number;
    memberships: { project: any }[];
}

export function ProfilePage() {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div className="glass-card-static" style={{ padding: 16, textAlign: 'center' }}>
                    <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-primary)' }}>
                        {projectCount}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Походов</div>
                </div>
                <div className="glass-card-static" style={{ padding: 16, textAlign: 'center' }}>
                    <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-accent)' }}>
                        0
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Км пройдено</div>
                </div>
            </div>

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
