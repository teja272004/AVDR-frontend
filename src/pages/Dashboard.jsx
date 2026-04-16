import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";
import { getShirts } from "../services/api";
import { Loader2, Search, Upload } from "lucide-react";
import { useToast } from "../components/ToastProvider";

const SunIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

if (!document.getElementById("vera-fonts")) {
  const l = document.createElement("link");
  l.id = "vera-fonts"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap";
  document.head.appendChild(l);
}

if (!document.getElementById("vera-dash-styles")) {
  const s = document.createElement("style");
  s.id = "vera-dash-styles";
  s.textContent = `
    :root {
      --cream:#F7F4EF; --parchment:#EDE9E0; --ink:#1A1714;
      --muted:#8A8480; --gold:#B59A6A; --gold-lt:#D4BC94;
      --white:#FFFFFF; --border:#E0DAD1;
    }

    /* ── DARK MODE OVERRIDES ── */
    [data-theme="dark"] {
      --cream:#f5f0e8; --parchment:#2a2420; --ink:#f5f0e8;
      --muted:#8a8480; --gold:#B59A6A; --gold-lt:#d4bc94;
      --white:#1f1c18; --border:rgba(255,255,255,0.07);
    }
    [data-theme="dark"] body { background:#1a1714; }
    [data-theme="dark"] .vd-root { background:#1a1714; color:#f5f0e8; }
    [data-theme="dark"] .vd-nav { background:#1f1c18; border-color:rgba(255,255,255,0.07); }
    [data-theme="dark"] .vd-wordmark { color:#f5f0e8; }
    [data-theme="dark"] .vd-sinput { background:#2a2420; border-color:rgba(255,255,255,0.08); color:#f5f0e8; }
    [data-theme="dark"] .vd-sinput::placeholder { color:#5a5650; }
    [data-theme="dark"] .vd-uname { color:#f5f0e8; }
    [data-theme="dark"] .vd-uemail { color:#8a8480; }
    [data-theme="dark"] .vd-sep { background:rgba(255,255,255,0.07); }
    [data-theme="dark"] .vd-upload-btn { border-color:rgba(181,154,106,0.35); color:var(--gold); }
    [data-theme="dark"] .vd-upload-btn:hover { background:var(--gold); color:#1a1714; }
    [data-theme="dark"] .vd-heading { color:#f5f0e8; }
    [data-theme="dark"] .vd-subhead { color:#8a8480; }
    [data-theme="dark"] .vd-tabs { border-color:rgba(255,255,255,0.07); }
    [data-theme="dark"] .vd-tab { color:#5a5650; }
    [data-theme="dark"] .vd-tab:hover { color:#f5f0e8; }
    [data-theme="dark"] .vd-tab.active { color:#f5f0e8; }
    [data-theme="dark"] .vd-tab-n { background:#2a2420; color:#8a8480; }
    [data-theme="dark"] .vd-card { background:#1f1c18; border-color:rgba(255,255,255,0.07); }
    [data-theme="dark"] .vd-card:hover { box-shadow:0 8px 32px rgba(0,0,0,0.5); }
    [data-theme="dark"] .vd-card-img { background:#2a2420; }
    [data-theme="dark"] .vd-card-name { color:#f5f0e8; }
    [data-theme="dark"] .vd-card-sz { border-color:rgba(255,255,255,0.08); color:#8a8480; }
    [data-theme="dark"] .vd-card-cta { border-color:rgba(255,255,255,0.07); }
    [data-theme="dark"] .vd-section-divider-line { background:rgba(255,255,255,0.07); }
    [data-theme="dark"] .vd-custom-empty { border-color:rgba(255,255,255,0.07); color:#8a8480; }
    [data-theme="dark"] .vd-custom-empty:hover { border-color:var(--gold); }
    [data-theme="dark"] .vd-err { background:#2a1c1a; border-color:#5a3530; }
    [data-theme="dark"] .vd-foot { background:#1f1c18; border-color:rgba(255,255,255,0.07); }
    [data-theme="dark"] .vd-foot-brand { color:#5a5650; }
    [data-theme="dark"] .vd-foot-copy { color:#5a5650; }
    .vd-root { min-height:100vh; background:var(--cream); font-family:'Jost',sans-serif; color:var(--ink); }

    /* NAV */
    .vd-nav {
      position:sticky; top:0; z-index:100;
      background:var(--white); border-bottom:1px solid var(--border);
      height:64px; display:flex; align-items:center; padding:0 40px; gap:24px;
    }
    .vd-brand { display:flex; align-items:center; gap:10px; text-decoration:none; }
    .vd-wordmark {
      font-family:'Cormorant Garamond',serif; font-weight:300; font-size:24px;
      letter-spacing:0.2em; text-transform:uppercase; color:var(--ink);
    }
    .vd-dot { width:5px; height:5px; border-radius:50%; background:var(--gold); margin-left:2px; }
    .vd-search { flex:1; max-width:380px; position:relative; }
    .vd-search svg { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:var(--muted); pointer-events:none; }
    .vd-sinput {
      width:100%; height:38px; padding:0 12px 0 36px;
      background:var(--parchment); border:1px solid var(--border); border-radius:2px;
      font-family:'Jost',sans-serif; font-size:13px; font-weight:300; color:var(--ink);
      outline:none; transition:border-color 0.2s;
    }
    .vd-sinput:focus { border-color:var(--gold); }
    .vd-sinput::placeholder { color:var(--muted); }
    .vd-account { margin-left:auto; display:flex; align-items:center; gap:12px; }
    .vd-uname { font-size:13px; font-weight:500; color:var(--ink); }
    .vd-uemail { font-size:11px; color:var(--muted); }
    .vd-sep { width:1px; height:26px; background:var(--border); }

    /* Upload button in nav */
    .vd-upload-btn {
      display:inline-flex; align-items:center; gap:6px;
      font-family:'Jost',sans-serif; font-size:11px; font-weight:500;
      letter-spacing:0.12em; text-transform:uppercase;
      background:transparent; color:var(--gold);
      border:1px solid var(--gold-lt); padding:8px 18px;
      cursor:pointer; transition:background 0.2s, color 0.2s; white-space:nowrap;
    }
    .vd-upload-btn:hover { background:var(--gold); color:var(--white); }

    /* Theme toggle */
    .vd-theme-btn {
      display:inline-flex; align-items:center; gap:7px;
      background:none; border:1px solid var(--border);
      padding:7px 14px; cursor:pointer;
      font-family:'Jost',sans-serif; font-size:10px; font-weight:500;
      letter-spacing:0.15em; text-transform:uppercase; color:var(--muted);
      transition:all 0.25s ease; white-space:nowrap;
    }
    .vd-theme-btn:hover { border-color:var(--gold); color:var(--ink); background:rgba(181,154,106,0.06); }
    [data-theme="dark"] .vd-theme-btn { border-color:rgba(255,255,255,0.1); color:#8a8480; }
    [data-theme="dark"] .vd-theme-btn:hover { border-color:var(--gold); color:#f5f0e8; background:rgba(181,154,106,0.08); }

    /* PAGE */
    .vd-page { max-width:1400px; margin:0 auto; padding:40px 40px 80px; }
    .vd-head { margin-bottom:32px; display:flex; align-items:flex-end; justify-content:space-between; flex-wrap:wrap; gap:16px; }
    .vd-head-left {}
    .vd-heading {
      font-family:'Cormorant Garamond',serif; font-weight:300;
      font-size:clamp(32px,4vw,48px); letter-spacing:0.05em; color:var(--ink);
    }
    .vd-heading em { font-style:italic; color:var(--gold); }
    .vd-subhead { font-size:12px; color:var(--muted); letter-spacing:0.1em; margin-top:6px; }

    /* TABS */
    .vd-tabs { display:flex; border-bottom:1px solid var(--border); margin-bottom:32px; flex-wrap:wrap; }
    .vd-tab {
      position:relative; padding:10px 24px 12px;
      font-size:11px; font-weight:500; letter-spacing:0.16em; text-transform:uppercase;
      color:var(--muted); background:none; border:none; cursor:pointer; transition:color 0.2s;
    }
    .vd-tab:hover { color:var(--ink); }
    .vd-tab.active { color:var(--ink); }
    .vd-tab.active::after {
      content:''; position:absolute; bottom:-1px; left:0; right:0;
      height:2px; background:var(--gold);
    }
    .vd-tab-n {
      display:inline-flex; align-items:center; justify-content:center;
      margin-left:6px; min-width:18px; height:18px; padding:0 4px;
      background:var(--parchment); border-radius:20px;
      font-size:10px; color:var(--muted); vertical-align:middle;
    }
    .vd-tab.active .vd-tab-n { background:var(--gold); color:var(--white); }

    /* GRID */
    .vd-grid {
      display:grid;
      grid-template-columns:repeat(auto-fill, minmax(220px, 1fr));
      gap:20px;
    }

    /* CARD */
    .vd-card {
      background:var(--white); border:1px solid var(--border);
      cursor:pointer; position:relative; overflow:hidden;
      transition:box-shadow 0.3s, transform 0.3s;
      animation:vd-up 0.4s ease both;
    }
    .vd-card:hover { box-shadow:0 8px 32px rgba(26,23,20,0.12); transform:translateY(-3px); }
    @keyframes vd-up { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }

    .vd-card-img {
      width:100%; aspect-ratio:3/4; background:var(--parchment);
      overflow:hidden; position:relative;
    }
    .vd-card-img img {
      width:100%; height:100%; object-fit:cover;
      transition:transform 0.5s ease;
    }
    .vd-card:hover .vd-card-img img { transform:scale(1.04); }

    .vd-card-bar {
      position:absolute; bottom:0; left:0; right:0; height:2px;
      background:linear-gradient(90deg, var(--gold), var(--gold-lt), var(--gold));
      transform:scaleX(0); transition:transform 0.3s;
    }
    .vd-card:hover .vd-card-bar { transform:scaleX(1); }

    .vd-badge {
      position:absolute; top:10px; left:10px;
      font-size:9px; font-weight:600; letter-spacing:0.14em; text-transform:uppercase;
      background:var(--ink); color:var(--white);
      padding:3px 9px; border-radius:1px;
    }
    .vd-badge.custom {
      background:var(--gold); color:var(--white);
    }

    .vd-card-body { padding:14px 16px 18px; }
    .vd-card-name {
      font-family:'Cormorant Garamond',serif; font-weight:400; font-size:18px;
      letter-spacing:0.02em; color:var(--ink); margin-bottom:8px;
      white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
    }
    .vd-card-sizes { display:flex; gap:4px; flex-wrap:wrap; margin-bottom:12px; }
    .vd-card-sz {
      font-size:9px; font-weight:500; letter-spacing:0.12em; text-transform:uppercase;
      color:var(--muted); border:1px solid var(--border); padding:2px 7px;
    }
    .vd-card-cta {
      display:flex; align-items:center; justify-content:space-between;
      padding-top:10px; border-top:1px solid var(--border);
    }
    .vd-card-cta-txt {
      font-size:10px; font-weight:500; letter-spacing:0.16em;
      text-transform:uppercase; color:var(--gold);
    }
    .vd-card-arrow { color:var(--gold); font-size:16px; transition:transform 0.2s; }
    .vd-card:hover .vd-card-arrow { transform:translateX(4px); }

    /* Card action buttons (wishlist, delete) */
    .vd-card-actions {
      position:absolute; top:8px; right:8px;
      display:flex; flex-direction:column; gap:6px; z-index:10;
    }
    .vd-card-btn {
      width:30px; height:30px;
      padding:0; margin:0; outline:none; border:none;
      background:rgba(255,255,255,0.9); border:1px solid var(--border);
      color:initial; /* reset */
      display:flex; align-items:center; justify-content:center;
      cursor:pointer; opacity:0; transition:all 0.2s;
      border-radius:4px; box-sizing:border-box;
      -webkit-appearance: none; appearance: none;
    }
    .vd-card:hover .vd-card-btn { opacity:1; color: var(--muted); }
    .vd-card-btn:hover { background:white; color:var(--ink); border-color:var(--ink); }
    .vd-card-btn.danger { color:var(--muted); }
    .vd-card-btn.danger:hover { color:#c0392b; border-color:#c0392b; }
    .vd-card-btn.active { opacity:1; color:#c0392b; border-color:rgba(255,255,255,0.1); }
    [data-theme="dark"] .vd-card-btn { background:rgba(26,23,20,0.9); border-color:rgba(255,255,255,0.1); color:#8a8480; }

    /* Custom section divider */
    .vd-section-divider {
      display:flex; align-items:center; gap:16px; margin:48px 0 28px;
    }
    .vd-section-divider-label {
      font-size:9px; font-weight:600; letter-spacing:0.22em; text-transform:uppercase;
      color:var(--gold); white-space:nowrap;
    }
    .vd-section-divider-line {
      flex:1; height:1px; background:var(--border);
    }
    .vd-section-divider-count {
      font-size:9px; letter-spacing:0.14em; text-transform:uppercase;
      color:var(--muted); white-space:nowrap;
    }

    /* Empty custom state */
    .vd-custom-empty {
      border:1px dashed var(--border); padding:48px 32px;
      display:flex; flex-direction:column; align-items:center; gap:12px;
      color:var(--muted); cursor:pointer; transition:border-color 0.2s;
    }
    .vd-custom-empty:hover { border-color:var(--gold); }
    .vd-custom-empty-icon { font-size:28px; opacity:0.4; }
    .vd-custom-empty p { font-size:12px; font-weight:300; letter-spacing:0.08em; }
    .vd-custom-empty span { font-size:10px; letter-spacing:0.14em; text-transform:uppercase; color:var(--gold); }

    /* STATES */
    .vd-state {
      display:flex; flex-direction:column; align-items:center;
      justify-content:center; padding:80px 0; gap:12px; color:var(--muted);
    }
    .vd-state p { font-size:13px; font-weight:300; letter-spacing:0.08em; }
    .vd-err {
      border:1px solid #C8A29A; background:#FDF5F4; padding:24px 28px; max-width:480px;
    }
    .vd-err h3 {
      font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:400;
      color:#7A3A2E; margin-bottom:6px;
    }
    .vd-err p { font-size:13px; color:#9A5548; font-weight:300; line-height:1.7; }

    /* FOOTER */
    .vd-foot {
      border-top:1px solid var(--border); background:var(--white);
      padding:20px 40px; display:flex; align-items:center; justify-content:space-between;
    }
    .vd-foot-brand {
      font-family:'Cormorant Garamond',serif; font-size:14px; font-weight:300;
      letter-spacing:0.2em; text-transform:uppercase; color:var(--muted);
    }
    .vd-foot-copy { font-size:11px; color:var(--muted); font-weight:300; }
    @keyframes vspin { to{transform:rotate(360deg)} }
  `;
  document.head.appendChild(s);
}

