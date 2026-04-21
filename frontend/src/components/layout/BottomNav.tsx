import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, User, Settings } from 'lucide-react';
import { cn } from '../../lib/utils'; // Correct import path

export const BottomNav = () => {
    return (
        <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none safe-area-bottom">
            <nav className="flex items-center gap-1 p-2 bg-[#060E0B]/50 backdrop-blur-[40px] saturate-[150%] border border-white/5 rounded-[28px] shadow-[0_15px_35px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.05)] pointer-events-auto transition-all duration-300">
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
                    'relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ease-out',
                    isActive
                        ? 'text-white bg-gradient-to-tr from-[#3AB54A] to-[#125212] shadow-[0_8px_20px_rgba(34,139,34,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)]'
                        : 'text-[#6B8076] hover:bg-white/5 hover:text-white'
                )
            }
        >
            {({ isActive }) => (
                <>
                    <span className={cn('transition-transform duration-300', isActive ? '-translate-y-1' : 'translate-y-0')}>
                        {icon}
                    </span>
                    {isActive && (
                        <span className="absolute bottom-1 w-5 h-1 rounded-full bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                    )}
                </>
            )}
        </NavLink>
    );
};
