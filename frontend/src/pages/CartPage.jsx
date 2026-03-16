import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import './CartPage.css';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <main className="cart-page">
        <div className="container">
          <div className="cart-empty">
            <div className="cart-empty__icon" aria-hidden="true">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </div>
            <h1 className="cart-empty__title">Your cart is empty</h1>
            <p className="cart-empty__body">
              Browse the gallery and add works that speak to you.
            </p>
            <Link to="/gallery" className="btn btn--large">
              Explore the Gallery
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="container">

        <header className="cart-header">
          <h1 className="cart-header__title">Your Cart</h1>
          <p className="cart-header__count">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </p>
        </header>

        <div className="cart-layout">

          {/* ── ITEMS ── */}
          <div className="cart-items">
            {items.map(item => {
              const imgSrc = item.images?.[0] ?? item.image ?? null;
              const qty = item.quantity ?? 1;
              const itemTotal = (item.price ?? 0) * qty;

              return (
                <article key={item.id ?? item._id} className="cart-item">
                  <div className="cart-item__img">
                    {imgSrc ? (
                      <img src={imgSrc} alt={item.title} loading="lazy" />
                    ) : (
                      <div className="cart-item__img-placeholder" aria-hidden="true">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                          <rect x="3" y="3" width="18" height="18" rx="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="cart-item__body">
                    <div className="cart-item__top">
                      <div>
                        <p className="cart-item__artist">BAASHER</p>
                        <h2 className="cart-item__title">{item.title ?? 'Untitled'}</h2>
                        {(item.year || item.medium) && (
                          <p className="cart-item__meta">
                            {[item.year, item.medium].filter(Boolean).join(' · ')}
                          </p>
                        )}
                        {item.selectedVersion && (
                          <p className="cart-item__version">
                            {item.selectedVersion === 'print' ? 'Limited Edition Print' : 'Original'}
                          </p>
                        )}
                      </div>
                      <button
                        className="cart-item__remove"
                        onClick={() => removeItem(item.id ?? item._id)}
                        aria-label={`Remove ${item.title} from cart`}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>

                    <div className="cart-item__bottom">
                      <div className="cart-item__qty">
                        <button
                          className="cart-item__qty-btn"
                          onClick={() => updateQuantity(item.id ?? item._id, Math.max(1, qty - 1))}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="cart-item__qty-val">{qty}</span>
                        <button
                          className="cart-item__qty-btn"
                          onClick={() => updateQuantity(item.id ?? item._id, qty + 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <p className="cart-item__price">
                        ${itemTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* ── SUMMARY ── */}
          <aside className="cart-summary">
            <h2 className="cart-summary__title">Order Summary</h2>

            <div className="cart-summary__lines">
              <div className="cart-summary__line">
                <span>Subtotal</span>
                <span>${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="cart-summary__line cart-summary__line--muted">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="cart-summary__divider" />

            <div className="cart-summary__total">
              <span>Estimated Total</span>
              <span>${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>

            <button
              className="btn btn--large cart-summary__checkout"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </button>

            <Link to="/gallery" className="cart-summary__continue">
              Continue Browsing
            </Link>

            <p className="cart-summary__note">
              Shipping and any applicable taxes are calculated during checkout.
              All works are professionally packaged and insured.
            </p>
          </aside>

        </div>
      </div>
    </main>
  );
}
