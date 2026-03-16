import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PaintingCard from '../components/PaintingCard.jsx';
import { useCart } from '../context/CartContext.jsx';
import './WishlistPage.css';

const WISHLIST_KEY = 'dahlia-wishlist';

function readWishlist() {
  try { return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || []; }
  catch { return []; }
}

function writeWishlist(items) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
}

export default function WishlistPage({ addToast }) {
  const [wishlist, setWishlist] = useState(readWishlist);
  const { addItem } = useCart();

  useEffect(() => {
    const sync = () => setWishlist(readWishlist());
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const removeItem = id => {
    const updated = wishlist.filter(p => p.id !== id);
    writeWishlist(updated);
    setWishlist(updated);
  };

  const clearAll = () => {
    writeWishlist([]);
    setWishlist([]);
  };

  const handleAddToCart = painting => {
    addItem(painting);
    addToast?.(`"${painting.title}" added to cart`, 'success');
  };

  if (wishlist.length === 0) {
    return (
      <main className="wishlist-page">
        <div className="container wishlist-page__empty-wrap">
          <div className="wishlist-page__empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <h1 className="wishlist-page__empty-title">Your Wishlist is Empty</h1>
            <p className="wishlist-page__empty-text">
              Save artworks that speak to you and revisit them at any time.
            </p>
            <Link to="/gallery" className="wishlist-page__explore-btn">Explore the Gallery</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="wishlist-page">
      <header className="wishlist-page__header">
        <div className="container wishlist-page__header-inner">
          <div>
            <p className="wishlist-page__eyebrow">Saved Works</p>
            <h1 className="wishlist-page__title">Your Wishlist</h1>
            <p className="wishlist-page__subtitle">{wishlist.length} {wishlist.length === 1 ? 'saved work' : 'saved works'}</p>
          </div>
          <button className="wishlist-page__clear-btn" onClick={clearAll} aria-label="Clear all saved works">
            Clear All
          </button>
        </div>
      </header>

      <div className="container wishlist-page__body">
        <div className="wishlist-page__grid">
          {wishlist.map(painting => (
            <div key={painting.id ?? painting._id} className="wishlist-page__item">
              <PaintingCard
                painting={painting}
                onAddToCart={handleAddToCart}
                showWishlist={false}
              />
              <button
                className="wishlist-page__remove-btn"
                onClick={() => removeItem(painting.id ?? painting._id)}
                aria-label={`Remove "${painting.title ?? 'artwork'}" from wishlist`}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
