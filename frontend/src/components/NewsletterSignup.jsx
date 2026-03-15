import { useState } from 'react';
import { subscribeNewsletter } from '../api.js';
import './NewsletterSignup.css';

export default function NewsletterSignup({ title, subtitle }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      await subscribeNewsletter(email);
      setStatus('success');
      setMessage('Thank you for subscribing! Check your email for updates.');
      setEmail('');
      setTimeout(() => {
        setStatus(null);
        setMessage('');
      }, 5000);
    } catch (err) {
      setStatus('error');
      setMessage(err.message === 'Already subscribed'
        ? 'This email is already subscribed.'
        : 'Something went wrong. Please try again.');
      setTimeout(() => { setStatus(null); setMessage(''); }, 5000);
    }
  };

  return (
    <section className="newsletter">
      <div className="container">
        <div className="newsletter__content">
          <div className="newsletter__text">
            <h2 className="newsletter__title">{title || 'Stay Updated'}</h2>
            <p className="newsletter__subtitle">
              {subtitle || 'Subscribe to receive updates about new artworks, exhibitions, and commission opportunities.'}
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
