import { useState } from 'react';
import './ImageZoom.css';

export default function ImageZoom({ src, alt, className }) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!isZoomed) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => setIsZoomed(true);
  const handleMouseLeave = () => setIsZoomed(false);

  return (
    <div
      className={`image-zoom ${isZoomed ? 'zoomed' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex="0"
      aria-label={`Zoom image: ${alt}`}
    >
      <img
        src={src}
        alt={alt}
        className={`image-zoom__img ${className}`}
        style={
          isZoomed
            ? {
                transformOrigin: `${position.x}% ${position.y}%`,
              }
            : {}
        }
      />
      {isZoomed && (
        <div className="image-zoom__hint">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </div>
      )}
    </div>
  );
}
