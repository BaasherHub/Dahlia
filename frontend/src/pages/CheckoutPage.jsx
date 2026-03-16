import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { createCheckout } from '../api.js';
import './CheckoutPage.css';

const FIELD = ({ label, optional, children }) => (
  <div className="co-field">
    <label className="co-label">
      {label}{optional && <span className="co-label__opt"> (optional)</span>}
    </label>
    {children}
  </div>
);

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });

  useEffect(() => {
    if (items.length === 0) navigate('/cart', { replace: true });
  }, [items.length, navigate]);

  if (items.length === 0) return null;

  const set = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const customer = {
      name: form.fullName,
      email: form.email,
      phone: form.phone || undefined,
      address: {
        street: form.street,
        city: form.city,
        state: form.state || undefined,
        zip: form.zip || undefined,
        country: form.country,
      },
    };

    try {
      const result = await createCheckout({ items, customer });

      /* If the backend returns a Stripe redirect URL, go there */
      if (result?.url) {
        window.location.href = result.url;
        return;
      }

      /* Otherwise treat sessionId / id as order reference */
      const sessionId = result?.sessionId ?? result?.id ?? '';
      clearCart();
      navigate(`/order-success?sessionId=${encodeURIComponent(sessionId)}`);
    } catch (err) {
      setError(err.message ?? 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <main className="checkout-page">
      <div className="container">

        <Link to="/cart" className="checkout-back">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Cart
        </Link>

        <h1 className="checkout-title">Checkout</h1>

        <div className="checkout-layout">

          {/* ── FORM ── */}
          <form className="checkout-form" onSubmit={handleSubmit} noValidate>
            <fieldset className="checkout-form__section">
              <legend className="checkout-form__legend">Contact</legend>
              <div className="checkout-form__row checkout-form__row--2">
                <FIELD label="Full Name">
                  <input
                    className="co-input"
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={set}
                    placeholder="Jane Smith"
                    required
                    autoComplete="name"
                  />
                </FIELD>
                <FIELD label="Email">
                  <input
                    className="co-input"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={set}
                    placeholder="jane@example.com"
                    required
                    autoComplete="email"
                  />
                </FIELD>
              </div>
              <FIELD label="Phone" optional>
                <input
                  className="co-input"
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={set}
                  placeholder="+1 416 000 0000"
                  autoComplete="tel"
                />
              </FIELD>
            </fieldset>

            <fieldset className="checkout-form__section">
              <legend className="checkout-form__legend">Shipping Address</legend>
              <FIELD label="Street Address">
                <input
                  className="co-input"
                  type="text"
                  name="street"
                  value={form.street}
                  onChange={set}
                  placeholder="123 Maple Street"
                  required
                  autoComplete="street-address"
                />
              </FIELD>
              <div className="checkout-form__row checkout-form__row--2">
                <FIELD label="City">
                  <input
                    className="co-input"
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={set}
                    placeholder="London"
                    required
                    autoComplete="address-level2"
                  />
                </FIELD>
                <FIELD label="State / Province" optional>
                  <input
                    className="co-input"
                    type="text"
                    name="state"
                    value={form.state}
                    onChange={set}
                    placeholder="Ontario"
                    autoComplete="address-level1"
                  />
                </FIELD>
              </div>
              <div className="checkout-form__row checkout-form__row--2">
                <FIELD label="Postal Code" optional>
                  <input
                    className="co-input"
                    type="text"
                    name="zip"
                    value={form.zip}
                    onChange={set}
                    placeholder="W1A 1AA"
                    autoComplete="postal-code"
                  />
                </FIELD>
                <FIELD label="Country">
                  <input
                    className="co-input"
                    type="text"
                    name="country"
                    value={form.country}
                    onChange={set}
                    placeholder="United Kingdom"
                    required
                    autoComplete="country-name"
                  />
                </FIELD>
              </div>
            </fieldset>

            {error && (
              <p className="checkout-form__error" role="alert">{error}</p>
            )}

            <button
              type="submit"
              className="btn btn--large checkout-form__submit"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="checkout-form__spinner" aria-hidden="true" />
                  Processing…
                </>
              ) : (
                `Place Order · $${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
              )}
            </button>

            <p className="checkout-form__secure">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Secure checkout. We never store your payment details.
            </p>
          </form>

          {/* ── ORDER SUMMARY ── */}
          <aside className="checkout-summary">
            <h2 className="checkout-summary__title">Your Order</h2>

            <ul className="checkout-summary__items">
              {items.map((item, i) => {
                const imgSrc = item.images?.[0] ?? item.image ?? null;
                return (
                  <li key={item.id ?? item._id ?? i} className="checkout-summary__item">
                    <div className="checkout-summary__img">
                      {imgSrc ? (
                        <img src={imgSrc} alt={item.title} loading="lazy" />
                      ) : (
                        <div className="checkout-summary__img-placeholder" aria-hidden="true" />
                      )}
                      {(item.quantity ?? 1) > 1 && (
                        <span className="checkout-summary__qty">{item.quantity}</span>
                      )}
                    </div>
                    <div className="checkout-summary__item-body">
                      <p className="checkout-summary__item-title">{item.title ?? 'Untitled'}</p>
                      {item.selectedVersion && (
                        <p className="checkout-summary__item-meta">
                          {item.selectedVersion === 'print' ? 'Limited Edition Print' : 'Original'}
                        </p>
                      )}
                    </div>
                    <p className="checkout-summary__item-price">
                      ${((item.price ?? 0) * (item.quantity ?? 1)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </li>
                );
              })}
            </ul>

            <div className="checkout-summary__divider" />

            <div className="checkout-summary__lines">
              <div className="checkout-summary__line">
                <span>Subtotal</span>
                <span>${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="checkout-summary__line checkout-summary__line--muted">
                <span>Shipping</span>
                <span>Calculated at confirmation</span>
              </div>
            </div>

            <div className="checkout-summary__total">
              <span>Total</span>
              <span>${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}
