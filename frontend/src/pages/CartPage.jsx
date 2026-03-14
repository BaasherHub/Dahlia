import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import './CartPage.css';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const [checkoutStep, setCheckoutStep] = useState('review');

  const total = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const tax = total * 0.08;
  const shipping = total > 0 ? (total > 500 ? 0 : 25) : 0;
  const grandTotal = total + tax + shipping;

  const handleProceedToCheckout = () => {
    if (items.length === 0) {
      alert('Please add items to your cart');
      return;
    }
    navigate('/checkout');
  };

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
                      <p className="cart-item__price">
                        ${item.price?.toLocaleString() || '0'}
                      </p>
                      
                      <div className="cart-item__actions">
                        <div className="cart-item__quantity">
                          <button 
                            className="quantity-btn"
                            onClick={() => updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="quantity-value">{item.quantity || 1}</span>
                          <button 
                            className="quantity-btn"
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <button
                          className="cart-item__remove"
                          onClick={() => removeItem(item.id)}
                          aria-label="Remove item"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cart Summary */}
          <aside className="cart-summary">
            <h2 className="cart-summary__title">Order Summary</h2>
            
            <div className="cart-summary__lines">
              <div className="cart-summary__line">
                <span>Subtotal</span>
                <span>${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="cart-summary__line">
                <span>Tax (8%)</span>
                <span>${tax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="cart-summary__line">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</span>
              </div>
              
              <div className="cart-summary__divider"></div>
              
              <div className="cart-summary__total">
                <span>Total</span>
                <span>${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            <button 
              className="btn btn--large cart-summary__checkout"
              onClick={handleProceedToCheckout}
            >
              Proceed to Checkout
            </button>

            <Link to="/gallery" className="btn btn--ghost cart-summary__continue">
              Continue Shopping
            </Link>

            <p className="cart-summary__note">
              You'll be taken to our secure checkout page where you can enter your shipping address and payment information.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
