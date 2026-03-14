import { useState } from 'react';
import './NewsletterSignup.css';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
      
      if (subscribers.includes(email)) {
        setStatus('error');
        setMessage('This email is already subscribed.');
        setTimeout(() => setStatus(null), 5000);
        return;
      }

      subscribers.push(email);
      localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));

      setStatus('success');
      setMessage('Thank you for subscribing! Check your email for updates.');
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
