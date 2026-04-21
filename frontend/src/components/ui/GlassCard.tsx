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
            default: 'bg-[#0D1814]/60 border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.05)]',
            elevated: 'bg-[#15251F]/70 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.1)]',
            flat: 'bg-[#060E0B]/40 border border-white/5 shadow-none',
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
