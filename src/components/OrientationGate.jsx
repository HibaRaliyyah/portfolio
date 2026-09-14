import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Devices below this width are treated as mobile/tablet and must be played in landscape.
const MOBILE_TABLET_MAX = 1024;

export function OrientationGate({ children }) {
    const [isMobileTablet, setIsMobileTablet] = useState(false);
    const [isLandscape, setIsLandscape] = useState(true);

    const evaluate = () => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const mobile = vw <= MOBILE_TABLET_MAX;
        const landscape = vw >= vh;
        setIsMobileTablet(mobile);
        setIsLandscape(landscape);
        // Lock page scroll / zoom while the portrait gate is shown
        const locked = mobile && !landscape;
        document.documentElement.classList.toggle('orientation-locked', locked);
    };

    useEffect(() => {
        evaluate();
        window.addEventListener('resize', evaluate);
        window.addEventListener('orientationchange', evaluate);
        return () => {
            window.removeEventListener('resize', evaluate);
            window.removeEventListener('orientationchange', evaluate);
        };
    }, []);

    // On desktop (wide screens) we never gate — always show the game.
    const blocked = isMobileTablet && !isLandscape;

    return (
        <>
            <AnimatePresence initial={false}>
                {blocked && (
                    <motion.div
                        key="rotate-prompt"
                        className="fixed inset-0 z-[200] flex flex-col items-center justify-center text-center pointer-events-none"
                        style={{
                            background: 'radial-gradient(circle at 50% 40%, #0a0e1a 0%, #05060a 100%)',
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {/* Rotating phone icon */}
                        <motion.div
                            className="relative w-28 h-48 mb-8"
                            animate={{ rotate: 90 }}
                            transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                        >
                            <div className="absolute inset-0 rounded-3xl border-2 border-[#7ecfb3]/60 bg-[#7ecfb3]/5" />
                            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#7ecfb3]" />
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#7ecfb3]" />
                        </motion.div>

                        <h2
                            className="text-2xl sm:text-3xl font-black tracking-tight mb-3"
                            style={{ fontFamily: 'Outfit, sans-serif', color: '#f5f0e8' }}
                        >
                            Rotate Your Device
                        </h2>
                        <p
                            className="text-sm sm:text-base max-w-xs px-6 leading-relaxed"
                            style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'Outfit, sans-serif' }}
                        >
                            This interactive world is best enjoyed in landscape mode. Turn your phone sideways to start the journey.
                        </p>

                        <div className="mt-8 flex items-center gap-3 text-[#7ecfb3]">
                            <span className="w-10 h-[2px] bg-[#7ecfb3]/40 rounded-full" />
                            <span className="text-xs font-black tracking-[0.3em] uppercase">Landscape Required</span>
                            <span className="w-10 h-[2px] bg-[#7ecfb3]/40 rounded-full" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Dim the game behind the prompt when blocked so focus stays clear */}
            <div
                style={{
                    opacity: blocked ? 0.15 : 1,
                    pointerEvents: blocked ? 'none' : 'auto',
                    transition: 'opacity 0.4s ease',
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                }}
            >
                {children}
            </div>
        </>
    );
}

export default OrientationGate;