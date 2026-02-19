import React from 'react';
import { motion } from 'motion/react';
import { cn } from './GlassCard';

interface ProgressBarProps {
  progress: number; // 0 to 100
  color?: string;
  className?: string;
  height?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  color = 'bg-gradient-to-r from-[#4AC7FA] to-[#2F80ED]', 
  className,
  height = 8
}) => {
  return (
    <div 
      className={cn('w-full bg-gray-200/50 rounded-full overflow-hidden backdrop-blur-sm', className)}
      style={{ height }}
    >
      <motion.div 
        className={cn('h-full rounded-full', color)}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </div>
  );
};
