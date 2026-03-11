import { useState } from 'react';
import './NewsletterSignup.css';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch(`${API_URL}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 409) {
        setStatus('error');
        setMessage('This email is already subscribed.');
        setTimeout(() => setStatus(null), 5000);
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      setStatus('success');
      setMessage('Thank you for subscribing! You\'ll receive updates about new artworks.');
      setEmail('');
      setTimeout(() => {
        setStatus(null);
        setMessage('');
      }, 5000);
    } catch (err) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
      setTimeout(() => setStatus(null), 5000);
    }
  };

  return (
    <section className="newsletter">
      <div className="container">
        <div className="newsletter__content">
          <div className="newsletter__text">
            <h2 className="newsletter__title">Stay Updated</h2>
            <p className="newsletter__subtitle">
              Subscribe to receive updates about new artworks, exhibitions, and commission opportunities.
            </p>
          </div>

          <form className="newsletter__form" onSubmit={handleSubmit}>
            <div className="newsletter__input-group">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === 'loading'}
                className="newsletter__input"
                aria-label="Email address for newsletter"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="newsletter__button"
                aria-label="Subscribe to newsletter"
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>

            {message && (
              <p className={`newsletter__message newsletter__message--${status}`}>
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
