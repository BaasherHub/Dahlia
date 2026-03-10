import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPaintings, getHeroPainting } from '../api.js';
import PaintingCard from '../components/PaintingCard.jsx';
import './HomePage.css';

export default function HomePage() {
  const [heroPainting, setHeroPainting] = useState(null);
  const [originals, setOriginals] = useState([]);
  const [prints, setPrints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHeroPainting()
      .then(p => p && setHeroPainting(p))
      .catch(err => console.error('Failed to load hero:', err));
    
    getPaintings()
      .then(all => {
        const paintingArray = Array.isArray(all) ? all : (all.data || []);
        setOriginals(paintingArray.filter(p => !p.sold && p.originalAvailable !== false && p.category !== 'print').slice(0, 6));
        setPrints(paintingArray.filter(p => p.printAvailable === true).slice(0, 3));
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load paintings:', err);
        setLoading(false);
      });
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

      {/* ── FEATURED WORKS ── */}
      {!loading && originals.length > 0 && (
        <section className="featured-works">
          <div className="container">
            <div className="section-header">
              <div>
                <h2 className="section-title">Featured Works</h2>
                <p className="section-subtitle">Original Paintings</p>
              </div>
              <Link to="/gallery" className="section-link">
                View All
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
            <div className="gallery-grid gallery-grid--3">
              {originals.map(p => (
                <PaintingCard key={p.id} painting={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── LIMITED PRINTS ── */}
      {!loading && prints.length > 0 && (
        <section className="collection-highlights">
          <div className="container">
            <div className="section-header">
              <div>
                <h2 className="section-title">Limited Edition Prints</h2>
                <p className="section-subtitle">Exclusive Reproductions</p>
              </div>
              <Link to="/gallery?type=print" className="section-link">
                View All Prints
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
            <div className="gallery-grid gallery-grid--3">
              {prints.map(p => (
                <PaintingCard key={p.id} painting={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA SECTION ── */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Custom Commissions</h2>
            <p className="cta-text">
              Looking for something unique? Dahlia Baasher creates custom paintings tailored to your vision and space.
            </p>
            <Link to="/commissions" className="btn">
              Learn About Commissions
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
