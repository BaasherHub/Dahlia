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
      // Robust filtering — works with both old DB schema and new
      setOriginals(all.filter(p => !p.sold && p.originalAvailable !== false && p.category !== 'print').slice(0, 3));
      setPrints(all.filter(p => p.printAvailable === true).slice(0, 3));
    }).catch(() => {});
  }, []);

  return (
    <main className="home">

      {/* ── Hero ── */}
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
            <p className="label hero__eyebrow">Dahlia Baasher</p>
            <div className="hero__divider" />
            <blockquote className="hero__quote">
              "The intricacy of human nature is rooted in our need for emotional connection and social interaction, which is deceptively simple"
            </blockquote>
            <div className="hero__actions">
              <Link to="/gallery" className="btn">View Works</Link>
              <Link to="/about" className="btn btn-outline-white">About the Artist</Link>
            </div>
          </div>

          {heroPainting && (
            <div className="hero__painting-caption">
              <p className="hero__painting-title">{heroPainting.title}</p>
              <p className="hero__painting-meta">{heroPainting.medium} · {heroPainting.dimensions}</p>
            </div>
          )}
        </div>

        <div className="hero__scroll-hint">
          <span>Scroll</span>
          <div className="hero__scroll-line" />
        </div>
      </section>

      {/* ── Statement ── */}
      <section className="home-statement container">
        <div className="home-statement__inner">
          <p className="label">Artist Statement</p>
          <blockquote className="home-statement__quote">
            "A refined collection of original oil paintings on premium linen canvas, defined by the deliberate use of palette knife and confident, expressive brushstrokes."
          </blockquote>
          <p className="home-statement__attr">— Dahlia Baasher, Toronto</p>
          <Link to="/about" className="home-statement__link">Read full statement →</Link>
        </div>
      </section>

      {/* ── Original Paintings ── */}
      {originals.length > 0 && (
        <section className="home-section container">
          <div className="home-section__header">
            <div>
              <p className="label">New Works</p>
              <h2 className="home-section__title">Original Paintings</h2>
            </div>
            <Link to="/gallery?type=original" className="home-section__cta">View all originals →</Link>
          </div>
          <div className="home-grid">
            {originals.map(p => <PaintingCard key={p.id} painting={p} />)}
          </div>
        </section>
      )}

      {/* ── Limited Edition Prints ── */}
      {prints.length > 0 && (
        <section className="home-section container">
          <div className="home-section__header">
            <div>
              <p className="label">Affordable Art</p>
              <h2 className="home-section__title">Limited Edition Prints</h2>
            </div>
            <Link to="/gallery?type=print" className="home-section__cta">View all prints →</Link>
          </div>
          <div className="home-grid">
            {prints.map(p => <PaintingCard key={p.id} painting={p} type="print" />)}
          </div>
        </section>
      )}
    </main>
  );
}
