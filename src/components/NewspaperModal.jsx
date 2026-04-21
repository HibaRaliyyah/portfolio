import { useRef, useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, motionValue, useSpring } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { STATIONS } from '../data/stations';
import Folder from './Folder';
import DomeGallery from './DomeGallery';
import ProjectDetailPanel from './ProjectDetailPanel';
import ContactForm from './ContactForm';

// Certificate Imports
import cert1 from '../assets/1.jpeg';
import cert2 from '../assets/2.jpeg';
import cert3 from '../assets/3.jpeg';
import cert4 from '../assets/4.jpeg';
import cert5 from '../assets/5.jpeg';
import cert6 from '../assets/6.jpeg';
import cert7 from '../assets/7.jpeg';
import cert8 from '../assets/8.jpeg';
import cert9 from '../assets/9.jpeg';
import cert10 from '../assets/10.jpeg';
import cert11 from '../assets/11.jpeg';
import cert12 from '../assets/12.jpeg';
import cert13 from '../assets/13.jpeg';
import cert14 from '../assets/14.jpeg';
import cert15 from '../assets/15.jpeg';

const CERTS = [
    cert1, cert2, cert3, cert4, cert5, cert6, cert7, cert8,
    cert9, cert10, cert11, cert12, cert13, cert14, cert15
];

