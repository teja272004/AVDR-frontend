import { useRef, useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { processTryOnFrame, getShirts } from "../services/api";
import SizeAnalysis from "../components/SizeAnalysis";

// ── Fonts ────────────────────────────────────────────────────────────────────
if (!document.getElementById("dr-fonts")) {
  const l = document.createElement("link");
  l.id = "dr-fonts"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap";
  document.head.appendChild(l);
}

// ── Styles ───────────────────────────────────────────────────────────────────
if (!document.getElementById("dr-styles")) {
  const s = document.createElement("style");
  s.id = "dr-styles";
  s.textContent = `
    :root {
      --ink:      #12100E;
      --cream:    #F7F4EF;
      --parchment:#EDE9E0;
      --gold:     #B59A6A;
      --gold-lt:  #D4BC94;
      --muted:    #8A8480;
      --border:   #E0DAD1;
      --white:    #FFFFFF;
    }

    .dr-root {
      min-height: 100vh;
      background: var(--cream);
      font-family: 'Jost', sans-serif;
      color: var(--ink);
      display: flex;
      flex-direction: column;
    }

    /* ── TOPBAR ── */
    .dr-bar {
      height: 64px;
      background: var(--white);
      border-bottom: 1px solid var(--border);
      display: flex; align-items: center;
      padding: 0 40px;
      gap: 20px;
      position: sticky; top: 0; z-index: 50;
    }
    .dr-back {
      display: flex; align-items: center; gap: 8px;
      background: none; border: 1px solid var(--border);
      padding: 7px 18px; border-radius: 2px;
      font-family: 'Jost', sans-serif;
      font-size: 11px; font-weight: 500;
      letter-spacing: 0.14em; text-transform: uppercase;
      color: var(--muted); cursor: pointer;
      transition: color 0.2s, border-color 0.2s;
    }
    .dr-back:hover { color: var(--ink); border-color: var(--ink); }
    .dr-back svg { width: 14px; height: 14px; }
    .dr-title {
      font-family: 'Cormorant Garamond', serif;
      font-weight: 300; font-size: 22px;
      letter-spacing: 0.12em; text-transform: uppercase;
      color: var(--ink);
    }
    .dr-title em { font-style: italic; color: var(--gold); }
    .dr-dot {
      width: 4px; height: 4px; border-radius: 50%;
      background: var(--gold); margin-left: auto;
      box-shadow: 0 0 8px var(--gold);
      animation: dr-pulse 2s ease-in-out infinite;
    }
    @keyframes dr-pulse {
      0%,100% { opacity: 1; transform: scale(1); }
      50%      { opacity: 0.4; transform: scale(0.7); }
    }

    /* ── BODY ── */
    .dr-body {
      flex: 1;
      display: grid;
      grid-template-columns: 1fr 2.2fr 280px;
      gap: 24px;
      padding: 32px 40px 48px;
      max-width: 1400px;
      width: 100%;
      margin: 0 auto;
      align-items: start;
    }

    /* ── PANEL shared ── */
    .dr-panel {
      background: var(--white);
      border: 1px solid var(--border);
    }
    .dr-panel-label {
      padding: 12px 18px;
      font-size: 10px; font-weight: 500;
      letter-spacing: 0.2em; text-transform: uppercase;
      color: var(--muted);
      border-bottom: 1px solid var(--border);
      display: flex; align-items: center; gap: 8px;
    }
    .dr-panel-label::before {
      content: '';
      display: inline-block; width: 2px; height: 12px;
      background: var(--gold);
    }

    /* ── RAW CAM ── */
    .dr-cam-wrap {
      background: var(--ink);
      overflow: hidden;
      aspect-ratio: 4/3;
    }
    .dr-cam-wrap video,
    .dr-cam-wrap canvas { width: 100%; height: 100%; object-fit: cover; display: block; }

    /* ── MIRROR ── */
    .dr-mirror-wrap {
      background: var(--ink);
      overflow: hidden;
      position: relative;
      min-height: 500px;
      display: flex; align-items: center; justify-content: center;
    }
    .dr-mirror-wrap img {
      width: 100%; height: 100%; object-fit: contain; display: block;
    }
    .dr-mirror-placeholder {
      display: flex; flex-direction: column;
      align-items: center; gap: 16px;
      color: rgba(255,255,255,0.3);
    }
    .dr-mirror-placeholder svg { width: 48px; height: 48px; opacity: 0.3; }
    .dr-mirror-placeholder p {
      font-size: 12px; letter-spacing: 0.18em;
      text-transform: uppercase; font-weight: 300;
    }
    .dr-processing-bar {
      position: absolute; bottom: 0; left: 0; right: 0;
      height: 2px; background: rgba(255,255,255,0.05);
      overflow: hidden;
    }
    .dr-processing-bar.active::after {
      content: '';
      position: absolute; top: 0; left: -40%;
      width: 40%; height: 100%;
      background: linear-gradient(90deg, transparent, var(--gold), transparent);
      animation: dr-scan 1.2s ease-in-out infinite;
    }
    @keyframes dr-scan {
      from { left: -40%; }
      to   { left: 100%; }
    }

    /* ── SIZE PANEL ── */
    .dr-size-body { padding: 20px 18px 24px; }
    .dr-size-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 8px;
      margin-bottom: 20px;
    }
    .dr-sz {
      aspect-ratio: 1;
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 600;
      letter-spacing: 0.1em;
      border: 1px solid var(--border);
      background: var(--cream);
      color: var(--muted);
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
    }
    .dr-sz:hover { border-color: var(--gold-lt); color: var(--ink); }
    .dr-sz.active { background: var(--ink); border-color: var(--ink); color: var(--white); }
    .dr-sz.active::after {
      content: '';
      position: absolute; bottom: 4px; left: 50%; transform: translateX(-50%);
      width: 16px; height: 1px; background: var(--gold);
    }

    /* ── RECOMMENDATIONS ── */
    .dr-rec-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 18px;
    }
    .dr-rec-img-wrap {
      background: var(--parchment); border: 1px solid var(--border);
      aspect-ratio: 3/4; position: relative; cursor: pointer; transition: border-color 0.2s;
    }
    .dr-rec-img-wrap:hover { border-color: var(--gold); }
    .dr-rec-img-wrap img { width: 100%; height: 100%; object-fit: contain; padding: 4px; }

    .dr-divider { height: 1px; background: var(--border); margin: 20px 0; }
    .dr-hint {
      font-size: 10px; color: var(--muted);
      font-weight: 300; letter-spacing: 0.06em;
      line-height: 1.7; text-align: center;
    }

    /* ── BOTTOM DISCLAIMER ── */
    .dr-bottom-disclaimer {
      background: #c8882a;
      color: #fff;
      text-align: center;
      padding: 11px 24px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.09em;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      position: sticky;
      bottom: 0;
      z-index: 40;
    }

    /* ── WISHLIST BUTTON ── */
    .dr-wish-btn {
      width: 100%;
      display: flex; align-items: center; justify-content: center; gap: 10px;
      padding: 13px 0;
      font-family: 'Jost', sans-serif;
      font-size: 11px; font-weight: 600;
      letter-spacing: 0.18em; text-transform: uppercase;
      border: 1px solid var(--border);
      background: var(--cream);
      color: var(--muted);
      cursor: pointer;
      transition: all 0.25s ease;
      position: relative; overflow: hidden;
    }
    .dr-wish-btn:hover {
      border-color: var(--gold);
      color: var(--ink);
      background: rgba(181,154,106,0.06);
    }
    .dr-wish-btn.wished {
      background: var(--ink);
      border-color: var(--ink);
      color: #FFFFFF;
    }
    .dr-wish-btn.wished:hover {
      background: #2a2724;
      border-color: #2a2724;
    }
    .dr-wish-btn svg {
      flex-shrink: 0;
      transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
    }
    .dr-wish-btn.wished svg { transform: scale(1.25); }
    @keyframes dr-heart-pop {
      0%   { transform: scale(1); }
      40%  { transform: scale(1.5); }
      70%  { transform: scale(0.9); }
      100% { transform: scale(1.25); }
    }
    .dr-wish-btn.pop svg { animation: dr-heart-pop 0.4s cubic-bezier(0.34,1.56,0.64,1); }

    /* ── TOAST ── */
    .dr-toast {
      position: fixed; bottom: 72px; left: 50%; transform: translateX(-50%);
      background: var(--ink); color: #FFFFFF;
      font-family: 'Jost', sans-serif; font-size: 11px; font-weight: 500;
      letter-spacing: 0.14em; text-transform: uppercase;
      padding: 10px 22px; border-radius: 2px;
      z-index: 9999; pointer-events: none;
      animation: dr-toast-in 0.3s ease, dr-toast-out 0.3s ease 1.7s forwards;
      display: flex; align-items: center; gap: 8px;
      white-space: nowrap;
      box-shadow: 0 8px 32px rgba(0,0,0,0.22);
    }
    @keyframes dr-toast-in  { from { opacity:0; transform:translateX(-50%) translateY(10px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
    @keyframes dr-toast-out { from { opacity:1; } to { opacity:0; } }

    /* ── POPUP ANIMATIONS ── */
    @keyframes dr-overlay-in {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes dr-popup-up {
      from { opacity: 0; transform: translateY(32px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes dr-shake {
      0%,100% { transform: translateX(0); }
      20%     { transform: translateX(-4px); }
      40%     { transform: translateX(4px); }
      60%     { transform: translateX(-3px); }
      80%     { transform: translateX(3px); }
    }

    @media (max-width: 900px) {
      .dr-body { grid-template-columns: 1fr; padding: 20px; }
    }
  `;
  document.head.appendChild(s);
}

// ── Icons ────────────────────────────────────────────────────────────────────
const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M19 12H5M5 12l7-7M5 12l7 7" />
  </svg>
);

const MirrorIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1">
    <rect x="8" y="6" width="32" height="36" rx="2" />
    <line x1="24" y1="42" x2="24" y2="46" />
    <line x1="16" y1="46" x2="32" y2="46" />
    <circle cx="24" cy="24" r="8" />
  </svg>
);

// ── Disclaimer Popup ─────────────────────────────────────────────────────────
function DisclaimerPopup({ onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(18, 16, 14, 0.75)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "dr-overlay-in 0.3s ease",
        fontFamily: "'Jost', sans-serif",
      }}
    >
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E0DAD1",
          maxWidth: "440px",
          width: "90%",
          padding: "44px 40px 36px",
          textAlign: "center",
          position: "relative",
          animation: "dr-popup-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
        }}
      >
        {/* Mirror emoji */}
        <div style={{ fontSize: "42px", marginBottom: "12px" }}>🪞</div>

        {/* Gold line */}
        <div style={{
          width: "32px", height: "2px",
          background: "#B59A6A",
          margin: "0 auto 20px",
        }} />

        {/* Title */}
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "24px",
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#12100E",
          marginBottom: "14px",
        }}>
          Welcome to the{" "}
          <em style={{ fontStyle: "italic", color: "#B59A6A" }}>Fitting Room</em>
        </div>

        {/* Body text */}
        <div style={{
          fontSize: "13px",
          color: "#8A8480",
          lineHeight: 1.8,
          letterSpacing: "0.04em",
          marginBottom: "22px",
        }}>
          Our AI Magic Mirror overlays garments on your live camera feed in real time.
          Stand <strong style={{ color: "#12100E" }}>1–2 metres</strong> from the camera
          in good lighting for the best experience.
        </div>

        {/* Warning box */}
        <div style={{
          background: "rgba(200, 136, 42, 0.09)",
          border: "1px solid rgba(200, 136, 42, 0.4)",
          borderRadius: "4px",
          padding: "14px 18px",
          marginBottom: "28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
        }}>
          <span style={{ fontSize: "18px" }}>⚠️</span>
          <span style={{
            fontSize: "12px",
            fontWeight: 700,
            color: "#c8882a",
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            lineHeight: 1.5,
            textAlign: "left",
          }}>
            VERA AI may occasionally miscalculate.<br />
            Please use results as a reference only.
          </span>
        </div>

        {/* CTA Button */}
        <button
          onClick={onClose}
          style={{
            background: "#12100E",
            color: "#FFFFFF",
            border: "none",
            padding: "14px 0",
            width: "100%",
            fontFamily: "'Jost', sans-serif",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#2a2724"}
          onMouseLeave={e => e.currentTarget.style.background = "#12100E"}
        >
          Got it — Let's Start
        </button>
      </div>
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────────────────
// ── Heart Icon ────────────────────────────────────────────────────────────────
const HeartIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor"
    strokeWidth="1.5" width="16" height="16" style={{ display: 'block' }}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

export default function DressingRoom() {
  const { shirtId } = useParams();
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [processedFrame, setProcessedFrame] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedSize, setSelectedSize] = useState("L");
  const [randomShirts, setRandomShirts] = useState([]);
  const [fitStatus, setFitStatus] = useState("Analyzing...");
  const [showPopup, setShowPopup] = useState(true);
  const [wishlist, setWishlist] = useState(
    () => JSON.parse(localStorage.getItem('vera_wishlist') || '[]')
  );
  const [toastMsg, setToastMsg] = useState(null);
  const [heartPop, setHeartPop] = useState(false);

  // Sync wishlist with other tabs
  useEffect(() => {
    const sync = () => setWishlist(JSON.parse(localStorage.getItem('vera_wishlist') || '[]'));
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const isWished = wishlist.includes(String(shirtId));

  const toggleWishlist = () => {
    const newWs = isWished
      ? wishlist.filter(id => id !== String(shirtId))
      : [...wishlist, String(shirtId)];
    setWishlist(newWs);
    localStorage.setItem('vera_wishlist', JSON.stringify(newWs));
    window.dispatchEvent(new Event('storage'));
    if (!isWished) {
      setHeartPop(true);
      setTimeout(() => setHeartPop(false), 450);
      setToastMsg('♥ Added to Wishlist');
    } else {
      setToastMsg('Removed from Wishlist');
    }
    setTimeout(() => setToastMsg(null), 2100);
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await getShirts();
        const others = data.filter(s => String(s.id) !== String(shirtId));
        const shuffled = others.sort(() => 0.5 - Math.random());
        setRandomShirts(shuffled.slice(0, 4));
      } catch (e) {
        console.error(e);
      }
    })();
  }, [shirtId]);

  const captureAndProcess = useCallback(async () => {
    if (webcamRef.current?.video?.readyState === 4 && !isProcessing) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc && imageSrc.length > 50) {
        setIsProcessing(true);
        try {
          const result = await processTryOnFrame(shirtId, imageSrc, selectedSize);
          if (result.processed_image?.includes(",")) {
            setProcessedFrame(result.processed_image);
            if (result.fit_status) setFitStatus(result.fit_status);
          }
        } catch (e) {
          console.error("Frame error:", e);
        } finally {
          setIsProcessing(false);
        }
      }
    }
  }, [webcamRef, isProcessing, shirtId, selectedSize]);

  useEffect(() => {
    const id = setInterval(captureAndProcess, 350);
    return () => clearInterval(id);
  }, [captureAndProcess]);

  const SIZES = ["S", "M", "L", "XL", "XXL", "XXXL"];

  return (
    <div className="dr-root">

      {/* TOAST */}
      {toastMsg && (
        <div className="dr-toast">
          {toastMsg.includes('♥') ? '♥' : '✕'} {toastMsg.replace('♥ ', '')}
        </div>
      )}

      {/* POPUP — rendered first, uses position:fixed + z-index:99999 */}
      {showPopup && <DisclaimerPopup onClose={() => setShowPopup(false)} />}

      {/* TOPBAR */}
      <header className="dr-bar">
        <button className="dr-back" onClick={() => navigate("/dashboard")}>
          <ArrowLeftIcon /> Collection
        </button>
        <h1 className="dr-title">Fitting <em>Room</em></h1>
        <div className="dr-dot" />
      </header>

      {/* BODY */}
      <main className="dr-body">

        {/* LEFT: Camera + Recommendations */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div className="dr-panel">
            <div className="dr-panel-label">Camera</div>
            <div className="dr-cam-wrap">
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: "user" }}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
          </div>

          {randomShirts.length > 0 && (
            <div className="dr-panel">
              <div className="dr-panel-label">Try these too</div>
              <div className="dr-rec-grid">
                {randomShirts.map(rs => (
                  <div
                    key={rs.id}
                    className="dr-rec-img-wrap"
                    title={rs.name}
                    onClick={() => navigate(`/try-on/${rs.id}?size=${selectedSize}`)}
                  >
                    <img src={rs.image_url} alt={rs.name} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CENTER: AI Mirror */}
        <div className="dr-panel">
          <div className="dr-panel-label">AI Magic Mirror</div>
          <div className="dr-mirror-wrap">
            {processedFrame ? (
              <img src={processedFrame} alt="Try-On" />
            ) : (
              <div className="dr-mirror-placeholder">
                <MirrorIcon />
                <p>Warming up engine…</p>
              </div>
            )}
            <div className={`dr-processing-bar ${isProcessing ? "active" : ""}`} />
          </div>
        </div>

        {/* RIGHT: Size + Fit Insight */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div className="dr-panel">
            <div className="dr-panel-label">Select Size</div>
            <div className="dr-size-body">
              <div className="dr-size-grid">
                {SIZES.map((sz) => (
                  <button
                    key={sz}
                    className={`dr-sz ${selectedSize === sz ? "active" : ""}`}
                    onClick={() => setSelectedSize(sz)}
                  >
                    {sz}
                  </button>
                ))}
              </div>
              <div className="dr-divider" />
              <p className="dr-hint">
                Stand 1–2 metres from camera.<br />
                Ensure good lighting for best results.
              </p>
              <div style={{ marginTop: "16px" }}>
                <button
                  className={`dr-wish-btn ${isWished ? 'wished' : ''} ${heartPop ? 'pop' : ''}`}
                  onClick={toggleWishlist}
                  title={isWished ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <HeartIcon filled={isWished} />
                  {isWished ? 'Wishlisted' : 'Add to Wishlist'}
                </button>
              </div>
            </div>
          </div>

          <div className="dr-panel">
            <SizeAnalysis fitStatus={fitStatus} selectedSize={selectedSize} />
          </div>
        </div>

      </main>

      {/* STICKY BOTTOM DISCLAIMER */}
      <div className="dr-bottom-disclaimer">
        ⚠️ &nbsp;Note: VERA AI may occasionally miscalculate — please use as a reference only.
      </div>

    </div>
  );
}