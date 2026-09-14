import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import portfolioHero from '../assets/background.png';
import hibiIcon from '../assets/hibi.png';

// Figma design dimensions — all absolute pixel offsets below are relative to this.
const DESIGN_W = 1440;
const DESIGN_H = 900;

export function IntroScreen() {
    const phase = useGameStore((s) => s.phase);
    const startGame = useGameStore((s) => s.startGame);
    const stageRef = useRef(null);

    useEffect(() => {
        const el = stageRef.current;
        if (!el) return;
        const apply = () => {
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const scale = Math.min(vw / DESIGN_W, vh / DESIGN_H);
            el.style.transform = `scale(${scale})`;
            el.style.transformOrigin = 'center center';
        };
        apply();
        window.addEventListener('resize', apply);
        return () => window.removeEventListener('resize', apply);
    }, []);

    return (
        <AnimatePresence>
            {phase === 'intro' && (
                <motion.div
                    className="fixed inset-0 z-50 overflow-hidden bg-black flex items-center justify-center select-none"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                >
                    {/* ── Responsive stage ──
                         All absolute pixel offsets below match the 1440×900 Figma
                         design. We scale the whole stage to fit any viewport while
                         preserving exact internal coordinates. */}
                    <div
                        ref={stageRef}
                        className="relative shrink-0 overflow-hidden select-none"
                        style={{
                            width: `${DESIGN_W}px`,
                            height: `${DESIGN_H}px`,
                            transformOrigin: 'center center',
                        }}
                    >
                        {/* Background Hero Image */}
                        <img
                            src={portfolioHero}
                            className="w-full h-full object-cover object-top absolute inset-0"
                            alt="background hero"
                        />

                        {/* Subtle dark gradient overlay to ensure text contrast */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                        {/* Hiba Raliyyah */}
                        <motion.p
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-[#FFF] font-islandMoments text-[160px] leading-[80px] w-[400px] h-[250px] absolute left-[30px] top-[220px] text-center drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)] pointer-events-none"
                            style={{ fontFamily: "'Island Moments', cursive" }}
                        >
                            Hiba Raliyyah
                        </motion.p>

                        {/* AI & Full Stack Development Badge */}
                        <motion.div
                            initial={{ opacity: 0, x: -60 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.35 }}
                            className="absolute left-[0px] top-[420px] z-10 flex items-center justify-center select-none"
                            style={{
                                width: '490px',
                                height: '160px',
                            }}
                        >
                            {/* SVG Shape from design (with bottom-left notch cutout) */}
                            <svg
                                viewBox="0 0 365 217"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-full h-full absolute inset-0 drop-shadow-[0_8px_30px_rgba(0,0,0,0.55)]"
                                style={{ transform: 'scaleX(-1)' }}
                            >
                                <path
                                    d="M0 50C0 22.3858 22.3858 0 50 0H315C342.614 0 365 22.3858 365 50V132.852V150.127C365 179.607 333.07 198.018 307.556 183.25L286.616 171.13C270.402 161.745 250.111 173.445 250.111 192.179C250.111 205.611 239.249 216.5 225.817 216.5C202.5 216.5 164.743 216.5 123 216.5C95.4402 216.5 70.2735 216.5 49.9848 216.5C22.3706 216.5 0 194.114 0 166.5V108.25V50Z"
                                    fill="#118D05"
                                    fillOpacity="0.65"
                                />
                            </svg>

                            {/* Centered Text */}
                            <span
                                className="relative z-10 text-[#FFF] font-pressStart2P tracking-wider text-center px-8"
                                style={{
                                    fontFamily: "'Press Start 2P', cursive",
                                    fontSize: '18px',
                                    lineHeight: '1.65',
                                    textAlign: 'center',
                                    transform: 'translateY(-22px)',
                                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.7)',
                                }}
                            >
                                AI &amp; <br /> Full Stack
                                <br />
                                Development
                            </span>
                        </motion.div>

                        {/* CSE & Final Year Badge Container */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="absolute left-[1000px] top-[280px] z-10 select-none flex flex-col items-center justify-center"
                            style={{ width: '255px', height: '150px' }}
                        >
                            {/* Custom Green Badge SVG */}
                            <svg
                                width="255"
                                height="150"
                                viewBox="0 0 365 217"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-full h-full absolute inset-0 drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
                            >
                                <path
                                    d="M0 50C0 22.3858 22.3858 0 50 0H315C342.614 0 365 22.3858 365 50V132.852V150.127C365 179.607 333.07 198.018 307.556 183.25L286.616 171.13C270.402 161.745 250.111 173.445 250.111 192.179C250.111 205.611 239.249 216.5 225.817 216.5C202.5 216.5 164.743 216.5 123 216.5C95.4402 216.5 70.2735 216.5 49.9848 216.5C22.3706 216.5 0 194.114 0 166.5V108.25V50Z"
                                    fill="#118D05"
                                    fillOpacity="0.65"
                                />
                            </svg>

                            {/* CSE Text */}
                            <p
                                className="relative z-10 text-[#17430B] font-luxuriousRoman text-[56px] leading-[56px] text-center font-bold"
                                style={{ fontFamily: "'Luxurious Roman', serif" }}
                            >
                                CSE
                            </p>

                            {/* Final Year Text */}
                            <p
                                className="relative z-10 text-[#FFF] font-poppins text-[45px] leading-[50px] text-center font-semibold drop-shadow-md"
                                style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                                Final Year
                            </p>
                        </motion.div>

                        {/* Start Journey Button Container & Trigger */}
                        <motion.button
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ 
                                opacity: 1, 
                                scale: [1, 1.03, 1],
                                boxShadow: [
                                    '0 0 20px rgba(32,166,25,0.6)',
                                    '0 0 40px rgba(32,166,25,0.9)',
                                    '0 0 20px rgba(32,166,25,0.6)'
                                ]
                            }}
                            transition={{ 
                                opacity: { duration: 0.6, delay: 0.9 },
                                scale: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
                                boxShadow: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={startGame}
                            className="absolute left-[1020px] top-[480px] w-[220px] h-[50px] rounded-[25px] bg-[#20A619] cursor-pointer flex items-center justify-center border border-white/30 shadow-[0_0_20px_rgba(32,166,25,0.6)] hover:shadow-[0_0_35px_rgba(32,166,25,0.9)] transition-all z-20 group"
                        >
                            <span
                                className="text-[#FFF] font-pressStart2P text-sm leading-none text-center flex items-center justify-center gap-1"
                                style={{ fontFamily: "'Press Start 2P', cursive" }}
                            >
                                START JOURNEY
                                <svg className="w-4 h-4 font-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </span>
                        </motion.button>

                        {/* Social Buttons Container — Bottom Center */}
                        <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-[107px] z-20 pl-[120px]">
                            {/* 1. LinkedIn */}
                            <motion.a
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 1.0 }}
                                whileHover={{ scale: 1.15, y: -4 }}
                                whileTap={{ scale: 0.95 }}
                                href="https://www.linkedin.com/in/hiba-raliyyah-samsudeen-10032006hr/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-[70px] h-[70px] flex items-center justify-center rounded-full bg-white/25 hover:bg-white/30 border border-white/25 backdrop-blur-md transition-colors cursor-pointer group shadow-lg"
                            >
                            <svg className="w-[35px] h-[35px] text-white fill-current group-hover:text-white transition-colors" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                        </motion.a>

                        {/* 2. GitHub */}
                        <motion.a
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 1.1 }}
                            whileHover={{ scale: 1.15, y: -4 }}
                            whileTap={{ scale: 0.95 }}
                            href="https://github.com/HibaRaliyyah"
                            target="_blank"
                            rel="noopener noreferrer"
                                className="w-[70px] h-[70px] flex items-center justify-center rounded-full bg-white/25 hover:bg-white/30 border border-white/25 backdrop-blur-md transition-colors cursor-pointer group shadow-lg"
                            >
                            <svg
                                width="35"
                                height="34"
                                viewBox="0 0 50 49"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-[35px] h-[35px] text-white group-hover:text-white transition-colors"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M25 0C11.1875 0 0 11.1875 0 25C0 36.0625 7.15625 45.4062 17.0937 48.7187C18.3437 48.9375 18.8125 48.1875 18.8125 47.5312C18.8125 46.9375 18.7812 44.9687 18.7812 42.875C12.5 44.0312 10.875 41.3437 10.375 39.9375C10.0937 39.2187 8.875 37 7.8125 36.4062C6.9375 35.9375 5.6875 34.7812 7.78125 34.75C9.75 34.7187 11.1562 36.5625 11.625 37.3125C13.875 41.0937 17.4687 40.0312 18.9062 39.375C19.125 37.75 19.7812 36.6562 20.5 36.0312C14.9375 35.4062 9.125 33.25 9.125 23.6875C9.125 20.9687 10.0937 18.7188 11.6875 16.9688C11.4375 16.3438 10.5625 13.7812 11.9375 10.3437C11.9375 10.3437 14.0312 9.6875 18.8125 12.9062C20.8125 12.3437 22.9375 12.0625 25.0625 12.0625C27.1875 12.0625 29.3125 12.3437 31.3125 12.9062C36.0937 9.65625 38.1875 10.3437 38.1875 10.3437C39.5625 13.7812 38.6875 16.3438 38.4375 16.9688C40.0313 18.7188 41 20.9375 41 23.6875C41 33.2812 35.1562 35.4062 29.5937 36.0312C30.5 36.8125 31.2812 38.3125 31.2812 40.6562C31.2812 44 31.25 46.6875 31.25 47.5312C31.25 48.1875 31.7187 48.9687 32.9687 48.7187C37.9316 47.0432 42.2441 43.8535 45.2993 39.5987C48.3545 35.3439 49.9985 30.2381 50 25C50 11.1875 38.8125 0 25 0Z"
                                    fill="currentColor"
                                />
                            </svg>
                        </motion.a>

                        {/* 3. Hibi Assistant */}
                        <motion.a
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 1.2 }}
                            whileHover={{ scale: 1.15, y: -4 }}
                            whileTap={{ scale: 0.95 }}
                            href="https://hibi-personalassistant.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                                className="w-[70px] h-[70px] flex items-center justify-center rounded-full bg-white/25 hover:bg-white/30 border border-white/25 backdrop-blur-md transition-colors cursor-pointer group shadow-lg"
                            >
                            <img
                                src={hibiIcon}
                                className="w-[38px] h-[38px] object-contain max-w-none grayscale"
                                alt="Hibi assistant"
                            />
                        </motion.a>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default IntroScreen;