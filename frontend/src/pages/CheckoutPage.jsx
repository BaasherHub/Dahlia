// src/pages/CheckoutPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { createCheckout } from '../api.js';
import './CheckoutPage.css';

const FIELDS = [
  { name: 'name',    label: 'Full Name',       type: 'text',  placeholder: 'Nour Al-Rashid', colSpan: 2 },
  { name: 'email',   label: 'Email',            type: 'email', placeholder: 'nour@example.com', colSpan: 2 },
  { name: 'street',  label: 'Street Address',   type: 'text',  placeholder: '12 Garden Lane', colSpan: 2 },
  { name: 'city',    label: 'City',             type: 'text',  placeholder: 'Cairo' },
  { name: 'state',   label: 'State / Province', type: 'text',  placeholder: 'Cairo' },
  { name: 'zip',     label: 'ZIP / Postal Code',type: 'text',  placeholder: '11511' },
  { name: 'country', label: 'Country',          type: 'text',  placeholder: 'EG' },
  { name: 'phone',   label: 'Phone (optional)', type: 'tel',   placeholder: '+20 100 000 0000', colSpan: 2 },
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

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
          state: form.state,
          zip: form.zip,
          country: form.country,
          phone: form.phone || undefined,
        },
      });
      window.location.href = url; // Redirect to Stripe hosted checkout
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
            {FIELDS.map((field) => (
              <div
                key={field.name}
                className="form-group"
                style={{ gridColumn: field.colSpan === 2 ? '1 / -1' : undefined }}
              >
                <label className="form-label">{field.label}</label>
                <input
                  className="form-input"
                  type={field.type}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required={!field.label.includes('optional')}
                />
              </div>
            ))}
          </div>

          {error && <p className="checkout-form__error">{error}</p>}

          <button
            type="submit"
            className="btn checkout-form__submit"
            disabled={loading}
          >
            {loading ? 'Redirecting to payment…' : `Pay $${total.toLocaleString()} with Stripe →`}
          </button>

          <p className="checkout-form__note">
            You'll be redirected to Stripe's secure payment page. We never store your card details.
          </p>
        </form>

        {/* Order summary */}
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
