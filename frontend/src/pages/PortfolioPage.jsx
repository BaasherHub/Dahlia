import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPaintings, getSiteSettings } from '../api.js';
import './PortfolioPage.css';

const DEFAULTS = {
  portfolioTitle: 'Portfolio',
  portfolioSubtitle: 'A curated selection of original works',
  portfolioStatement:
    'Each painting is a meditation on color, form, and the expressive potential of oil on linen. These selected works represent the breadth of my practice — from intimate studies to large-scale statements.',
};

export default function PortfolioPage() {
  const [paintings, setPaintings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState(DEFAULTS);

  useEffect(() => {
    getPaintings()
      .then(all => {
        const arr = Array.isArray(all) ? all : (all.data || []);
        // Show featured paintings; if none, show all available originals (up to 12)
        const featured = arr.filter(p => p.featured && !p.sold);
        setPaintings(featured.length > 0 ? featured : arr.filter(p => !p.sold).slice(0, 12));
        setLoading(false);
      })
      .catch(() => setLoading(false));

    getSiteSettings()
      .then(data => setContent({ ...DEFAULTS, ...data }))
      .catch(() => {});
  }, []);

  return (
    <main className="portfolio-page">
      {/* ── HEADER ── */}
      <header className="portfolio-page__header">
        <div className="container">
          <p className="label">Selected Works</p>
          <h1 className="portfolio-page__title">{content.portfolioTitle}</h1>
          <p className="portfolio-page__subtitle">{content.portfolioSubtitle}</p>
        </div>
      </header>

      {/* ── ARTIST STATEMENT ── */}
      <section className="portfolio-statement">
        <div className="container">
          <div className="portfolio-statement__inner">
            <svg className="portfolio-statement__quote" width="40" height="32" viewBox="0 0 40 32" fill="none" aria-hidden="true">
              <path d="M0 32V20C0 13.3 2.7 7.7 8 3L11 6C7.7 9 5.7 12.3 5 16H10V32H0ZM22 32V20C22 13.3 24.7 7.7 30 3L33 6C29.7 9 27.7 12.3 27 16H32V32H22Z" fill="currentColor" opacity="0.15"/>
            </svg>
            <p className="portfolio-statement__text">{content.portfolioStatement}</p>
          </div>
        </div>
      </section>

      {/* ── GRID ── */}
      <section className="portfolio-grid-section">
        <div className="container">
          {loading ? (
            <div className="portfolio-loading">
              <div className="spinner" />
              <p>Loading portfolio...</p>
            </div>
          ) : paintings.length === 0 ? (
            <div className="portfolio-empty">
              <p>No works available yet. Check back soon.</p>
            </div>
          ) : (
            <div className="portfolio-masonry">
              {paintings.map((painting, i) => (
                <Link
                  key={painting.id}
                  to={`/paintings/${painting.id}`}
                  className={`portfolio-item portfolio-item--${(i % 5 === 0 || i % 5 === 3) ? 'tall' : 'normal'}`}
                  aria-label={`View ${painting.title}`}
                >
                  <div className="portfolio-item__img-wrap">
                    {painting.images?.[0] && (
                      <img
                        src={painting.images[0]}
                        alt={painting.title}
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                    <div className="portfolio-item__overlay">
                      <div className="portfolio-item__info">
                        <h3 className="portfolio-item__title">{painting.title}</h3>
                        {painting.year && <p className="portfolio-item__year">{painting.year}</p>}
                        {painting.medium && <p className="portfolio-item__medium">{painting.medium}</p>}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="portfolio-cta">
        <div className="container">
          <h2>Interested in a Work?</h2>
          <p>View the full gallery for availability and pricing, or get in touch to commission a bespoke piece.</p>
          <div className="portfolio-cta__actions">
            <Link to="/gallery" className="btn btn--large">View Full Gallery</Link>
            <Link to="/commissions" className="btn btn--ghost btn--large">Commission a Piece</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
