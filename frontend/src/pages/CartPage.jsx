import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import './CartPage.css';

export default function CartPage() {
  const { items, removeItem, total } = useCart();
  const navigate = useNavigate();

  return (
    <main className="cart-page container">
      <p className="label">Shopping</p>
      <h1 className="cart-page__title">Your Cart</h1>

      {items.length === 0 ? (
        <div className="cart-page__empty">
          <p className="cart-page__empty-title">Your cart is empty</p>
          <Link to="/artworks" className="btn">Browse Artworks</Link>
        </div>
      ) : (
        <div className="cart-page__grid">
          <div className="cart-items">
            {items.map((item, i) => (
              <div key={i} className="cart-item">
                <Link to={`/paintings/${item.id}`} className="cart-item__img-link">
                  <img src={item.images[0]} alt={item.title} className="cart-item__img" />
                </Link>
                <div className="cart-item__details">
                  <Link to={`/paintings/${item.id}`} className="cart-item__title-link">
                    <p className="cart-item__title">{item.title}</p>
                  </Link>
                  <p className="cart-item__meta">{item.medium} · {item.dimensions}</p>
                  {item.selectedVersion && (
                    <p className="cart-item__version">
                      {item.selectedVersion === 'print' ? 'Limited Edition Print' : 'Original Painting'}
                    </p>
                  )}
                  <p className="cart-item__price">${item.price?.toLocaleString()}</p>
                </div>
                <button className="cart-item__remove" onClick={() => removeItem(i)} aria-label="Remove">×</button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2 className="cart-summary__title">Order Summary</h2>
            {items.map((item, i) => (
              <div key={i} className="cart-summary__row">
                <span>{item.title}{item.selectedVersion === 'print' ? ' (Print)' : ''}</span>
                <span>${item.price?.toLocaleString()}</span>
              </div>
            ))}
            <div className="cart-summary__divider" />
            <div className="cart-summary__total">
              <span className="cart-summary__total-label">Total</span>
              <span className="cart-summary__total-value">${total.toLocaleString()}</span>
            </div>
            <button className="btn cart-summary__checkout" onClick={() => navigate('/checkout')}>
              Proceed to Checkout
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <Link to="/artworks" className="cart-summary__continue">← Continue browsing</Link>
          </div>
        </div>
      )}
    </main>
  );
}
