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

    useEffect(() => {
        apiClient.get('/users/me')
            .then(res => setProfile(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
            <div className="loading loading-spinner loading-lg text-primary"></div>
        </div>
    );

    if (!user || !profile) return null;

    return (
        <div className="min-h-screen bg-gray-900 text-white pb-20">
            {/* Header / Cover */}
            <div className="bg-gradient-to-b from-primary/20 to-gray-900 pt-10 pb-6 px-6 text-center">
                <div className="avatar mb-4">
                    <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img src={profile.photoUrl || `https://ui-avatars.com/api/?name=${profile.firstName}&background=random`} alt="avatar" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold">{profile.firstName} {profile.lastName}</h1>
                <p className="text-gray-400">@{profile.username || 'unknown'}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 px-4 mb-6">
                <div className="bg-gray-800 p-4 rounded-2xl text-center">
                    <div className="text-3xl font-bold text-primary">{profile.memberships?.length || 0}</div>
                    <div className="text-sm text-gray-400">Походов</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-2xl text-center">
                    <div className="text-3xl font-bold text-secondary">0</div>
                    <div className="text-sm text-gray-400">Км пройдено</div>
                </div>
            </div>

            {/* Menu */}
            <div className="px-4 space-y-2">
                <h2 className="text-lg font-semibold mb-2 px-1">Настройки</h2>
                <div className="bg-gray-800 rounded-2xl overflow-hidden">
                    <button className="w-full text-left p-4 flex items-center justify-between active:bg-gray-700 transition" onClick={() => { }}>
                        <div className="flex items-center gap-3">
                            <span className="text-xl">⚖️</span>
                            <span>Мой вес снаряжения</span>
                        </div>
                        <span className="text-gray-500">Soon</span>
                    </button>
                    <div className="h-px bg-gray-700 mx-4"></div>
                    <button className="w-full text-left p-4 flex items-center justify-between active:bg-gray-700 transition" onClick={() => { }}>
                        <div className="flex items-center gap-3">
                            <span className="text-xl">🔔</span>
                            <span>Уведомления</span>
                        </div>
                        <span className="text-gray-500">Вкл</span>
                    </button>
                </div>
            </div>

            <div className="mt-8 px-4">
                <button
                    onClick={() => navigate('/')}
                    className="btn btn-outline btn-block text-gray-400 border-gray-700 hover:border-gray-500 hover:text-white"
                >
                    Вернуться к проектам
                </button>
            </div>
        </div>
    );
}
