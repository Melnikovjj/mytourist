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
import { LoadingScreen } from './components/ui/LoadingScreen';

function AppContent() {
    const { user, loading, login } = useAuthStore();
    const location = useLocation();

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

    if (loading) return <LoadingScreen />;

    const showNav = !location.pathname.includes('/project/');

    return (
        <>
            <Routes>
                <Route path="/" element={<ProjectsPage />} />
                <Route path="/project/:projectId" element={<ProjectDetailPage />} />
                <Route path="/project/:projectId/equipment" element={<EquipmentPage />} />
                <Route path="/project/:projectId/meals" element={<MealsPage />} />
                <Route path="/project/:projectId/weight" element={<WeightPage />} />
                <Route path="/project/:projectId/checklist" element={<ChecklistPage />} />
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
