import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PaintingCard from '../components/PaintingCard';
import './WishlistPage.css';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('wishlist');
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (err) {
        console.error('Failed to load wishlist:', err);
      }
    }
  }, []);

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter(item => item.id !== id);
    setWishlist(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
  };

  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem('wishlist');
  };

  if (wishlist.length === 0) {
    return (
      <main className="wishlist-page">
        <div className="container">
          <div className="wishlist-page__empty">
            <h1 className="wishlist-page__empty-title">Your Wishlist is Empty</h1>
            <p className="wishlist-page__empty-text">
              Save artworks to your wishlist to keep track of pieces you love.
            </p>
            <Link to="/gallery" className="btn">Explore Gallery</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="wishlist-page">
      <div className="container">
        <div className="wishlist-page__header">
          <h1 className="wishlist-page__title">My Wishlist</h1>
          <p className="wishlist-page__count">{wishlist.length} items</p>
          <button
            className="wishlist-page__clear"
            onClick={clearWishlist}
          >
            Clear Wishlist
          </button>
        </div>

        <div className="wishlist-grid">
          {wishlist.map(painting => (
            <div key={painting.id} className="wishlist-item">
              <PaintingCard painting={painting} />
              <button
                className="wishlist-item__remove"
                onClick={() => removeFromWishlist(painting.id)}
                aria-label={`Remove ${painting.title} from wishlist`}
                title="Remove from wishlist"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
