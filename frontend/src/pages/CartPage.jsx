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
          <Link to="/artworks" className="btn">Browse Works</Link>
        </div>
      ) : (
        <div className="cart-page__grid">
          <div className="cart-items">
            {items.map((item, i) => (
              <div key={i} className="cart-item">
                <img src={item.images[0]} alt={item.title} className="cart-item__img" />
                <div className="cart-item__details">
                  <p className="cart-item__title">{item.title}</p>
                  <p className="cart-item__meta">{item.medium} · {item.dimensions}</p>
                  {item.selectedVersion && (
                    <p className="cart-item__version">{item.selectedVersion === 'print' ? 'Limited Edition Print' : 'Original Painting'}</p>
                  )}
                  <p className="cart-item__price">${item.price?.toLocaleString()}</p>
                </div>
                <button className="cart-item__remove" onClick={() => removeItem(i)}>×</button>
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
            <div className="cart-summary__total">
              <span className="cart-summary__total-label">Total</span>
              <span className="cart-summary__total-value">${total.toLocaleString()}</span>
            </div>
            <button className="btn cart-summary__checkout" onClick={() => navigate('/checkout')}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
