import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps {
    status?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
    variant?: 'default' | 'outline';
    children: React.ReactNode;
    className?: string;
}

export const Badge = ({ status = 'neutral', variant = 'default', children, className }: BadgeProps) => {
    const baseStyles = {
        success: 'bg-[#34C759]/15 text-[#34C759] border-[#34C759]/20',
        warning: 'bg-[#FF9F0A]/15 text-[#FF9F0A] border-[#FF9F0A]/20',
        error: 'bg-[#FF3B30]/15 text-[#FF3B30] border-[#FF3B30]/20',
        info: 'bg-[#4AC7FA]/15 text-[#2F80ED] border-[#4AC7FA]/20',
        neutral: 'bg-gray-100/50 text-gray-600 border-gray-200/50',
    };

    const outlineStyles = {
        success: 'bg-transparent text-[#34C759] border-[#34C759]/50',
        warning: 'bg-transparent text-[#FF9F0A] border-[#FF9F0A]/50',
        error: 'bg-transparent text-[#FF3B30] border-[#FF3B30]/50',
        info: 'bg-transparent text-[#2F80ED] border-[#4AC7FA]/50',
        neutral: 'bg-transparent text-gray-600 border-gray-200/50',
    };

    const selectedStyle = variant === 'outline' ? outlineStyles[status] : baseStyles[status];

    return (
        <span className={cn(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border backdrop-blur-sm',
            selectedStyle,
            className
        )}>
            {children}
        </span>
    );
};
