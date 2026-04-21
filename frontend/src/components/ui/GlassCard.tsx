import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

interface GlassCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    variant?: 'default' | 'elevated' | 'flat';
    blur?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
    ({ children, className, variant = 'default', blur = 'md', ...props }, ref) => {

        const blurClasses = {
            sm: 'backdrop-blur-[20px] saturate-[120%]',
            md: 'backdrop-blur-[40px] saturate-[150%]',
            lg: 'backdrop-blur-[60px] saturate-[200%]',
        };

        const variantClasses = {
            default: 'bg-white/30 dark:bg-black/40 border border-white/50 dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.9),inset_0_-1px_1px_rgba(255,255,255,0.3)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)]',
            elevated: 'bg-white/40 dark:bg-black/50 border border-white/60 dark:border-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,1),inset_0_-1px_1px_rgba(255,255,255,0.5)]',
            flat: 'bg-white/20 dark:bg-white/5 border border-white/30 dark:border-white/5 shadow-none',
        };

        return (
            <motion.div
                ref={ref}
                className={cn(
                    'rounded-[24px] overflow-hidden',
                    blurClasses[blur],
                    variantClasses[variant],
                    className
                )}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);
GlassCard.displayName = "GlassCard";
