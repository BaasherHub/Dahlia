import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPaintings, getHeroPainting } from '../api.js';
import PaintingCard from '../components/PaintingCard.jsx';
import './HomePage.css';

export default function HomePage() {
  const [heroPainting, setHeroPainting] = useState(null);
  const [originals, setOriginals] = useState([]);
  const [prints, setPrints] = useState([]);

  useEffect(() => {
    getHeroPainting().then(p => p && setHeroPainting(p)).catch(() => {});
    getPaintings().then(all => {
      setOriginals(all.filter(p => !p.sold && p.originalAvailable !== false && p.category !== 'print').slice(0, 6));
      setPrints(all.filter(p => p.printAvailable === true).slice(0, 3));
    }).catch(() => {});
  }, []);

  return (
    <main className="home">
      {/* ── HERO SECTION ── */}
      <section className="hero">
        {heroPainting?.images?.[0] ? (
          <div className="hero__painting">
            <img src={heroPainting.images[0]} alt={heroPainting.title} className="hero__painting-img" />
            <div className="hero__overlay" />
          </div>
        ) : (
          <div className="hero__bg-fallback" />
        )}

        <div className="hero__content container">
          <div className="hero__text">
            <h1 className="hero__title">Dahlia Baasher</h1>
            <p className="hero__subtitle">Contemporary Oil Paintings</p>
            <p className="hero__description">
              Refined works on premium linen canvas, defined by deliberate palette knife technique and expressive brushwork.
            </p>
            <div className="hero__actions">
              <Link to="/gallery" className="btn">
                Explore Collection
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="hero__scroll-hint">
          <span>Scroll to explore</span>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="4" y="2" width="8" height="14" rx="4"/>
            <path d="M8 18v4"/>
          </svg>
        </div>
      </section>

      {/* ── ARTIST STATEMENT ── */}
      <section className="artist-statement">
        <div className="container">
          <div className="artist-statement__content">
            <h2 className="artist-statement__title">The Artist</h2>
            <div className="artist-statement__text">
              <p>
                Dahlia Baasher is a contemporary painter based in Toronto, working primarily with oil on premium linen canvas. Her practice is rooted in the exploration of human connection and emotional nuance, rendered through confident, expressive brushwork.
              </p>
              <p>
                Each work begins with intention and evolves through a careful dialogue between concept and medium. Employing the palette knife as a primary tool, Dahlia builds surfaces of depth and movement, creating pieces that reward both immediate and sustained attention.
              </p>
            </div>
            <Link to="/about" className="artist-statement__link">
              View full biography
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURED WORKS ── */}
      {originals.length > 0 && (
        <section className="featured-works">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Featured Works</h2>
              <Link to="/gallery" className="section-link">
                View all
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>

            <div className="gallery-grid gallery-grid--3">
              {originals.slice(0, 6).map(p => (
                <PaintingCard key={p.id} painting={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── LIMITED EDITIONS ── */}
      {prints.length > 0 && (
        <section className="collection-highlights">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Limited Editions</h2>
              <p className="section-subtitle">Archival giclée prints on museum-quality paper</p>
            </div>

            <div className="gallery-grid gallery-grid--3">
              {prints.map(p => (
                <PaintingCard key={p.id} painting={p} type="print" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA SECTION ── */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Commissions Available</h2>
            <p className="cta-text">
              Custom works created specifically for your collection. Starting at $800 USD.
            </p>
            <Link to="/commissions" className="btn btn--outline">
              Inquire About a Commission
            </Link>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="newsletter">
        <div className="container">
          <div className="newsletter-content">
            <h2 className="newsletter-title">Stay Connected</h2>
            <p className="newsletter-subtitle">Receive updates on new works and exhibitions</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="newsletter-input"
                required
              />
              <button type="submit" className="btn newsletter-btn">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
