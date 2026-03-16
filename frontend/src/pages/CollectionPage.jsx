import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCollection } from '../api.js';
import PaintingCard from '../components/PaintingCard.jsx';
import { useCart } from '../context/CartContext.jsx';
import './CollectionPage.css';

export default function CollectionPage({ addToast }) {
  const { id } = useParams();
  const { addItem } = useCart();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getCollection(id)
      .then(data => { setCollection(data); setLoading(false); })
      .catch(() => { setError('Collection not found.'); setLoading(false); });
  }, [id]);

  const handleAddToCart = painting => {
    addItem(painting);
    addToast?.(`"${painting.title}" added to cart`, 'success');
  };

  if (loading) {
    return (
      <main className="collection-detail">
        <div className="collection-detail__loading">
          <div className="collection-detail__spinner" aria-label="Loading collection…" />
        </div>
      </main>
    );
  }

  if (error || !collection) {
    return (
      <main className="collection-detail">
        <div className="container collection-detail__not-found">
          <p className="collection-detail__err-msg">{error ?? 'This collection could not be found.'}</p>
          <Link to="/collections" className="collection-detail__back-link">← Back to Collections</Link>
        </div>
      </main>
    );
  }

  const paintings = collection.paintings || [];
  const coverImage = collection.imageUrl || collection.image_url || collection.coverImage || paintings[0]?.imageUrl || paintings[0]?.image_url;

  return (
    <main className="collection-detail">

      {/* ── HERO ── */}
      <header className={`collection-detail__hero${coverImage ? ' collection-detail__hero--image' : ''}`}>
        {coverImage && (
          <div className="collection-detail__hero-img-wrap" aria-hidden="true">
            <img src={coverImage} alt="" className="collection-detail__hero-img" loading="eager" />
            <div className="collection-detail__hero-overlay" />
          </div>
        )}
        <div className="container collection-detail__hero-content">
          <Link to="/collections" className="collection-detail__back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M19 12H5M5 12l7-7M5 12l7 7" />
            </svg>
            Back to Collections
          </Link>
          <p className="collection-detail__eyebrow">Collection</p>
          <h1 className="collection-detail__title">{collection.name}</h1>
          {collection.description && (
            <p className="collection-detail__desc">{collection.description}</p>
          )}
          <p className="collection-detail__count">
            {paintings.length} {paintings.length === 1 ? 'work' : 'works'}
          </p>
        </div>
      </header>

      {/* ── PAINTINGS GRID ── */}
      <section className="container collection-detail__grid-section">
        {paintings.length === 0 ? (
          <div className="collection-detail__empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <p className="collection-detail__empty-title">No works in this collection yet</p>
            <Link to="/gallery" className="collection-detail__gallery-link">Explore the Gallery</Link>
          </div>
        ) : (
          <div className="collection-detail__grid">
            {paintings.map(p => (
              <PaintingCard
                key={p.id ?? p._id}
                painting={p}
                onAddToCart={handleAddToCart}
                showWishlist
              />
            ))}
          </div>
        )}
      </section>

    </main>
  );
}
