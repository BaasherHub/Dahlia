import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getOrderBySession } from '../api.js';
import { useCart } from '../context/CartContext.jsx';
import './OrderSuccessPage.css';

export default function OrderSuccessPage() {
  const [params] = useSearchParams();
  const sessionId = params.get('sessionId');
  const { clearCart } = useCart();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(!!sessionId);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    clearCart();
    if (!sessionId) return;

    let attempts = 0;
    const poll = () => {
      getOrderBySession(sessionId)
        .then(data => { setOrder(data); setLoading(false); })
        .catch(() => {
          attempts++;
          if (attempts < 5) {
            setTimeout(poll, 2000);
          } else {
            setFetchError('Unable to load order details.');
            setLoading(false);
          }
        });
    };
    poll();
  }, [sessionId]);

  return (
    <main className="success-page">
      <div className="container">
        <div className="success-page__inner">

          <div className="success-page__check" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <p className="success-page__eyebrow">Order Confirmed</p>
          <h1 className="success-page__heading">Thank you for your purchase</h1>
          <p className="success-page__subheading">
            Your order has been received. A member of our team will be in touch within 48 hours to arrange safe delivery of your artwork.
          </p>

          {sessionId && (
            <div className="success-page__order">
              {loading ? (
                <div className="success-page__state">
                  <div className="success-spinner" aria-label="Loading order…" />
                  <p>Retrieving your order details…</p>
                </div>
              ) : fetchError ? (
                <div className="success-page__state">
                  <p className="success-page__fetch-err">{fetchError}</p>
                </div>
              ) : order ? (
                <>
                  <div className="success-page__order-hd">
                    <span className="success-page__order-label">Order Reference</span>
                    <span className="success-page__order-id">#{String(order.id ?? order._id ?? '').slice(-8).toUpperCase()}</span>
                  </div>

                  <ul className="success-page__items" aria-label="Purchased works">
                    {(order.items || []).map((item, i) => {
                      const p = item.painting || item;
                      const img = p.imageUrl || p.image_url || p.images?.[0];
                      const title = p.title || item.title || 'Untitled';
                      const price = item.price ?? p.price;
                      return (
                        <li key={p.id ?? i} className="success-page__item">
                          <div className="success-page__item-thumb">
                            {img
                              ? <img src={img} alt="" aria-hidden="true" loading="lazy" />
                              : <span aria-hidden="true" className="success-page__item-thumb-ph" />}
                          </div>
                          <div className="success-page__item-body">
                            <p className="success-page__item-title">{title}</p>
                            {p.medium && <p className="success-page__item-meta">{p.medium}{p.dimensions ? ` · ${p.dimensions}` : ''}</p>}
                          </div>
                          {price != null && (
                            <span className="success-page__item-price">${Number(price).toLocaleString()}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>

                  {(order.total != null || order.amount != null) && (
                    <div className="success-page__total">
                      <span>Total</span>
                      <span>${Number(order.total ?? order.amount).toLocaleString()}</span>
                    </div>
                  )}
                </>
              ) : null}
            </div>
          )}

          <div className="success-page__note">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.42 16" />
            </svg>
            <p>We will contact you to confirm shipping details and estimated delivery for your work.</p>
          </div>

          <Link to="/gallery" className="success-page__cta">
            Continue Browsing
          </Link>
        </div>
      </div>
    </main>
  );
}
