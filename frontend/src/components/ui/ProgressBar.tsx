import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface ProgressBarProps {
    progress: number;
    className?: string;
    height?: number;
}

export const ProgressBar = ({ progress, className, height = 6 }: ProgressBarProps) => {
    return (
        <div
            className={cn('w-full bg-gray-200/50 rounded-full overflow-hidden backdrop-blur-sm', className)}
            style={{ height }}
        >
            <motion.div
                className="h-full bg-gradient-to-r from-[#4AC7FA] to-[#2F80ED] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
            />
        </div>
    );
};
