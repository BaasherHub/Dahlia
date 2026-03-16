import { useState } from 'react';
import { Link } from 'react-router-dom';
import './PaintingCard.css';

const WISHLIST_KEY = 'dahlia-wishlist';

function getWishlist() {
  try { return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || []; }
  catch { return []; }
}

function isWishlisted(id) {
  return getWishlist().some(item => item.id === id);
}

export default function PaintingCard({ painting, onAddToCart, showWishlist = true }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [wishlisted, setWishlisted] = useState(() => isWishlisted(painting.id));

  const imageUrl = painting.imageUrl || painting.image_url || null;
  const price = painting.price ?? null;
  const artist = painting.artist || 'Baasher';

  const status = painting.status
    ? painting.status.charAt(0).toUpperCase() + painting.status.slice(1).toLowerCase()
    : painting.sold
      ? 'Sold'
      : painting.reserved
        ? 'Reserved'
        : 'Available';

  const statusClass = {
    Available: 'status--available',
    Sold: 'status--sold',
    Reserved: 'status--reserved',
  }[status] || 'status--available';

  const toggleWishlist = e => {
    e.preventDefault();
    e.stopPropagation();
    const list = getWishlist();
    if (wishlisted) {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(list.filter(i => i.id !== painting.id)));
    } else {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify([...list, painting]));
    }
    setWishlisted(prev => !prev);
  };

  const handleAddToCart = e => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(painting);
  };

  return (
    <article className="painting-card">
      <Link
        to={`/gallery/${painting.id}`}
        className="painting-card__link"
        aria-label={`${painting.title || 'Untitled'} by ${artist} — ${status}`}
      >
        <div className="painting-card__img-wrap">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt=""
              aria-hidden="true"
              className={`painting-card__img${imgLoaded ? ' loaded' : ''}`}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgLoaded(true)}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="painting-card__placeholder" aria-hidden="true">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          )}

          <div className="painting-card__overlay" aria-hidden="true">
            <span className="painting-card__view-label">View Details</span>
          </div>
        </div>

        <div className="painting-card__info">
          <div className="painting-card__header">
            <h3 className="painting-card__title">{painting.title || 'Untitled'}</h3>
            <span className={`painting-card__status ${statusClass}`} aria-label={`Status: ${status}`}>
              {status}
            </span>
          </div>
          <p className="painting-card__artist">{artist}</p>
          {price !== null && (
            <p className="painting-card__price">${Number(price).toLocaleString()}</p>
          )}
        </div>
      </Link>

      {showWishlist && (
        <button
          className={`painting-card__wishlist${wishlisted ? ' wishlisted' : ''}`}
          onClick={toggleWishlist}
          aria-label={wishlisted ? `Remove ${painting.title || 'artwork'} from wishlist` : `Add ${painting.title || 'artwork'} to wishlist`}
          title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      )}

      {onAddToCart && status === 'Available' && (
        <button
          className="painting-card__add-btn"
          onClick={handleAddToCart}
          aria-label={`Add ${painting.title || 'artwork'} to cart`}
        >
          Add to Cart
        </button>
      )}
    </article>
  );
}
