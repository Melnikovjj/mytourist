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
            sm: 'backdrop-blur-[10px]',
            md: 'backdrop-blur-[25px]',
            lg: 'backdrop-blur-[40px]',
        };

        const variantClasses = {
            default: 'bg-white/60 dark:bg-black/40 backdrop-blur-[25px] border border-white/30 dark:border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)]',
            elevated: 'bg-white/70 dark:bg-black/50 backdrop-blur-[25px] border border-white/40 dark:border-white/15 shadow-[0_15px_50px_rgba(0,0,0,0.12)]',
            flat: 'bg-white/30 dark:bg-white/5 backdrop-blur-[15px] border border-white/20 dark:border-white/5 shadow-none',
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
