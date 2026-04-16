import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ToastProvider";

// ── Fonts ─────────────────────────────────────────────────────────────────────
if (!document.getElementById("gu-fonts")) {
  const l = document.createElement("link");
  l.id = "gu-fonts";
  l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap";
  document.head.appendChild(l);
}

// ── Styles ────────────────────────────────────────────────────────────────────
if (!document.getElementById("gu-styles")) {
  const s = document.createElement("style");
  s.id = "gu-styles";
  s.textContent = `
    :root {
      --vera-black: #0a0a0a;
      --vera-dark: #111111;
      --vera-card: #161616;
      --vera-border: #2a2a2a;
      --vera-gold: #c9a84c;
      --vera-gold-light: #e4c97a;
      --vera-text: #f0ece4;
      --vera-muted: #888880;
      --vera-error: #c0392b;
      --vera-success: #2ecc71;
    }

    .gu-root {
      min-height: 100vh;
      background: var(--vera-black);
      color: var(--vera-text);
      font-family: 'Montserrat', sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 60px 24px 80px;
    }

    .gu-back {
      align-self: flex-start;
      max-width: 780px;
      width: 100%;
      margin-bottom: 40px;
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--vera-muted);
      font-size: 11px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      cursor: pointer;
      transition: color 0.2s;
      background: none;
      border: none;
      padding: 0;
    }
    .gu-back:hover { color: var(--vera-gold); }
    .gu-back svg { width: 14px; height: 14px; }

    .gu-header {
      text-align: center;
      max-width: 560px;
      margin-bottom: 56px;
    }
    .gu-eyebrow {
      font-family: 'Montserrat', sans-serif;
      font-size: 10px;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--vera-gold);
      margin-bottom: 16px;
    }
    .gu-title {
      font-family: 'Cormorant Garamond', serif;
      font-weight: 300;
      font-size: clamp(32px, 5vw, 48px);
      line-height: 1.15;
      color: var(--vera-text);
      margin: 0 0 16px;
    }
    .gu-subtitle {
      font-size: 12px;
      line-height: 1.7;
      color: var(--vera-muted);
      letter-spacing: 0.04em;
    }

    .gu-container {
      width: 100%;
      max-width: 780px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2px;
      background: var(--vera-border);
      border: 1px solid var(--vera-border);
    }

    @media (max-width: 620px) {
      .gu-container { grid-template-columns: 1fr; }
    }

    /* ── Drop Zone ── */
    .gu-drop-panel {
      background: var(--vera-card);
      padding: 48px 32px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 20px;
      min-height: 380px;
      position: relative;
      cursor: pointer;
      transition: background 0.2s;
    }
    .gu-drop-panel:hover { background: #1a1a1a; }
    .gu-drop-panel.dragging {
      background: #1a1510;
      outline: 1px dashed var(--vera-gold);
      outline-offset: -8px;
    }

    .gu-drop-icon {
      width: 64px;
      height: 64px;
      border: 1px solid var(--vera-border);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: border-color 0.2s, transform 0.2s;
    }
    .gu-drop-panel:hover .gu-drop-icon,
    .gu-drop-panel.dragging .gu-drop-icon {
      border-color: var(--vera-gold);
      transform: scale(1.08);
    }
    .gu-drop-icon svg { width: 28px; height: 28px; stroke: var(--vera-gold); }

    .gu-drop-label {
      text-align: center;
    }
    .gu-drop-label strong {
      display: block;
      font-family: 'Cormorant Garamond', serif;
      font-size: 18px;
      font-weight: 400;
      color: var(--vera-text);
      margin-bottom: 6px;
    }
    .gu-drop-label span {
      font-size: 11px;
      color: var(--vera-muted);
      letter-spacing: 0.06em;
    }

    .gu-browse-btn {
      font-family: 'Montserrat', sans-serif;
      font-size: 9px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--vera-gold);
      background: transparent;
      border: 1px solid var(--vera-gold);
      padding: 10px 28px;
      cursor: pointer;
      transition: background 0.2s, color 0.2s;
    }
    .gu-browse-btn:hover {
      background: var(--vera-gold);
      color: var(--vera-black);
    }

    .gu-preview-panel {
      background: var(--vera-card);
      padding: 32px;
      display: flex;
      flex-direction: column;
      gap: 24px;
      min-height: 380px;
    }

    .gu-preview-label {
      font-size: 9px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--vera-muted);
    }

    .gu-preview-img-wrap {
      flex: 1;
      border: 1px solid var(--vera-border);
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 200px;
      background: #111;
      position: relative;
      overflow: hidden;
    }
    .gu-preview-img-wrap img {
      max-width: 100%;
      max-height: 240px;
      object-fit: contain;
    }
    .gu-preview-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      color: var(--vera-muted);
      font-size: 11px;
      letter-spacing: 0.06em;
    }
    .gu-preview-empty svg { width: 32px; height: 32px; opacity: 0.3; }

    /* checkerboard for transparent preview */
    .gu-preview-img-wrap::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(45deg, #1c1c1c 25%, transparent 25%),
        linear-gradient(-45deg, #1c1c1c 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #1c1c1c 75%),
        linear-gradient(-45deg, transparent 75%, #1c1c1c 75%);
      background-size: 16px 16px;
      background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
      opacity: 0.5;
      z-index: 0;
    }
    .gu-preview-img-wrap img,
    .gu-preview-empty { position: relative; z-index: 1; }

    /* ── Form ── */
    .gu-form-row {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .gu-form-row label {
      font-size: 9px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--vera-muted);
    }
    .gu-input, .gu-select {
      background: var(--vera-dark);
      border: 1px solid var(--vera-border);
      color: var(--vera-text);
      font-family: 'Montserrat', sans-serif;
      font-size: 12px;
      padding: 10px 14px;
      outline: none;
      transition: border-color 0.2s;
      width: 100%;
      box-sizing: border-box;
      appearance: none;
    }
    .gu-input:focus, .gu-select:focus { border-color: var(--vera-gold); }

    .gu-form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    /* ── Bottom bar ── */
    .gu-bottom {
      width: 100%;
      max-width: 780px;
      background: var(--vera-card);
      border: 1px solid var(--vera-border);
      border-top: none;
      padding: 20px 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
    }

    .gu-status {
      font-size: 11px;
      letter-spacing: 0.06em;
      color: var(--vera-muted);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .gu-status.error { color: var(--vera-error); }
    .gu-status.success { color: var(--vera-success); }
    .gu-status-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: currentColor;
      flex-shrink: 0;
    }

    .gu-submit-btn {
      font-family: 'Montserrat', sans-serif;
      font-size: 9px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      padding: 14px 40px;
      border: none;
      cursor: pointer;
      transition: opacity 0.2s, transform 0.15s;
      background: var(--vera-gold);
      color: var(--vera-black);
      font-weight: 600;
    }
    .gu-submit-btn:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
    .gu-submit-btn:not(:disabled):hover {
      background: var(--vera-gold-light);
      transform: translateY(-1px);
    }

    /* ── Progress bar ── */
    .gu-progress {
      width: 100%;
      max-width: 780px;
      height: 2px;
      background: var(--vera-border);
      overflow: hidden;
    }
    .gu-progress-fill {
      height: 100%;
      background: var(--vera-gold);
      transition: width 0.4s ease;
    }

    /* ── Tips ── */
    .gu-tips {
      width: 100%;
      max-width: 780px;
      margin-top: 40px;
    }
    .gu-tips-title {
      font-size: 9px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--vera-gold);
      margin-bottom: 20px;
    }
    .gu-tips-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2px;
      background: var(--vera-border);
    }
    @media (max-width: 620px) { .gu-tips-grid { grid-template-columns: 1fr; } }
    .gu-tip {
      background: var(--vera-card);
      padding: 20px;
    }
    .gu-tip-icon {
      font-size: 20px;
      margin-bottom: 10px;
    }
    .gu-tip-head {
      font-size: 11px;
      color: var(--vera-text);
      letter-spacing: 0.04em;
      margin-bottom: 6px;
    }
    .gu-tip-body {
      font-size: 10px;
      color: var(--vera-muted);
      line-height: 1.6;
      letter-spacing: 0.03em;
    }

    /* spinner */
    @keyframes gu-spin { to { transform: rotate(360deg); } }
    .gu-spinner {
      width: 14px; height: 14px;
      border: 2px solid var(--vera-border);
      border-top-color: var(--vera-gold);
      border-radius: 50%;
      animation: gu-spin 0.7s linear infinite;
      flex-shrink: 0;
    }

    /* ── Success Modal ── */
    .gu-modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.85);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000; padding: 20px;
      animation: gu-fade-in 0.3s ease;
      backdrop-filter: blur(4px);
    }
    @keyframes gu-fade-in { from { opacity: 0; } to { opacity: 1; } }
    .gu-modal {
      background: var(--vera-card); border: 1px solid var(--vera-border);
      padding: 48px; text-align: center; max-width: 440px; width: 100%;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
      animation: gu-slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .gu-modal::before {
      content: ''; display: block; height: 3px; background: var(--vera-gold);
      position: absolute; top: 0; left: 0; right: 0;
    }
    @keyframes gu-slide-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    .gu-modal-icon {
      width: 64px; height: 64px; border-radius: 50%;
      border: 1px solid var(--vera-gold); color: var(--vera-gold);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 24px;
    }
    .gu-modal-icon svg { width: 28px; height: 28px; stroke-width: 1.5px; }
    .gu-modal-title {
      font-family: 'Cormorant Garamond', serif; font-size: 32px;
      color: var(--vera-text); margin: 0 0 16px; font-weight: 300;
    }
    .gu-modal-desc {
      font-size: 13px; color: var(--vera-muted); line-height: 1.6; letter-spacing: 0.04em;
      margin-bottom: 0;
    }
  `;
  document.head.appendChild(s);
}

