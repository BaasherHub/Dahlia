import { useState } from 'react';
import { Link } from 'react-router-dom';
import './PaintingCard.css';

export default function PaintingCard({ painting }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    return wishlist.some(item => item.id === painting.id);
  });

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    if (isInWishlist) {
      const updated = wishlist.filter(item => item.id !== painting.id);
      localStorage.setItem('wishlist', JSON.stringify(updated));
      setIsInWishlist(false);
    } else {
      wishlist.push(painting);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      setIsInWishlist(true);
    }
  };

  const handleClick = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return '';
    try {
      return `$${Number(price).toLocaleString()}`;
    } catch {
      return '';
    }
  };

  // Derive display price from the correct schema fields
  const displayPrice = painting.originalPrice || painting.printPrice || painting.price || null;

  const imageUrl = painting.image || painting.images?.[0];

  return (
    <Link 
      to={`/paintings/${painting.id}`} 
      className="painting-card"
      onClick={handleClick}
    >
      <div className="painting-card__img-wrap">
        {imageUrl ? (
          <img 
            src={imageUrl}
            alt={painting.title || 'Artwork'} 
            className={`painting-card__img ${imageLoaded ? 'loaded' : ''}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
            decoding="async"
            loading="lazy"
          />
        ) : (
          <div className="painting-card__img-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
        )}
        
        <button
          className={`painting-card__wishlist ${isInWishlist ? 'active' : ''}`}
          onClick={toggleWishlist}
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
        
        <div className="painting-card__hover">
          <span>View Details</span>
        </div>
      </div>

      <div className="painting-card__info">
        <h3 className="painting-card__title">{painting.title || 'Untitled'}</h3>
        <div className="painting-card__meta">
          {painting.year && <span>{painting.year}</span>}
          {painting.medium && <span>{painting.medium}</span>}
          {painting.originalAvailable && <span className="painting-card__available">Available</span>}
        </div>
        {displayPrice && (
          <div className="painting-card__price">
            {formatPrice(displayPrice)}
            {painting.printPrice && painting.originalPrice && (
              <span className="painting-card__price-from"> (prints from {formatPrice(painting.printPrice)})</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
