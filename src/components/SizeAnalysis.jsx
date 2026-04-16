import React from "react";

if (!document.getElementById("dr-size-analysis-styles")) {
  const s = document.createElement("style");
  s.id = "dr-size-analysis-styles";
  s.textContent = `
    .dr-size-analysis {
      padding: 16px 18px 24px;
      font-family: 'Jost', sans-serif;
    }
    .sa-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .sa-title {
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--ink);
    }
    .sa-size-badge {
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.15em;
      color: var(--ink);
      background: var(--parchment);
      padding: 3px 8px;
      border-radius: 2px;
    }
    .sa-status-box {
      border: 1px solid var(--border);
      padding: 24px 12px;
      text-align: center;
      background: var(--cream);
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }
    .sa-status-text {
      font-size: 15px;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      transition: color 0.3s ease;
    }
    .sa-status-desc {
      font-size: 12px;
      color: var(--muted);
      letter-spacing: 0.05em;
      line-height: 1.5;
      max-width: 80%;
    }
    .sa-analyzing .sa-status-box {
      animation: sa-pulse 1.5s infinite alternate;
      border-color: var(--border) !important;
    }
    .sa-disclaimer {
      margin-top: 16px;
      font-size: 13px;
      font-weight: 700;
      color: #fff;
      text-align: center;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      background: #c8882a;
      padding: 12px 14px;
      border-radius: 4px;
      line-height: 1.5;
    }
    .sa-disclaimer-icon {
      font-size: 16px;
      display: block;
      margin-bottom: 4px;
    }
    @keyframes sa-pulse {
      from { background: var(--cream); }
      to { background: var(--parchment); }
    }
  `;
  document.head.appendChild(s);
}

export default function SizeAnalysis({ fitStatus, selectedSize }) {
  const textMatches = (words) => {
    if (!fitStatus) return false;
    const lower = fitStatus.toLowerCase();
    return words.some(w => lower.includes(w));
  };

  const isPerfect = textMatches(["perfect", "great fit", "optimal", "fitting"]);
  const isTight = textMatches(["tight", "small", "size up"]);
  const isLoose = textMatches(["loose", "large", "big", "size down", "oversized"]);
  const isAnalyzing = textMatches(["analyzing", "warming up", "step back", "waiting"]);

  let statusColor = "var(--ink)";
  let description = "Please wait, scanning proportions...";

  if (isPerfect) {
    statusColor = "var(--gold)";
    description = "Ideal proportions for your body type. This is your recommended size.";
  } else if (isTight) {
    statusColor = "#b56a6a";
    description = "This size may restrict movement. We recommend sizing up for comfort.";
  } else if (isLoose) {
    statusColor = "#b56a6a";
    description = "Features a relaxed, roomy fit. Consider sizing down for a tailored look.";
  }

  if (isAnalyzing) {
    statusColor = "var(--muted)";
    description = "Processing your measurements. Please stand clearly in frame.";
  }

  return (
    <div className="dr-size-analysis">
      <div className="sa-header">
        <span className="sa-title">Fit Insight</span>
        <span className="sa-size-badge">Size {selectedSize}</span>
      </div>

      <div className={`sa-status-wrap ${isAnalyzing ? "sa-analyzing" : ""}`}>
        <div
          className="sa-status-box"
          style={{ borderColor: isAnalyzing ? "var(--border)" : statusColor }}
        >
          <div className="sa-status-text" style={{ color: statusColor }}>
            {fitStatus || "Waiting for subject..."}
          </div>
          <div className="sa-status-desc">{description}</div>
        </div>
      </div>

      <div className="sa-disclaimer">
        <span className="sa-disclaimer-icon">⚠️</span>
        Note: VERA AI may occasionally miscalculate. Please use as a reference.
      </div>
    </div>
  );
}