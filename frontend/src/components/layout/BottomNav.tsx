import { useLocation, useNavigate } from 'react-router-dom';
import { House, Backpack, Compass, User } from '@phosphor-icons/react';

const navItems = [
    { path: '/', label: 'Проекты', icon: House },
    { path: '/profile', label: 'Профиль', icon: User },
    { path: '/reference', label: 'Справочник', icon: Compass },
];

export function BottomNav() {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <nav className="bottom-nav">
            {navItems.map((item) => (
                <button
                    key={item.path}
                    className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                    onClick={() => navigate(item.path)}
                >
                    <item.icon size={22} weight={location.pathname === item.path ? 'fill' : 'regular'} />
                    <span>{item.label}</span>
                </button>
            ))}
        </nav>
    );
}
