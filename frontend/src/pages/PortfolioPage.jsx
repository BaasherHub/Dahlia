import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPaintings } from '../api.js';
import './PortfolioPage.css';

export default function PortfolioPage() {
  const [paintings, setPaintings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPaintings()
      .then(data => {
        const all = Array.isArray(data) ? data : (data?.data ?? []);
        const featured = all.filter(p => p.featured);
        setPaintings(featured.length > 0 ? featured : all.slice(0, 16));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main className="portfolio">

      {/* ── HEADER ── */}
      <header className="portfolio__header">
        <div className="container">
          <p className="portfolio__eyebrow">Selected Works</p>
          <h1 className="portfolio__title">Portfolio</h1>
          <p className="portfolio__subtitle">
            An ongoing body of work exploring the intersection of light, material, and memory.
          </p>
        </div>
      </header>

      {/* ── STATEMENT ── */}
      <section className="portfolio__statement">
        <div className="container">
          <div className="portfolio__statement-inner">
            <div className="portfolio__statement-rule" aria-hidden="true" />
            <blockquote className="portfolio__statement-text">
              Each painting begins as a question — about colour, about duration, about what it means for an image to persist. These works are the record of that enquiry.
            </blockquote>
            <p className="portfolio__statement-attr">— Baasher</p>
          </div>
        </div>
      </section>

      {/* ── GRID ── */}
      <section className="portfolio__grid-section">
        <div className="container">
          {loading ? (
            <div className="portfolio__loading">
              <div className="portfolio__spinner" aria-label="Loading portfolio…" />
              <p>Loading works…</p>
            </div>
          ) : paintings.length === 0 ? (
            <div className="portfolio__empty">
              <p>No works available at this time. Please check back soon.</p>
            </div>
          ) : (
            <div className="portfolio__grid">
              {paintings.map((painting, i) => {
                const imageUrl = painting.imageUrl || painting.image_url || painting.images?.[0];
                const isTall = i % 5 === 0 || i % 5 === 3;
                return (
                  <Link
                    key={painting.id ?? painting._id}
                    to={`/gallery/${painting.id ?? painting._id}`}
                    className={`portfolio__item${isTall ? ' portfolio__item--tall' : ''}`}
                    aria-label={`View "${painting.title ?? 'Untitled'}" — ${painting.year ?? ''}`}
                  >
                    <div className="portfolio__item-img-wrap">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt=""
                          aria-hidden="true"
                          className="portfolio__item-img"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="portfolio__item-placeholder" aria-hidden="true" />
                      )}
                      <div className="portfolio__item-overlay" aria-hidden="true">
                        <div className="portfolio__item-meta">
                          <h3 className="portfolio__item-title">{painting.title ?? 'Untitled'}</h3>
                          <p className="portfolio__item-details">
                            {[painting.year, painting.medium].filter(Boolean).join(' · ')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="portfolio__process">
        <div className="container">
          <div className="portfolio__process-inner">
            <div className="portfolio__process-text">
              <p className="portfolio__eyebrow">The Practice</p>
              <h2 className="portfolio__process-title">On Making</h2>
              <p className="portfolio__process-body">
                Baasher works primarily in oil on linen, drawn to the medium's capacity for luminosity and its deep historical resonance. Each canvas is built up over weeks — layers of underpainting, glazing, and direct mark-making accumulating into images that hold time within them.
              </p>
              <p className="portfolio__process-body">
                The studio is a place of sustained enquiry rather than production. A painting may rest for months before it is resolved, its final state arrived at through dialogue between intention and material circumstance.
              </p>
            </div>
            <div className="portfolio__process-aside">
              <div className="portfolio__process-stat">
                <span className="portfolio__process-stat-num">Oil</span>
                <span className="portfolio__process-stat-label">Primary medium</span>
              </div>
              <div className="portfolio__process-stat">
                <span className="portfolio__process-stat-num">Linen</span>
                <span className="portfolio__process-stat-label">Support surface</span>
              </div>
              <div className="portfolio__process-stat">
                <span className="portfolio__process-stat-num">Weeks</span>
                <span className="portfolio__process-stat-label">Per painting</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="portfolio__cta">
        <div className="container portfolio__cta-inner">
          <div>
            <h2 className="portfolio__cta-title">Interested in a Work?</h2>
            <p className="portfolio__cta-text">
              Browse available paintings in the gallery, or get in touch to commission an original piece.
            </p>
          </div>
          <div className="portfolio__cta-actions">
            <Link to="/gallery" className="portfolio__cta-btn portfolio__cta-btn--primary">View Gallery</Link>
            <Link to="/commissions" className="portfolio__cta-btn portfolio__cta-btn--ghost">Commission a Piece</Link>
          </div>
        </div>
      </section>

    </main>
  );
}