// ── Categories ────────────────────────────────────────────────────────────────
const CATEGORIES = ["Shirt", "Suit", "Jacket", "Casual", "Formal", "Other"];
const GENDERS    = ["Men", "Women", "Unisex"];

// ── Upload to backend ─────────────────────────────────────────────────────────
async function uploadGarment(file, name, category, gender, userId) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("name", name);
  formData.append("category", category);
  formData.append("gender", gender);
  if (userId) formData.append("user_id", userId);

  const res = await fetch("/garments/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Upload failed" }));
    throw new Error(err.detail || "Upload failed");
  }
  return res.json(); // { id, name, category, gender, image_url }
}

import { useUser } from "@clerk/clerk-react";

// ── Component ─────────────────────────────────────────────────────────────────
export default function GarmentUpload() {
  const navigate = useNavigate();
  const { user } = useUser();
  const toast = useToast();
  const fileInputRef = useRef(null);
  const [dragging, setDragging]     = useState(false);
  const [file, setFile]             = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [name, setName]             = useState("");
  const [category, setCategory]     = useState("Shirt");
  const [gender, setGender]         = useState("Men");
  const [status, setStatus]         = useState({ type: "idle", msg: "" });
  const [progress, setProgress]     = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFile = useCallback((f) => {
    if (!f || !f.type.startsWith("image/")) {
      setStatus({ type: "error", msg: "Please upload an image file (JPG, PNG, WEBP)." });
      toast.error("Invalid file type. Please choose a JPG, PNG, or WEBP image.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setStatus({ type: "error", msg: "File too large — max 10 MB." });
      toast.error("File is too large. Maximum size is 10 MB.");
      return;
    }
    setFile(f);
    setStatus({ type: "idle", msg: "" });
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
    // pre-fill name from filename
    const baseName = f.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
    const titled = baseName.charAt(0).toUpperCase() + baseName.slice(1);
    setName(titled);
    toast.info(`Image "${titled}" ready to upload.`, 2500);
  }, []);

  // Drag & drop
  const onDragOver  = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = ()  => setDragging(false);
  const onDrop      = (e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); };
  const onFileChange = (e) => handleFile(e.target.files[0]);

  const handleSubmit = async () => {
    if (!file) {
      setStatus({ type: "error", msg: "Please select a garment image first." });
      toast.warning("Please select a garment image first.");
      return;
    }
    if (!name.trim()) {
      setStatus({ type: "error", msg: "Please enter a name for this garment." });
      toast.warning("Please enter a name for your garment.");
      return;
    }

    setStatus({ type: "loading", msg: "Processing garment — removing background…" });
    setProgress(20);

    try {
      setProgress(50);
      const result = await uploadGarment(file, name.trim(), category, gender, user?.id);
      setProgress(100);
      setStatus({ type: "success", msg: `"${result.name}" added to your collection.` });
      setShowSuccess(true);
      toast.success(`"${result.name}" added to your wardrobe!`, 4000);

      // Navigate to dashboard after short delay
      setTimeout(() => navigate("/dashboard"), 2500);
    } catch (err) {
      setProgress(0);
      setStatus({ type: "error", msg: err.message });
      toast.error(`Upload failed: ${err.message}`);
    }
  };

  const isLoading = status.type === "loading";
  const canSubmit = !!file && name.trim().length > 0 && !isLoading;

  return (
    <div className="gu-root">
      {/* Back */}
      <button className="gu-back" onClick={() => navigate("/dashboard")}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M19 12H5M5 12l7-7M5 12l7 7"/>
        </svg>
        Back to Collection
      </button>

      {/* Header */}
      <div className="gu-header">
        <p className="gu-eyebrow">Vera — Custom Wardrobe</p>
        <h1 className="gu-title">Upload Your Garment</h1>
        <p className="gu-subtitle">
          Add any shirt, suit, or jacket to your personal collection.<br/>
          Our AI will remove the background automatically so you can try it on instantly.
        </p>
      </div>

      {/* Progress bar */}
      <div className="gu-progress">
        <div className="gu-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Main panels */}
      <div className="gu-container">
        {/* Drop zone */}
        <div
          className={`gu-drop-panel${dragging ? " dragging" : ""}`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={onFileChange}
          />
          <div className="gu-drop-icon">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
              <path d="M12 16V4M12 4l-3 3M12 4l3 3" stroke="currentColor"/>
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1" stroke="currentColor" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="gu-drop-label">
            <strong>Drop image here</strong>
            <span>JPG · PNG · WEBP · up to 10 MB</span>
          </div>
          <button
            className="gu-browse-btn"
            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
          >
            Browse Files
          </button>
        </div>

        {/* Preview + form */}
        <div className="gu-preview-panel">
          <span className="gu-preview-label">Preview</span>
          <div className="gu-preview-img-wrap">
            {previewUrl ? (
              <img src={previewUrl} alt="Garment preview" />
            ) : (
              <div className="gu-preview-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="M21 15l-5-5L5 21"/>
                </svg>
                <span>No image selected</span>
              </div>
            )}
          </div>

          {/* Form fields */}
          <div className="gu-form-row">
            <label>Garment Name</label>
            <input
              className="gu-input"
              type="text"
              placeholder="e.g. Navy Oxford Shirt"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={60}
            />
          </div>

          <div className="gu-form-grid">
            <div className="gu-form-row">
              <label>Category</label>
              <select
                className="gu-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="gu-form-row">
              <label>For</label>
              <select
                className="gu-select"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                {GENDERS.map((g) => <option key={g}>{g}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="gu-bottom">
        <div className={`gu-status ${status.type !== "idle" ? status.type : ""}`}>
          {isLoading
            ? <><div className="gu-spinner" />{status.msg}</>
            : status.msg
              ? <><div className="gu-status-dot" />{status.msg}</>
              : <span style={{ color: "var(--vera-muted)" }}>Ready to upload</span>
          }
        </div>
        <button
          className="gu-submit-btn"
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          {isLoading ? "Processing…" : "Add to Collection"}
        </button>
      </div>

      {/* Tips */}
      <div className="gu-tips">
        <p className="gu-tips-title">For best results</p>
        <div className="gu-tips-grid">
          {[
            { icon: "🪟", head: "Plain background", body: "White, black, or any solid color works. Our AI handles the removal automatically." },
            { icon: "👕", head: "Flat lay or hanger", body: "Lay the garment flat on a surface or photograph it on a hanger for the cleanest overlay." },
            { icon: "💡", head: "Good lighting", body: "Even, diffused light brings out true fabric color. Avoid harsh direct flash." },
          ].map((t) => (
            <div className="gu-tip" key={t.head}>
              <div className="gu-tip-icon">{t.icon}</div>
              <div className="gu-tip-head">{t.head}</div>
              <div className="gu-tip-body">{t.body}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="gu-modal-overlay">
          <div className="gu-modal" style={{ position: "relative" }}>
            <div className="gu-modal-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
              </svg>
            </div>
            <h2 className="gu-modal-title">Garment Uploaded</h2>
            <p className="gu-modal-desc">
              Your item has been successfully added to your private collection. 
              Returning you to the dashboard...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}