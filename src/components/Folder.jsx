import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Folder.css';

const darkenColor = (hex, percent) => {
    let color = hex.startsWith('#') ? hex.slice(1) : hex;
    if (color.length === 3) {
        color = color.split('').map(c => c + c).join('');
    }
    const num = parseInt(color, 16);
    let r = (num >> 16) & 0xff;
    let g = (num >> 8) & 0xff;
    let b = num & 0xff;
    r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))));
    g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))));
    b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))));
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

/* ── Lightbox Modal ── */
function CertModal({ img, title, onClose }) {
    if (!img) return null;
    return createPortal(
        <AnimatePresence>
            <motion.div
                key="backdrop"
                className="cert-modal-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    key="card"
                    className="cert-modal-card"
                    initial={{ scale: 0.65, y: 80, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.65, y: 80, opacity: 0 }}
                    transition={{ type: 'spring', damping: 22, stiffness: 200 }}
                    onClick={e => e.stopPropagation()}
                >
                    <div className="cert-modal-header">
                        <span className="cert-modal-title">{title}</span>
                        <motion.button
                            className="cert-modal-close"
                            onClick={onClose}
                            whileHover={{ scale: 1.15, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ type: 'spring', damping: 14, stiffness: 280 }}
                        >✕</motion.button>
                    </div>
                    <div className="cert-modal-img-wrap">
                        <motion.img
                            src={img}
                            alt={title}
                            className="cert-modal-img"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                        />
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>,
        document.body
    );
}

/* ── Folder (React Bits base + cert lightbox) ── */
const Folder = ({ color = '#5227FF', size = 1, items = [], className = '', certMeta = [], isOpen: controlledOpen, onToggle }) => {
    const maxItems = 3;
    const papers = items.slice(0, maxItems);
    while (papers.length < maxItems) papers.push(null);

    const [internalOpen, setInternalOpen] = useState(false);
    const open = controlledOpen !== undefined ? controlledOpen : internalOpen;

    const [viewing, setViewing] = useState(null);
    const [paperOffsets, setPaperOffsets] = useState(
        Array.from({ length: maxItems }, () => ({ x: 0, y: 0 }))
    );

    const folderBackColor = darkenColor(color, 0.08);
    const paper1 = darkenColor('#ffffff', 0.1);
    const paper2 = darkenColor('#ffffff', 0.05);
    const paper3 = '#ffffff';

    const handleClick = () => {
        if (onToggle) {
            onToggle(!open);
        } else {
            setInternalOpen(prev => !prev);
        }

        if (open) {
            setPaperOffsets(Array.from({ length: maxItems }, () => ({ x: 0, y: 0 })));
        }
    };

    const handlePaperMouseMove = (e, index) => {
        if (!open) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const offsetX = (e.clientX - centerX) * 0.15;
        const offsetY = (e.clientY - centerY) * 0.15;
        setPaperOffsets(prev => {
            const next = [...prev];
            next[index] = { x: offsetX, y: offsetY };
            return next;
        });
    };

    const handlePaperMouseLeave = (_, index) => {
        setPaperOffsets(prev => {
            const next = [...prev];
            next[index] = { x: 0, y: 0 };
            return next;
        });
    };

    const handlePaperClick = (e, index) => {
        if (!open) return;
        e.stopPropagation();
        const meta = certMeta[index];
        if (meta) setViewing(meta);
    };

    const folderStyle = {
        '--folder-color': color,
        '--folder-back-color': folderBackColor,
        '--paper-1': paper1,
        '--paper-2': paper2,
        '--paper-3': paper3,
    };

    return (
        <>
            <div style={{ transform: `scale(${size})` }} className={className}>
                <div
                    className={`folder ${open ? 'open' : ''}`.trim()}
                    style={folderStyle}
                    onClick={handleClick}
                >
                    <div className="folder__back">
                        {papers.map((item, i) => (
                            <div
                                key={i}
                                className={`paper paper-${i + 1}`}
                                onMouseMove={e => handlePaperMouseMove(e, i)}
                                onMouseLeave={e => handlePaperMouseLeave(e, i)}
                                onClick={e => handlePaperClick(e, i)}
                                style={
                                    open
                                        ? {
                                            '--magnet-x': `${paperOffsets[i]?.x || 0}px`,
                                            '--magnet-y': `${paperOffsets[i]?.y || 0}px`,
                                            cursor: 'pointer',
                                        }
                                        : {}
                                }
                            >
                                {item}
                            </div>
                        ))}
                        <div className="folder__front" />
                        <div className="folder__front right" />
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            {viewing && (
                <CertModal
                    img={viewing.img}
                    title={viewing.label}
                    onClose={() => setViewing(null)}
                />
            )}
        </>
    );
};

export default Folder;
