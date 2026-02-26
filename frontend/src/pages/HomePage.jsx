// src/pages/HomePage.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPaintings } from '../api.js';
import PaintingCard from '../components/PaintingCard.jsx';
import './HomePage.css';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    fetchPaintings({ featured: true }).then(setFeatured).catch(console.error);
  }, []);

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero__text fade-up">
          <p className="label">Original Paintings</p>
          <h1 className="hero__heading">Art that holds<br /><em>the light</em></h1>
          <p className="hero__sub">
            Each work is painted by hand, once — then it belongs to you forever.
          </p>
          <Link to="/gallery" className="btn">Explore the Gallery</Link>
        </div>
        <div className="hero__image-grid">
          <div className="hero__img hero__img--1" />
          <div className="hero__img hero__img--2" />
        </div>
      </section>

      {/* ── Featured ──────────────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="featured container">
          <div className="featured__header">
            <h2 className="featured__title">Featured Works</h2>
            <Link to="/gallery" className="featured__link">View all →</Link>
          </div>
          <div className="paintings-grid">
            {featured.map((p) => (
              <PaintingCard key={p.id} painting={p} />
            ))}
          </div>
        </section>
      )}

      {/* ── About strip ───────────────────────────────────────── */}
      <section className="about container">
        <div className="about__inner">
          <div>
            <p className="label">The Studio</p>
            <h2 className="about__heading">Painted with patience,<br />made to last</h2>
          </div>
          <p className="about__body">
            Dahlia works primarily in oil on linen and canvas, building up layers over weeks to create
            paintings with depth and warmth that photographs can only hint at. Every piece ships carefully
            rolled or framed with a certificate of authenticity.
          </p>
        </div>
      </section>
    </main>
  );
}