function VeraMark({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="2" fill="#1A1714"/>
      <path d="M8 9h3.4l4.6 10.8L20.6 9H24l-8 15L8 9Z" fill="#B59A6A"/>
      <line x1="8" y1="25.5" x2="24" y2="25.5" stroke="#B59A6A" strokeWidth="0.7" opacity="0.4"/>
    </svg>
  );
}

const CATEGORIES = [
  { key:"all",    label:"All" },
  { key:"shirts", label:"Shirts" },
  { key:"suits",  label:"Suits" },
  { key:"women",  label:"Women" },
  { key:"wishlist", label:"♥ Wishlist" },
  { key:"uploads", label:"Uploads" },
];

function matchCat(shirt, key) {
  if (key === "all" || key === "uploads") return true;
  if (shirt.category) return shirt.category.toLowerCase() === key;
  return shirt.name.toLowerCase().includes(key.slice(0, -1));
}

export default function Dashboard() {
  const [shirts,        setShirts]        = useState([]);
  const [customGarments,setCustomGarments]= useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);
  const [query,         setQuery]         = useState("");
  const [tab,           setTab]           = useState("all");
  const [theme,         setTheme]         = useState("light");
  const [wishlist,      setWishlist]      = useState(() => JSON.parse(localStorage.getItem('vera_wishlist') || '[]'));
  const navigate = useNavigate();
  const { user } = useUser();
  const toast = useToast();

  useEffect(() => {
    const handleStorage = () => setWishlist(JSON.parse(localStorage.getItem('vera_wishlist') || '[]'));
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.body.style.background = theme === "dark" ? "#1a1714" : "";
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === "light" ? "dark" : "light");

  // Load regular garments
  useEffect(() => {
    (async () => {
      try { setShirts(await getShirts()); }
      catch {
        setError("Could not connect to backend.");
        toast.error("Could not load the collection. Check your connection.");
      }
      finally { setLoading(false); }
    })();
  }, []);

  // Load custom uploaded garments
  useEffect(() => {
    if (user?.id) {
      fetch(`/garments/custom?user_id=${user.id}`)
        .then(r => r.json())
        .then(data => setCustomGarments(Array.isArray(data) ? data : []))
        .catch(() => {});
    }
  }, [user?.id]);

  const deleteCustomGarment = async (e, id) => {
    e.stopPropagation();
    const garment = customGarments.find(g => g.id === id);
    const name = garment?.name ?? "garment";
    if (!window.confirm(`Remove "${name}" from your uploads?`)) return;
    try {
      await fetch(`/garments/custom/${id}`, { method: "DELETE" });
      setCustomGarments(prev => prev.filter(g => g.id !== id));
      toast.success(`"${name}" removed from your collection.`);
    } catch {
      toast.error("Failed to delete garment. Please try again.");
    }
  };

  const HeartIconSVG = ({ filled }) => (
    <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" width="16" height="16" style={{ display: 'block', margin: 'auto' }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  );

  const toggleWishlist = (e, id) => {
    e.stopPropagation();
    const isWished = wishlist.includes(String(id));
    const item = [...shirts, ...customGarments].find(s => String(s.id) === String(id));
    const newWs = isWished ? wishlist.filter(wid => wid !== String(id)) : [...wishlist, String(id)];
    setWishlist(newWs);
    localStorage.setItem('vera_wishlist', JSON.stringify(newWs));
    window.dispatchEvent(new Event('storage'));
    if (isWished) {
      toast.info(`Removed from wishlist.`);
    } else {
      toast.success(`♥ ${item?.name ?? 'Item'} added to wishlist!`);
    }
  };

  const matchTab = (item, key) => {
    if (key === "wishlist") return wishlist.includes(String(item.id));
    return matchCat(item, key);
  };

  const countFor = (key) => {
    const sCount = key === "uploads" ? 0 : shirts.filter(s =>
      matchTab(s, key) && s.name.toLowerCase().includes(query.toLowerCase())
    ).length;
    
    const cCount = (key === "all" || key === "wishlist" || key === "uploads") ? customGarments.filter(g =>
      (key === "all" || key === "uploads" || matchTab(g, key)) && g.name.toLowerCase().includes(query.toLowerCase())
    ).length : 0;
    
    return sCount + cCount;
  };

  const filtered = tab === "uploads" ? [] : shirts.filter(s =>
    matchTab(s, tab) && s.name.toLowerCase().includes(query.toLowerCase())
  );

  // Filter custom garments by search query and tab too
  const filteredCustom = customGarments.filter(g =>
    (tab === "all" || tab === "uploads" || matchTab(g, tab)) && g.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="vd-root">
      <header className="vd-nav">
        <a href="/" className="vd-brand">
          <VeraMark/>
          <span className="vd-wordmark">Vera<span className="vd-dot"/></span>
        </a>
        <div className="vd-search">
          <Search size={13}/>
          <input className="vd-sinput" placeholder="Search garments…"
            value={query} onChange={e => setQuery(e.target.value)}/>
        </div>
        <div className="vd-account">
          {/* Upload button */}
          <button className="vd-upload-btn" onClick={() => navigate("/upload")}>
            <Upload size={12}/>
            Upload
          </button>
          <div className="vd-sep"/>
          {/* Theme Toggle */}
          <button
            className="vd-theme-btn"
            onClick={toggleTheme}
            aria-label="Toggle dark/light mode"
          >
            {theme === "light" ? <MoonIcon /> : <SunIcon />}
            <span>{theme === "light" ? "Dark" : "Light"}</span>
          </button>
          <div className="vd-sep"/>
          {user && <>
            <div>
              <div className="vd-uname">{user.firstName ? `${user.firstName} ${user.lastName??''}`.trim() : user.username ?? 'Guest'}</div>
              <div className="vd-uemail">{user.primaryEmailAddress?.emailAddress}</div>
            </div>
            <div className="vd-sep"/>
          </>}
          <UserButton afterSignOutUrl="/"/>
        </div>
      </header>

      <main className="vd-page">
        <div className="vd-head">
          <div className="vd-head-left">
            <h1 className="vd-heading">The <em>Collection</em></h1>
            <p className="vd-subhead">{loading ? '' : `${filtered.length} piece${filtered.length!==1?'s':''} available`}</p>
          </div>
        </div>

        {!loading && !error && (
          <div className="vd-tabs">
            {CATEGORIES.map(cat => (
              <button key={cat.key} className={`vd-tab ${tab===cat.key?'active':''}`} onClick={() => setTab(cat.key)}>
                {cat.label}<span className="vd-tab-n">{countFor(cat.key)}</span>
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="vd-state">
            <Loader2 size={32} style={{animation:'vspin 1s linear infinite', color:'var(--gold)'}}/>
            <p>Curating your wardrobe…</p>
          </div>
        ) : error ? (
          <div className="vd-state"><div className="vd-err"><h3>Connection Error</h3><p>{error}</p></div></div>
        ) : filtered.length === 0 && filteredCustom.length === 0 ? (
          <div className="vd-state"><p>No garments found.</p></div>
        ) : (
          <>
            {/* ── Regular garments grid ── */}
            {filtered.length > 0 && (
              <div className="vd-grid">
                {filtered.map((shirt, i) => (
                  <div key={shirt.id} className="vd-card"
                    style={{animationDelay:`${i*40}ms`}}
                    onClick={() => navigate(`/product/${shirt.id}`)}>
                    <div className="vd-card-img">
                      <div className="vd-card-actions">
                        <button 
                          className={`vd-card-btn ${wishlist.includes(String(shirt.id)) ? 'active' : ''}`}
                          title="Toggle Wishlist"
                          onClick={(e) => toggleWishlist(e, shirt.id)}
                        >
                          <HeartIconSVG filled={wishlist.includes(String(shirt.id))} />
                        </button>
                      </div>
                      <img src={shirt.image_url} alt={shirt.name} loading="lazy"/>
                      <div className="vd-card-bar"/>
                      {shirt.category && <span className="vd-badge">{shirt.category}</span>}
                    </div>
                    <div className="vd-card-body">
                      <h3 className="vd-card-name">{shirt.name}</h3>
                      <div className="vd-card-sizes">
                        {shirt.sizes.map(sz => <span key={sz} className="vd-card-sz">{sz}</span>)}
                      </div>
                      <div className="vd-card-cta">
                        <span className="vd-card-cta-txt">View Details</span>
                        <span className="vd-card-arrow">→</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── My Uploads section ── */}
            {(tab === "all" || tab === "wishlist" || tab === "uploads") && (
              <>
                <div className="vd-section-divider">
                  <span className="vd-section-divider-label">
                    {tab === "wishlist" ? "Wishlisted Uploads" : "My Uploads"}
                  </span>
                  <div className="vd-section-divider-line"/>
                  <span className="vd-section-divider-count">{filteredCustom.length} custom piece{filteredCustom.length !== 1 ? 's' : ''}</span>
                </div>

                {filteredCustom.length === 0 ? (
                  <div className="vd-custom-empty" onClick={() => navigate("/upload")}>
                    <div className="vd-custom-empty-icon">👕</div>
                    <p>No custom garments yet.</p>
                    <span>Upload your first garment →</span>
                  </div>
                ) : (
                  <div className="vd-grid">
                    {filteredCustom.map((g, i) => (
                      <div key={g.id} className="vd-card"
                        style={{animationDelay:`${i*40}ms`}}
                        onClick={() => navigate(`/product/${g.id}`)}>

                        <div className="vd-card-img">
                          <div className="vd-card-actions">
                            <button 
                              className={`vd-card-btn ${wishlist.includes(String(g.id)) ? 'active' : ''}`}
                              title="Toggle Wishlist"
                              onClick={(e) => toggleWishlist(e, g.id)}
                            >
                              <HeartIconSVG filled={wishlist.includes(String(g.id))} />
                            </button>
                            {/* Delete button */}
                            <button
                              className="vd-card-btn danger"
                              onClick={(e) => deleteCustomGarment(e, g.id)}
                              title="Remove upload"
                              style={{ fontSize: "16px", lineHeight: 1 }}
                            >
                              <span style={{ position: "relative", top: "-1px" }}>×</span>
                            </button>
                          </div>
                          <img src={g.image_url} alt={g.name} loading="lazy"/>
                          <div className="vd-card-bar"/>
                          <span className="vd-badge custom">Custom</span>
                        </div>
                        <div className="vd-card-body">
                          <h3 className="vd-card-name">{g.name}</h3>
                          <div className="vd-card-sizes">
                            {["S","M","L","XL"].map(sz => <span key={sz} className="vd-card-sz">{sz}</span>)}
                          </div>
                          <div className="vd-card-cta">
                            <span className="vd-card-cta-txt">Try On</span>
                            <span className="vd-card-arrow">→</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>

      <footer className="vd-foot">
        <span className="vd-foot-brand">Vera · AI Try-On</span>
        <span className="vd-foot-copy">© {new Date().getFullYear()} Vera. All rights reserved.</span>
      </footer>
    </div>
  );
}