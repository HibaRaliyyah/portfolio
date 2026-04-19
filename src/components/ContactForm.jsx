import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 12,
    border: '1.5px solid #3d2a1d25',
    background: '#fff',
    color: '#3d2a1d',
    fontSize: 14,
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 600,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s',
};

function Field({ label, id, focusColor = '#7c3aed', children }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label
                htmlFor={id}
                style={{
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: focusColor,
                    fontFamily: "'Outfit', sans-serif",
                }}
            >
                {label}
            </label>
            {children}
        </div>
    );
}

export default function ContactForm() {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [focused, setFocused] = useState(null);
    const [status, setStatus] = useState('idle'); // idle | loading | success | error
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
        setStatus('loading');
        setErrorMsg('');
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const data = await res.json().catch(() => null);

            if (res.ok && data?.success) {
                setStatus('success');
                setForm({ name: '', email: '', message: '' });
            } else {
                setStatus('error');
                const detail = data?.error || `HTTP ${res.status}`;
                setErrorMsg(`Server failure: ${detail}. Please restart your terminal/dev server.`);
            }
        } catch (err) {
            console.error('Contact Error:', err);
            setStatus('error');
            setErrorMsg('Could not connect to the mail server. Please ensure the dev server was restarted.');
        }
    };

    const focusBorderStyle = (field) => ({
        ...inputStyle,
        borderColor: focused === field ? '#7c3aed' : '#3d2a1d25',
        boxShadow: focused === field ? '0 0 0 3px rgba(124,58,237,0.1)' : 'none',
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Intro card */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                    background: 'linear-gradient(135deg, #7c3aed18, #ec489918)',
                    border: '1.5px solid #7c3aed30',
                    borderRadius: 16,
                    padding: '16px 20px',
                }}
            >
                <p style={{
                    color: '#3d2a1d',
                    fontSize: 14,
                    lineHeight: 1.75,
                    margin: 0,
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 500,
                }}>
                    I am actively seeking professional opportunities and collaborations that allow me to apply my skills, contribute meaningfully, and grow within a dynamic environment.
                </p>
            </motion.div>

            <AnimatePresence mode="wait">
                {status === 'success' ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        style={{
                            background: 'linear-gradient(135deg, #22c55e15, #16a34a15)',
                            border: '1.5px solid #22c55e40',
                            borderRadius: 20,
                            padding: '32px 24px',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 12,
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.2, 1] }}
                            transition={{ delay: 0.1, duration: 0.5 }}
                            style={{ fontSize: 48 }}
                        >
                        </motion.div>
                        <h3 style={{ color: '#166534', fontSize: 18, fontWeight: 900, margin: 0, fontFamily: "'Outfit', sans-serif" }}>
                            Message Sent!
                        </h3>
                        <p style={{ color: '#15803d', fontSize: 13, lineHeight: 1.6, margin: 0, fontFamily: "'Outfit', sans-serif" }}>
                            Thank you for getting in touch. I will respond to your email soon. <br />
                            A confirmation message has been sent to your inbox.
                        </p>
                        <motion.button
                            onClick={() => setStatus('idle')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                marginTop: 8,
                                padding: '10px 24px',
                                borderRadius: 12,
                                background: '#22c55e',
                                color: '#fff',
                                border: 'none',
                                fontWeight: 900,
                                fontSize: 12,
                                letterSpacing: '1.5px',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                fontFamily: "'Outfit', sans-serif",
                            }}
                        >
                            Send Another →
                        </motion.button>
                    </motion.div>
                ) : (
                    <motion.form
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onSubmit={handleSubmit}
                        style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
                    >
                        {/* Name + Email row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <Field label="Your Name" id="contact-name" focusColor="#7c3aed">
                                <input
                                    id="contact-name"
                                    name="name"
                                    type="text"
                                    placeholder="Full Name"
                                    value={form.name}
                                    onChange={handleChange}
                                    onFocus={() => setFocused('name')}
                                    onBlur={() => setFocused(null)}
                                    required
                                    style={focusBorderStyle('name')}
                                />
                            </Field>
                            <Field label="Your Email" id="contact-email" focusColor="#ec4899">
                                <input
                                    id="contact-email"
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    value={form.email}
                                    onChange={handleChange}
                                    onFocus={() => setFocused('email')}
                                    onBlur={() => setFocused(null)}
                                    required
                                    style={focusBorderStyle('email')}
                                />
                            </Field>
                        </div>

                        <Field label="Message" id="contact-message" focusColor="#f59e0b">
                            <textarea
                                id="contact-message"
                                name="message"
                                rows={5}
                                placeholder="Message here...."
                                value={form.message}
                                onChange={handleChange}
                                onFocus={() => setFocused('message')}
                                onBlur={() => setFocused(null)}
                                required
                                style={{
                                    ...focusBorderStyle('message'),
                                    resize: 'vertical',
                                    minHeight: 110,
                                }}
                            />
                        </Field>

                        {/* Error */}
                        <AnimatePresence>
                            {status === 'error' && (
                                <motion.div
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    style={{
                                        background: '#fef2f2',
                                        border: '1.5px solid #fca5a5',
                                        borderRadius: 10,
                                        padding: '10px 14px',
                                        color: '#b91c1c',
                                        fontSize: 13,
                                        fontWeight: 700,
                                        fontFamily: "'Outfit', sans-serif",
                                    }}
                                >
                                    ⚠️ {errorMsg}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Submit */}
                        <motion.button
                            type="submit"
                            disabled={status === 'loading'}
                            whileHover={status !== 'loading' ? { scale: 1.03, boxShadow: '0 0 24px rgba(124,58,237,0.35)' } : {}}
                            whileTap={status !== 'loading' ? { scale: 0.97 } : {}}
                            style={{
                                width: '100%',
                                padding: '14px 24px',
                                borderRadius: 14,
                                background: status === 'loading'
                                    ? 'rgba(124,58,237,0.5)'
                                    : 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)',
                                color: '#fff',
                                border: 'none',
                                fontWeight: 900,
                                fontSize: 14,
                                letterSpacing: '1.5px',
                                textTransform: 'uppercase',
                                cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                                fontFamily: "'Outfit', sans-serif",
                                boxShadow: '0 8px 24px rgba(124,58,237,0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 10,
                                transition: 'background 0.3s',
                            }}
                        >
                            {status === 'loading' ? (
                                <>
                                    <motion.span
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                                        style={{ display: 'inline-block', fontSize: 18 }}
                                    >
                                        ⟳
                                    </motion.span>
                                    Sending…
                                </>
                            ) : (
                                <>Send Message</>
                            )}
                        </motion.button>

                        {/* Direct email hint */}
                        <p style={{
                            textAlign: 'center',
                            color: '#3d2a1d60',
                            fontSize: 11,
                            fontWeight: 600,
                            fontFamily: "'Outfit', sans-serif",
                            margin: 0,
                        }}>
                            or email directly at{' '}
                            <a
                                href="mailto:hibaraliyyah12@gmail.com"
                                style={{ color: '#7c3aed', fontWeight: 800, textDecoration: 'none' }}
                            >
                                hibaraliyyah12@gmail.com
                            </a>
                        </p>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    );
}
