// src/pages/CartPage.jsx
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import './CartPage.css';

export default function CartPage() {
  const { items, remove, total } = useCart();

  if (items.length === 0) return (
    <main className="cart-page container fade-up">
      <div className="cart-page__empty">
        <p className="label">Your cart</p>
        <h1 className="cart-page__title">Nothing here yet</h1>
        <Link to="/gallery" className="btn" style={{ marginTop: 32 }}>Browse Gallery</Link>
      </div>
    </main>
  );

  return (
    <main className="cart-page container fade-up">
      <div>
        <p className="label">Your cart</p>
        <h1 className="cart-page__title">Ready to check out</h1>
      </div>

      <div className="cart-page__grid">
        {/* Items */}
        <div className="cart-items">
          {items.map((painting) => (
            <div key={painting.id} className="cart-item">
              <Link to={`/paintings/${painting.id}`} className="cart-item__img">
                <img src={painting.images[0]} alt={painting.title} />
              </Link>
              <div className="cart-item__info">
                <Link to={`/paintings/${painting.id}`}>
                  <h3 className="cart-item__title">{painting.title}</h3>
                </Link>
                <p className="cart-item__meta">{painting.medium} · {painting.dimensions}</p>
                <p className="cart-item__price">${painting.price.toLocaleString()}</p>
              </div>
              <button className="cart-item__remove" onClick={() => remove(painting.id)}>✕</button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="cart-summary">
          <h2 className="cart-summary__title">Order Summary</h2>
          {items.map((p) => (
            <div key={p.id} className="cart-summary__row">
              <span>{p.title}</span>
              <span>${p.price.toLocaleString()}</span>
            </div>
          ))}
          <div className="cart-summary__total">
            <span>Total</span>
            <span>${total.toLocaleString()}</span>
          </div>
          <Link to="/checkout" className="btn" style={{ width: '100%', justifyContent: 'center', marginTop: 24 }}>
            Continue to Checkout
          </Link>
          <p className="cart-summary__note">Shipping calculated at checkout via Stripe</p>
        </div>
      </div>
    </main>
  );
}
