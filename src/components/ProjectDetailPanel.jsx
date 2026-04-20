import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactDOM from 'react-dom';

export default function ProjectDetailPanel({ project, onClose }) {
    const [isMobile, setIsMobile] = useState(false);
    const [isInteractivityReady, setIsInteractivityReady] = useState(false);

    useEffect(() => {
        if (project) {
            const timer = setTimeout(() => setIsInteractivityReady(true), 200);
            return () => {
                clearTimeout(timer);
                setIsInteractivityReady(false);
            };
        }
    }, [project]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!project) return;
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [project, onClose]);

    const DesktopPanel = () => (
        <motion.div
            key="pdp-panel-desktop"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 35 }}
            style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width: 'min(520px, 90vw)',
                zIndex: 99999,
                display: 'flex', flexDirection: 'column',
                overflow: 'hidden',
                background: 'linear-gradient(160deg, #1a0f2e 0%, #0d0720 60%, #170c2a 100%)',
                boxShadow: '-20px 0 80px rgba(0,0,0,0.8)',
                fontFamily: "'Outfit', sans-serif",
                pointerEvents: isInteractivityReady ? 'auto' : 'none',
            }}
            onClick={(e) => e.stopPropagation()}
        >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, #a855f7, #ec4899, #f59e0b)', zIndex: 20 }} />
            <div style={{ position: 'relative', width: '100%', height: 260, flexShrink: 0, overflow: 'hidden' }}>
                <motion.img src={project.src} alt={project.alt} initial={{ scale: 1.1 }} animate={{ scale: 1 }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, rgba(13,7,32,1))' }} />
                <motion.div style={{ position: 'absolute', bottom: 20, left: 20 }}>
                    <div style={{ fontSize: 10, color: '#a855f7', fontWeight: 800, letterSpacing: 2, marginBottom: 4 }}>PROJECT</div>
                    <h2 style={{ fontSize: 24, fontWeight: 900, color: '#fff', margin: 0 }}>{project.title}</h2>
                </motion.div>
                <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', cursor: 'pointer', zIndex: 30 }}>✕</button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '30px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
                <section>
                    <h3 style={{ fontSize: 11, fontWeight: 900, color: '#ec4899', letterSpacing: 2, marginBottom: 10 }}>DESCRIPTION</h3>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 1.8 }}>{project.description}</p>
                </section>
                <section>
                    <h3 style={{ fontSize: 11, fontWeight: 900, color: '#f59e0b', letterSpacing: 2, marginBottom: 10 }}>TECH STACK</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {(project.tech || []).map(t => <span key={t} style={{ padding: '5px 12px', borderRadius: 8, background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', color: '#d8b4fe', fontSize: 11, fontWeight: 700 }}>{t}</span>)}
                    </div>
                </section>
            </div>
            <div style={{ padding: 20, background: 'rgba(13,7,32,0.9)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <a href={project.downloadFile || project.url} target={project.downloadFile ? "_self" : "_blank"} rel="noreferrer" style={{ display: 'block', textAlign: 'center', padding: '16px', borderRadius: 14, background: 'linear-gradient(135deg, #7c3aed, #ec4899)', color: '#fff', textDecoration: 'none', fontWeight: 900, fontSize: 14 }}>{project.downloadFile ? "DOWNLOAD PROJECT ↓" : "EXPLORE LIVE →"}</a>
            </div>
        </motion.div>
    );

    const MobilePanel = () => (
        <motion.div
            key="pdp-panel-mobile"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
                position: 'fixed', left: 0, right: 0, bottom: 0, height: '90vh',
                zIndex: 99999,
                background: '#0d0720',
                borderTopLeftRadius: 30, borderTopRightRadius: 30,
                boxShadow: '0 -10px 40px rgba(0,0,0,0.8)',
                display: 'flex', flexDirection: 'column',
                overflow: 'hidden',
                fontFamily: "'Outfit', sans-serif",
                pointerEvents: isInteractivityReady ? 'auto' : 'none',
            }}
            onClick={(e) => e.stopPropagation()}
        >
            {/* Drag Handle */}
            <div style={{ width: 40, height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 2, margin: '12px auto', flexShrink: 0 }} />

            <button
                onClick={onClose}
                style={{ position: 'absolute', top: 15, right: 20, width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontSize: 14, zIndex: 50 }}
            >
                ✕
            </button>

            <div style={{ flex: 1, overflowY: 'auto', padding: '0 0 40px 0' }}>
                <div style={{ position: 'relative', width: '100%', height: 220, marginBottom: 20 }}>
                    <img src={project.src} alt={project.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, #0d0720)' }} />
                    <div style={{ position: 'absolute', bottom: 15, left: 20, right: 20 }}>
                        <div style={{ fontSize: 9, color: '#a855f7', fontWeight: 900, letterSpacing: 2 }}>SELECTED PROJECT</div>
                        <h2 style={{ fontSize: 24, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.2 }}>{project.title}</h2>
                    </div>
                </div>

                <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 28 }}>
                    <section>
                        <h3 style={{ fontSize: 10, fontWeight: 900, color: '#ec4899', letterSpacing: 3, marginBottom: 12 }}>ABOUT THIS WORK</h3>
                        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, lineHeight: 1.7, margin: 0 }}>{project.description}</p>
                    </section>

                    <section>
                        <h3 style={{ fontSize: 10, fontWeight: 900, color: '#f59e0b', letterSpacing: 3, marginBottom: 12 }}>BUILT WITH</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {(project.tech || []).map(t => (
                                <span key={t} style={{ padding: '6px 14px', borderRadius: 10, background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', color: '#d8b4fe', fontSize: 12, fontWeight: 700 }}>
                                    {t}
                                </span>
                            ))}
                        </div>
                    </section>

                    <div style={{ marginTop: 10, paddingBottom: 20 }}>
                        <a
                            href={project.downloadFile || project.url}
                            target={project.downloadFile ? "_self" : "_blank"}
                            rel="noreferrer"
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                width: '100%', padding: '18px', borderRadius: 18,
                                background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
                                color: '#fff', textDecoration: 'none', fontWeight: 900, fontSize: 14,
                                letterSpacing: 1.5, boxShadow: '0 10px 25px rgba(124,58,237,0.4)'
                            }}
                        >
                            {project.downloadFile ? "DOWNLOAD SOURCE" : "OPEN LIVE PREVIEW"}
                        </a>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    return ReactDOM.createPortal(
        <AnimatePresence>
            {project && (
                <>
                    <motion.div
                        key="pdp-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={isInteractivityReady ? onClose : undefined}
                        style={{
                            position: 'fixed', inset: 0,
                            background: 'rgba(5,3,15,0.85)',
                            backdropFilter: 'blur(10px)',
                            zIndex: 99998,
                        }}
                    />
                    {isMobile ? <MobilePanel /> : <DesktopPanel />}
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
