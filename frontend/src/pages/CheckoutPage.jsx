import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { createCheckout } from '../api.js';
import './CheckoutPage.css';

const COUNTRIES = [
  { code: 'AF', name: 'Afghanistan' },
  { code: 'AL', name: 'Albania' },
  { code: 'DZ', name: 'Algeria' },
  { code: 'AD', name: 'Andorra' },
  { code: 'AO', name: 'Angola' },
  { code: 'AG', name: 'Antigua and Barbuda' },
  { code: 'AR', name: 'Argentina' },
  { code: 'AM', name: 'Armenia' },
  { code: 'AU', name: 'Australia' },
  { code: 'AT', name: 'Austria' },
  { code: 'AZ', name: 'Azerbaijan' },
  { code: 'BS', name: 'Bahamas' },
  { code: 'BH', name: 'Bahrain' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'BB', name: 'Barbados' },
  { code: 'BY', name: 'Belarus' },
  { code: 'BE', name: 'Belgium' },
  { code: 'BZ', name: 'Belize' },
  { code: 'BJ', name: 'Benin' },
  { code: 'BT', name: 'Bhutan' },
  { code: 'BO', name: 'Bolivia' },
  { code: 'BA', name: 'Bosnia and Herzegovina' },
  { code: 'BW', name: 'Botswana' },
  { code: 'BR', name: 'Brazil' },
  { code: 'BN', name: 'Brunei' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'BF', name: 'Burkina Faso' },
  { code: 'BI', name: 'Burundi' },
  { code: 'CV', name: 'Cabo Verde' },
  { code: 'KH', name: 'Cambodia' },
  { code: 'CM', name: 'Cameroon' },
  { code: 'CA', name: 'Canada' },
  { code: 'CF', name: 'Central African Republic' },
  { code: 'TD', name: 'Chad' },
  { code: 'CL', name: 'Chile' },
  { code: 'CN', name: 'China' },
  { code: 'CO', name: 'Colombia' },
  { code: 'KM', name: 'Comoros' },
  { code: 'CD', name: 'Congo (DRC)' },
  { code: 'CG', name: 'Congo (Republic)' },
  { code: 'CR', name: 'Costa Rica' },
  { code: 'HR', name: 'Croatia' },
  { code: 'CU', name: 'Cuba' },
  { code: 'CY', name: 'Cyprus' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'DK', name: 'Denmark' },
  { code: 'DJ', name: 'Djibouti' },
  { code: 'DM', name: 'Dominica' },
  { code: 'DO', name: 'Dominican Republic' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'EG', name: 'Egypt' },
  { code: 'SV', name: 'El Salvador' },
  { code: 'GQ', name: 'Equatorial Guinea' },
  { code: 'ER', name: 'Eritrea' },
  { code: 'EE', name: 'Estonia' },
  { code: 'SZ', name: 'Eswatini' },
  { code: 'ET', name: 'Ethiopia' },
  { code: 'FJ', name: 'Fiji' },
  { code: 'FI', name: 'Finland' },
  { code: 'FR', name: 'France' },
  { code: 'GA', name: 'Gabon' },
  { code: 'GM', name: 'Gambia' },
  { code: 'GE', name: 'Georgia' },
  { code: 'DE', name: 'Germany' },
  { code: 'GH', name: 'Ghana' },
  { code: 'GR', name: 'Greece' },
  { code: 'GD', name: 'Grenada' },
  { code: 'GT', name: 'Guatemala' },
  { code: 'GN', name: 'Guinea' },
  { code: 'GW', name: 'Guinea-Bissau' },
  { code: 'GY', name: 'Guyana' },
  { code: 'HT', name: 'Haiti' },
  { code: 'HN', name: 'Honduras' },
  { code: 'HU', name: 'Hungary' },
  { code: 'IS', name: 'Iceland' },
  { code: 'IN', name: 'India' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'IR', name: 'Iran' },
  { code: 'IQ', name: 'Iraq' },
  { code: 'IE', name: 'Ireland' },
  { code: 'IL', name: 'Israel' },
  { code: 'IT', name: 'Italy' },
  { code: 'JM', name: 'Jamaica' },
  { code: 'JP', name: 'Japan' },
  { code: 'JO', name: 'Jordan' },
  { code: 'KZ', name: 'Kazakhstan' },
  { code: 'KE', name: 'Kenya' },
  { code: 'KI', name: 'Kiribati' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'KG', name: 'Kyrgyzstan' },
  { code: 'LA', name: 'Laos' },
  { code: 'LV', name: 'Latvia' },
  { code: 'LB', name: 'Lebanon' },
  { code: 'LS', name: 'Lesotho' },
  { code: 'LR', name: 'Liberia' },
  { code: 'LY', name: 'Libya' },
  { code: 'LI', name: 'Liechtenstein' },
  { code: 'LT', name: 'Lithuania' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'MG', name: 'Madagascar' },
  { code: 'MW', name: 'Malawi' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'MV', name: 'Maldives' },
  { code: 'ML', name: 'Mali' },
  { code: 'MT', name: 'Malta' },
  { code: 'MH', name: 'Marshall Islands' },
  { code: 'MR', name: 'Mauritania' },
  { code: 'MU', name: 'Mauritius' },
  { code: 'MX', name: 'Mexico' },
  { code: 'FM', name: 'Micronesia' },
  { code: 'MD', name: 'Moldova' },
  { code: 'MC', name: 'Monaco' },
  { code: 'MN', name: 'Mongolia' },
  { code: 'ME', name: 'Montenegro' },
  { code: 'MA', name: 'Morocco' },
  { code: 'MZ', name: 'Mozambique' },
  { code: 'MM', name: 'Myanmar' },
  { code: 'NA', name: 'Namibia' },
  { code: 'NR', name: 'Nauru' },
  { code: 'NP', name: 'Nepal' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'NI', name: 'Nicaragua' },
  { code: 'NE', name: 'Niger' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'NO', name: 'Norway' },
  { code: 'OM', name: 'Oman' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'PW', name: 'Palau' },
  { code: 'PA', name: 'Panama' },
  { code: 'PG', name: 'Papua New Guinea' },
  { code: 'PY', name: 'Paraguay' },
  { code: 'PE', name: 'Peru' },
  { code: 'PH', name: 'Philippines' },
  { code: 'PL', name: 'Poland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'QA', name: 'Qatar' },
  { code: 'RO', name: 'Romania' },
  { code: 'RU', name: 'Russia' },
  { code: 'RW', name: 'Rwanda' },
  { code: 'KN', name: 'Saint Kitts and Nevis' },
  { code: 'LC', name: 'Saint Lucia' },
  { code: 'VC', name: 'Saint Vincent and the Grenadines' },
  { code: 'WS', name: 'Samoa' },
  { code: 'SM', name: 'San Marino' },
  { code: 'ST', name: 'Sao Tome and Principe' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'SN', name: 'Senegal' },
  { code: 'RS', name: 'Serbia' },
  { code: 'SC', name: 'Seychelles' },
  { code: 'SL', name: 'Sierra Leone' },
  { code: 'SG', name: 'Singapore' },
  { code: 'SK', name: 'Slovakia' },
  { code: 'SI', name: 'Slovenia' },
  { code: 'SB', name: 'Solomon Islands' },
  { code: 'SO', name: 'Somalia' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'SS', name: 'South Sudan' },
  { code: 'ES', name: 'Spain' },
  { code: 'LK', name: 'Sri Lanka' },
  { code: 'SD', name: 'Sudan' },
  { code: 'SR', name: 'Suriname' },
  { code: 'SE', name: 'Sweden' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'SY', name: 'Syria' },
  { code: 'TW', name: 'Taiwan' },
  { code: 'TJ', name: 'Tajikistan' },
  { code: 'TZ', name: 'Tanzania' },
  { code: 'TH', name: 'Thailand' },
  { code: 'TL', name: 'Timor-Leste' },
  { code: 'TG', name: 'Togo' },
  { code: 'TO', name: 'Tonga' },
  { code: 'TT', name: 'Trinidad and Tobago' },
  { code: 'TN', name: 'Tunisia' },
  { code: 'TR', name: 'Turkey' },
  { code: 'TM', name: 'Turkmenistan' },
  { code: 'TV', name: 'Tuvalu' },
  { code: 'UG', name: 'Uganda' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'UZ', name: 'Uzbekistan' },
  { code: 'VU', name: 'Vanuatu' },
  { code: 'VE', name: 'Venezuela' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'YE', name: 'Yemen' },
  { code: 'ZM', name: 'Zambia' },
  { code: 'ZW', name: 'Zimbabwe' },
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
        versions: items.map((p) => p.selectedVersion || 'original'),
        customerEmail: form.email,
        shipping: {
          name: form.name,
          street: form.street,
          city: form.city,
          state: form.state || 'N/A',
          zip: form.zip || '00000',
          country: form.country,
          phone: form.phone || undefined,
        },
      });
      window.location.href = url;
    } catch (err) {
      setError(err.message || 'Failed to process checkout. Please try again.');
      setLoading(false);
    }
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 0 ? (subtotal > 500 ? 0 : 25) : 0;
  const checkoutTotal = subtotal + tax + shipping;

  return (
    <main className="checkout-page container fade-up">
      <Link to="/cart" className="checkout-page__back">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        Back to Cart
      </Link>

      <div>
        <p className="label">Checkout</p>
        <h1 className="checkout-page__title">Shipping Details</h1>
      </div>

      <div className="checkout-page__grid">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="checkout-form__fields">

            <div className="form-group full-width">
              <label className="form-label">Full Name *</label>
              <input 
                className="form-input" 
                type="text" 
                name="name" 
                value={form.name}
                onChange={handleChange} 
                placeholder="Jane Smith" 
                required 
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Email *</label>
              <input 
                className="form-input" 
                type="email" 
                name="email" 
                value={form.email}
                onChange={handleChange} 
                placeholder="jane@example.com" 
                required 
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Country *</label>
              <select 
                className="form-input form-select" 
                name="country" 
                value={form.country}
                onChange={handleChange} 
                required
              >
                <option value="">Select your country…</option>
                {COUNTRIES.map(c => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
            </div>

            {form.country && (
              <div className="form-group full-width">
                <label className="form-label">Street Address *</label>
                <input 
                  className="form-input" 
                  type="text" 
                  name="street" 
                  value={form.street}
                  onChange={handleChange} 
                  placeholder="123 Main Street" 
                  required 
                />
              </div>
            )}

            {form.country && (
              <div className="form-group">
                <label className="form-label">City *</label>
                <input 
                  className="form-input" 
                  type="text" 
                  name="city" 
                  value={form.city}
                  onChange={handleChange} 
                  placeholder="City" 
                  required 
                />
              </div>
            )}

            {form.country && (
              <div className="form-group">
                <label className="form-label">State / Province <span className="form-label-optional">(if applicable)</span></label>
                <input 
                  className="form-input" 
                  type="text" 
                  name="state" 
                  value={form.state}
                  onChange={handleChange} 
                  placeholder="State or province" 
                />
              </div>
            )}

            {form.country && (
              <div className="form-group">
                <label className="form-label">Postal Code <span className="form-label-optional">(if applicable)</span></label>
                <input 
                  className="form-input" 
                  type="text" 
                  name="zip" 
                  value={form.zip}
                  onChange={handleChange} 
                  placeholder="Leave blank if not applicable" 
                />
              </div>
            )}

            {form.country && (
              <div className="form-group full-width">
                <label className="form-label">Phone <span className="form-label-optional">(optional)</span></label>
                <input 
                  className="form-input" 
                  type="tel" 
                  name="phone" 
                  value={form.phone}
                  onChange={handleChange} 
                  placeholder="+1 416 000 0000" 
                />
              </div>
            )}

          </div>

          {error && <p className="checkout-form__error">{error}</p>}

          <button 
            type="submit" 
            className="btn btn--large checkout-form__submit" 
            disabled={loading || !form.country}
          >
            {loading ? 'Redirecting to payment…' : `Pay $${checkoutTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} with Stripe →`}
          </button>

          <p className="checkout-form__note">
            You'll be redirected to Stripe's secure payment page. We never store your card details.
          </p>
        </form>

        <div className="checkout-summary">
          <h2 className="checkout-summary__title">Your Order</h2>
          
          {items.map((p, i) => (
            <div key={i} className="checkout-summary__item">
              <img 
                src={p.images?.[0] || p.image} 
                alt={p.title} 
                className="checkout-summary__img" 
              />
              <div>
                <p className="checkout-summary__name">{p.title}</p>
                <p className="checkout-summary__meta">
                  {p.selectedVersion === 'print' ? 'Limited Edition Print' : 'Original Painting'}
                </p>
                <p className="checkout-summary__price">
                  ${(p.price || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          ))}

          <div className="checkout-summary__divider"></div>

          <div className="checkout-summary__lines">
            <div className="checkout-summary__line">
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="checkout-summary__line">
              <span>Tax (8%)</span>
              <span>${tax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="checkout-summary__line">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `$${shipping.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</span>
            </div>
          </div>

          <div className="checkout-summary__total">
            <span>Total</span>
            <span>${checkoutTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