/* ── Physics Tech Cloud Component ── */
function TechCloud({ technologies }) {
    const containerRef = useRef(null);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const mousePos = useRef({ x: -100, y: -100 });

    const R = 28; // slightly smaller collision radius for more space
    const DIAM = R * 2;
    const FRICTION = 0.996; // Less friction for more active movement
    const BOUNCE = 0.92; // Higher bounce for better energy
    const MOUSE_PUSH = 160;

    const bubbles = useMemo(() => technologies.map((tech, i) => {
        const cols = 12;
        const col = i % cols;
        const row = Math.floor(i / cols);
        return {
            tech,
            id: i,
            x: col * 75 + 45 + (Math.random() - 0.5) * 15,
            y: row * 75 + 45 + (Math.random() - 0.5) * 15,
            vx: (Math.random() - 0.5) * 1.2,
            vy: (Math.random() - 0.5) * 1.2,
            mvX: motionValue(0),
            mvY: motionValue(0),
            angle: Math.random() * Math.PI * 2,
            wave: Math.random() * Math.PI * 2,
            waveSpeed: 0.6 + Math.random() * 0.5,
        };
    }), [technologies]);

    useEffect(() => {
        const resize = () => {
            if (!containerRef.current) return;
            const w = containerRef.current.offsetWidth;
            const h = containerRef.current.offsetHeight;
            if (w > 0 && h > 0) {
                setContainerSize({ width: w, height: h });
            }
        };

        const observer = new ResizeObserver(resize);
        if (containerRef.current) observer.observe(containerRef.current);

        resize();
        const timer = setTimeout(resize, 500);
        return () => {
            observer.disconnect();
            clearTimeout(timer);
        };
    }, [technologies]);

    useEffect(() => {
        let raf;
        const update = () => {
            if (!containerRef.current) return;
            const W = containerSize.width;
            const H = containerSize.height;

            for (let i = 0; i < bubbles.length; i++) {
                const b = bubbles[i];
                b.wave += 0.008 * b.waveSpeed;
                b.angle += 0.007;

                b.vx += Math.cos(b.angle) * 0.055 + Math.cos(b.wave) * 0.03;
                b.vy += Math.sin(b.angle) * 0.055 + Math.sin(b.wave * 1.3) * 0.03;

                const mx = mousePos.current.x;
                const my = mousePos.current.y;
                if (mx > 0) {
                    const dx = b.x - mx;
                    const dy = b.y - my;
                    const dist = Math.hypot(dx, dy);
                    if (dist < MOUSE_PUSH && dist > 0) {
                        const force = Math.pow((MOUSE_PUSH - dist) / MOUSE_PUSH, 2) * 2.5;
                        b.vx += (dx / dist) * force;
                        b.vy += (dy / dist) * force;
                    }
                }

                b.x += b.vx;
                b.y += b.vy;
                b.vx *= FRICTION;
                b.vy *= FRICTION;

                const speed = Math.hypot(b.vx, b.vy);
                if (speed > 6) { b.vx *= 6 / speed; b.vy *= 6 / speed; }
            }

            // Collision resolution between bubbles
            for (let i = 0; i < bubbles.length; i++) {
                for (let j = i + 1; j < bubbles.length; j++) {
                    const a = bubbles[i], b2 = bubbles[j];
                    const dx = b2.x - a.x, dy = b2.y - a.y;
                    const dist = Math.hypot(dx, dy);
                    const minD = DIAM + 2;
                    if (dist < minD && dist > 0.01) {
                        const push = (minD - dist) * 0.52;
                        const nx = dx / dist, ny = dy / dist;
                        a.x -= nx * push * 0.5; a.y -= ny * push * 0.5;
                        b2.x += nx * push * 0.5; b2.y += ny * push * 0.5;
                        const dot = (a.vx - b2.vx) * nx + (a.vy - b2.vy) * ny;
                        if (dot > 0) {
                            a.vx -= dot * nx * BOUNCE;
                            a.vy -= dot * ny * BOUNCE;
                            b2.vx += dot * nx * BOUNCE;
                            b2.vy += dot * ny * BOUNCE;
                        }
                    }
                }
            }

            // Final boundary containment (force them to stay inside visible bounds)
            const padding = 12; // More padding to ensure visibility
            for (let i = 0; i < bubbles.length; i++) {
                const b = bubbles[i];
                if (b.x < R + padding) { b.x = R + padding; b.vx = Math.abs(b.vx) * BOUNCE; }
                if (b.x > W - R - padding) { b.x = W - R - padding; b.vx = -Math.abs(b.vx) * BOUNCE; }
                if (b.y < R + padding) { b.y = R + padding; b.vy = Math.abs(b.vy) * BOUNCE; }
                if (b.y > H - R - padding) { b.y = H - R - padding; b.vy = -Math.abs(b.vy) * BOUNCE; }
            }

            bubbles.forEach(b => {
                b.mvX.set(b.x - R);
                b.mvY.set(b.y - R);
            });

            raf = requestAnimationFrame(update);
        };

        raf = requestAnimationFrame(update);
        return () => cancelAnimationFrame(raf);
    }, [bubbles, containerSize]);

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        mousePos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleMouseLeave = () => { mousePos.current = { x: -1000, y: -1000 }; };

    return (
        <div
            ref={containerRef}
            className="relative w-full overflow-hidden rounded-[30px] md:rounded-[40px] border border-white/10 bg-gradient-to-br from-[#1a1a1a] via-[#0a0a0a] to-black shadow-[inset_0_8px_32px_rgba(0,0,0,0.5),0_20px_40px_rgba(0,0,0,0.2)] h-[440px] md:h-[360px]"
            style={{ marginTop: 20 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {bubbles.map((b) => (
                <div
                    key={b.id}
                    style={{ width: 60, height: 60, position: 'absolute', left: 0, top: 0 }}
                >
                    <MagneticTechBubble tech={b.tech} i={b.id} x={b.mvX} y={b.mvY} />
                </div>
            ))}
        </div>
    );
}

/* ── Magnetic Tech Bubble Component ── */
function MagneticTechBubble({ tech, i, x, y }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            style={{
                x, y,
                width: 60,
                height: 60,
                borderRadius: '50%',
                position: 'absolute'
            }}
            className="group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: isHovered ? 1.2 : 1 }}
                transition={{ type: 'spring', damping: 14, stiffness: 160, delay: i * 0.008 }}
            >
                <motion.div
                    className="w-14 h-14 rounded-full relative flex items-center justify-center"
                >
                    <motion.div
                        className="absolute inset-0 rounded-full"
                    >
                        <div className="absolute inset-0 rounded-full bg-white/20 backdrop-blur-md border border-white/40 shadow-[inset_0_4px_12px_rgba(255,255,255,0.6),0_8px_20px_rgba(0,0,0,0.08)]" />
                        <div className="absolute top-[10%] left-[10%] w-[35%] h-[20%] bg-white/40 rounded-[50%] rotate-[-25deg] blur-[1px]" />
                        <div className="absolute inset-2 rounded-full border border-white/5 border-dashed" />
                    </motion.div>
                    <motion.div
                        className="w-9 h-9 flex items-center justify-center z-10"
                        animate={{
                            y: isHovered ? [0, -2, 2, 0] : [0, -1.5, 0],
                            rotate: isHovered ? [0, 15, -15, 0] : [0, 3, -3, 0]
                        }}
                        transition={{ duration: isHovered ? 1.5 : 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <img src={tech.icon} alt={tech.name} className="w-full h-full object-contain" />
                    </motion.div>
                </motion.div>
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all text-[8px] font-black text-[#3d2a1d] tracking-widest bg-white/80 px-1.5 py-0.5 rounded-full pointer-events-none whitespace-nowrap z-20 shadow-sm border border-[#3d2a1d10]">
                    {tech.name.toUpperCase()}
                </div>
            </motion.div>
        </motion.div>
    );
}

/* ── Decorative SVGs ── */
const Star = ({ size = 60, color = "#f6b93b", stroke = "#ffffff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={stroke} strokeWidth="1.5">
        <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
    </svg>
);

const WheelIcon = ({ size = 60 }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="40" stroke="#ffffff" strokeWidth="5" />
        <circle cx="50" cy="50" r="10" stroke="#ffffff" strokeWidth="5" />
        <path d="M50 10V40M50 60V90M10 50H40M60 50H90M21.7 21.7L42.9 42.9M57.1 57.1L78.3 78.3M21.7 78.3L42.9 57.1M57.1 42.9L78.3 21.7" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
    </svg>
);

const KeyIcon = ({ size = 60 }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="30" cy="60" r="15" stroke="#ffffff" strokeWidth="6" />
        <path d="M45 60L90 60M75 60V75M85 60V75" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
    </svg>
);

const SignalIcon = ({ size = 60 }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 40C5 45 5 55 10 60M20 30C12 38 12 62 20 70" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
        <rect x="35" y="40" width="30" height="20" rx="10" fill="#f6b93b" stroke="#ffffff" strokeWidth="4" />
        <circle cx="75" cy="50" r="10" stroke="#ffffff" strokeWidth="4" />
        <circle cx="90" cy="50" r="10" stroke="#ffffff" strokeWidth="4" />
    </svg>
);

const TargetIcon = ({ size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3">
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="2" fill="#ffffff" />
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" strokeLinecap="round" />
    </svg>
);

const SideDot = ({ color = "#f6b93b" }) => (
    <div className="w-3 h-3 rounded-full border-2 border-[#ffffff]" style={{ backgroundColor: color }} />
);

/* ── Certificate Folders Component ── */
function CertificateFolders() {
    const FOLDER_COLORS = ['#e8734a', '#5b8dd9', '#6dc26e', '#c97bd0', '#f6b93b'];
    const groups = [
        {
            name: "Full Stack",
            color: FOLDER_COLORS[0],
            certs: [cert1, cert12, cert10],
            labels: ["MERN Stack", "Full Stack", "MongoDB"],
        },
        {
            name: "AI",
            color: FOLDER_COLORS[1],
            certs: [cert2, cert6, cert14],
            labels: ["AI Generalist", "AI Fundamental Skills", "AI Masterclass"],
        },
        {
            name: "Tech Skills",
            color: FOLDER_COLORS[2],
            certs: [cert13, cert4, cert3],
            labels: ["Prompt Engineering", "n8n", "Docker"],
        },
        {
            name: "Programming Language",
            color: FOLDER_COLORS[3],
            certs: [cert7, cert9, cert5],
            labels: ["Java Internship", "Java Course", "Python Course"],
        },
        {
            name: "Additinal Skills",
            color: FOLDER_COLORS[4],
            certs: [cert11, cert8, cert15],
            labels: ["Cloud Orchestration", "Learnathon", "Cyber Job Simulation"],
        },
    ];

    const [activeFolderIdx, setActiveFolderIdx] = useState(null);

    return (
        <div className="py-8 flex flex-col gap-10 md:gap-20 items-center justify-center w-full">
            {/* Folders Container */}
            <div className="flex flex-wrap gap-10 md:gap-20 justify-center items-end w-full">
                {groups.map((group, i) => (
                    <div key={i} className="flex flex-col items-center gap-4 scale-90 md:scale-100">
                        <Folder
                            color={group.color}
                            size={1.5}
                            isOpen={activeFolderIdx === i}
                            onToggle={(open) => setActiveFolderIdx(open ? i : null)}
                            certMeta={group.certs.map((img, j) => ({ img, label: group.labels[j] || `Cert ${j + 1}` }))}
                            items={group.certs.map((img, j) => (
                                <img
                                    key={j}
                                    src={img}
                                    alt={group.labels[j]}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10, display: 'block' }}
                                />
                            ))}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ── NewspaperModal ── */
export function NewspaperModal() {
    const phase = useGameStore((s) => s.phase);
    const currentStation = useGameStore((s) => s.currentStation);
    const closeSection = useGameStore((s) => s.closeSection);
    const scrollRef = useRef(null);
    const skillsRef = useRef(null);
    const setSelectedProject = useGameStore((s) => s.setSelectedProject);

    const isOpen = phase === 'reading';
    const station = STATIONS[currentStation];
    if (!station && isOpen) return null;

    const handleTileSelect = (imgData) => {
        if (!station?.projects) return;
        const full = station.projects.find(p => p.src === imgData.src || p.alt === imgData.alt);
        setSelectedProject(full || imgData);
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && station && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ background: 'rgba(30,20,10,0.4)' }}
                    >
                        <div className="absolute inset-0" onClick={closeSection} />

                        <div className="relative w-full max-w-4xl">
                            {/* Top decorations */}
                            <div className="absolute top-[-35px] left-1/2 -translate-x-1/2 flex justify-between w-[160px] z-30 pointer-events-none px-4">
                                <div className="w-6 h-6 rotate-45 border-l-4 border-t-4 border-[#ffffff] bg-[#f6b93b]" />
                                <div className="w-6 h-6 rotate-45 border-r-4 border-t-4 border-[#ffffff] bg-[#f6b93b]" />
                            </div>
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-48 h-12 z-20 pointer-events-none flex items-center justify-center overflow-hidden border-[4px] border-[#ffffff] rounded-lg"
                                style={{ background: 'repeating-linear-gradient(90deg, #f6b93b, #f6b93b 15px, #ffcf71 15px, #ffcf71 30px)' }}>
                            </div>
                            <div className="absolute -top-16 left-[15%] pointer-events-none hidden md:block"><Star size={45} /></div>
                            <div className="absolute -top-16 right-[15%] pointer-events-none hidden md:block"><Star size={45} /></div>
                            <div className="absolute -left-20 top-1/4 pointer-events-none -rotate-12 hidden lg:block"><Star size={85} /></div>
                            <div className="absolute -left-16 top-[45%] pointer-events-none hidden lg:block"><WheelIcon size={75} /></div>
                            <div className="absolute -left-12 bottom-[20%] pointer-events-none hidden lg:block"><TargetIcon size={50} /></div>
                            <div className="absolute -right-20 top-1/4 pointer-events-none hidden lg:block"><SignalIcon size={80} /></div>
                            <div className="absolute -right-16 bottom-[18%] pointer-events-none hidden lg:block"><KeyIcon size={80} /></div>
                            <div className="absolute left-[-22px] top-[30%] -translate-y-1/2 hidden md:block"><SideDot /></div>
                            <div className="absolute left-[-22px] top-[70%] -translate-y-1/2 hidden md:block"><SideDot /></div>
                            <div className="absolute right-[-22px] top-[30%] -translate-y-1/2 hidden md:block"><SideDot /></div>
                            <div className="absolute right-[-22px] top-[70%] -translate-y-1/2 hidden md:block"><SideDot /></div>

                            <motion.div
                                className="relative w-full overflow-hidden bg-[#f8f4ed] border-[3px] md:border-[5px] border-[#3d2a1d] shadow-[10px_10px_0px_rgba(61,42,29,0.1)] md:shadow-[15px_15px_0px_rgba(61,42,29,0.1)]"
                                style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
                                initial={{ scale: 0.9, y: 30, opacity: 0 }}
                                animate={{ scale: 1, y: 0, opacity: 1 }}
                                exit={{ scale: 0.9, y: 30, opacity: 0 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            >
                                <div
                                    ref={scrollRef}
                                    className="relative flex-1 overflow-y-auto p-6 md:p-12 pt-12 md:pt-16 modal-scroll select-none"
                                >
                                    {/* Side vertical decorative lines */}
                                    <div className="absolute left-4 md:left-8 top-8 bottom-32 w-[1px] md:w-[2px] bg-[#3d2a1d10] pointer-events-none" />
                                    <div className="absolute right-4 md:right-8 top-8 bottom-32 w-[1px] md:w-[2px] bg-[#3d2a1d10] pointer-events-none" />
                                    <div className="absolute inset-3 md:inset-6 border-[1px] md:border-[1.5px] border-[#3d2a1d08] rounded-[25px] md:rounded-[35px] pointer-events-none" />

                                    {/* Station header */}
                                    <div className="flex items-center gap-5 mb-6 relative z-10">
                                        <div
                                            className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border-4 border-[#3d2a1d] overflow-hidden"
                                            style={{ background: station.buildingColor }}
                                        >
                                            {station.isImg ? (
                                                <img src={station.icon} alt={station.name} className="w-full h-full object-cover p-2" />
                                            ) : (
                                                <span className="text-3xl">{station.icon}</span>
                                            )}
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-bold tracking-[0.3em] text-[#3d2a1d60] uppercase">
                                                Station 0{currentStation + 1} / 05
                                            </div>
                                            <h1
                                                className="text-2xl font-black text-[#3d2a1d] tracking-tight leading-none"
                                                style={{ fontFamily: 'Outfit, sans-serif' }}
                                            >
                                                {station.name.toUpperCase()}
                                            </h1>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="mb-6 relative z-10">
                                        {station.headline && (
                                            <h2
                                                className="text-lg font-bold text-[#3d2a1d] mb-4 leading-tight italic opacity-90"
                                                style={{ fontFamily: 'Outfit, sans-serif' }}
                                            >
                                                "{station.headline}"
                                            </h2>
                                        )}
                                        <div className="space-y-4">
                                            {station.text && (
                                                <p className="text-[#4a3a2d] leading-relaxed text-base" style={{ fontFamily: 'Outfit, sans-serif' }}>
                                                    {station.text}
                                                </p>
                                            )}
                                            {station.subheading && (
                                                <h3 className="text-base font-black text-[#3d2a1d] uppercase tracking-widest mt-6 mb-3 border-b-2 border-[#3d2a1d10] pb-1">
                                                    {station.subheading}
                                                </h3>
                                            )}

                                            {station.education ? (
                                                <div className="space-y-2">
                                                    {station.education.map((edu, i) => (
                                                        <motion.div
                                                            key={i}
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: 0.4 + i * 0.1 }}
                                                            className="p-3 rounded-xl bg-[#3d2a1d05] border-l-4 border-[#f6b93b] flex justify-between items-center"
                                                        >
                                                            <div>
                                                                <div className="text-[#3d2a1d] font-black text-sm">{edu.school}</div>
                                                                <div className="text-[#3d2a1d60] font-bold text-[9px] tracking-widest uppercase">{edu.duration}</div>
                                                            </div>
                                                            {edu.grade && (
                                                                <div className="text-[#000000] font-black text-[11px] px-2 py-1 bg-[#f6b93b10] rounded-lg max-w-[180px] text-right leading-tight">
                                                                    {edu.grade}
                                                                </div>
                                                            )}
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            ) : station.id === 'certificates' ? (
                                                <>
                                                    <CertificateFolders />
                                                    <div className="mt-12 pt-8 border-t-2 border-[#3d2a1d10]" ref={skillsRef}>
                                                        <h3 className="text-xl font-black text-[#3d2a1d] uppercase tracking-widest mb-6 flex items-center gap-3">
                                                            <span className="w-8 h-1 bg-[#f6b93b]" />
                                                            SKILLS
                                                            <span className="flex-1 h-[2px] bg-[#3d2a1d10]" />
                                                        </h3>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            {[
                                                                "Web Development",
                                                                "Modern Frontend Engineering",
                                                                "Backend & API Development",
                                                                "Database Management",
                                                                "Authentication & Security Systems",
                                                                "Payment Integration Systems",
                                                                "AI Integration & LLM Applications",
                                                                "Voice AI & Speech Processing",
                                                                "Workflow Automation & AI Pipelines",
                                                                "Cloud Media & Storage Management",
                                                                "UI/UX Engineering & Motion Design",
                                                                "3D Web Development",
                                                                "DevOps & Containerization",
                                                                "CI/CD & Deployment Pipelines",
                                                                "Version Control & Collaboration",
                                                                "API Testing & Debugging",
                                                                "Java",
                                                                "25+ problems in DSA",
                                                                "Python",
                                                                "Vibe coding",
                                                                "Prompt Engineering"
                                                            ].map((skill, i) => (
                                                                <motion.div
                                                                    key={i}
                                                                    initial={{ opacity: 0, x: -10 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    transition={{ delay: 0.1 + i * 0.05 }}
                                                                    className="flex items-center gap-2 group"
                                                                >
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-[#f6b93b] group-hover:scale-150 transition-transform" />
                                                                    <span className="text-[#4a3a2d] font-bold text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>
                                                                        {skill}
                                                                    </span>
                                                                </motion.div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </>
                                            ) : station.id === 'projects' ? (
                                                <div className="space-y-6">
                                                    {station.items && (
                                                        <div className="flex flex-wrap gap-2">
                                                            {station.items.map((item, i) => (
                                                                <motion.span
                                                                    key={i}
                                                                    initial={{ opacity: 0, y: 10 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    transition={{ delay: 0.4 + i * 0.1 }}
                                                                    className="px-3 py-1 rounded-full bg-[#f6b93b20] border-2 border-[#f6b93b40] text-[#3d2a1d] font-bold text-[10px]"
                                                                >
                                                                    ✨ {item}
                                                                </motion.span>
                                                            ))}
                                                        </div>
                                                    )}
                                                    <div className="relative w-full h-[500px] mt-8 rounded-[40px] overflow-hidden border-[5px] border-[#3d2a1d20] shadow-inner bg-[#3d2a1d05]">
                                                        <DomeGallery
                                                            images={(station.projects || []).map(p => ({ src: p.src, alt: p.alt }))}
                                                            fit={1}
                                                            minRadius={400}
                                                            maxVerticalRotationDeg={12}
                                                            segments={28}
                                                            grayscale={false}
                                                            onTileSelect={handleTileSelect}
                                                        />
                                                    </div>
                                                </div>
                                            ) : station.technologies ? (
                                                <TechCloud technologies={station.technologies} />
                                            ) : station.id === 'contact' ? (
                                                <ContactForm />
                                            ) : station.items && (
                                                <div className="flex flex-wrap gap-2">
                                                    {station.items.map((item, i) => (
                                                        <motion.span
                                                            key={i}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: 0.4 + i * 0.1 }}
                                                            className="px-3 py-1 rounded-full bg-[#f6b93b20] border-2 border-[#f6b93b40] text-[#3d2a1d] font-bold text-[10px]"
                                                        >
                                                            ✨ {item}
                                                        </motion.span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Floating Down Arrow for Certificates Station */}
                                    {station.id === 'certificates' && (
                                        <motion.button
                                            onClick={() => {
                                                skillsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                            }}
                                            initial={{ opacity: 0, scale: 0, y: 20 }}
                                            animate={{ opacity: 1, scale: 1, y: [0, 8, 0] }}
                                            transition={{
                                                opacity: { delay: 1 },
                                                scale: { delay: 1 },
                                                y: { repeat: Infinity, duration: 2, ease: "easeInOut" }
                                            }}
                                            whileHover={{ scale: 1.1, backgroundColor: '#3d2a1d', color: '#f6b93b' }}
                                            whileTap={{ scale: 0.9 }}
                                            className="fixed md:absolute bottom-24 left-10 md:left-12 z-[60] md:z-20 w-10 h-10 md:w-12 md:h-12 rounded-full border-[3px] md:border-4 border-[#3d2a1d] bg-[#f6b93b] text-[#3d2a1d] flex items-center justify-center shadow-xl cursor-pointer"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
                                            </svg>
                                        </motion.button>
                                    )}

                                    {/* Smiley stamp */}
                                    <div className="mt-8 flex justify-end relative z-10 pointer-events-none">
                                        <motion.div
                                            style={{ width: 50, height: 50, borderRadius: '50%', background: '#f6b93b', border: '3px solid #3d2a1d', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', rotate: '8deg' }}
                                            animate={{ rotate: [8, 12, 8] }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        >
                                            <div style={{ width: 5, height: 5, background: '#3d2a1d', borderRadius: '50%', position: 'absolute', top: '35%', left: '30%' }} />
                                            <div style={{ width: 5, height: 5, background: '#3d2a1d', borderRadius: '50%', position: 'absolute', top: '35%', right: '30%' }} />
                                            <div style={{ width: 20, height: 10, borderBottom: '3px solid #3d2a1d', borderRadius: '0 0 25px 25px', marginTop: 10 }} />
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="px-6 md:px-8 py-4 bg-[#3d2a1d] flex flex-row items-center justify-between gap-4 border-t-2 border-[#3d2a1d]">
                                    <div className="flex flex-col">
                                        <p className="text-[#f8f4ed] text-[9px] md:text-[10px] font-bold tracking-widest uppercase">Discovery Complete</p>
                                        <p className="text-[#f8f4ed40] text-[8px] md:text-[9px] font-medium hidden sm:block">Ready to continue?</p>
                                    </div>
                                    <button
                                        onClick={closeSection}
                                        className="px-6 py-2 rounded-xl bg-[#f6b93b] text-[#3d2a1d] font-black text-xs tracking-widest border-b-[4px] border-[#c89420] active:border-b-0 active:translate-y-1 transition-all hover:scale-105"
                                        style={{ fontFamily: 'Outfit, sans-serif' }}
                                    >
                                        CONTINUE ➔
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
