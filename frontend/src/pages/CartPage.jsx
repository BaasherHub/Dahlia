import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import './CartPage.css';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCart();
  const [checkoutStep, setCheckoutStep] = useState('review');

  const total = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const tax = total * 0.08;
  const shipping = total > 0 ? (total > 500 ? 0 : 25) : 0;
  const grandTotal = total + tax + shipping;

  if (items.length === 0) {
    return (
      <main className="cart-page">
        <div className="container">
          <div className="cart-empty">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
            </svg>
            <h1>Your Cart is Empty</h1>
            <p>Add artworks to your cart to get started</p>
            <Link to="/gallery" className="btn">
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="container">
        <h1>Shopping Cart</h1>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            <div className="cart-items__header">
              <h2>{items.length} Item{items.length !== 1 ? 's' : ''} in Cart</h2>
              <button 
                className="cart-items__clear"
                onClick={() => {
                  if (window.confirm('Clear entire cart?')) {
                    clearCart();
                  }
                }}
              >
                Clear Cart
              </button>
            </div>

            <div className="cart-items__list">
              {items.map(item => {
                const imageUrl = item.image || item.images?.[0];
                
                return (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item__img">
                      {imageUrl ? (
                        <img src={imageUrl} alt={item.title} />
                      ) : (
                        <div className="cart-item__img-placeholder">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="cart-item__details">
                      <h3 className="cart-item__title">{item.title}</h3>
                      <p className="cart-item__meta">
                        {item.year} • {item.medium}
                      </p>
                      <p className="cart-item__version">
                        {item.selectedVersion === 'print' ? 'Limited Edition Print' : 'Original'}
                      </p>
                    </div>

                    <div className="cart-item__quantity">
                      <label htmlFor={`qty-${item.id}`}>Qty:</label>
                      <input
                        id={`qty-${item.id}`}
                        type="number"
                        min="1"
                        value={item.quantity || 1}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      />
                    </div>

                    <div className="cart-item__price">
                      ${(item.price * (item.quantity || 1)).toLocaleString()}
                    </div>

                    <button
                      className="cart-item__remove"
                      onClick={() => removeItem(item.id)}
                      title="Remove from cart"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <aside className="cart-summary">
            <div className="cart-summary__inner">
              <h2>Order Summary</h2>

              <div className="cart-summary__lines">
                <div className="cart-summary__line">
                  <span>Subtotal</span>
                  <span>${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>

                <div className="cart-summary__line">
                  <span>Tax (8%)</span>
                  <span>${tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>

                <div className="cart-summary__line">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="cart-summary__free">FREE</span>
                    ) : (
                      `$${shipping.toLocaleString()}`
                    )}
                  </span>
                </div>
              </div>

              <div className="cart-summary__total">
                <span>Total</span>
                <span>${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>

              {shipping > 0 && (
                <p className="cart-summary__note">
                  ✓ Free shipping on orders over $500
                </p>
              )}

              <button className="btn btn--large btn--success">
                Proceed to Checkout
              </button>

              <Link to="/gallery" className="btn btn--ghost">
                Continue Shopping
              </Link>

              <div className="cart-summary__security">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <p>Secure checkout powered by Stripe</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
