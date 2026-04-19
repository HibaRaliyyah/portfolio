import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactDOM from 'react-dom';

export default function ProjectDetailPanel({ project, onClose }) {
    useEffect(() => {
        if (!project) return;
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [project, onClose]);

    return ReactDOM.createPortal(
        <AnimatePresence>
            {project && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="pdp-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={onClose}
                        style={{
                            position: 'fixed', inset: 0,
                            background: 'rgba(10,6,20,0.65)',
                            backdropFilter: 'blur(6px)',
                            zIndex: 99998,
                        }}
                    />

                    {/* Panel */}
                    <motion.div
                        key="pdp-panel"
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '110%', opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 32 }}
                        style={{
                            position: 'fixed',
                            top: 0, right: 0, bottom: 0,
                            width: 'min(520px, 95vw)',
                            zIndex: 99999,
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            background: 'linear-gradient(160deg, #1a0f2e 0%, #0d0720 60%, #170c2a 100%)',
                            boxShadow: '-20px 0 80px rgba(0,0,0,0.6)',
                            fontFamily: "'Outfit', sans-serif",
                        }}
                    >
                        {/* Decorative top glow */}
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                            background: 'linear-gradient(90deg, #a855f7, #ec4899, #f59e0b)',
                        }} />

                        {/* Close button */}
                        <motion.button
                            onClick={onClose}
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            style={{
                                position: 'absolute', top: 20, right: 20,
                                width: 40, height: 40, borderRadius: '50%',
                                background: 'rgba(255,255,255,0.08)',
                                border: '1.5px solid rgba(255,255,255,0.15)',
                                color: '#fff', fontSize: 18, cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                zIndex: 10, transition: 'background 0.2s',
                            }}
                        >
                            ✕
                        </motion.button>

                        {/* Hero image */}
                        <div style={{
                            position: 'relative', width: '100%',
                            height: 260, flexShrink: 0, overflow: 'hidden'
                        }}>
                            <motion.img
                                src={project.src}
                                alt={project.alt}
                                initial={{ scale: 1.08 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                                style={{
                                    width: '100%', height: '100%',
                                    objectFit: 'cover', display: 'block',
                                }}
                            />
                            {/* Image overlay gradient */}
                            <div style={{
                                position: 'absolute', inset: 0,
                                background: 'linear-gradient(to bottom, rgba(10,6,20,0.1) 0%, rgba(10,6,20,0.9) 100%)',
                            }} />

                            {/* Title on image */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                style={{
                                    position: 'absolute', bottom: 20, left: 24, right: 60,
                                }}
                            >
                                <div style={{
                                    fontSize: 11, fontWeight: 800, letterSpacing: '3px',
                                    color: '#a855f7', textTransform: 'uppercase', marginBottom: 6,
                                }}>
                                    ◈ Project
                                </div>
                                <h2 style={{
                                    fontSize: 20, fontWeight: 900, color: '#fff',
                                    lineHeight: 1.3, margin: 0,
                                }}>
                                    {project.title}
                                </h2>
                            </motion.div>
                        </div>

                        {/* Scrollable content */}
                        <div style={{
                            flex: 1, overflowY: 'auto', padding: '28px 24px',
                            display: 'flex', flexDirection: 'column', gap: 28,
                        }}>
                            {/* Description */}
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 }}
                            >
                                <div style={{
                                    fontSize: 10, fontWeight: 800, letterSpacing: '2.5px',
                                    color: '#ec4899', textTransform: 'uppercase', marginBottom: 10,
                                    display: 'flex', alignItems: 'center', gap: 8,
                                }}>
                                    <span style={{ flex: 1, height: 1, background: 'rgba(236,72,153,0.3)' }} />
                                    About
                                    <span style={{ flex: 1, height: 1, background: 'rgba(236,72,153,0.3)' }} />
                                </div>
                                <p style={{
                                    color: 'rgba(255,255,255,0.75)', fontSize: 14,
                                    lineHeight: 1.75, margin: 0,
                                }}>
                                    {project.description}
                                </p>
                            </motion.div>

                            {/* Tech Stack */}
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35 }}
                            >
                                <div style={{
                                    fontSize: 10, fontWeight: 800, letterSpacing: '2.5px',
                                    color: '#f59e0b', textTransform: 'uppercase', marginBottom: 12,
                                    display: 'flex', alignItems: 'center', gap: 8,
                                }}>
                                    <span style={{ flex: 1, height: 1, background: 'rgba(245,158,11,0.3)' }} />
                                    Tech Stack
                                    <span style={{ flex: 1, height: 1, background: 'rgba(245,158,11,0.3)' }} />
                                </div>
                                <div style={{
                                    display: 'flex', flexWrap: 'wrap', gap: 8,
                                }}>
                                    {project.tech.map((t, i) => (
                                        <motion.span
                                            key={t}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.4 + i * 0.05 }}
                                            style={{
                                                padding: '5px 14px',
                                                borderRadius: 999,
                                                background: 'rgba(168,85,247,0.12)',
                                                border: '1px solid rgba(168,85,247,0.3)',
                                                color: '#c4b5fd',
                                                fontSize: 12, fontWeight: 700,
                                                letterSpacing: '0.5px',
                                            }}
                                        >
                                            {t}
                                        </motion.span>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Footer — CTA button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.45 }}
                            style={{
                                padding: '20px 24px',
                                borderTop: '1px solid rgba(255,255,255,0.07)',
                                background: 'rgba(0,0,0,0.3)',
                                backdropFilter: 'blur(10px)',
                                flexShrink: 0,
                            }}
                        >
                            {project.downloadFile ? (
                                <motion.a
                                    href={project.downloadFile}
                                    download="chrome-extension.rar"
                                    whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(168,85,247,0.5)' }}
                                    whileTap={{ scale: 0.97 }}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        gap: 10, width: '100%', padding: '15px 24px',
                                        borderRadius: 16,
                                        background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)',
                                        color: '#fff', fontSize: 15, fontWeight: 900,
                                        letterSpacing: '1.5px', textTransform: 'uppercase',
                                        textDecoration: 'none', cursor: 'pointer',
                                        boxShadow: '0 8px 32px rgba(124,58,237,0.4)',
                                        border: 'none',
                                        fontFamily: "'Outfit', sans-serif",
                                    }}
                                >
                                    Download File
                                    <span style={{ fontSize: 18 }}>↓</span>
                                </motion.a>
                            ) : (
                                <motion.a
                                    href={project.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(168,85,247,0.5)' }}
                                    whileTap={{ scale: 0.97 }}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        gap: 10, width: '100%', padding: '15px 24px',
                                        borderRadius: 16,
                                        background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)',
                                        color: '#fff', fontSize: 15, fontWeight: 900,
                                        letterSpacing: '1.5px', textTransform: 'uppercase',
                                        textDecoration: 'none', cursor: 'pointer',
                                        boxShadow: '0 8px 32px rgba(124,58,237,0.4)',
                                        border: 'none',
                                        fontFamily: "'Outfit', sans-serif",
                                    }}
                                >
                                    Explore Project
                                    <span style={{ fontSize: 18 }}>→</span>
                                </motion.a>
                            )}
                        </motion.div>

                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
