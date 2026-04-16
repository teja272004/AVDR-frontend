import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getShirts } from "../services/api";
import { useToast } from "../components/ToastProvider";

if (!document.getElementById("pd-styles")) {
  const s = document.createElement("style");
  s.id = "pd-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Jost:wght@300;400;500;600&display=swap');

    .pd-root {
      min-height:100vh; background:var(--cream,#F7F4EF);
      font-family:'Jost',sans-serif; color:#1A1714;
    }

    /* TOPBAR */
    .pd-bar {
      height:64px; background:#fff; border-bottom:1px solid #E0DAD1;
      display:flex; align-items:center; padding:0 40px; gap:20px;
      position:sticky; top:0; z-index:50;
    }
    .pd-back {
      display:flex; align-items:center; gap:8px;
      background:none; border:1px solid #E0DAD1; padding:7px 18px;
      font-family:'Jost',sans-serif; font-size:11px; font-weight:500;
      letter-spacing:0.14em; text-transform:uppercase; color:#8A8480;
      cursor:pointer; transition:color 0.2s, border-color 0.2s;
    }
    .pd-back:hover { color:#1A1714; border-color:#1A1714; }
    .pd-bar-title {
      font-family:'Cormorant Garamond',serif; font-weight:300; font-size:20px;
      letter-spacing:0.1em; color:#1A1714;
    }

    /* LAYOUT */
    .pd-body {
      max-width:1100px; margin:0 auto;
      padding:48px 40px 80px;
      display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:start;
    }

    /* IMAGE SIDE */
    .pd-img-wrap {
      position:sticky; top:88px;
      background:#EDE9E0; overflow:hidden;
      aspect-ratio:3/4;
    }
    .pd-img-wrap img { width:100%; height:100%; object-fit:cover; display:block; }
    .pd-img-badge {
      position:absolute; top:16px; left:16px;
      font-size:9px; font-weight:600; letter-spacing:0.14em; text-transform:uppercase;
      background:#1A1714; color:#fff; padding:4px 10px;
    }

    /* INFO SIDE */
    .pd-info { display:flex; flex-direction:column; gap:0; }
    .pd-cat {
      font-size:10px; font-weight:500; letter-spacing:0.22em;
      text-transform:uppercase; color:#B59A6A; margin-bottom:10px;
    }
    .pd-name {
      font-family:'Cormorant Garamond',serif; font-weight:300;
      font-size:clamp(36px,4vw,52px); letter-spacing:0.03em;
      line-height:1.1; color:#1A1714; margin-bottom:24px;
    }

    .pd-divider { height:1px; background:#E0DAD1; margin:24px 0; }

    /* SIZES */
    .pd-size-label {
      font-size:10px; font-weight:500; letter-spacing:0.18em;
      text-transform:uppercase; color:#8A8480; margin-bottom:12px;
    }
    .pd-sizes { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:8px; }
    .pd-sz {
      width:52px; height:52px; display:flex; align-items:center; justify-content:center;
      font-size:11px; font-weight:600; letter-spacing:0.08em;
      border:1px solid #E0DAD1; background:#F7F4EF; color:#8A8480;
      cursor:pointer; transition:all 0.2s; position:relative;
    }
    .pd-sz:hover { border-color:#B59A6A; color:#1A1714; }
    .pd-sz.active {
      background:#1A1714; border-color:#1A1714; color:#fff;
    }
    .pd-sz.active::after {
      content:''; position:absolute; bottom:4px; left:50%; transform:translateX(-50%);
      width:14px; height:1px; background:#B59A6A;
    }

    /* SIZE MEASUREMENT CARD */
    .pd-measure-card {
      background:#fff; border:1px solid #E0DAD1;
      padding:20px 22px; margin-top:16px;
      animation: fadeSlide 0.25s ease;
    }
    @keyframes fadeSlide {
      from { opacity:0; transform:translateY(-6px); }
      to   { opacity:1; transform:translateY(0); }
    }
    .pd-measure-title {
      font-size:9px; font-weight:600; letter-spacing:0.2em; text-transform:uppercase;
      color:#B59A6A; margin-bottom:14px;
    }
    .pd-measure-grid {
      display:grid; grid-template-columns:1fr 1fr 1fr;
      gap:12px 8px;
    }
    .pd-measure-item {
      display:flex; flex-direction:column; gap:3px;
    }
    .pd-measure-key {
      font-size:9px; font-weight:500; letter-spacing:0.14em;
      text-transform:uppercase; color:#8A8480;
    }
    .pd-measure-val {
      font-family:'Cormorant Garamond',serif; font-size:22px;
      font-weight:400; color:#1A1714; line-height:1;
    }
    .pd-measure-unit {
      font-size:10px; color:#B59A6A; font-weight:400;
    }

    /* SIZE CHART TABLE TOGGLE */
    .pd-chart-toggle {
      background:none; border:none; cursor:pointer;
      font-family:'Jost',sans-serif; font-size:10px; font-weight:500;
      letter-spacing:0.16em; text-transform:uppercase;
      color:#8A8480; padding:0; margin-top:12px;
      display:flex; align-items:center; gap:6px;
      text-decoration:underline; text-underline-offset:3px;
      transition:color 0.2s;
    }
    .pd-chart-toggle:hover { color:#1A1714; }

    /* FULL SIZE CHART TABLE */
    .pd-chart-wrap {
      margin-top:16px; overflow-x:auto;
      animation: fadeSlide 0.25s ease;
    }
    .pd-chart {
      width:100%; border-collapse:collapse;
      font-size:12px;
    }
    .pd-chart th {
      font-size:9px; font-weight:600; letter-spacing:0.16em;
      text-transform:uppercase; color:#8A8480;
      padding:8px 12px; text-align:left;
      border-bottom:2px solid #E0DAD1;
      background:#F7F4EF;
    }
    .pd-chart td {
      padding:10px 12px; border-bottom:1px solid #F0EBE3;
      font-size:12px; font-weight:300; color:#1A1714;
      letter-spacing:0.03em;
    }
    .pd-chart tr.pd-chart-active td {
      background:#1A1714; color:#fff;
    }
    .pd-chart tr.pd-chart-active td:first-child {
      font-weight:600;
    }
    .pd-chart tr:not(.pd-chart-active):hover td {
      background:#F0EBE3; cursor:pointer;
    }
    .pd-chart-size-badge {
      display:inline-flex; align-items:center; justify-content:center;
      width:28px; height:28px;
      font-size:10px; font-weight:600; letter-spacing:0.06em;
    }
    .pd-chart-active .pd-chart-size-badge {
      background:#B59A6A; color:#fff;
    }

    /* DETAILS */
    .pd-details { display:flex; flex-direction:column; gap:10px; margin-bottom:4px; }
    .pd-detail-row { display:flex; gap:12px; align-items:baseline; }
    .pd-detail-key {
      font-size:10px; font-weight:500; letter-spacing:0.16em;
      text-transform:uppercase; color:#8A8480; min-width:90px;
    }
    .pd-detail-val { font-size:13px; font-weight:300; color:#1A1714; letter-spacing:0.04em; }

    /* CTA */
    .pd-cta-wrap { display:flex; flex-direction:column; gap:12px; margin-top:32px; }
    .pd-try-btn {
      width:100%; height:54px;
      background:#1A1714; color:#fff;
      border:none; cursor:pointer;
      font-family:'Jost',sans-serif; font-size:12px; font-weight:600;
      letter-spacing:0.22em; text-transform:uppercase;
      display:flex; align-items:center; justify-content:center; gap:10px;
      transition:background 0.2s;
    }
    .pd-try-btn:hover { background:#B59A6A; }
    .pd-try-btn svg { width:16px; height:16px; }
    .pd-wish-btn {
      width:100%; height:44px;
      background:transparent; border:1px solid #E0DAD1; color:#8A8480;
      cursor:pointer; font-family:'Jost',sans-serif; font-size:11px;
      font-weight:500; letter-spacing:0.16em; text-transform:uppercase;
      transition:all 0.2s;
    }
    .pd-wish-btn:hover { border-color:#1A1714; color:#1A1714; }
    .pd-wish-btn.active {
      background: var(--ink, #1A1714);
      color: var(--white, #fff);
      border-color: var(--ink, #1A1714);
    }
    .pd-wish-btn.active:hover {
      background: var(--gold, #B59A6A);
      border-color: var(--gold, #B59A6A);
    }

    /* NOTICE */
    .pd-notice {
      display:flex; align-items:center; gap:10px;
      padding:14px 16px; background:#F7F4EF; border:1px solid #E0DAD1;
      margin-top:20px;
    }
    .pd-notice-dot { width:6px; height:6px; border-radius:50%; background:#B59A6A; flex-shrink:0; }
    .pd-notice p { font-size:11px; color:#8A8480; font-weight:300; line-height:1.6; letter-spacing:0.04em; }

    /* LOADING */
    .pd-loading {
      display:flex; align-items:center; justify-content:center;
      min-height:60vh; color:#8A8480; font-size:13px; letter-spacing:0.1em;
    }

    @media(max-width:768px) {
      .pd-body { grid-template-columns:1fr; gap:32px; padding:24px 20px 60px; }
      .pd-img-wrap { position:static; }
      .pd-bar { padding:0 20px; }
    }
  `;
  document.head.appendChild(s);
}

// Size measurement data (in cm)
const SIZE_DATA = {
  S:    { chest: 86,  shoulder: 42, length: 68, waist: 82  },
  M:    { chest: 92,  shoulder: 44, length: 70, waist: 88  },
  L:    { chest: 98,  shoulder: 46, length: 72, waist: 94  },
  XL:   { chest: 104, shoulder: 48, length: 74, waist: 100 },
  XXL:  { chest: 110, shoulder: 50, length: 76, waist: 106 },
  XXXL: { chest: 116, shoulder: 52, length: 78, waist: 112 },
};

const SIZES = ["S", "M", "L", "XL", "XXL", "XXXL"];

export default function ProductDetail() {
  const { shirtId } = useParams();
  const navigate    = useNavigate();
  const toast = useToast();
  const [shirt, setShirt]             = useState(null);
  const [loading, setLoading]         = useState(true);
  const [selectedSize, setSelectedSize] = useState("L");
  const [showChart, setShowChart]     = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('vera_wishlist') || '[]');
    setIsWishlisted(wishlist.includes(String(shirtId)));
  }, [shirtId]);

  const toggleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem('vera_wishlist') || '[]');
    let newWishlist;
    if (isWishlisted) {
      newWishlist = wishlist.filter(id => id !== String(shirtId));
      toast.info('Removed from wishlist.');
    } else {
      newWishlist = [...wishlist, String(shirtId)];
      toast.success(`♥ ${shirt?.name ?? 'Item'} added to wishlist!`);
    }
    localStorage.setItem('vera_wishlist', JSON.stringify(newWishlist));
    setIsWishlisted(!isWishlisted);
    window.dispatchEvent(new Event('storage'));
  };

  useEffect(() => {
    (async () => {
      try {
        const all = await getShirts();
        setShirt(all.find(s => s.id === shirtId) ?? null);
      } finally { setLoading(false); }
    })();
  }, [shirtId]);

  if (loading) return <div className="pd-loading">Loading…</div>;
  if (!shirt)  return <div className="pd-loading">Garment not found.</div>;

  const label = shirt.category
    ? shirt.category.charAt(0).toUpperCase() + shirt.category.slice(1)
    : "Garment";

  const m = SIZE_DATA[selectedSize];

  return (
    <div className="pd-root">
      {/* TOPBAR */}
      <header className="pd-bar">
        <button className="pd-back" onClick={() => navigate("/dashboard")}>
          ← Collection
        </button>
        <span className="pd-bar-title">{shirt.name}</span>
      </header>

      <main className="pd-body">
        {/* IMAGE */}
        <div style={{position:'relative'}}>
          <div className="pd-img-wrap">
            <img src={shirt.image_url} alt={shirt.name}/>
          </div>
          <span className="pd-img-badge">{label}</span>
        </div>

        {/* INFO */}
        <div className="pd-info">
          <p className="pd-cat">{label} Collection</p>
          <h1 className="pd-name">{shirt.name}</h1>

          <div className="pd-divider"/>

          {/* SIZE SELECTOR */}
          <div className="pd-size-label">Select Size</div>
          <div className="pd-sizes">
            {SIZES.map(sz => (
              <button key={sz}
                className={`pd-sz ${selectedSize===sz?'active':''}`}
                onClick={() => setSelectedSize(sz)}>
                {sz}
              </button>
            ))}
          </div>

          {/* SELECTED SIZE MEASUREMENTS */}
          <div className="pd-measure-card" key={selectedSize}>
            <div className="pd-measure-title">Size {selectedSize} Measurements</div>
            <div className="pd-measure-grid">
              <div className="pd-measure-item">
                <span className="pd-measure-key">Chest</span>
                <span className="pd-measure-val">{m.chest}<span className="pd-measure-unit"> cm</span></span>
              </div>
              <div className="pd-measure-item">
                <span className="pd-measure-key">Shoulder</span>
                <span className="pd-measure-val">{m.shoulder}<span className="pd-measure-unit"> cm</span></span>
              </div>
              <div className="pd-measure-item">
                <span className="pd-measure-key">Length</span>
                <span className="pd-measure-val">{m.length}<span className="pd-measure-unit"> cm</span></span>
              </div>
              <div className="pd-measure-item">
                <span className="pd-measure-key">Waist</span>
                <span className="pd-measure-val">{m.waist}<span className="pd-measure-unit"> cm</span></span>
              </div>
            </div>
          </div>

          {/* FULL SIZE CHART TOGGLE */}
          <button className="pd-chart-toggle" onClick={() => setShowChart(v => !v)}>
            {showChart ? '↑ Hide' : '↓ View'} Full Size Chart
          </button>

          {showChart && (
            <div className="pd-chart-wrap">
              <table className="pd-chart">
                <thead>
                  <tr>
                    <th>Size</th>
                    <th>Chest (cm)</th>
                    <th>Shoulder (cm)</th>
                    <th>Length (cm)</th>
                    <th>Waist (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {SIZES.map(sz => (
                    <tr key={sz}
                      className={selectedSize===sz ? 'pd-chart-active' : ''}
                      onClick={() => setSelectedSize(sz)}>
                      <td>
                        <span className="pd-chart-size-badge">{sz}</span>
                      </td>
                      <td>{SIZE_DATA[sz].chest}</td>
                      <td>{SIZE_DATA[sz].shoulder}</td>
                      <td>{SIZE_DATA[sz].length}</td>
                      <td>{SIZE_DATA[sz].waist}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="pd-divider"/>

          {/* DETAILS */}
          <div className="pd-details">
            <div className="pd-detail-row">
              <span className="pd-detail-key">Category</span>
              <span className="pd-detail-val">{label}</span>
            </div>
            <div className="pd-detail-row">
              <span className="pd-detail-key">Available Sizes</span>
              <span className="pd-detail-val">{shirt.sizes.join(', ')}</span>
            </div>
            <div className="pd-detail-row">
              <span className="pd-detail-key">Try-On</span>
              <span className="pd-detail-val">AI Virtual Fitting</span>
            </div>
            <div className="pd-detail-row">
              <span className="pd-detail-key">Item No.</span>
              <span className="pd-detail-val">{String(shirt.id).padStart(4,'0')}</span>
            </div>
          </div>

          {/* CTA */}
          <div className="pd-cta-wrap">
            <button className="pd-try-btn"
              onClick={() => navigate(`/try-on/${shirt.id}?size=${selectedSize}`)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
              Try Now — {selectedSize}
            </button>
            <button 
              className={`pd-wish-btn ${isWishlisted ? 'active' : ''}`} 
              onClick={toggleWishlist}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <svg viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" width="16" height="16">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              {isWishlisted ? 'Saved to Wishlist' : 'Save to Wishlist'}
            </button>
          </div>

          <div className="pd-notice">
            <div className="pd-notice-dot"/>
            <p>Stand 1–2 metres from your camera in good lighting for the best virtual fitting experience.</p>
          </div>
        </div>
      </main>
    </div>
  );
}