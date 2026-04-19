import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { STATIONS } from '../data/stations';
import car from '../assets/car.png';

/* ── Magnetic Arrive Icon Component ── */
function MagneticArriveIcon({ station }) {
    const ref = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0, r: 0, s: 1 });
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

        if (dist < 120) {
            setIsHovered(true);
            setPosition({
                x: deltaX * 0.45,
                y: deltaY * 0.45,
                r: deltaX * 0.5,
                s: 1.25
            });
        } else {
            setIsHovered(false);
            setPosition({ x: 0, y: 0, r: 0, s: 1 });
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setPosition({ x: 0, y: 0, r: 0, s: 1 });
    };

    return (
        <motion.div
            ref={ref}
            whileHover={{
                scale: 1.3,
                rotate: [0, -10, 10, 0],
                transition: {
                    rotate: { repeat: Infinity, duration: 0.5 }
                }
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{
                x: position.x,
                y: position.y,
                rotate: position.r,
                scale: position.s
            }}
            transition={{ type: 'spring', damping: 10, stiffness: 150 }}
            className="w-14 h-14 rounded-full flex items-center justify-center text-3xl overflow-hidden relative cursor-pointer"
            style={{
                background: `${station.color}30`,
                boxShadow: isHovered ? `0 0 25px ${station.color}` : 'none',
                zIndex: 10
            }}
        >
            {/* Spin Layer */}
            <motion.div
                className="absolute inset-0"
                animate={{ rotate: isHovered ? 360 * 2 : 360 }}
                transition={{
                    rotate: { duration: isHovered ? 3 : 10, repeat: Infinity, ease: "linear" }
                }}
                style={{ background: `linear-gradient(135deg, ${station.color}40, transparent, ${station.color}30)` }}
            />
            <motion.div
                className="relative z-10 flex items-center justify-center w-full h-full"
                animate={isHovered ? { rotate: [0, -15, 15, 0] } : {}}
                transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0 }}
            >
                {station.isImg ? (
                    <img src={station.icon} alt="" style={{ width: '65%', height: '65%', objectFit: 'contain' }} />
                ) : (
                    station.icon
                )}
            </motion.div>
        </motion.div>
    );
}

export function ArrivePrompt() {
    const phase = useGameStore((s) => s.phase);
    const currentStation = useGameStore((s) => s.currentStation);
    const enterStation = useGameStore((s) => s.enterStation);
    const skipStation = useGameStore((s) => s.skipStation);

    const station = STATIONS[currentStation];
    const isOpen = phase === 'arrived' && !!station;

    return (
        <AnimatePresence>
            {isOpen && station && (
                <motion.div
                    className="fixed bottom-20 left-0 right-0 flex justify-center z-40 pointer-events-none"
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                >
                    <div
                        className="pointer-events-auto mx-4 max-w-sm w-full rounded-3xl overflow-hidden"
                        style={{
                            background: 'rgba(10,14,26,0.96)',
                            border: `3px solid ${station.color}`,
                            backdropFilter: 'blur(20px)',
                            boxShadow: `0 0 50px ${station.color}40, 0 30px 80px rgba(0,0,0,0.6)`,
                        }}
                    >
                        {/* Header */}
                        <div className="px-6 py-4 flex items-center gap-4"
                            style={{ background: `${station.color}20`, borderBottom: `1px solid ${station.color}30` }}>

                            <MagneticArriveIcon station={station} />

                            <div>
                                <div className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: station.color, opacity: 0.8 }}>
                                    Arrived — Stop {currentStation + 1}/5
                                </div>
                                <div className="font-black text-white text-xl tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                                    {station.name.toUpperCase()}
                                </div>
                            </div>
                            <motion.div className="ml-auto"
                                animate={{ y: [0, -5, 0], rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}>
                                <img src={car} alt="car" style={{ height: '70px', width: '70px', objectFit: 'contain' }} />
                            </motion.div>
                        </div>

                        {/* Hint */}
                        <div className="px-6 py-4">
                            <p className="text-sm font-medium leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Outfit, sans-serif' }}>
                                You've reached the building! Drive closer or click below to explore this section.
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="px-6 pb-6 flex gap-3">
                            <motion.button
                                onClick={enterStation}
                                className="flex-1 py-4 rounded-2xl font-black text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg"
                                style={{
                                    background: `linear-gradient(135deg, ${station.color} 0%, ${station.buildingColor} 100%)`,
                                    color: '#0a0e1a',
                                    fontFamily: 'Outfit, sans-serif',
                                }}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Enter Building
                            </motion.button>
                            <motion.button
                                onClick={skipStation}
                                className="px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2"
                                style={{
                                    borderColor: 'rgba(255,255,255,0.15)',
                                    color: 'rgba(255,255,255,0.6)',
                                    fontFamily: 'Outfit, sans-serif',
                                }}
                                whileHover={{ scale: 1.05, borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Skip →
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
