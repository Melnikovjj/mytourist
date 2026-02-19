import React from 'react';
import { cn } from '../../lib/utils';

interface AvatarProps {
    src?: string | null;
    fallback?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    glow?: boolean;
    className?: string;
}

export const Avatar = ({ src, fallback = '?', size = 'md', glow = false, className }: AvatarProps) => {
    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-14 h-14 text-base',
        xl: 'w-24 h-24 text-xl',
    };

    return (
        <div className={cn('relative', className)}>
            <div
                className={cn(
                    'rounded-full overflow-hidden flex items-center justify-center bg-gray-200 text-gray-500 font-medium border border-white/50 backdrop-blur-sm',
                    sizeClasses[size],
                    glow && 'shadow-[0_0_20px_rgba(47,128,237,0.3)] ring-2 ring-white/50'
                )}
            >
                {src ? (
                    <img src={src} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                    <span>{fallback.charAt(0).toUpperCase()}</span>
                )}
            </div>
            {glow && (
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#4AC7FA] to-[#2F80ED] opacity-20 blur-xl -z-10" />
            )}
        </div>
    );
};
