import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import photo from '../assets/photo.jpeg';
import aboutMe from '../assets/about_me.png';
import { STATIONS } from '../data/stations';
import hibiIcon from '../assets/hibi.png';
import Particles from './Particles';

// ─────────────────────────────────────────────────────────────────────────────
// 1. MatrixText
// ─────────────────────────────────────────────────────────────────────────────
function MatrixText({ text = 'Hello', style = {}, initialDelay = 200, letterAnimationDuration = 500, letterInterval = 80 }) {
    const [letters, setLetters] = useState(() =>
        text.split('').map((char) => ({ char, isMatrix: false, isSpace: char === ' ' }))
    );
    const [isAnimating, setIsAnimating] = useState(false);

    const getRandomChar = useCallback(() => (Math.random() > 0.5 ? '1' : '0'), []);

    const animateLetter = useCallback((index) => {
        if (index >= text.length) return;
        requestAnimationFrame(() => {
            setLetters((prev) => {
                const next = [...prev];
                if (!next[index].isSpace) next[index] = { ...next[index], char: getRandomChar(), isMatrix: true };
                return next;
            });
            setTimeout(() => {
                setLetters((prev) => {
                    const next = [...prev];
                    next[index] = { ...next[index], char: text[index], isMatrix: false };
                    return next;
                });
            }, letterAnimationDuration);
        });
    }, [getRandomChar, text, letterAnimationDuration]);

    const startAnimation = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);
        let i = 0;
        const tick = () => {
            if (i >= text.length) { setIsAnimating(false); return; }
            animateLetter(i++);
            setTimeout(tick, letterInterval);
        };
        tick();
    }, [animateLetter, text, isAnimating, letterInterval]);

    useEffect(() => {
        let t1, t2;
        const run = () => {
            t1 = setTimeout(() => {
                startAnimation();
                t2 = setTimeout(run, text.length * letterInterval + letterAnimationDuration + 2500);
            }, initialDelay);
        };
        run();
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', ...style }}>
            {letters.map((letter, i) => (
                <span key={i} style={{
                    fontFamily: 'inherit',
                    display: 'inline-block',
                    width: letter.isSpace ? '0.4em' : '1ch',
                    textAlign: 'center',
                    transition: 'color 0.1s, text-shadow 0.1s',
                    color: letter.isMatrix ? '#ffffff' : 'inherit',
                    textShadow: letter.isMatrix ? '0 0 10px rgba(255,255,255,0.9)' : 'none',
                }}>
                    {letter.isSpace ? '\u00A0' : letter.char}
                </span>
            ))}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. ParticleTextEffect
// ─────────────────────────────────────────────────────────────────────────────
function ParticleTextEffect({ text = 'HELLO', colors = ['ffffff', 'd0d0d0', 'a0a0a0', '808080'], animationForce = 55, particleDensity = 2, width = 260, height = 48 }) {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const animationIdRef = useRef(null);
    const particlesRef = useRef([]);
    const pointerRef = useRef({});
    const hasPointerRef = useRef(false);
    const interactionRadiusRef = useRef(70);

    const rand = (max = 1, min = 0) => min + Math.random() * (max - min);

    const dottify = useCallback(() => {
        const ctx = ctxRef.current;
        const canvas = canvasRef.current;
        if (!ctx || !canvas) return;

        const fSize = Math.floor(height * 0.75);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = `500 ${fSize}px Outfit, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const tw = Math.round(ctx.measureText(text).width);
        const tx = Math.floor((canvas.width - tw) / 2);
        const ty = Math.floor((canvas.height - fSize) / 2);

        const grad = ctx.createLinearGradient(tx, ty, tx + tw, ty + fSize);
        const N = colors.length - 1;
        colors.forEach((c, i) => grad.addColorStop(i / N, `#${c}`));
        ctx.fillStyle = grad;
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);

        interactionRadiusRef.current = Math.max(40, fSize * 1.1);

        const safeW = Math.max(1, tw);
        const safeH = Math.max(1, fSize);
        const safeTx = Math.max(0, tx);
        const safeTy = Math.max(0, ty);

        let imgData;
        try {
            imgData = ctx.getImageData(safeTx, safeTy, safeW, safeH).data;
        } catch { return; }

        const pixels = [];
        for (let i = 0; i < imgData.length; i += 4) {
            if (!imgData[i + 3]) continue;
            const px = (i / 4) % safeW;
            const py = Math.floor((i / 4) / safeW);
            if (px % particleDensity === 0 && py % particleDensity === 0) {
                pixels.push({ x: safeTx + px, y: safeTy + py, rgb: [imgData[i], imgData[i + 1], imgData[i + 2]] });
            }
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particlesRef.current = pixels.map(p => ({
            ox: p.x, oy: p.y, cx: p.x, cy: p.y,
            cr: rand(2.5, 0.8),
            f: rand(animationForce + 12, animationForce - 12),
            rgb: p.rgb.map(c => Math.max(0, c + rand(10, -10))),
        }));
        particlesRef.current.forEach(p => {
            ctx.fillStyle = `rgb(${p.rgb.join(',')})`;
            ctx.beginPath();
            ctx.arc(p.cx, p.cy, p.cr, 0, 2 * Math.PI);
            ctx.fill();
        });
    }, [text, colors, animationForce, particleDensity, height]);

    const animate = useCallback(() => {
        const ctx = ctxRef.current;
        const canvas = canvasRef.current;
        if (!ctx || !canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particlesRef.current.forEach(p => {
            if (hasPointerRef.current && pointerRef.current.x !== undefined) {
                const dx = p.cx - pointerRef.current.x;
                const dy = p.cy - pointerRef.current.y;
                const dist = Math.hypot(dx, dy);
                if (dist < interactionRadiusRef.current && dist > 0) {
                    const force = Math.min(p.f, (interactionRadiusRef.current - dist) / dist * 2);
                    p.cx += (dx / dist) * force;
                    p.cy += (dy / dist) * force;
                }
            }
            const odx = p.ox - p.cx;
            const ody = p.oy - p.cy;
            const od = Math.hypot(odx, ody);
            if (od > 0.5) {
                const restore = Math.min(od * 0.1, 3);
                p.cx += (odx / od) * restore;
                p.cy += (ody / od) * restore;
            }
            ctx.fillStyle = `rgb(${p.rgb.join(',')})`;
            ctx.beginPath();
            ctx.arc(p.cx, p.cy, p.cr, 0, 2 * Math.PI);
            ctx.fill();
        });
        animationIdRef.current = requestAnimationFrame(animate);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctxRef.current = ctx;
        canvas.width = width;
        canvas.height = height;
        dottify();
        animationIdRef.current = requestAnimationFrame(animate);
        return () => { if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current); };
    }, [text, width, height, dottify, animate]);

    const handlePointerMove = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        pointerRef.current.x = (e.clientX - rect.left) * (canvas.width / rect.width);
        pointerRef.current.y = (e.clientY - rect.top) * (canvas.height / rect.height);
        hasPointerRef.current = true;
    };

    return (
        <canvas
            ref={canvasRef}
            style={{ width, height, cursor: 'none', display: 'block' }}
            onPointerMove={handlePointerMove}
            onPointerLeave={() => { hasPointerRef.current = false; pointerRef.current = {}; }}
            onPointerEnter={() => { hasPointerRef.current = true; }}
        />
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. BlurTextAnimation
// ─────────────────────────────────────────────────────────────────────────────
function BlurTextAnimation({ text = '', style = {}, className = '', animationDelay = 5000 }) {
    const [isAnimating, setIsAnimating] = useState(false);
    const animRef = useRef();
    const resetRef = useRef();

    const textWords = useMemo(() => text.split(' ').map((word, index, arr) => {
        const progress = index / arr.length;
        return {
            text: word,
            duration: 2.0 + Math.cos(index * 0.3) * 0.3,
            delay: index * 0.055 + Math.pow(progress, 0.8) * 0.4 + (Math.random() - 0.5) * 0.04,
            blur: 10 + Math.floor(Math.random() * 7),
            scale: 0.9 + Math.sin(index * 0.2) * 0.05,
        };
    }), [text]);

    useEffect(() => {
        const startAnimation = () => {
            setTimeout(() => setIsAnimating(true), 200);
            const maxTime = textWords.reduce((m, w) => Math.max(m, w.delay + w.duration), 0);
            animRef.current = setTimeout(() => {
                setIsAnimating(false);
                resetRef.current = setTimeout(startAnimation, animationDelay);
            }, (maxTime + 1) * 1000);
        };
        startAnimation();
        return () => { clearTimeout(animRef.current); clearTimeout(resetRef.current); };
    }, [textWords, animationDelay]);

    return (
        <p className={className} style={{ lineHeight: 1.85, ...style }}>
            {textWords.map((word, i) => (
                <span key={i} style={{
                    display: 'inline-block',
                    marginRight: '0.35em',
                    transition: `all ${word.duration}s cubic-bezier(0.25,0.46,0.45,0.94) ${word.delay}s`,
                    opacity: isAnimating ? 1 : 0,
                    filter: isAnimating ? 'blur(0px) brightness(1)' : `blur(${word.blur}px) brightness(0.5)`,
                    transform: isAnimating ? 'translateY(0) scale(1) rotateX(0deg)' : `translateY(18px) scale(${word.scale}) rotateX(-15deg)`,
                    willChange: 'filter, transform, opacity',
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'hidden',
                }}>
                    {word.text}
                </span>
            ))}
        </p>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. GlassButton
// ─────────────────────────────────────────────────────────────────────────────
function GlassButton({ children, onClick, className = '', size = 'default' }) {
    const paddingMap = { sm: '8px 16px', default: '12px 24px', lg: '14px 32px' };
    return (
        <div className={`glass-btn-wrap ${className}`} style={{ display: 'inline-block', borderRadius: '9999px', position: 'relative' }}>
            <button onClick={onClick} style={{ all: 'unset', cursor: 'pointer', display: 'block', borderRadius: '9999px' }}>
                <span className="glass-btn-inner" style={{
                    display: 'block',
                    padding: paddingMap[size] || paddingMap.default,
                    borderRadius: '9999px',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                    fontFamily: 'Outfit, sans-serif',
                    userSelect: 'none',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 100%)',
                    border: '1px solid rgba(255,255,255,0.22)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), 0 4px 20px rgba(0,0,0,0.4)',
                    transition: 'all 0.22s ease',
                    color: 'rgba(255,255,255,0.85)',
                }}>
                    {children}
                </span>
            </button>
            <div style={{ position: 'absolute', left: 8, right: 8, bottom: -6, height: 14, borderRadius: '9999px', background: 'rgba(0,0,0,0.5)', filter: 'blur(10px)', zIndex: -1 }} />
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ElegantShape
// ─────────────────────────────────────────────────────────────────────────────
function ElegantShape({ className, delay = 0, width = 400, height = 100, rotate = 0, opacity = 0.1 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
            animate={{ opacity: 1, y: 0, rotate }}
            transition={{ duration: 2.4, delay, ease: [0.23, 0.86, 0.39, 0.96], opacity: { duration: 1.2 } }}
            className={`absolute ${className}`}
        >
            <motion.div animate={{ y: [0, 15, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }} style={{ width, height, position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '9999px', background: `linear-gradient(to right, rgba(255,255,255,${opacity}), transparent)`, backdropFilter: 'blur(2px)', border: `1.5px solid rgba(255,255,255,${opacity * 1.5})`, boxShadow: `0 8px 32px 0 rgba(255,255,255,${opacity * 0.5})` }} />
            </motion.div>
        </motion.div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. MagneticIntroIcon
// ─────────────────────────────────────────────────────────────────────────────
function MagneticIntroIcon({ station, i }) {
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

        if (dist < 80) {
            setIsHovered(true);
            setPosition({
                x: deltaX * 0.5,
                y: deltaY * 0.5,
                r: deltaX * 0.8,
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
                scale: 1.4,
                rotate: [0, -15, 15, 0],
                transition: {
                    rotate: { repeat: Infinity, duration: 0.4 }
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
            transition={{ type: 'spring', damping: 10, stiffness: 180 }}
            className="flex items-center justify-center rounded-full text-sm relative cursor-pointer"
            style={{
                width: 32,
                height: 32,
                background: isHovered ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
                border: `1.5px solid ${isHovered ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)'}`,
                boxShadow: isHovered ? '0 0 15px rgba(255,255,255,0.3)' : 'none',
                overflow: 'hidden',
                zIndex: isHovered ? 20 : 1
            }}
        >
            {/* Rotating Background */}
            <motion.div
                className="absolute inset-0"
                animate={{ rotate: isHovered ? 360 * 2 : 360 }}
                transition={{
                    rotate: { duration: isHovered ? 3 : 12, repeat: Infinity, ease: "linear" }
                }}
                style={{
                    background: 'conic-gradient(from 0deg, transparent, rgba(255,255,255,0.1), transparent)'
                }}
            />
            <motion.div
                className="relative z-10 flex items-center justify-center w-full h-full"
                animate={isHovered ? { rotate: [0, -20, 20, 0] } : {}}
                transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0 }}
            >
                {station.isImg ? (
                    <img src={station.icon} alt="" style={{ width: '64%', height: '64%', objectFit: 'contain', display: 'block' }} />
                ) : (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{station.icon}</span>
                )}
            </motion.div>
        </motion.div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. Main IntroScreen
// ─────────────────────────────────────────────────────────────────────────────
export function IntroScreen() {
    const phase = useGameStore((s) => s.phase);
    const startGame = useGameStore((s) => s.startGame);

    const bio = "Hi, I'm S. Hiba Raliyyah, an aspiring Full Stack Developer and a pre-final year student passionate about building meaningful digital experiences. My journey began with curiosity about how websites and apps work, which grew into a strong interest in both frontend and backend development. I enjoy turning ideas into real applications and continuously improving my problem-solving skills.";

    return (
        <AnimatePresence>
            {phase === 'intro' && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #eedf0fff 5%, #53ce1aff 33%, #53ce1aff 66%, #eedf0fff 100%)' }}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.7, ease: 'easeInOut' }}
                >
                    <style>{`
                        .glass-btn-inner:hover {
                            background: linear-gradient(135deg,rgba(255,255,255,0.2) 0%,rgba(255,255,255,0.08) 100%) !important;
                            border-color: rgba(255,255,255,0.45) !important;
                            transform: translateY(-3px);
                            box-shadow: inset 0 1px 0 rgba(255,255,255,0.3), 0 8px 30px rgba(0,0,0,0.6) !important;
                        }
                        .glass-btn-inner:active { transform: scale(0.95) !important; }
                        .btn-primary .glass-btn-inner { background: linear-gradient(135deg,rgba(255,255,255,0.18) 0%,rgba(255,255,255,0.06) 100%) !important; border-color: rgba(255,255,255,0.4) !important; color: #ffffff !important; }
                        .btn-secondary .glass-btn-inner { background: linear-gradient(135deg,rgba(255,255,255,0.08) 0%,rgba(255,255,255,0.03) 100%) !important; border-color: rgba(255,255,255,0.2) !important; color: rgba(255,255,255,0.6) !important; }
                    `}</style>

                    {/* Corners Shadow / Vignette Effect */}
                    <div
                        className="absolute inset-0 pointer-events-none z-[5]"
                        style={{ boxShadow: 'inset 0 0 150px 50px rgba(0,0,0,0.7)' }}
                    />

                    {/* Dynamic Particles Background */}
                    <div className="absolute inset-0 pointer-events-none">
                        <Particles
                            particleColors={["#ffffff", "#ffffff", "#ffffff"]}
                            particleCount={400}
                            particleSpread={15}
                            speed={0.1}
                            particleBaseSize={280}
                            moveParticlesOnHover={true}
                            alphaParticles={true}
                            disableRotation={false}
                            pixelRatio={typeof window !== 'undefined' ? window.devicePixelRatio : 1}
                        />
                    </div>

                    {/* Background Shapes */}
                    <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.03) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(255,255,255,0.02) 0%, transparent 60%)' }} />
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <ElegantShape delay={0.3} width={600} height={140} rotate={12} opacity={0.08} className="left-[-10%] top-[20%]" />
                        <ElegantShape delay={0.5} width={500} height={120} rotate={-15} opacity={0.07} className="right-[-5%] top-[65%]" />
                        <ElegantShape delay={0.4} width={300} height={80} rotate={-8} opacity={0.09} className="left-[5%] bottom-[8%]" />
                    </div>

                    {/* Main Responsive Container */}
                    <motion.div
                        className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full px-6 py-12"
                    >
                        <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-5xl mx-auto gap-12 md:gap-16">

                            {/* LEFT PANEL */}
                            <motion.div
                                className="flex-1 flex flex-col justify-center items-center md:items-start text-center md:text-left md:pl-8 lg:pl-12"
                                initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                            >
                                <MatrixText
                                    text="Hiba's Journey"
                                    initialDelay={400}
                                    style={{
                                        fontSize: 'clamp(1.8rem, 5.5vw, 3.2rem)',
                                        fontWeight: 900,
                                        fontFamily: 'Outfit, sans-serif',
                                        letterSpacing: '-0.03em',
                                        marginBottom: '1rem',
                                        color: '#000000',
                                        flexWrap: 'nowrap',
                                    }}
                                />

                                <p
                                    className="mb-8 text-sm md:text-base lg:text-lg opacity-90 leading-relaxed max-w-xl text-black"
                                    style={{ fontFamily: 'Outfit, sans-serif' }}
                                >
                                    {bio}
                                </p>

                                <motion.div className="flex gap-4 flex-wrap items-center justify-center md:justify-start"
                                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.2, duration: 0.6 }}
                                >
                                    <GlassButton size="default" className="btn-secondary"
                                        onClick={() => window.location.href = 'https://hibi-personalassistant.vercel.app/'}
                                    >
                                        <img src={hibiIcon} alt="Hibi" className="w-8 h-8 object-contain" />
                                    </GlassButton>
                                    <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
                                        <GlassButton size="default" onClick={startGame} className="btn-primary">
                                            START JOURNEY ➔
                                        </GlassButton>
                                    </motion.div>
                                </motion.div>
                            </motion.div>

                            {/* RIGHT PANEL */}
                            <motion.div
                                className="flex-1 flex flex-col items-center justify-center"
                                initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                            >
                                <div className="relative mb-10">
                                    <motion.div
                                        className="relative z-10 w-48 h-64 md:w-56 md:h-72 lg:w-65 lg:h-80 rounded-[2rem] overflow-hidden border-4 border-white/30 shadow-2xl bg-black/10"
                                        style={{ willChange: 'transform' }}
                                        whileHover={{ scale: 1.05, rotate: 2 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                    >
                                        <img
                                            src={photo}
                                            alt="Profile"
                                            className="w-full h-full object-cover object-[center_15%] select-none"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                                    </motion.div>
                                    <div className="absolute -inset-10 bg-white/10 blur-3xl rounded-full scale-75 opacity-30 -z-10" />
                                </div>

                                <motion.div
                                    className="flex flex-col items-center"
                                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8, duration: 0.7 }}
                                >
                                    <ParticleTextEffect
                                        text="S.Hiba Raliyyah"
                                        colors={['ffffff', 'ffffff', 'ffffff', 'ffffff']}
                                        animationForce={60}
                                        width={400}
                                        height={60}
                                    />
                                    <p className="mt-2 text-xs font-black uppercase tracking-[0.4em]" style={{ color: '#000000', fontFamily: 'Outfit, sans-serif', opacity: 0.9 }}>
                                        Full Stack Developer
                                    </p>
                                </motion.div>
                            </motion.div>
                        </div>

                        {/* Footer Hint */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 0.4, 0] }}
                            transition={{ delay: 3, duration: 3, repeat: Infinity }}
                            className="absolute bottom-6 md:bottom-10 text-[10px] font-black uppercase tracking-[0.3em]"
                            style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'Outfit, sans-serif' }}
                        >
                            Loading Journey...
                        </motion.p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}