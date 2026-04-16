import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ShirtCard({ shirt }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className="vcard"
      style={{ animationDelay: "0ms" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/try-on/${shirt.id}`)}
    >
      <div className="vcard-img">
        <div className="vcard-gold-bar" />
        <img src={shirt.image_url} alt={shirt.name} loading="lazy" />
      </div>
      <div className="vcard-body">
        <div className="vcard-top">
          <h3 className="vcard-name">{shirt.name}</h3>
          <div className="vcard-sizes">
            {shirt.sizes.map((sz) => (
              <span key={sz} className="vcard-sz">{sz}</span>
            ))}
          </div>
        </div>
        <div className="vcard-cta">
          <span className="vcard-cta-label">Try On</span>
          <span className="vcard-arrow">→</span>
        </div>
      </div>
    </div>
  );
}