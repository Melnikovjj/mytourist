import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useProjectStore } from './store/projectStore';
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
import { LandingPage } from './pages/Landing/LandingPage';
import { DataManagementPage } from './pages/DataManagement/DataManagementPage';
import { LoadingScreen } from './components/ui/LoadingScreen';

function AppContent() {
    const { user, loading, checkAuth } = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Initial authentication check
        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get('token');
        
        if (urlToken) {
            localStorage.setItem('token', urlToken);
            // Clean up the URL visually without reloading
            window.history.replaceState({}, document.title, window.location.pathname);
        }
        
        checkAuth();
    }, []);

    // Onboarding & Project Invite redirection
    useEffect(() => {
        if (loading || !user) return;

        // Check for project invite from standard URL params
        const urlParams = new URLSearchParams(window.location.search);
        const startParam = urlParams.get('invite') || urlParams.get('start_param');

        if (startParam?.startsWith('proj_')) {
            const inviteCode = startParam.replace('proj_', '');
            setTimeout(async () => {
                try {
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

        if (user.isOnboarded === false && location.pathname !== '/onboarding') {
            navigate('/onboarding', { replace: true });
        }
    }, [user, loading, location.pathname, navigate]);

    if (loading) return <LoadingScreen />;

    if (!user) {
        return (
            <Routes>
                <Route path="/data-management" element={<DataManagementPage />} />
                <Route path="/login" element={<LandingPage />} />
                <Route path="/" element={<LandingPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        );
    }

    const showNav = !location.pathname.includes('/project/') && location.pathname !== '/onboarding';

    return (
        <>
            <div className="liquid-background">
                <div className="liquid-blob liquid-blob-1" />
                <div className="liquid-blob liquid-blob-2" />
                <div className="liquid-blob liquid-blob-3" />
            </div>
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
                <Route path="/data-management" element={<DataManagementPage />} />
                {/* Redirect any stray logins if already authenticated */}
                <Route path="/login" element={<Navigate to="/" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
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
