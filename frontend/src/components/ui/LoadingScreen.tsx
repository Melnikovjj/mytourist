import { motion } from 'framer-motion';

export function LoadingScreen() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            gap: '24px',
        }}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    border: '3px solid rgba(255,255,255,0.1)',
                    borderTopColor: 'var(--color-primary)',
                }}
            />
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ color: 'var(--text-secondary)', fontSize: 14 }}
            >
                Загрузка...
            </motion.p>
        </div>
    );
}
