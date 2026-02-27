// src/pages/CheckoutPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { createCheckout } from '../api.js';
import './CheckoutPage.css';

// Countries and whether they use postal codes and states/provinces
const COUNTRIES = [
  { code: 'CA', name: 'Canada',              hasPostal: true,  hasState: true,  stateName: 'Province',      postalFormat: 'A1A 1A1' },
  { code: 'US', name: 'United States',       hasPostal: true,  hasState: true,  stateName: 'State',         postalFormat: '10001' },
  { code: 'GB', name: 'United Kingdom',      hasPostal: true,  hasState: false, stateName: '',              postalFormat: 'SW1A 1AA' },
  { code: 'AU', name: 'Australia',           hasPostal: true,  hasState: true,  stateName: 'State',         postalFormat: '2000' },
  { code: 'DE', name: 'Germany',             hasPostal: true,  hasState: false, stateName: '',              postalFormat: '10115' },
  { code: 'FR', name: 'France',              hasPostal: true,  hasState: false, stateName: '',              postalFormat: '75001' },
  { code: 'AE', name: 'UAE',                 hasPostal: false, hasState: true,  stateName: 'Emirate',       postalFormat: '' },
  { code: 'SA', name: 'Saudi Arabia',        hasPostal: true,  hasState: false, stateName: '',              postalFormat: '12271' },
  { code: 'EG', name: 'Egypt',               hasPostal: true,  hasState: false, stateName: '',              postalFormat: '11511' },
  { code: 'NG', name: 'Nigeria',             hasPostal: false, hasState: true,  stateName: 'State',         postalFormat: '' },
  { code: 'GH', name: 'Ghana',               hasPostal: false, hasState: false, stateName: '',              postalFormat: '' },
  { code: 'KE', name: 'Kenya',               hasPostal: true,  hasState: false, stateName: '',              postalFormat: '00100' },
  { code: 'ZA', name: 'South Africa',        hasPostal: true,  hasState: false, stateName: '',              postalFormat: '2000' },
  { code: 'MA', name: 'Morocco',             hasPostal: true,  hasState: false, stateName: '',              postalFormat: '20000' },
  { code: 'IN', name: 'India',               hasPostal: true,  hasState: true,  stateName: 'State',         postalFormat: '110001' },
  { code: 'JP', name: 'Japan',               hasPostal: true,  hasState: false, stateName: '',              postalFormat: '100-0001' },
  { code: 'SG', name: 'Singapore',           hasPostal: true,  hasState: false, stateName: '',              postalFormat: '018989' },
  { code: 'NL', name: 'Netherlands',         hasPostal: true,  hasState: false, stateName: '',              postalFormat: '1011 AB' },
  { code: 'SE', name: 'Sweden',              hasPostal: true,  hasState: false, stateName: '',              postalFormat: '111 29' },
  { code: 'NO', name: 'Norway',              hasPostal: true,  hasState: false, stateName: '',              postalFormat: '0150' },
  { code: 'OTHER', name: 'Other country',    hasPostal: false, hasState: false, stateName: '',              postalFormat: '' },
];

export default function CheckoutPage() {
  const { items, total } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', street: '', city: '',
    state: '', zip: '', country: '', phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const selectedCountry = COUNTRIES.find(c => c.code === form.country);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCountryChange = (e) => {
    setForm({ ...form, country: e.target.value, state: '', zip: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { url } = await createCheckout({
        paintingIds: items.map((p) => p.id),
        customerEmail: form.email,
        shipping: {
          name: form.name,
          street: form.street,
          city: form.city,
          state: form.state || 'N/A',
          zip: form.zip || '00000',
          country: form.country === 'OTHER' ? 'US' : form.country,
          phone: form.phone || undefined,
        },
      });
      window.location.href = url;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <main className="checkout-page container fade-up">
      <div>
        <p className="label">Checkout</p>
        <h1 className="checkout-page__title">Shipping Details</h1>
      </div>

      <div className="checkout-page__grid">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="checkout-form__fields">

            {/* Full Name */}
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Full Name</label>
              <input className="form-input" type="text" name="name" value={form.name}
                onChange={handleChange} placeholder="Jane Smith" required />
            </div>

            {/* Email */}
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Email</label>
              <input className="form-input" type="email" name="email" value={form.email}
                onChange={handleChange} placeholder="jane@example.com" required />
            </div>

            {/* Country — always first so form adapts */}
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Country</label>
              <select className="form-input form-select" name="country" value={form.country}
                onChange={handleCountryChange} required>
                <option value="">Select your country…</option>
                {COUNTRIES.map(c => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Street Address — shown once country is selected */}
            {form.country && (
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Street Address</label>
                <input className="form-input" type="text" name="street" value={form.street}
                  onChange={handleChange} placeholder="123 Main Street" required />
              </div>
            )}

            {/* City */}
            {form.country && (
              <div className="form-group">
                <label className="form-label">City</label>
                <input className="form-input" type="text" name="city" value={form.city}
                  onChange={handleChange} placeholder="City" required />
              </div>
            )}

            {/* State/Province — only for countries that use it */}
            {form.country && selectedCountry?.hasState && (
              <div className="form-group">
                <label className="form-label">{selectedCountry.stateName}</label>
                <input className="form-input" type="text" name="state" value={form.state}
                  onChange={handleChange} placeholder={selectedCountry.stateName} required />
              </div>
            )}

            {/* Postal code — only for countries that use it */}
            {form.country && selectedCountry?.hasPostal && (
              <div className="form-group">
                <label className="form-label">Postal Code</label>
                <input className="form-input" type="text" name="zip" value={form.zip}
                  onChange={handleChange} placeholder={selectedCountry.postalFormat} required />
              </div>
            )}

            {/* Phone */}
            {form.country && (
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Phone (optional)</label>
                <input className="form-input" type="tel" name="phone" value={form.phone}
                  onChange={handleChange} placeholder="+1 416 000 0000" />
              </div>
            )}

          </div>

          {error && <p className="checkout-form__error">{error}</p>}

          <button type="submit" className="btn checkout-form__submit" disabled={loading || !form.country}>
            {loading ? 'Redirecting to payment…' : `Pay $${total.toLocaleString()} with Stripe →`}
          </button>

          <p className="checkout-form__note">
            You'll be redirected to Stripe's secure payment page. We never store your card details.
          </p>
        </form>

        <div className="checkout-summary">
          <h2 className="checkout-summary__title">Your Order</h2>
          {items.map((p) => (
            <div key={p.id} className="checkout-summary__item">
              <img src={p.images[0]} alt={p.title} className="checkout-summary__img" />
              <div>
                <p className="checkout-summary__name">{p.title}</p>
                <p className="checkout-summary__meta">{p.medium} · {p.dimensions}</p>
                <p className="checkout-summary__price">${p.price.toLocaleString()}</p>
              </div>
            </div>
          ))}
          <div className="checkout-summary__total">
            <span>Total</span>
            <span>${total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
