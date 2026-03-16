import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPainting } from '../api.js';
import { useCart } from '../context/CartContext.jsx';
import './PaintingPage.css';

const WISHLIST_KEY = 'dahlia-wishlist';

function getWishlist() {
  try { return JSON.parse(localStorage.getItem(WISHLIST_KEY) ?? '[]'); }
  catch { return []; }
}

function toggleWishlist(id) {
  const list = getWishlist();
  const updated = list.includes(id) ? list.filter(x => x !== id) : [...list, id];
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
  return updated.includes(id);
}

export default function PaintingPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [painting, setPainting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [wished, setWished] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (!id) { setError('Invalid artwork ID'); setLoading(false); return; }
    setLoading(true);
    getPainting(id)
      .then(data => {
        if (!data) { setError('Artwork not found'); }
        else {
          setPainting(data);
          setWished(getWishlist().includes(data.id ?? data._id));
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message ?? 'Failed to load artwork.');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="painting-page painting-page--state">
        <div className="painting-page__spinner" />
        <p>Loading artwork…</p>
      </div>
    );
  }

  if (error || !painting) {
    return (
      <div className="painting-page painting-page--state">
        <p className="painting-page__error-msg">{error ?? 'Artwork not found'}</p>
        <Link to="/gallery" className="btn">Back to Gallery</Link>
      </div>
    );
  }

  const images = Array.isArray(painting.images) && painting.images.length
    ? painting.images
    : painting.image
    ? [painting.image]
    : [];

  const isAvailable = !painting.sold && painting.originalAvailable !== false;
  const isReserved = painting.reserved === true;
  const price = painting.originalPrice ?? painting.price;

  const handleAddToCart = () => {
    addItem({ ...painting, price });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const handleWishlist = () => {
    const paintingId = painting.id ?? painting._id;
    const nowWished = toggleWishlist(paintingId);
    setWished(nowWished);
  };

  const statusLabel = painting.sold
    ? 'Sold'
    : isReserved
    ? 'Reserved'
    : 'Available';

  const statusMod = painting.sold
    ? 'sold'
    : isReserved
    ? 'reserved'
    : 'available';

  const fmt = n => n != null ? `$${Number(n).toLocaleString()}` : null;

  return (
    <main className="painting-page">
      <div className="container">

        <Link to="/gallery" className="painting-back">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Gallery
        </Link>

        <div className="painting-layout">

          {/* ── IMAGE COLUMN ── */}
          <div className="painting-images">
            <div className="painting-images__main">
              {images.length > 0 ? (
                <img
                  src={images[activeImg]}
                  alt={painting.title ?? 'Artwork'}
                  className="painting-images__img"
                  loading="eager"
                />
              ) : (
                <div className="painting-images__placeholder">
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <p>No image available</p>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="painting-images__thumbs">
                {images.map((src, i) => (
                  <button
                    key={i}
                    className={`painting-images__thumb${i === activeImg ? ' active' : ''}`}
                    onClick={() => setActiveImg(i)}
                    aria-label={`View image ${i + 1}`}
                  >
                    <img src={src} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── DETAILS COLUMN ── */}
          <div className="painting-details">
            <p className="painting-details__artist">BAASHER</p>

            <div className="painting-details__status-row">
              <span className={`painting-details__badge painting-details__badge--${statusMod}`}>
                {statusLabel}
              </span>
            </div>

            <h1 className="painting-details__title">
              {painting.title ?? 'Untitled'}
            </h1>

            <dl className="painting-details__meta">
              {painting.year && (
                <>
                  <dt>Year</dt>
                  <dd>{painting.year}</dd>
                </>
              )}
              {painting.medium && (
                <>
                  <dt>Medium</dt>
                  <dd>{painting.medium}</dd>
                </>
              )}
              {painting.dimensions && (
                <>
                  <dt>Dimensions</dt>
                  <dd>{painting.dimensions}</dd>
                </>
              )}
              {fmt(price) && (
                <>
                  <dt>Price</dt>
                  <dd className="painting-details__price">{fmt(price)}</dd>
                </>
              )}
            </dl>

            {painting.description && (
              <p className="painting-details__description">{painting.description}</p>
            )}

            {/* ── ACTIONS ── */}
            <div className="painting-details__actions">
              {isAvailable && !isReserved ? (
                <button
                  className={`btn btn--large painting-details__cart-btn${addedToCart ? ' added' : ''}`}
                  onClick={handleAddToCart}
                  disabled={addedToCart}
                >
                  {addedToCart ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      Added to Cart
                    </>
                  ) : 'Add to Cart'}
                </button>
              ) : (
                <div className="painting-details__unavailable">
                  This work is {statusLabel.toLowerCase()}.
                  <Link to="/commissions" className="painting-details__commission-link">
                    Enquire about a commission →
                  </Link>
                </div>
              )}

              <button
                className={`painting-details__wishlist-btn${wished ? ' active' : ''}`}
                onClick={handleWishlist}
                aria-pressed={wished}
                aria-label={wished ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill={wished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {wished ? 'Saved to Wishlist' : 'Save to Wishlist'}
              </button>
            </div>

            <p className="painting-details__enquiry">
              Questions about this work?{' '}
              <Link to="/commissions">Get in touch</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
