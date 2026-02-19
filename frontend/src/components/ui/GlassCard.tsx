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
            default: 'bg-white/55 border border-white/35 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]',
            elevated: 'bg-white/70 border border-white/50 shadow-[0_12px_40px_0_rgba(31,38,135,0.1)]',
            flat: 'bg-white/30 border border-white/20 shadow-none',
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
