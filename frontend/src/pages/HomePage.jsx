import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPaintings, getHeroPainting, getCollections } from '../api.js';
import PaintingCard from '../components/PaintingCard.jsx';
import CollectionCard from '../components/CollectionCard.jsx';
import { useCart } from '../context/CartContext.jsx';
import './HomePage.css';

export default function HomePage() {
  const [heroPainting, setHeroPainting] = useState(null);
  const [paintings, setPaintings] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    getHeroPainting()
      .then(p => p && setHeroPainting(p))
      .catch(() => {});

    getPaintings()
      .then(data => {
        const arr = Array.isArray(data) ? data : (data?.data ?? []);
        setPaintings(arr.slice(0, 6));
        setLoading(false);
      })
      .catch(() => setLoading(false));

    getCollections()
      .then(data => {
        const arr = Array.isArray(data) ? data : (data?.data ?? []);
        setCollections(arr);
      })
      .catch(() => {});
  }, []);

  const heroImg = heroPainting?.images?.[0] ?? heroPainting?.image ?? null;

  return (
    <main className="home">

      {/* ── HERO ── */}
      <section className="hero">
        {heroImg && (
          <>
            <img
              src={heroImg}
              alt={heroPainting?.title ?? 'Hero painting'}
              className="hero__bg"
              decoding="async"
              fetchpriority="high"
            />
            <div className="hero__vignette" />
          </>
        )}
        {!heroImg && <div className="hero__fallback" />}

        <div className="hero__body">
          <p className="hero__eyebrow">Fine Art Collection</p>
          <h1 className="hero__title">BAASHER</h1>
          <p className="hero__subtitle">Original Paintings — Fine Art Collection</p>
          <div className="hero__ctas">
            <Link to="/gallery" className="hero__cta hero__cta--primary">
              Explore Gallery
            </Link>
            <Link to="/commissions" className="hero__cta hero__cta--ghost">
              Commission a Piece
            </Link>
          </div>
        </div>

        <div className="hero__scroll">
          <span>Scroll</span>
          <div className="hero__scroll-line" />
        </div>
      </section>

      {/* ── SELECTED WORKS ── */}
      <section className="section works-section">
        <div className="container">
          <header className="section__header">
            <div className="section__header-text">
              <p className="section__eyebrow">Portfolio</p>
              <h2 className="section__title">Selected Works</h2>
            </div>
            <Link to="/gallery" className="section__link">
              View Complete Gallery
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </header>

          {loading ? (
            <div className="home__loading">
              <div className="home__spinner" />
            </div>
          ) : paintings.length > 0 ? (
            <div className="works-grid">
              {paintings.map(p => (
                <PaintingCard
                  key={p.id ?? p._id}
                  painting={p}
                  onAddToCart={addItem}
                  showWishlist
                />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* ── ABOUT TEASER ── */}
      <section className="section about-teaser">
        <div className="container">
          <div className="about-teaser__inner">
            <p className="section__eyebrow">The Artist</p>
            <h2 className="about-teaser__heading">About the Artist</h2>
            <p className="about-teaser__body">
              Baasher is a contemporary painter whose work occupies the quiet space between
              restraint and expression. Working primarily in oils on linen, each canvas is
              built through layers of carefully considered mark-making — palette knife,
              brush, and time. His practice is rooted in observation, memory, and a lifelong
              dialogue with colour.
            </p>
            <Link to="/about" className="about-teaser__link">
              Read More
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── COLLECTIONS ── */}
      {collections.length > 0 && (
        <section className="section collections-section">
          <div className="container">
            <header className="section__header">
              <div className="section__header-text">
                <p className="section__eyebrow">Curated Series</p>
                <h2 className="section__title">Collections</h2>
              </div>
              <Link to="/collections" className="section__link">
                All Collections
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </header>

            <div className="collections-grid">
              {collections.slice(0, 3).map(c => (
                <CollectionCard key={c.id ?? c._id} collection={c} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── COMMISSION CTA ── */}
      <section className="commission-cta">
        <div className="container">
          <div className="commission-cta__inner">
            <p className="section__eyebrow">Bespoke Work</p>
            <h2 className="commission-cta__title">Commission a Piece</h2>
            <p className="commission-cta__body">
              Work directly with Baasher to create a painting made entirely for you —
              tailored to your space, palette, and vision.
            </p>
            <Link to="/commissions" className="commission-cta__btn">
              Begin a Commission
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
