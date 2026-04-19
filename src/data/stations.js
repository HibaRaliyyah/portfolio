import aboutMe from '../assets/about_me.png';
import techStacks from '../assets/tech_stacks.png';
import certificates from '../assets/certificates.png';
import project from '../assets/projects.png';
import contactMe from '../assets/contact_me.png';

// Technology Icons
import githubIcon from '../assets/github.png';
import reactIcon from '../assets/react.svg';
import viteIcon from '../assets/vite.png';
import clipdropIcon from '../assets/clipdrop.png';
import convexIcon from '../assets/convex.png';
import stackauthIcon from '../assets/stackauth.png';
import deepgramIcon from '../assets/deepgram.png';
import groqIcon from '../assets/groq.png';
import clerkIcon from '../assets/clerk.png';
import cloudinaryIcon from '../assets/cloudinary.png';
import stripeIcon from '../assets/stripe.png';
import nodemailerIcon from '../assets/nodemailer.png';
import brevoIcon from '../assets/brevo.png';
import flowiseIcon from '../assets/flowise.png';
import claudeIcon from '../assets/claude.png';
import lovableIcon from '../assets/lovable.jpeg';
import antigravityIcon from '../assets/antigravity.png';
import chatgptIcon from '../assets/chatgpt.png';
import prebuiltuiIcon from '../assets/prebuiltui.jpeg';
import materializeCssIcon from '../assets/materializecss.png';

// Project Images
import genart from '../assets/genart.png';
import voxnova from '../assets/voxnova.png';
import staymatrix from '../assets/staymatrix.png';
import innerglow from '../assets/innerglow.png';
import securecheck from '../assets/securecheck.PNG';
import nephrotox from '../assets/nephrotox.png';
import hibiweb from '../assets/hibiweb.png';

