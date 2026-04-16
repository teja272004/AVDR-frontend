import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";
import { Sparkles, Shirt, Zap, Camera, ArrowRight, ScanFace, Layers, ShoppingBag } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [theme, setTheme] = useState("dark");
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const howRef = useRef(null);
  const [statsAnimated, setStatsAnimated] = useState(false);
  const [howVisible, setHowVisible] = useState(false);
  const [statValues, setStatValues] = useState({ latency: 0, accuracy: 0, garments: 0, rating: 0 });

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
    const handleMouse = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.body.style.background = theme === "light" ? "#ffffff" : "#1a1714";
  }, [theme]);

  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [activeModal]);

  // Animated stat counters
  const animateStats = useCallback(() => {
    const duration = 1800;
    const start = performance.now();
    const targets = { latency: 0.3, accuracy: 98, garments: 12, rating: 4.9 };
    const ease = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const e = ease(progress);
      setStatValues({
        latency: parseFloat((e * targets.latency).toFixed(1)),
        accuracy: Math.round(e * targets.accuracy),
        garments: parseFloat((e * targets.garments).toFixed(1)),
        rating: parseFloat((e * targets.rating).toFixed(1)),
      });
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);

  // IntersectionObserver for stats + how-it-works
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === statsRef.current && entry.isIntersecting && !statsAnimated) {
            setStatsAnimated(true);
            animateStats();
          }
          if (entry.target === howRef.current && entry.isIntersecting) {
            setHowVisible(true);
          }
        });
      },
      { threshold: 0.25 }
    );
    if (statsRef.current) obs.observe(statsRef.current);
    if (howRef.current) obs.observe(howRef.current);
    return () => obs.disconnect();
  }, [statsAnimated, animateStats]);

  const parallaxX = (mousePos.x / window.innerWidth - 0.5) * 30;
  const parallaxY = (mousePos.y / window.innerHeight - 0.5) * 30;

  const MODAL_CONTENT = {
    collections: {
      title: "Collections",
      subtitle: "What you can try on today",
      categories: [
        {
          name: "Shirts",
          count: 14,
          desc: "Casual checks, graphic prints, and Oxford button-downs. Everyday styles from slim to relaxed fit.",
          color: "#B59A6A",
        },
        {
          name: "Suits",
          count: 18,
          desc: "Single-breasted, double-breasted, slim and classic cuts. From navy pinstripe to charcoal tweed.",
          color: "#6A7B9A",
        },
        {
          name: "Women",
          count: 3,
          desc: "A curated starter selection of women's tops and blazers — expanding soon.",
          color: "#9A6A7B",
        },
      ],
      note: "All garments are processed with AI background removal for clean, accurate overlays. New styles are added regularly.",
    },
    about: {
      title: "About",
      subtitle: "Why we built this",
      body: "VERA started as a final-year AI project with one question: can a camera and a neural network replace the changing room? Online shopping returns cost retailers billions annually — mostly because fit is impossible to judge from a flat product photo. We built VERA to close that gap.",
    },
  };

  const SunIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );

  const MoonIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --cream: #f5f0e8;
          --warm-white: #faf8f4;
          --charcoal: #1a1714;
          --muted: #8a8078;
          --accent: #c9a96e;
          --accent-light: #e8d5b0;
          --rose: #d4a5a5;
        }

        /* ── LIGHT MODE OVERRIDES - BRIGHT COLORS ── */
        [data-theme="light"] {
          --cream: #000000;         
          --warm-white: #ffffff;    
          --charcoal: #ffffff;      
          --muted: #4a4a4a;         
          --accent: #d98a1c;        
          --accent-light: #f5b754;  
        }
        [data-theme="light"] body { background: #ffffff; }
        [data-theme="light"] .landing { background: #ffffff; }
        [data-theme="light"] .landing::before { opacity: 0.08; }
        [data-theme="light"] .orb-1 { background: radial-gradient(circle, rgba(217,138,28,0.15) 0%, transparent 70%); }
        [data-theme="light"] .orb-2 { background: radial-gradient(circle, rgba(217,138,28,0.12) 0%, transparent 70%); }
        [data-theme="light"] .orb-3 { background: radial-gradient(circle, rgba(217,138,28,0.08) 0%, transparent 70%); }
        
        [data-theme="light"] .modal-box { background: #ffffff; border-color: rgba(0,0,0,0.1); box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
        [data-theme="light"] .modal-header { background: #ffffff; border-color: rgba(0,0,0,0.1); }
        [data-theme="light"] .tech-section { border-color: rgba(0,0,0,0.08); }
        
        [data-theme="light"] .feature-card { background: #f8f9fa; border: 1px solid rgba(0,0,0,0.05); }
        [data-theme="light"] .feature-card:hover { background: #ffffff; box-shadow: 0 10px 30px rgba(0,0,0,0.08); }
        
        /* SOLID RED in Light Mode */
        [data-theme="light"] .feature-number { color: #ff0000; }
        [data-theme="light"] .feature-card:hover .feature-number { color: #cc0000; }
        [data-theme="light"] .how-step-num { color: #ff0000; }
        
        [data-theme="light"] .features-grid { background: rgba(0,0,0,0.03); border-color: rgba(0,0,0,0.08); }
        
        [data-theme="light"] .hero-bottom { border-color: rgba(0,0,0,0.1); }
        [data-theme="light"] .stats-row { border-color: rgba(0,0,0,0.1); }
        [data-theme="light"] .stat-item { border-color: rgba(0,0,0,0.1); }
        [data-theme="light"] .collection-card { border-color: rgba(0,0,0,0.1); }
        [data-theme="light"] .collection-note { border-color: rgba(217,138,28,0.3); background: rgba(217,138,28,0.03); }
        [data-theme="light"] .team-row { border-color: rgba(0,0,0,0.08); }
        [data-theme="light"] .about-quote { border-color: rgba(0,0,0,0.08); }
        [data-theme="light"] .stack-pill { border-color: rgba(0,0,0,0.15); }
        [data-theme="light"] .nav-cta { background: var(--accent); color: #fff; }
        [data-theme="light"] .nav-cta:hover { background: var(--accent-light); }
        [data-theme="light"] .cursor-glow { background: radial-gradient(circle, rgba(217,138,28,0.08) 0%, transparent 70%); }
        [data-theme="light"] .float-label { color: rgba(0,0,0,0.25); }
        [data-theme="light"] .theme-toggle { border-color: rgba(217,138,28,0.4); color: var(--muted); }
        [data-theme="light"] .theme-toggle:hover { background: rgba(217,138,28,0.1); }
        [data-theme="light"] .cta-strip { background: linear-gradient(135deg, rgba(217,138,28,0.08) 0%, rgba(217,138,28,0.02) 100%); border-color: rgba(217,138,28,0.3); }

        /* ── LIGHT MODE: FONT OVERRIDES ── */
        [data-theme="light"] .landing { font-family: 'Montserrat', sans-serif; }
        [data-theme="light"] .nav-links li button { font-family: 'Montserrat', sans-serif; font-size: 16px; letter-spacing: 0.1em; }
        [data-theme="light"] .nav-cta { font-family: 'Montserrat', sans-serif; font-size: 15px; }
        [data-theme="light"] .theme-toggle { font-family: 'Montserrat', sans-serif; font-size: 13px;}
        [data-theme="light"] .badge { font-family: 'Montserrat', sans-serif; font-size: 15px; letter-spacing: 0.18em; }
        [data-theme="light"] .subtext { font-family: 'Montserrat', sans-serif; font-size: clamp(19px, 2vw, 24px); font-weight: 400; }
        [data-theme="light"] .cta-sub { font-family: 'Montserrat', sans-serif; font-size: 15px; }
        [data-theme="light"] .cta-main { font-family: 'Montserrat', sans-serif; font-size: 17px; padding: 22px 44px; }
        [data-theme="light"] .stat-label { font-family: 'Montserrat', sans-serif; font-size: 15px; letter-spacing: 0.1em; }
        [data-theme="light"] .feature-desc { font-family: 'Montserrat', sans-serif; font-size: 17px; line-height: 1.8; }
        [data-theme="light"] .how-step-desc { font-family: 'Montserrat', sans-serif; font-size: 17px; line-height: 1.85; }
        [data-theme="light"] .how-step-tag { font-family: 'Montserrat', sans-serif; font-size: 13px; letter-spacing: 0.15em; }
        [data-theme="light"] .float-label { font-family: 'Montserrat', sans-serif; }
        [data-theme="light"] .scroll-text { font-family: 'Montserrat', sans-serif; }
        [data-theme="light"] .cta-strip-eyebrow { font-family: 'Montserrat', sans-serif; font-size: 14px; }
        [data-theme="light"] .cta-strip-sub { font-family: 'Montserrat', sans-serif; font-size: 17px; }
        [data-theme="light"] .collection-desc { font-family: 'Montserrat', sans-serif; font-size: 16px; }
        [data-theme="light"] .collection-count { font-family: 'Montserrat', sans-serif; font-size: 14px;}
        [data-theme="light"] .collection-note { font-family: 'Montserrat', sans-serif; font-size: 15px; }
        [data-theme="light"] .about-body { font-family: 'Montserrat', sans-serif; font-size: 17px; }

        [data-theme="light"] .headline { font-family: 'Cormorant Garamond', serif; font-size: clamp(84px, 12vw, 180px); font-weight: 400; letter-spacing: -0.01em; }
        [data-theme="light"] .stat-number { font-family: 'Cormorant Garamond', serif; font-size: clamp(52px, 5.5vw, 78px); font-weight: 500; }
        [data-theme="light"] .feature-title { font-family: 'Cormorant Garamond', serif; font-size: 34px; font-weight: 500; }
        [data-theme="light"] .how-step-title { font-family: 'Cormorant Garamond', serif; font-size: 40px; font-weight: 400; }
        [data-theme="light"] .cta-strip-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(40px, 4.5vw, 64px); font-weight: 400; }
        [data-theme="light"] .modal-title { font-family: 'Cormorant Garamond', serif; font-size: 44px; font-weight: 400; }
        [data-theme="light"] .modal-subtitle { font-family: 'Montserrat', sans-serif; font-size: 16px; }
        [data-theme="light"] .about-quote { font-family: 'Cormorant Garamond', serif; font-size: 30px; font-style: italic; }
        [data-theme="light"] .collection-name { font-family: 'Cormorant Garamond', serif; font-size: 30px; font-weight: 400; }

        body { background: var(--charcoal); }

        .landing {
          min-height: 100vh;
          background: var(--charcoal);
          color: var(--cream);
          overflow: hidden;
          position: relative;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.4s ease;
        }

        .landing::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 100;
          opacity: 0.4;
        }

        .bg-mesh { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
        .mesh-orb { position: absolute; border-radius: 50%; filter: blur(120px); transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
        .orb-1 { width: 700px; height: 700px; background: radial-gradient(circle, rgba(201,169,110,0.12) 0%, transparent 70%); top: -200px; left: -200px; }
        .orb-2 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(212,165,165,0.1) 0%, transparent 70%); bottom: -100px; right: -100px; }
        .orb-3 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 70%); top: 50%; left: 50%; transform: translate(-50%, -50%); }

        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 50;
          display: flex; justify-content: space-between; align-items: center;
          padding: 28px 48px;
          opacity: 0; transform: translateY(-20px);
          transition: all 0.4s ease;
        }
        .nav.visible { opacity: 1; transform: translateY(0); }
        .nav.scrolled {
          background: rgba(26, 23, 20, 0.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          padding: 16px 48px; border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        [data-theme="light"] .nav.scrolled {
          background: rgba(255, 255, 255, 0.95); border-bottom: 1px solid rgba(0,0,0,0.1);
        }
        
        .nav-brand-container {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
        }
        .nav-logo-img { height: 110px; width: auto; transition: height 0.4s ease; cursor: pointer; display: block; }
        .nav.scrolled .nav-logo-img { height: 70px; }
        [data-theme="light"] .nav-logo-img { filter: contrast(0) brightness(0); }
        
        .nav-tagline {
          font-family: 'DM Serif Display', serif; font-style: italic; font-size: 16px;
          color: var(--accent); letter-spacing: 0.05em; transition: all 0.4s ease;
          margin-top: -10px; 
        }
        .nav.scrolled .nav-tagline { font-size: 12px; margin-top: -5px; }
        [data-theme="light"] .nav-tagline { color: var(--accent); }
        
        .nav-links { display: flex; gap: 40px; list-style: none; }
        .nav-links li button {
          font-size: 16px; font-weight: 400; letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--muted); background: none; border: none; cursor: pointer;
          transition: color 0.3s; font-family: 'DM Sans', sans-serif;
        }
        .nav-links li button:hover { color: var(--cream); }

        .theme-toggle {
          display: inline-flex; align-items: center; gap: 8px;
          background: none; border: 1px solid rgba(201,169,110,0.25);
          border-radius: 2px; padding: 9px 18px; cursor: pointer;
          color: var(--muted); font-size: 13px; font-weight: 500;
          letter-spacing: 0.15em; text-transform: uppercase;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.3s ease;
        }
        .theme-toggle:hover { background: rgba(201,169,110,0.08); border-color: rgba(201,169,110,0.5); color: var(--cream); }

        .nav-right { display: flex; align-items: center; gap: 20px; }

        .nav-cta {
          font-size: 14px; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--charcoal); background: var(--accent); border: none;
          padding: 12px 28px; border-radius: 2px; cursor: pointer; transition: all 0.3s;
        }
        .nav-cta:hover { background: var(--accent-light); transform: translateY(-1px); }

        /* ── MODAL OVERLAY ── */
        .modal-overlay {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(18, 14, 12, 0.85);
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          opacity: 0; pointer-events: none;
          transition: opacity 0.3s;
        }
        .modal-overlay.open { opacity: 1; pointer-events: all; }

        .modal-box {
          background: #1f1c18;
          border: 1px solid rgba(201,169,110,0.15);
          max-width: 720px; width: 100%;
          max-height: 88vh; overflow-y: auto;
          border-radius: 4px;
          transform: translateY(24px) scale(0.97);
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), background 0.4s;
          scrollbar-width: thin; scrollbar-color: rgba(201,169,110,0.2) transparent;
        }
        .modal-overlay.open .modal-box { transform: translateY(0) scale(1); }

        .modal-header {
          display: flex; align-items: flex-start; justify-content: space-between;
          padding: 36px 42px 28px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          position: sticky; top: 0; background: #1f1c18; z-index: 10;
          transition: background 0.4s;
        }
        .modal-title {
          font-family: 'DM Serif Display', serif; font-size: 40px;
          font-weight: 400; color: var(--cream); line-height: 1; transition: color 0.4s;
        }
        .modal-subtitle {
          font-size: 16px; font-weight: 300; color: var(--muted);
          letter-spacing: 0.08em; margin-top: 8px; transition: color 0.4s;
        }
        .modal-close {
          background: #c0392b; border: 1px solid #e74c3c;
          color: #ffffff; cursor: pointer; width: 42px; height: 42px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; border-radius: 2px; transition: all 0.2s;
          font-size: 24px; line-height: 1; font-weight: bold;
        }
        .modal-close:hover { background: #e74c3c; border-color: #ff6b6b; }
        .modal-body { padding: 36px 42px 48px; }

        /* Collections modal */
        .collection-card {
          padding: 24px 28px; border: 1px solid rgba(255,255,255,0.06);
          border-radius: 3px; margin-bottom: 16px; position: relative; overflow: hidden;
          transition: border-color 0.4s;
        }
        .collection-top { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 12px; }
        .collection-name { font-family: 'DM Serif Display', serif; font-size: 28px; color: var(--cream); transition: color 0.4s; }
        .collection-count { font-size: 14px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); transition: color 0.4s; }
        .collection-desc { font-size: 16px; font-weight: 300; line-height: 1.7; color: var(--muted); transition: color 0.4s; }
        .collection-note {
          font-size: 15px; color: var(--muted); font-weight: 300;
          padding: 16px 20px; border: 1px solid rgba(201,169,110,0.12);
          display: flex; gap: 12px; align-items: flex-start; margin-top: 8px; border-radius: 2px;
          transition: color 0.4s, border-color 0.4s;
        }
        .collection-note-dot { width: 6px; height: 6px; background: var(--accent); border-radius: 50%; flex-shrink: 0; margin-top: 6px; }

        /* About modal */
        .about-quote {
          font-family: 'DM Serif Display', serif; font-style: italic;
          font-size: 28px; line-height: 1.5; color: var(--cream);
          padding: 0 0 28px; margin-bottom: 28px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          transition: color 0.4s, border-color 0.4s;
        }
        .about-body { font-size: 17px; font-weight: 300; line-height: 1.8; color: var(--muted); margin-bottom: 28px; transition: color 0.4s; }

        /* ── HERO ── */
        .hero {
          position: relative; z-index: 10; min-height: 100vh;
          display: flex; flex-direction: column; justify-content: center;
          padding: 240px 48px 80px; 
          max-width: 1400px; margin: 0 auto;
        }
        .badge {
          display: inline-flex; align-items: center; gap: 10px; padding: 8px 20px;
          border: 1px solid rgba(201,169,110,0.3); border-radius: 2px;
          font-size: 14px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--accent); margin-bottom: 48px; width: fit-content;
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.4s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.4s, color 0.4s;
        }
        .badge.visible { opacity: 1; transform: translateY(0); }
        .badge-dot { width: 8px; height: 8px; background: var(--accent); border-radius: 50%; animation: pulse-dot 2s ease-in-out infinite; }
        @keyframes pulse-dot { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.7); } }

        .headline {
          font-family: 'DM Serif Display', serif; font-size: clamp(72px, 11vw, 150px);
          font-weight: 400; line-height: 0.92; letter-spacing: -0.02em; color: var(--cream);
          opacity: 0; transform: translateY(40px);
          transition: opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.6s, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.6s, color 0.4s;
        }
        .headline.visible { opacity: 1; transform: translateY(0); }
        
        /* CHANGED: Made "before" a solid color instead of transparent outline */
        .headline-italic { font-style: italic; color: var(--cream); }
        
        .headline-accent { color: var(--accent); }

        .hero-bottom {
          display: flex; align-items: flex-end; justify-content: space-between;
          gap: 48px; margin-top: 70px; padding-top: 40px;
          border-top: 1px solid rgba(255,255,255,0.06);
          opacity: 0; transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.9s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.9s, border-color 0.4s;
        }
        .hero-bottom.visible { opacity: 1; transform: translateY(0); }
        .subtext { font-size: clamp(18px, 1.8vw, 22px); font-weight: 300; line-height: 1.7; color: var(--muted); max-width: 480px; transition: color 0.4s; }
        .subtext strong { color: var(--cream); font-weight: 400; transition: color 0.4s; }

        .cta-group { display: flex; flex-direction: column; align-items: flex-end; gap: 16px; flex-shrink: 0; }
        .cta-main {
          position: relative; display: inline-flex; align-items: center; gap: 16px;
          padding: 24px 48px; background: var(--accent); color: var(--charcoal);
          font-size: 16px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;
          border: none; border-radius: 2px; cursor: pointer; overflow: hidden;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cta-main::before { content: ''; position: absolute; inset: 0; background: var(--accent-light); transform: translateX(-101%); transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .cta-main:hover::before { transform: translateX(0); }
        .cta-main:hover { transform: translateY(-2px); box-shadow: 0 20px 60px rgba(201,169,110,0.25); }
        .cta-main span, .cta-main svg { position: relative; z-index: 1; }
        .cta-sub { font-size: 14px; color: var(--muted); letter-spacing: 0.08em; transition: color 0.4s; }

        .stats-row {
          display: flex; gap: 0; margin-top: 100px; padding-top: 56px;
          border-top: 1px solid rgba(255,255,255,0.06);
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.1s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.1s, border-color 0.4s;
        }
        .stats-row.visible { opacity: 1; transform: translateY(0); }
        .stat-item { flex: 1; padding: 0 40px 0 0; border-right: 1px solid rgba(255,255,255,0.06); margin-right: 40px; transition: border-color 0.4s; }
        .stat-item:last-child { border-right: none; margin-right: 0; }
        .stat-number { font-family: 'DM Serif Display', serif; font-size: clamp(44px, 5vw, 68px); color: var(--cream); line-height: 1; margin-bottom: 8px; transition: color 0.4s; }
        .stat-number span { color: var(--accent); }
        .stat-label { font-size: 14px; font-weight: 300; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); transition: color 0.4s; }

        .features-section { position: relative; z-index: 10; padding: 0 48px 100px; max-width: 1400px; margin: 0 auto; }
        .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.06); border-radius: 4px; overflow: hidden; transition: background 0.4s, border-color 0.4s; }
        .feature-card { background: var(--charcoal); padding: 56px 48px; position: relative; overflow: hidden; transition: background 0.4s; }
        .feature-card::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(201,169,110,0.04) 0%, transparent 60%); opacity: 0; transition: opacity 0.4s; }
        .feature-card:hover::before { opacity: 1; }
        
        /* SOLID RED NUMBERS */
        .feature-number { font-family: 'DM Serif Display', serif; font-style: italic; font-size: 84px; color: #ff0000; line-height: 1; margin-bottom: 28px; transition: color 0.4s; }
        .feature-card:hover .feature-number { color: #cc0000; }
        
        .feature-icon { width: 56px; height: 56px; border: 1px solid rgba(201,169,110,0.2); border-radius: 3px; display: flex; align-items: center; justify-content: center; color: var(--accent); margin-bottom: 28px; transition: all 0.4s; }
        .feature-card:hover .feature-icon { background: rgba(201,169,110,0.08); border-color: rgba(201,169,110,0.4); }
        .feature-title { font-family: 'DM Serif Display', serif; font-size: 30px; color: var(--cream); margin-bottom: 16px; transition: color 0.4s; }
        .feature-desc { font-size: 17px; font-weight: 300; line-height: 1.7; color: var(--muted); transition: color 0.4s; }

        /* ── HOW IT WORKS ── */
        .how-section {
          position: relative; z-index: 10;
          padding: 0 48px 140px; max-width: 1400px; margin: 0 auto;
        }
        .how-header {
          display: flex; align-items: center; gap: 24px;
          margin-bottom: 84px;
        }
        .how-header-line { flex: 1; height: 1px; background: rgba(255,255,255,0.06); transition: background 0.4s; }
        [data-theme="light"] .how-header-line { background: rgba(0,0,0,0.08); }
        .how-label {
          font-size: 12px; font-weight: 500; letter-spacing: 0.3em; text-transform: uppercase;
          color: var(--accent); white-space: nowrap;
        }
        .how-steps {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 0; position: relative;
        }
        .how-step {
          padding: 0 48px;
          border-right: 1px solid rgba(255,255,255,0.06);
          opacity: 0; transform: translateY(40px);
          transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1), border-color 0.4s;
        }
        [data-theme="light"] .how-step { border-color: rgba(0,0,0,0.08); }
        .how-step:first-child { padding-left: 0; }
        .how-step:last-child { border-right: none; }
        .how-step.visible { opacity: 1; transform: translateY(0); }
        .how-step:nth-child(1) { transition-delay: 0.1s; }
        .how-step:nth-child(2) { transition-delay: 0.25s; }
        .how-step:nth-child(3) { transition-delay: 0.4s; }
        
        /* SOLID RED NUMBERS */
        .how-step-num {
          font-family: 'DM Serif Display', serif; font-style: italic;
          font-size: 96px; line-height: 1;
          color: #ff0000; margin-bottom: 32px;
          transition: color 0.4s;
        }
        
        .how-step-icon-wrap {
          width: 64px; height: 64px;
          border: 1px solid rgba(201,169,110,0.2); border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: var(--accent); margin-bottom: 28px;
          background: rgba(201,169,110,0.04);
          transition: border-color 0.4s, background 0.4s;
        }
        .how-step:hover .how-step-icon-wrap {
          background: rgba(201,169,110,0.1); border-color: rgba(201,169,110,0.5);
        }
        .how-step-title {
          font-family: 'DM Serif Display', serif; font-size: 34px;
          color: var(--cream); margin-bottom: 18px; line-height: 1.1;
          transition: color 0.4s;
        }
        .how-step-desc {
          font-size: 17px; font-weight: 300; line-height: 1.75;
          color: var(--muted); transition: color 0.4s;
        }
        .how-step-tag {
          display: inline-flex; align-items: center; gap: 8px;
          margin-top: 28px; padding: 6px 16px;
          border: 1px solid rgba(201,169,110,0.2); border-radius: 2px;
          font-size: 12px; font-weight: 500; letter-spacing: 0.18em;
          text-transform: uppercase; color: var(--accent);
          transition: border-color 0.4s;
        }

        /* ── CTA STRIP ── */
        .cta-strip {
          position: relative; z-index: 10;
          margin: 0 48px 120px;
          background: linear-gradient(135deg, rgba(201,169,110,0.08) 0%, rgba(201,169,110,0.02) 100%);
          border: 1px solid rgba(201,169,110,0.15);
          border-radius: 4px;
          padding: 72px 84px;
          display: flex; align-items: center; justify-content: space-between; gap: 48px;
          max-width: 1304px; margin-left: auto; margin-right: auto;
          opacity: 0; transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1) 0.5s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.5s, background 0.4s, border-color 0.4s;
        }
        .cta-strip.visible { opacity: 1; transform: translateY(0); }
        .cta-strip-left {}
        .cta-strip-eyebrow {
          font-size: 12px; font-weight: 500; letter-spacing: 0.25em;
          text-transform: uppercase; color: var(--accent); margin-bottom: 16px;
        }
        .cta-strip-title {
          font-family: 'DM Serif Display', serif; font-size: clamp(34px, 4.5vw, 54px);
          color: var(--cream); line-height: 1.1; transition: color 0.4s;
        }
        .cta-strip-title em { font-style: italic; color: var(--accent); }
        .cta-strip-sub {
          font-size: 17px; font-weight: 300; color: var(--muted);
          margin-top: 14px; transition: color 0.4s;
        }

        @media (max-width: 768px) {
          .nav { padding: 20px 24px; }
          .nav-links { display: none; }
          .hero { padding: 180px 24px 60px; } 
          .hero-bottom { flex-direction: column; align-items: flex-start; }
          .cta-group { align-items: flex-start; }
          .features-section { padding: 0 24px 80px; }
          .features-grid { grid-template-columns: 1fr; }
          .stats-row { gap: 32px; overflow-x: auto; }
          .stat-item { min-width: 120px; }
          .modal-body { padding: 24px 20px 32px; }
          .modal-header { padding: 24px 20px 18px; }
          .theme-toggle span { display: none; }
          .how-section { padding: 0 24px 80px; }
          .how-steps { grid-template-columns: 1fr; gap: 48px; }
          .how-step { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.06); padding: 0 0 48px; }
          .how-step:last-child { border-bottom: none; padding-bottom: 0; }
          .cta-strip { flex-direction: column; align-items: flex-start; padding: 40px 32px; margin: 0 24px 80px; }
        }

        .float-label { position: fixed; top: 50%; right: 32px; transform: translateY(-50%) rotate(90deg); font-size: 12px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(255,255,255,0.15); z-index: 50; transition: color 0.4s; }
        .scroll-indicator { position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 12px; z-index: 50; opacity: 0; transition: opacity 0.5s 1.5s; }
        .scroll-indicator.visible { opacity: 1; }
        .scroll-line { width: 1px; height: 60px; background: linear-gradient(to bottom, var(--accent), transparent); animation: scroll-anim 2s ease-in-out infinite; }
        @keyframes scroll-anim { 0% { transform: scaleY(0); transform-origin: top; } 50% { transform: scaleY(1); transform-origin: top; } 51% { transform: scaleY(1); transform-origin: bottom; } 100% { transform: scaleY(0); transform-origin: bottom; } }
        .scroll-text { font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: var(--muted); transition: color 0.4s; }
        .cursor-glow { position: fixed; width: 300px; height: 300px; border-radius: 50%; background: radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%); pointer-events: none; z-index: 0; transform: translate(-50%, -50%); transition: left 0.4s ease, top 0.4s ease; }
      `}</style>

      <div className="landing">
        <div className="cursor-glow" style={{ left: mousePos.x, top: mousePos.y }} />

        <div className="bg-mesh">
          <div className="mesh-orb orb-1" style={{ transform: `translate(${parallaxX * 0.5}px, ${parallaxY * 0.5}px)` }} />
          <div className="mesh-orb orb-2" style={{ transform: `translate(${-parallaxX * 0.3}px, ${-parallaxY * 0.3}px)` }} />
          <div className="mesh-orb orb-3" />
        </div>

        <div className={`scroll-indicator ${loaded ? "visible" : ""}`}>
          <div className="scroll-line" />
          <span className="scroll-text">Scroll</span>
        </div>

        {/* Nav */}
        <nav className={`nav ${loaded ? "visible" : ""} ${scrollY > 50 ? "scrolled" : ""}`}>
          <div className="nav-brand-container">
            <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
              <img src="/vera_logo_transparent.png" alt="VERA" className="nav-logo-img" />
            </a>
            <span className="nav-tagline">The future of fashion</span>
          </div>

          <ul className="nav-links">
            <li><button onClick={() => setActiveModal("collections")}>Collections</button></li>
            <li><button onClick={() => setActiveModal("about")}>About</button></li>
          </ul>
          <div className="nav-right">
            <button
              className="theme-toggle"
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              aria-label="Toggle dark/light mode"
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
              <span>{theme === "dark" ? "Light" : "Dark"}</span>
            </button>
            <button className="nav-cta" onClick={() => navigate("/dashboard")}>Try Now</button>
          </div>
        </nav>

        {/* Hero */}
        <section className="hero" ref={heroRef}>
          <div className={`badge ${loaded ? "visible" : ""}`}>
            <div className="badge-dot" />
            AI Vision Technology
          </div>
          <div>
            <h1 className={`headline ${loaded ? "visible" : ""}`}>
              Wear it<br />
              <span className="headline-italic">before</span><br />
              <span className="headline-accent">you own it.</span>
            </h1>
          </div>
          <div className={`hero-bottom ${loaded ? "visible" : ""}`}>
            <p className="subtext">
              Our <strong>neural vision engine</strong> maps your exact body in real-time — every curve, proportion, and contour — delivering a try-on experience so precise, it feels physical.
            </p>
            <div className="cta-group">
              <button className="cta-main" onClick={() => navigate("/dashboard")}>
                <span>Enter Wardrobe</span>
                <ArrowRight size={18} />
              </button>
              <span className="cta-sub">No account needed · Free to try</span>
            </div>
          </div>
          <div className={`stats-row ${loaded ? "visible" : ""}`} ref={statsRef}>
            {[
              { key: "latency", display: statValues.latency.toFixed(1), unit: "ms", label: "Render latency" },
              { key: "accuracy", display: String(statValues.accuracy), unit: "%", label: "Fit accuracy" },
              { key: "garments", display: statValues.garments.toFixed(0) + "K", unit: "+", label: "Garments indexed" },
              { key: "rating", display: statValues.rating.toFixed(1), unit: "★", label: "User rating" },
            ].map((s) => (
              <div key={s.key} className="stat-item">
                <div className="stat-number">{s.display}<span>{s.unit}</span></div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="features-section">
          <div className="features-grid">
            {[
              { n: "01", icon: <Camera size={26} />, title: "Live Body Tracking", desc: "Real-time skeletal and surface segmentation maps 47 body landmarks at 120fps for flawless garment anchoring." },
              { n: "02", icon: <Zap size={26} />, title: "Instant Fit Engine", desc: "Sub-millisecond cloth simulation physics render drape, stretch, and shadow with cinematic realism." },
              { n: "03", icon: <Shirt size={26} />, title: "True Proportions", desc: "Our 3D warp engine scales fabric geometry to your exact measurements — no guesswork, no surprises at checkout." },
            ].map((f) => (
              <div key={f.n} className="feature-card">
                <div className="feature-number">{f.n}</div>
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="how-section" ref={howRef}>
          <div className="how-header">
            <div className="how-header-line" />
            <span className="how-label">How It Works</span>
            <div className="how-header-line" />
          </div>
          <div className="how-steps">
            {[
              {
                n: "01",
                icon: <ScanFace size={28} />,
                title: "Point your camera",
                desc: "Open the fitting room on any device — no app needed. Your browser streams your live camera feed securely. No footage is ever stored.",
                tag: "Real-time · 30fps",
              },
              {
                n: "02",
                icon: <Layers size={28} />,
                title: "AI maps your body",
                desc: "MediaPipe detects 33 skeletal landmarks in milliseconds. Our warp engine calculates your exact shoulder width, torso length, and posture angle on every frame.",
                tag: "MediaPipe · OpenCV",
              },
              {
                n: "03",
                icon: <ShoppingBag size={28} />,
                title: "See it on you",
                desc: "The garment is perspective-warped, alpha-blended, and streamed back to your screen in under 400ms — so real you'll reach for the collar.",
                tag: "< 400ms round-trip",
              },
            ].map((step) => (
              <div key={step.n} className={`how-step ${howVisible ? "visible" : ""}`}>
                <div className="how-step-num">{step.n}</div>
                <div className="how-step-icon-wrap">{step.icon}</div>
                <h3 className="how-step-title">{step.title}</h3>
                <p className="how-step-desc">{step.desc}</p>
                <span className="how-step-tag">{step.tag}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Strip */}
        <div className={`cta-strip ${howVisible ? "visible" : ""}`}>
          <div className="cta-strip-left">
            <div className="cta-strip-eyebrow">Ready to try?</div>
            <div className="cta-strip-title">Your wardrobe,<br /><em>reimagined.</em></div>
            <p className="cta-strip-sub">No account needed. Works on any device with a camera.</p>
          </div>
          <button className="cta-main" onClick={() => navigate("/dashboard")} style={{ flexShrink: 0 }}>
            <span>Enter Wardrobe</span>
            <ArrowRight size={18} />
          </button>
        </div>

      </div>

      {/* ── MODAL ── */}
      <div
        className={`modal-overlay ${activeModal ? "open" : ""}`}
        onClick={(e) => { if (e.target.classList.contains("modal-overlay")) setActiveModal(null); }}
      >
        <div className="modal-box">

          {activeModal === "collections" && (() => {
            const c = MODAL_CONTENT.collections;
            return <>
              <div className="modal-header">
                <div>
                  <div className="modal-title">{c.title}</div>
                  <div className="modal-subtitle">{c.subtitle}</div>
                </div>
                <button className="modal-close" onClick={() => setActiveModal(null)}>×</button>
              </div>
              <div className="modal-body">
                {c.categories.map((cat) => (
                  <div className="collection-card" key={cat.name}>
                    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: cat.color, borderRadius: "3px 0 0 3px" }} />
                    <div className="collection-top">
                      <div className="collection-name">{cat.name}</div>
                      <div className="collection-count">{cat.count} garments</div>
                    </div>
                    <div className="collection-desc">{cat.desc}</div>
                  </div>
                ))}
                <div className="collection-note">
                  <div className="collection-note-dot" />
                  <span>{c.note}</span>
                </div>
              </div>
            </>;
          })()}

          {activeModal === "about" && (() => {
            const c = MODAL_CONTENT.about;
            return <>
              <div className="modal-header">
                <div>
                  <div className="modal-title">{c.title}</div>
                  <div className="modal-subtitle">{c.subtitle}</div>
                </div>
                <button className="modal-close" onClick={() => setActiveModal(null)}>×</button>
              </div>
              <div className="modal-body">
                <div className="about-quote">"Can a camera and a neural network replace the changing room?"</div>
                <div className="about-body">{c.body}</div>
              </div>
            </>;
          })()}
        </div>
      </div>
    </>
  );
}