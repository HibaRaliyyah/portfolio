import { useProgress } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import carIcon from '../assets/car.png';

export function LoadingScreen() {
    const { progress, active } = useProgress();

    return (
        <AnimatePresence>
            {active && (
                <motion.div
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center transition-all"
                    style={{ background: '#0a0e1a' }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.img 
                        src={carIcon} 
                        alt="Loading" 
                        className="w-24 h-auto mb-8"
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <div
                        className="text-xl font-bold mb-6"
                        style={{
                            background: 'linear-gradient(135deg, #7ecfb3 0%, #a78bfa 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            fontFamily: 'Outfit, sans-serif',
                        }}
                    >
                        Loading World...
                    </div>
                    {/* Progress bar */}
                    <div
                        className="w-48 h-1.5 rounded-full overflow-hidden"
                        style={{ background: 'rgba(255,255,255,0.1)' }}
                    >
                        <motion.div
                            className="h-full rounded-full"
                            style={{ background: 'linear-gradient(135deg, #7ecfb3, #4ecdc4)' }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                    <p className="mt-3 text-xs" style={{ color: '#4a5a7a', fontFamily: 'JetBrains Mono, monospace' }}>
                        {Math.round(progress)}%
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
