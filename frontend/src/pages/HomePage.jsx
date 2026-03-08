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
              <Link to="/artworks" className="btn">View Works</Link>
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
              <p className="label">Selected Works</p>
              <h2 className="home-section__title">Original Paintings</h2>
            </div>
            <Link to="/artworks?tab=originals" className="home-section__all">
              View all
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
          <div className="home-section__grid">
            {originals.map(p => <PaintingCard key={p.id} painting={p} />)}
          </div>
        </section>
      )}

      {/* ── Limited Edition Prints ── */}
      {prints.length > 0 && (
        <section className="home-section home-section--alt">
          <div className="container">
            <div className="home-section__header">
              <div>
                <p className="label">Collectible Editions</p>
                <h2 className="home-section__title">Limited Edition Prints</h2>
              </div>
              <Link to="/artworks?tab=prints" className="home-section__all">
                View all
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
            <div className="home-section__grid">
              {prints.map(p => <PaintingCard key={p.id} painting={p} version="print" />)}
            </div>
          </div>
        </section>
      )}

      {/* ── Press strip ── */}
      <section className="home-press">
        <div className="container">
          <div className="home-press__grid">
            {[
              { outlet: 'The New York Times', title: 'Sudan War Strikes a Blow to the Country\'s Emerging Art Scene' },
              { outlet: 'AD Middle East', title: 'Meet 7 Sudanese Artists Giving Voice to Sudan\'s Civil War' },
              { outlet: 'Saatchi Gallery, London', title: 'Detour — Travelling Exhibition' },
              { outlet: 'Institut Français d\'Egypte', title: 'Ici Le Soudan — Group Exhibition' },
            ].map((p, i) => (
              <div key={i} className="home-press__item">
                <p className="home-press__outlet">{p.outlet}</p>
                <p className="home-press__title">{p.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="home-newsletter container">
        <div className="home-newsletter__card">
          <p className="label">Collector's List</p>
          <h2 className="home-newsletter__title">Stay close to the studio</h2>
          <p className="home-newsletter__sub">Early access to new works, exhibition invitations, and studio insights.</p>
          <NewsletterForm />
        </div>
      </section>

    </main>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  if (submitted) return <p className="home-newsletter__thanks">✦ Thank you — you're on the list.</p>;
  return (
    <form className="home-newsletter__form" onSubmit={e => { e.preventDefault(); if (email) setSubmitted(true); }}>
      <input className="form-input home-newsletter__input" type="email" placeholder="your@email.com"
        value={email} onChange={e => setEmail(e.target.value)} required />
      <button type="submit" className="btn">Join</button>
    </form>
  );
}