export const STATIONS = [
    {
        // ── ABOUT ── Deep indigo / violet identity theme
        id: 'about',
        name: 'About Me',
        icon: aboutMe,
        isImg: true,
        color: '#818cf8',          // violet — billboard border & label text
        buildingColor: '#3730a3',  // deep indigo — main cube body
        roofColor: '#1e1b4b',      // dark navy — flat roof
        opacity: 1,
        headline: "Hello, I'm Hiba!",
        text: "I'm an aspiring Full Stack Developer and a pre-final year student passionate about building meaningful digital experiences. My journey began with curiosity about how websites and apps work, which grew into a strong interest in both frontend and backend development. I enjoy turning ideas into real applications and continuously improving my problem-solving skills. I'm eager to learn, build, and grow as a versatile developer, creating impactful and user-friendly solutions.",
        subheading: 'Education',
        tags: ['Creative Thinker', 'Problem Solver', 'Team Player', 'Lifelong Learner'],
        education: [
            { school: 'KRM Public School', duration: '2019 - 2020', grade: 'GRADE X' },
            { school: 'KRM Public School', duration: '2022 - 2023', grade: 'GRADE XII' },
            { school: "St. Peter's College of Engineering and Technology", duration: '2023 - 2027', grade: 'BACHELOR OF COMPUTER SCIENCE AND ENGINEERING' },
        ],
    },
    {
        // ── TECH STACKS ── Amber / orange flame expertise theme
        id: 'techstacks',
        name: 'Tech Stacks',
        icon: techStacks,
        isImg: true,
        color: '#fbbf24',          // bright gold — billboard border & label text
        buildingColor: '#b45309',  // deep amber — base tower body
        roofColor: '#78350f',      // dark brown — antenna & accents
        opacity: 1,
        tags: ['Full Stack', 'Cloud', 'AI', 'Automation'],
        technologies: [
            { name: 'Github', icon: githubIcon },
            { name: 'Docker', icon: 'https://skillicons.dev/icons?i=docker' },
            { name: 'React', icon: reactIcon },
            { name: 'Vite', icon: viteIcon },
            { name: 'Tailwind CSS', icon: 'https://skillicons.dev/icons?i=tailwind' },
            { name: 'Javascript', icon: 'https://skillicons.dev/icons?i=js' },
            { name: 'MongoDB', icon: 'https://skillicons.dev/icons?i=mongodb' },
            { name: 'Express', icon: 'https://skillicons.dev/icons?i=express' },
            { name: 'Node.js', icon: 'https://skillicons.dev/icons?i=nodejs' },
            { name: 'Clipdrop', icon: clipdropIcon },
            { name: 'Razorpay', icon: 'https://cdn.simpleicons.org/razorpay' },
            { name: 'Framer Motion', icon: 'https://cdn.simpleicons.org/framer' },
            { name: 'Shadcn UI', icon: 'https://cdn.simpleicons.org/shadcnui' },
            { name: 'Next.js', icon: 'https://skillicons.dev/icons?i=nextjs' },
            { name: 'Convex', icon: convexIcon },
            { name: 'Stack Auth', icon: stackauthIcon },
            { name: 'Deepgram', icon: deepgramIcon },
            { name: 'Amazon Polly', icon: 'https://skillicons.dev/icons?i=aws' },
            { name: 'Groq', icon: groqIcon },
            { name: 'Prebuilt UI', icon: prebuiltuiIcon },
            { name: 'Clerk', icon: clerkIcon },
            { name: 'Cloudinary', icon: cloudinaryIcon },
            { name: 'Stripe', icon: stripeIcon },
            { name: 'Nodemailer', icon: nodemailerIcon },
            { name: 'Brevo', icon: brevoIcon },
            { name: 'Three.js', icon: 'https://skillicons.dev/icons?i=threejs' },
            { name: 'TypeScript', icon: 'https://skillicons.dev/icons?i=ts' },
            { name: 'Python', icon: 'https://skillicons.dev/icons?i=py' },
            { name: 'Java', icon: 'https://skillicons.dev/icons?i=java' },
            { name: 'HTML5', icon: 'https://skillicons.dev/icons?i=html' },
            { name: 'CSS3', icon: 'https://skillicons.dev/icons?i=css' },
            { name: 'Gemini', icon: 'https://cdn.simpleicons.org/googlegemini' },
            { name: 'N8n', icon: 'https://cdn.simpleicons.org/n8n' },
            { name: 'Flowise', icon: flowiseIcon },
            { name: 'Claude', icon: claudeIcon },
            { name: 'Lovable', icon: lovableIcon },
            { name: 'Antigravity', icon: antigravityIcon },
            { name: 'ChatGPT', icon: chatgptIcon },
            { name: 'Bootstrap', icon: 'https://skillicons.dev/icons?i=bootstrap' },
            { name: 'Postman', icon: 'https://skillicons.dev/icons?i=postman' },
            { name: 'Materialize CSS', icon: materializeCssIcon },
        ],
    },
    {
        // ── CERTIFICATES & SKILLS ── Royal purple wisdom / academia theme
        id: 'certificates',
        name: 'Certificates & Skills',
        icon: certificates,
        isImg: true,
        color: '#a78bfa',          // soft violet — billboard border & label text
        buildingColor: '#6d28d9',  // rich purple — main building body
        roofColor: '#4c1d95',      // deep grape — dome & pediment
        opacity: 1,
        tags: ['Frontend', 'Design', '3D / Creative', 'Tools'],
    },
    {
        // ── PROJECTS ── Teal / cyan innovation & creation theme
        id: 'projects',
        name: 'Projects',
        icon: project,
        isImg: true,
        color: '#14b8a6',          // bright teal — billboard border & label text
        buildingColor: '#0f766e',  // deep teal — base platform & spire
        roofColor: '#0d9488',      // medium teal — cone top
        opacity: 1,
        projects: [
            {
                src: genart,
                alt: 'GenArt',
                title: 'GenArt — AI Image Generation Studio',
                description: 'A full-stack AI-powered image generation platform where users can create stunning artwork from text prompts. Features real-time generation, a personal gallery, credit-based system, and a seamless Razorpay payment flow.',
                tech: ['Vite', 'Node.js', 'MongoDB', 'Clipdrop API', 'Razorpay', 'Tailwind CSS', 'Framer Motion', 'Nodejs'],
                url: 'https://genart-gamma.vercel.app/'
            },
            {
                src: voxnova,
                alt: 'VoxNova',
                title: 'VoxNova — Learning AI Voice Agent',
                description: 'An intelligent voice and chat platform that revolutionizes learning through real-time conversational AI agents. Users can engage through both voice and chat across five core learning modes — Topic-Based Lectures, Mock Interviews, Q&A Prep, Language Learning, and Meditation — making it a complete AI-driven personal learning companion.',
                tech: ['Nextjs', 'Convex DB', 'Deepgram', 'Amazon Polly', 'Groq API', 'Stack Auth', 'Razorpay', 'Nodejs', 'Magic UI', 'Framer Motion', 'Tailwind CSS'],
                url: 'https://voxnova-three.vercel.app/'
            },
            {
                src: staymatrix,
                alt: 'StayMatrix',
                title: 'StayMatrix — Hotel Booking Platform',
                description: 'A full-stack hotel booking web app where guests can browse premium hotels, check real-time room availability by date range, and complete secure bookings with Stripe-powered payments.',
                tech: ['Vite', 'Tailwind CSS(Prebuilt UI)', 'Node.js', 'MongoDB', 'Stripe', 'Cloudinary', 'Clerk', 'Nodemailer', 'Brevo'],
                url: 'https://staymatrix.vercel.app/'
            },
            {
                src: innerglow,
                alt: 'InnerGlow',
                title: 'InnerGlow — Mixed Emotion Prediction Platform',
                description: 'A web app that uses real-time facial recognition to detect and analyze human emotions — including mixed/blended emotional states — with an integrated daily dashboard to track emotional patterns over time.',
                tech: ['Vite', 'Tailwind CSS', 'Threejs', 'Nodejs', 'Mongodb', 'Python', 'Framer Motion', 'Open router API'],
                url: 'https://emotion-compass.vercel.app/'
            },
            {
                src: securecheck,
                alt: 'SecureCheck',
                title: 'SecureCheck — Website Security Extension',
                description: 'A powerful Chrome extension that instantly evaluates the security posture of any webpage you visit. Analyzes 14+ security heuristics to generate a real-time 0–100 security score with a color-coded risk badge.',
                tech: ['JavaScript', 'Chrome Extensions API', 'REST APIs', 'HTML5', 'CSS3'],
                url: 'https://github.com/hiba',
                downloadFile: '/chrome-extension.rar',
            },
            {
                src: nephrotox,
                alt: 'NephroTox',
                title: 'NephroTox — Nephrotoxicity Prediction Application',
                description: 'A clinical decision-support web application for detecting nephrotoxicity risk. Uses ML models to analyze patient data and flag potential kidney damage from medications.',
                tech: ['Python', 'Flask', 'HTML5', 'CSS3', 'JavaScript'],
                url: 'https://nephro.vercel.app/'
            },
            {
                src: hibiweb,
                alt: 'Hibi',
                title: "Hibi — AI Personal Assistant",
                description: "A private web application built exclusively around one person — me. Trained on my own personal information, it acts as my dedicated AI companion delivering deeply personalized conversations and assistance.",
                tech: ['HTML5', 'CSS3', 'Python', 'Gemini API'],
                url: 'https://hibi-personalassistant.vercel.app/'
            },
        ]
    },
    {
        // ── CONTACT ── Warm coral / gold approachability theme
        id: 'contact',
        name: 'Contact',
        icon: contactMe,
        isImg: true,
        color: '#fb923c',          // warm orange — billboard border & label text
        buildingColor: '#c2410c',  // deep coral — main building body
        roofColor: '#7c2d12',      // dark sienna — roof overhang & chimney cap
        opacity: 1,
    },
];