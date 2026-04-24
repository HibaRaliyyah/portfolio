import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { STATIONS } from '../data/stations';
import { SocialLinks } from './SocialLinks';

/* ── Magnetic Map Icon Component ── */
function MagneticMapIcon({ station, i, rideToStation }) {
    const ref = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0, s: 1 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e) => {
        if (!ref.current) return;
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;

        const deltaX = clientX - centerX;
        const deltaY = clientY - centerY;
        const dist = Math.hypot(deltaX, deltaY);

        if (dist < 100) {
            setIsHovered(true);
            setPosition({
                x: deltaX * 0.4,
                y: deltaY * 0.4,
                s: 1.15
            });
        } else {
            setIsHovered(false);
            setPosition({ x: 0, y: 0, s: 1 });
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setPosition({ x: 0, y: 0, s: 1 });
    };

    return (
        <motion.button
            ref={ref}
            whileHover={{ scale: 1.25 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => rideToStation(i)}
            className="flex-shrink-0 flex flex-col items-center gap-2 md:gap-4 p-4 md:p-6 rounded-2xl md:rounded-3xl transition-all relative z-10 min-w-[100px] md:min-w-[120px]"
            style={{
                background: isHovered ? station.buildingColor : `${station.buildingColor}cc`,
                border: `3px solid ${isHovered ? station.color : station.color + '60'}`,
                cursor: 'pointer',
                x: position.x,
                y: position.y,
                scale: position.s,
                boxShadow: isHovered ? `0 15px 40px ${station.color}60` : 'none',
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: position.s }}
            transition={{ delay: 0.2 + i * 0.08, type: 'spring', stiffness: 300, damping: 15 }}
            whileTap={{ scale: 0.94 }}
        >
            <motion.div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-xl md:text-2xl overflow-hidden relative shadow-inner"
                style={{ background: `${station.color}25` }}>
                <motion.div
                    className="absolute inset-0"
                    animate={{ rotate: 360 }}
                    transition={{ rotate: { duration: 12, repeat: Infinity, ease: "linear" } }}
                    style={{ background: `linear-gradient(45deg, ${station.color}30, transparent, ${station.color}20)` }}
                />
                <motion.div className="relative z-10 flex items-center justify-center w-full h-full">
                    {station.isImg ? (
                        <img src={station.icon} alt="" style={{ width: '65%', height: '65%', objectFit: 'contain' }} />
                    ) : (
                        station.icon
                    )}
                </motion.div>
            </motion.div>
            <div className="text-[0.65rem] md:text-[0.75rem]" style={{
                color: '#fff',
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 900,
                textAlign: 'center',
                lineHeight: 1.1,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
                {station.name}
            </div>
        </motion.button>
    );
}

export function FinalMap() {
    const phase = useGameStore((s) => s.phase);
    const rideToStation = useGameStore((s) => s.rideToStation);
    const playAgain = useGameStore((s) => s.playAgain);

    const isEnd = phase === 'final';

    return (
        <AnimatePresence>
            {isEnd && (
                <motion.div
                    className="fixed inset-0 z-[60] flex items-end justify-center pb-4 md:pb-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ pointerEvents: 'none' }}
                >
                    <motion.div
                        className="pointer-events-auto w-full max-w-5xl mx-4 flex flex-col md:flex-row items-center md:items-end justify-center gap-4 md:gap-8"
                        initial={{ y: 150, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 150, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 22, delay: 0.1 }}
                    >
                        <div className="flex-1 w-full rounded-[24px] md:rounded-[32px] border-[2px] md:border-[3px]" style={{
                            background: 'rgba(10,14,26,0.96)',
                            borderColor: 'rgba(126,207,179,0.4)',
                            backdropFilter: 'blur(24px)',
                            paddingTop: '4px',
                            overflow: 'hidden',
                            boxShadow: '0 -15px 70px rgba(126,207,179,0.2), 0 40px 100px rgba(0,0,0,0.8)',
                        }}>
                            {/* Mobile Social Links - Top of card */}
                            <div className="md:hidden pt-6 pb-2 flex justify-center border-b border-white/5">
                                <SocialLinks isFloating={false} className="flex-row scale-90" />
                            </div>

                            <div className="px-4 md:px-6 py-4 md:py-5 text-center" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <div className="font-black text-xl md:text-2xl uppercase tracking-tighter" style={{
                                    background: 'linear-gradient(135deg, #7ecfb3 0%, #a78bfa 50%, #ff7744 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    fontFamily: 'Outfit, sans-serif',
                                }}>
                                    Journey Complete!
                                </div>
                                <p className="text-[0.7rem] md:text-[0.8rem]" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Outfit, sans-serif', fontWeight: 600, marginTop: '2px' }}>
                                    Teleport back to any station!
                                </p>
                            </div>

                            <div className="px-4 md:px-6 py-4 md:py-5 flex gap-2 md:gap-3.5 overflow-x-auto scroll-hide" style={{
                                scrollbarWidth: 'none',
                                WebkitOverflowScrolling: 'touch',
                            }}>
                                {STATIONS.map((station, i) => (
                                    <MagneticMapIcon
                                        key={station.id}
                                        station={station}
                                        i={i}
                                        rideToStation={rideToStation}
                                    />
                                ))}
                            </div>

                            <div className="px-4 md:px-6 pb-4 md:pb-6 flex justify-center">
                                <motion.button
                                    onClick={playAgain}
                                    className="w-full max-w-xs py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-xs md:text-sm tracking-widest uppercase text-center shadow-lg"
                                    style={{
                                        background: 'linear-gradient(135deg, #7ecfb3 0%, #4ecdc4 100%)',
                                        color: '#0a0e1a',
                                        fontFamily: 'Outfit, sans-serif',
                                        border: 'none',
                                    }}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Restart Journey
                                </motion.button>
                            </div>
                        </div>

                        {/* Desktop Social Links - Right Side */}
                        <div className="hidden md:block pb-6">
                            <SocialLinks isFloating={false} className="flex-col" />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
