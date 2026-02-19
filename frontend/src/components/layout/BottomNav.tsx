import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, User, Settings } from 'lucide-react';
import { cn } from '../../lib/utils'; // Correct import path

export const BottomNav = () => {
    return (
        <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
            <nav className="flex items-center gap-1 p-2 bg-white/70 backdrop-blur-xl border border-white/40 rounded-[24px] shadow-lg shadow-black/5 pointer-events-auto">
                <NavItem to="/" icon={<Home size={22} />} label="Projects" />
                <NavItem to="/reference" icon={<Compass size={22} />} label="Explore" />
                <NavItem to="/profile" icon={<User size={22} />} label="Profile" />
            </nav>
        </div>
    );
};

const NavItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                cn(
                    'relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300',
                    isActive
                        ? 'text-[#2F80ED] bg-white shadow-sm'
                        : 'text-gray-500 hover:bg-white/40 hover:text-gray-700'
                )
            }
        >
            ({isActive}) => (
            <>
                <span className={cn('transition-transform duration-300', isActive ? '-translate-y-1' : 'translate-y-0')}>
                    {icon}
                </span>
                {isActive && (
                    <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-[#2F80ED]" />
                )}
            </>
      )}
        </NavLink>
    );
};
