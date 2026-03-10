import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPainting } from '../api.js';
import { useCart } from '../context/CartContext.jsx';
import ImageWithFallback from '../components/ImageWithFallback.jsx';
import ImageZoom from '../components/ImageZoom.jsx';
import './PaintingPage.css';

export default function PaintingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [painting, setPainting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [version, setVersion] = useState('original');
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    const loadPainting = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPainting(id);
        if (!data) {
          setError('Artwork not found');
          return;
        }
        setPainting(data);
      } catch (err) {
        console.error('Failed to load painting:', err);
        setError('Failed to load artwork. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadPainting();
  }, [id]);

  if (loading) {
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

  if (error || !painting) {
    return (
      <div className="painting-page">
        <div className="container">
          <div className="painting-page__error">
            <h2>{error || 'Artwork Not Found'}</h2>
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

  // ✅ Safe price formatting
  const formatPrice = (price) => {
    if (!price && price !== 0) return '';
    return `$${Number(price).toLocaleString()}`;
  };

  const handleAddToCart = () => {
    addItem({ ...painting, selectedVersion: version, price: currentPrice });
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  const images = painting.images || [painting.image];
  const mainImage = images[activeImg] || images[0];

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
              {mainImage ? (
                <ImageZoom 
                  src={mainImage} 
                  alt={painting.title}
                  className="painting-page__main-img"
                />
              ) : (
                <div className="painting-page__img-placeholder">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <p>No image available</p>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="painting-page__thumbs">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    className={`painting-page__thumb ${idx === activeImg ? 'active' : ''}`}
                    onClick={() => setActiveImg(idx)}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <ImageWithFallback src={img} alt={`${painting.title} view ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DETAILS */}
          <div className="painting-page__details">
            <h1 className="painting-page__title">{painting.title}</h1>

            <div className="painting-page__meta">
              {painting.year && <div><strong>Year:</strong> {painting.year}</div>}
              {painting.medium && <div><strong>Medium:</strong> {painting.medium}</div>}
              {painting.dimensions && <div><strong>Dimensions:</strong> {painting.dimensions}</div>}
            </div>

            {painting.description && (
              <p className="painting-page__description">{painting.description}</p>
            )}

            {/* VERSION SELECTION */}
            {(hasOriginal || hasPrint) && (
              <div className="painting-page__versions">
                <label className="label">Select Version</label>
                <div className="painting-page__version-buttons">
                  {hasOriginal && (
                    <button
                      className={`painting-page__version-btn ${version === 'original' ? 'active' : ''}`}
                      onClick={() => setVersion('original')}
                      aria-pressed={version === 'original'}
                    >
                      <div className="painting-page__version-label">Original</div>
                      {painting.originalPrice && (
                        <div className="painting-page__version-price">{formatPrice(painting.originalPrice)}</div>
                      )}
                    </button>
                  )}
                  {hasPrint && (
                    <button
                      className={`painting-page__version-btn ${version === 'print' ? 'active' : ''}`}
                      onClick={() => setVersion('print')}
                      aria-pressed={version === 'print'}
                    >
                      <div className="painting-page__version-label">Print</div>
                      {painting.printPrice && (
                        <div className="painting-page__version-price">{formatPrice(painting.printPrice)}</div>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* AVAILABILITY & CTA */}
            <div className="painting-page__cta">
              {currentAvailable ? (
                <>
                  <button className="btn btn--large" onClick={handleAddToCart}>
                    {added ? '✓ Added to Cart' : 'Add to Cart'}
                  </button>
                  <Link to="/cart" className="btn btn--ghost">
                    View Cart
                  </Link>
                </>
              ) : (
                <div className="painting-page__unavailable">
                  <p>This version is currently unavailable</p>
                  <Link to="/gallery" className="btn btn--ghost">
                    Browse Other Works
                  </Link>
                </div>
              )}
            </div>

            {/* CONTACT INFO */}
            <div className="painting-page__contact">
              <p><strong>Questions?</strong> <Link to="/commissions">Contact for inquiries</Link></p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
