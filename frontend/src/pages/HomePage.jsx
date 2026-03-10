import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPainting } from '../api.js';
import { useCart } from '../context/CartContext.jsx';
import './PaintingPage.css';

export default function PaintingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [painting, setPainting] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [version, setVersion] = useState('original');
  const [added, setAdded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    getPainting(id)
      .then(p => {
        setPainting(p);
        setImageError(false);
      })
      .catch(err => {
        console.error('Failed to load painting:', err);
        setImageError(true);
      });
  }, [id]);

  if (!painting && !imageError) {
    return (
      <div className="painting-page">
        <div className="container">
          <div className="painting-page__loading">
            <div className="spinner" />
            <p>Loading artwork...</p>
          </div>
        </div>
      </div>
    );
  }

  if (imageError || !painting) {
    return (
      <div className="painting-page">
        <div className="container">
          <div className="painting-page__error">
            <h2>Artwork Not Found</h2>
            <p>The artwork you're looking for couldn't be loaded.</p>
            <Link to="/gallery" className="btn">Back to Gallery</Link>
          </div>
        </div>
      </div>
    );
  }

  const hasOriginal = painting.category === 'original' || painting.category === 'both';
  const hasPrint = painting.category === 'print' || painting.category === 'both';
  const originalAvailable = hasOriginal && painting.originalAvailable && !painting.sold;
  const printAvailable = hasPrint && painting.printAvailable;

  const currentPrice = version === 'print' ? painting.printPrice : painting.originalPrice || painting.price;
  const currentAvailable = version === 'print' ? printAvailable : originalAvailable;

  const handleAddToCart = () => {
    addItem({ ...painting, selectedVersion: version, price: currentPrice });
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  const handleImageError = (e) => {
    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="600"%3E%3Crect fill="%23f5f3f0" width="400" height="600"/%3E%3Ctext x="50%25" y="50%25" font-size="14" fill="%23999" text-anchor="middle" dy=".3em"%3EImage not available%3C/text%3E%3C/svg%3E';
  };

  return (
    <main className="painting-page">
      <div className="container">
        <Link to="/gallery" className="painting-page__back">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Gallery
        </Link>

        <div className="painting-page__grid">
          {/* IMAGES */}
          <div className="painting-page__imgs">
            <div className="painting-page__main-img-wrap">
              {painting.images?.[activeImg] ? (
                <img 
                  src={painting.images[activeImg]} 
                  alt={painting.title} 
                  className="painting-page__main-img"
                  onError={handleImageError}
                />
              ) : (
                <div className="painting-page__img-placeholder">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="M21 15l-5-5L5 21"/>
                  </svg>
                  <p>Image not available</p>
                </div>
              )}
            </div>
            
            {painting.images?.length > 1 && (
              <div className="painting-page__thumbs">
                {painting.images.map((img, i) => (
                  <button
                    key={i}
                    className={`painting-page__thumb ${activeImg === i ? 'active' : ''}`}
                    onClick={() => setActiveImg(i)}
                    aria-label={`View image ${i + 1}`}
                  >
                    <img src={img} alt="" onError={handleImageError} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* INFO */}
          <div className="painting-page__info">
            <p className="label painting-page__label">{painting.medium}</p>
            <h1 className="painting-page__title">{painting.title}</h1>
            {painting.year && <p className="painting-page__year">{painting.year}</p>}

            {/* SPECS */}
            <div className="painting-page__specs">
              <div className="painting-page__spec">
                <span className="label">Dimensions</span>
                <p>{painting.dimensions}</p>
              </div>
              <div className="painting-page__spec">
                <span className="label">Medium</span>
                <p>{painting.medium}</p>
              </div>
              {painting.year && (
                <div className="painting-page__spec">
                  <span className="label">Year</span>
                  <p>{painting.year}</p>
                </div>
              )}
            </div>

            {/* DESCRIPTION */}
            {painting.description && (
              <div className="painting-page__description">
                <p>{painting.description}</p>
              </div>
            )}

            {/* DIVIDER */}
            <div className="painting-page__divider"></div>

            {/* VERSION SELECTOR */}
            {(hasOriginal || hasPrint) && (
              <div className="painting-page__versions">
                {hasOriginal && (
                  <button
                    className={`version-btn ${version === 'original' ? 'active' : ''}`}
                    onClick={() => setVersion('original')}
                  >
                    <span>Original Painting</span>
                    <span className="version-price">${painting.originalPrice || painting.price}</span>
                  </button>
                )}
                {hasPrint && (
                  <button
                    className={`version-btn ${version === 'print' ? 'active' : ''}`}
                    onClick={() => setVersion('print')}
                  >
                    <span>Limited Edition Print</span>
                    <span className="version-price">${painting.printPrice}</span>
                  </button>
                )}
              </div>
            )}

            {/* PRICE & AVAILABILITY */}
            <div className="painting-page__pricing">
              <div className="painting-page__price">
                <span className="label">Price</span>
                <p className="price-value">${currentPrice?.toLocaleString()}</p>
              </div>
              <div className="painting-page__availability">
                {currentAvailable ? (
                  <span className="available">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.33 3.67a1 1 0 0 0-1.41 0L9 13.59l-3.29-3.29a1 1 0 1 0-1.41 1.41l4 4a1 1 0 0 0 1.41 0l11-11a1 1 0 0 0 0-1.41z"/>
                    </svg>
                    Available
                  </span>
                ) : (
                  <span className="sold-out">Sold Out</span>
                )}
              </div>
            </div>

            {/* CTA */}
            {currentAvailable ? (
              <button 
                className={`btn btn--large ${added ? 'btn--success' : ''}`}
                onClick={handleAddToCart}
              >
                {added ? '✓ Added to Cart' : 'Add to Cart'}
              </button>
            ) : (
              <button className="btn btn--large" disabled>
                Not Available
              </button>
            )}

            <button 
              className="btn btn--ghost btn--large"
              onClick={() => navigate('/commissions')}
            >
              Commission Similar Work
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
