import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
    status?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
    children: React.ReactNode;
    className?: string;
}

export const Badge = ({ status = 'neutral', children, className }: BadgeProps) => {
    const styles = {
        success: 'bg-[#34C759]/15 text-[#34C759] border-[#34C759]/20',
        warning: 'bg-[#FF9F0A]/15 text-[#FF9F0A] border-[#FF9F0A]/20',
        error: 'bg-[#FF3B30]/15 text-[#FF3B30] border-[#FF3B30]/20',
        info: 'bg-[#4AC7FA]/15 text-[#2F80ED] border-[#4AC7FA]/20',
        neutral: 'bg-gray-100/50 text-gray-600 border-gray-200/50',
    };

    return (
        <span className={cn(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border backdrop-blur-sm',
            styles[status],
            className
        )}>
            {children}
        </span>
    );
};
