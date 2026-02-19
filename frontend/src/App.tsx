import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { BottomNav } from './components/layout/BottomNav';
import { ProjectsPage } from './pages/Projects/ProjectsPage';
import { ProjectDetailPage } from './pages/Projects/ProjectDetailPage';
import { EquipmentPage } from './pages/Equipment/EquipmentPage';
import { MealsPage } from './pages/Meals/MealsPage';
import { WeightPage } from './pages/Weight/WeightPage';
import { ChecklistPage } from './pages/Checklist/ChecklistPage';
import { ReferencePage } from './pages/Reference/ReferencePage';
import { ProfilePage } from './pages/Profile/ProfilePage';
import OnboardingPage from './pages/Onboarding/OnboardingPage';
import { LoadingScreen } from './components/ui/LoadingScreen';

function AppContent() {
    const { user, loading, login } = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Init Telegram WebApp
        const tg = window.Telegram?.WebApp;
        if (tg) {
            tg.ready();
            tg.expand();
            // Set theme
            document.documentElement.setAttribute(
                'data-theme',
                tg.colorScheme || 'dark',
            );
        }

        // Auto-login
        if (!user) {
            login();
        }
    }, []);

    // Onboarding & Project Invite redirection
    useEffect(() => {
        if (loading || !user) return;

        // Check for project invite in start_param
        const tg = window.Telegram?.WebApp;
        const startParam = tg?.initDataUnsafe?.start_param;

        if (startParam?.startsWith('proj_')) {
            const inviteCode = startParam.replace('proj_', '');
            // We use a small delay to ensure stores are ready
            setTimeout(async () => {
                try {
                    // Try to join project
                    const res = await useProjectStore.getState().joinProject(inviteCode);
                    if (res.projectId) {
                        navigate(`/project/${res.projectId}`, { replace: true });
                        return;
                    }
                } catch (err) {
                    console.error('Failed to join project via deep link:', err);
                }
            }, 500);
            return;
        }

        if (!user.isOnboarded && location.pathname !== '/onboarding') {
            navigate('/onboarding', { replace: true });
        }
    }, [user, loading, location.pathname, navigate]);

    if (loading) return <LoadingScreen />;

    const showNav = !location.pathname.includes('/project/') && location.pathname !== '/onboarding';

    return (
        <>
            <Routes>
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route path="/" element={<ProjectsPage />} />
                <Route path="/project/:projectId" element={<ProjectDetailPage />} />
                <Route path="/project/:projectId/equipment" element={<EquipmentPage />} />
                <Route path="/project/:projectId/meals" element={<MealsPage />} />
                <Route path="/project/:projectId/weight" element={<WeightPage />} />
                <Route path="/project/:projectId/checklist" element={<ChecklistPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/reference" element={<ReferencePage />} />
            </Routes>
            {showNav && <BottomNav />}
        </>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}
