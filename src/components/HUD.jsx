import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { STATIONS } from '../data/stations';

/* ── Magnetic HUD Icon Component ── */
function MagneticHUDIcon({ visited, active, station }) {
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

        if (dist < 80) {
            setIsHovered(true);
            setPosition({
                x: deltaX * 0.5,
                y: deltaY * 0.5,
                s: 1.2
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
        <motion.div
            ref={ref}
            whileHover={{ scale: 1.3 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{
                x: position.x,
                y: position.y,
                scale: position.s
            }}
            transition={{ type: 'spring', damping: 10, stiffness: 180 }}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-lg border-2 transition-all cursor-pointer relative"
            style={{
                background: visited
                    ? station.color
                    : active
                        ? 'rgba(255,255,255,0.25)'
                        : 'rgba(255,255,255,0.08)',
                borderColor: visited
                    ? 'white'
                    : active
                        ? 'white'
                        : 'rgba(255,255,255,0.2)',
                boxShadow: 'none',
                zIndex: isHovered ? 50 : 1,
            }}
        >
            <motion.span
                animate={{ scale: isHovered ? [1, 1.2, 1] : 1 }}
                transition={{ scale: { duration: 0.5, repeat: isHovered ? Infinity : 0 } }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}
            >
                {station.isImg ? (
                    <img src={station.icon} alt="" style={{ width: '65%', height: '65%', objectFit: 'contain' }} />
                ) : (
                    <span>{station.icon}</span>
                )}
            </motion.span>
        </motion.div>
    );
}

export function HUD() {
    const phase = useGameStore((s) => s.phase);
    const currentStation = useGameStore((s) => s.currentStation);
    const visitedStations = useGameStore((s) => s.visitedStations);
    const moving = useGameStore((s) => s.moving);

    const visible = ['game', 'arrived', 'finishing'].includes(phase);
    if (!visible) return null;

    const nextUnvisited = STATIONS.findIndex((_, i) => !visitedStations.has(i));

    return (
        <>
            {/* Station dots */}
            <motion.div
                className="fixed top-0 left-0 right-0 z-[100] flex flex-wrap justify-center pt-4 pb-3 gap-2 md:gap-3"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                    background: 'linear-gradient(to bottom, rgba(10,14,26,0.95) 0%, transparent 100%)',
                }}
            >
                {STATIONS.map((station, i) => {
                    const visited = visitedStations.has(i);
                    const active = currentStation === i;
                    const isNext = i === nextUnvisited;

                    return (
                        <div key={station.id} className="flex flex-col items-center gap-1">
                            <motion.div
                                animate={isNext && !visited ? { y: [0, -5, 0] } : {}}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="flex items-center"
                            >
                                <MagneticHUDIcon
                                    visited={visited}
                                    active={active}
                                    station={station}
                                />
                            </motion.div>
                        </div>
                    );
                })}
            </motion.div>

            {/* Tap to move hint */}
            {!moving && phase === 'game' && nextUnvisited >= 0 && (
                <motion.div
                    className="fixed bottom-8 left-0 right-0 flex justify-center z-30"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                    <div
                        className="px-4 py-2 rounded-full flex items-center text-[10px] md:text-sm font-black uppercase tracking-widest"
                        style={{
                            background: 'rgba(10,14,26,0.95)',
                            border: '1.5px solid rgba(126,207,179,0.5)',
                            color: '#7ecfb3',
                            backdropFilter: 'blur(12px)',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.5), 0 0 15px rgba(126,207,179,0.15)'
                        }}
                    >
                        <span>Hold to Drive</span>
                    </div>
                </motion.div>
            )}
        </>
    );
}
