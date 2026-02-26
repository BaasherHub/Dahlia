// src/pages/PaintingPage.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPainting } from '../api.js';
import { useCart } from '../context/CartContext.jsx';
import './PaintingPage.css';

export default function PaintingPage() {
  const { id } = useParams();
  const [painting, setPainting] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const { add, items } = useCart();
  const inCart = items.some((p) => p.id === id);

  useEffect(() => {
    fetchPainting(id).then(setPainting).catch(console.error);
  }, [id]);

  if (!painting) return (
    <main className="painting-page container">
      <div className="gallery-page__loading"><div className="spinner" /></div>
    </main>
  );

  return (
    <main className="painting-page container fade-up">
      <Link to="/gallery" className="painting-page__back">← Back to Gallery</Link>

      <div className="painting-page__grid">
        {/* Images */}
        <div className="painting-page__images">
          <div className="painting-page__main-img">
            <img src={painting.images[activeImg]} alt={painting.title} />
            {painting.sold && <div className="painting-page__sold">Sold</div>}
          </div>
          {painting.images.length > 1 && (
            <div className="painting-page__thumbs">
              {painting.images.map((img, i) => (
                <button
                  key={i}
                  className={`painting-page__thumb ${i === activeImg ? 'active' : ''}`}
                  onClick={() => setActiveImg(i)}
                >
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="painting-page__details">
          <p className="label">{painting.medium}</p>
          <h1 className="painting-page__title">{painting.title}</h1>
          <p className="painting-page__price">${painting.price.toLocaleString()}</p>

          <div className="painting-page__meta">
            <div className="meta-row">
              <span className="meta-label">Dimensions</span>
              <span>{painting.dimensions}</span>
            </div>
            {painting.year && (
              <div className="meta-row">
                <span className="meta-label">Year</span>
                <span>{painting.year}</span>
              </div>
            )}
            <div className="meta-row">
              <span className="meta-label">Availability</span>
              <span style={{ color: painting.sold ? '#c0392b' : '#27ae60' }}>
                {painting.sold ? 'Sold' : 'Available'}
              </span>
            </div>
          </div>

          <p className="painting-page__desc">{painting.description}</p>

          {!painting.sold && (
            <button
              className={`btn painting-page__cta ${inCart ? 'btn-outline' : ''}`}
              onClick={() => add(painting)}
              disabled={inCart}
            >
              {inCart ? 'Added to Cart ✓' : 'Add to Cart'}
            </button>
          )}

          {inCart && (
            <Link to="/cart" className="painting-page__cart-link">View cart →</Link>
          )}

          <p className="painting-page__shipping">
            🎁 Ships carefully packaged with certificate of authenticity
          </p>
        </div>
      </div>
    </main>
  );
}
