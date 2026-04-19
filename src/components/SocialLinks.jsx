import { useRef, useState } from 'react';
import { motion, useSpring, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import githubIcon from '../assets/github.png';
import linkedinIcon from '../assets/linkedin.png';
import hibiIcon from '../assets/hibi.png';

const MagneticBall = ({ social, index }) => {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const [isHovered, setIsHovered] = useState(false);

    // Spring physics for smooth movement - extra snappy
    const mouseX = useSpring(x, { damping: 12, stiffness: 220, mass: 0.4 });
    const mouseY = useSpring(y, { damping: 12, stiffness: 220, mass: 0.4 });

    // Aggressive rotation based on mouse movement
    const rotate = useTransform(x, [-40, 40], [-270, 270]);
    const rotateY = useTransform(x, [-40, 40], [-45, 45]);
    const rotateX = useTransform(y, [-40, 40], [45, -45]);

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;

        // Calculate offset (increased multiplier for more "play")
        const offX = (clientX - centerX) * 0.8;
        const offY = (clientY - centerY) * 0.8;

        x.set(offX);
        y.set(offY);
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        setIsHovered(false);
    };

    return (
        <div className="relative flex items-center justify-end">
            {/* Tooltip Label */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, x: 10, scale: 0.8 }}
                        animate={{ opacity: 1, x: -20, scale: 1 }}
                        exit={{ opacity: 0, x: 10, scale: 0.8 }}
                        className="absolute right-full mr-4 px-4 py-2 rounded-xl whitespace-nowrap pointer-events-none"
                        style={{
                            background: 'rgba(10, 14, 26, 0.9)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: '#fff',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            letterSpacing: '0.05em',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                            fontFamily: 'Outfit, sans-serif'
                        }}
                    >
                        {social.label}
                        <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 rotate-45"
                            style={{ background: 'rgba(10, 14, 26, 0.9)', borderRight: '1px solid rgba(255, 255, 255, 0.2)', borderTop: '1px solid rgba(255, 255, 255, 0.2)' }} />
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                ref={ref}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    x: mouseX,
                    y: mouseY,
                    perspective: 1000
                }}
                className="flex items-center justify-center p-2"
            >
                <motion.a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl relative group overflow-hidden"
                    style={{
                        rotateZ: rotate,
                        rotateX,
                        rotateY,
                        background: 'rgba(255, 255, 255, 0.08)',
                        backdropFilter: 'blur(16px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: isHovered ? '0 10px 30px rgba(255,255,255,0.2)' : '0 4px 12px rgba(0,0,0,0.3)',
                    }}
                    animate={{
                        scale: isHovered ? 1.25 : 1,
                    }}
                    transition={{ type: 'spring', damping: 10, stiffness: 180 }}
                    whileHover={{
                        scale: 1.3,
                        rotate: [0, -20, 20, 0],
                        transition: {
                            rotate: { repeat: Infinity, duration: 0.4 }
                        }
                    }}
                    whileTap={{ scale: 0.85 }}
                >
                    {/* Rotating background layer - speeds up on hover */}
                    <motion.div
                        className="absolute inset-0 rounded-full"
                        animate={{ rotate: isHovered ? 360 * 2 : 360 }}
                        transition={{
                            rotate: { duration: isHovered ? 3 : 10, repeat: Infinity, ease: "linear" }
                        }}
                        style={{
                            backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(0, 0, 0, 0.1) 100%)',
                        }}
                    />

                    {/* 3D-like ball highlights */}
                    <div className="absolute top-1 left-1 w-1/2 h-1/2 bg-white/25 rounded-full blur-[3px] pointer-events-none" />
                    <div className="absolute bottom-1 right-1 w-1/4 h-1/4 bg-black/30 rounded-full blur-[4px] pointer-events-none" />

                    <motion.img
                        src={social.icon}
                        alt={social.id}
                        className="w-9 h-9 object-contain relative z-10"
                        animate={isHovered ? {
                            rotate: [0, -15, 15, 0],
                            scale: [1, 1.1, 1]
                        } : {}}
                        transition={{ duration: 0.6, repeat: isHovered ? Infinity : 0 }}
                    />

                    {/* Shimmer effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" style={{ skewX: '-20deg' }} />

                    {/* Glow ring */}
                    <div className="absolute inset-0 rounded-full border border-white/0 group-hover:border-white/30 transition-colors pointer-events-none" />
                </motion.a>
            </motion.div>
        </div>
    );
};

export function SocialLinks() {
    const phase = useGameStore((state) => state.phase);

    const socials = [
        { id: 'github', icon: githubIcon, url: 'https://github.com/HibaRaliyyah/', label: 'View my code' },
        { id: 'linkedin', icon: linkedinIcon, url: 'https://www.linkedin.com/in/hiba-raliyyah-samsudeen-10032006hr/', label: 'Connect with me' },
        { id: 'hibi', icon: hibiIcon, url: 'https://hibi-personalassistant.vercel.app/', label: 'Chat with Hibi!' },
    ];

    if (phase === 'intro') return null;

    return (
        <div className="fixed bottom-6 right-6 z-[70] flex flex-col gap-4">
            {socials.map((social, i) => (
                <MagneticBall key={social.id} social={social} index={i} />
            ))}
        </div>
    );
}
