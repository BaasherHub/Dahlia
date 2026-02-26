// src/pages/OrderSuccessPage.jsx
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { fetchOrderBySession } from '../api.js';
import { useCart } from '../context/CartContext.jsx';
import './OrderSuccessPage.css';

export default function OrderSuccessPage() {
  const [params] = useSearchParams();
  const { clear } = useCart();
  const [order, setOrder] = useState(null);
  const sessionId = params.get('session_id');

  useEffect(() => {
    clear(); // Empty the cart
    if (sessionId) {
      // Poll up to 5 times — webhook may take a moment to process
      let attempts = 0;
      const poll = async () => {
        try {
          const data = await fetchOrderBySession(sessionId);
          setOrder(data);
        } catch {
          if (++attempts < 5) setTimeout(poll, 2000);
        }
      };
      poll();
    }
  }, [sessionId]);

  return (
    <main className="success-page container fade-up">
      <div className="success-page__icon">✓</div>
      <h1 className="success-page__heading">Thank you!</h1>
      <p className="success-page__sub">
        Your order is confirmed. A confirmation email is on its way.
      </p>

      {order ? (
        <div className="success-page__card">
          <h2 className="success-page__card-title">Order Details</h2>
          {order.items.map((item) => (
            <div key={item.id} className="success-page__item">
              <img src={item.painting.images[0]} alt={item.painting.title} className="success-page__img" />
              <div>
                <p className="success-page__painting-name">{item.painting.title}</p>
                <p className="success-page__painting-meta">{item.painting.medium} · {item.painting.dimensions}</p>
              </div>
            </div>
          ))}

          {order.trackingCode && (
            <div className="success-page__tracking">
              <p className="label">Tracking</p>
              <p className="success-page__tracking-code">{order.carrier}: {order.trackingCode}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="success-page__loading">
          <div className="spinner" />
          <p>Loading order details…</p>
        </div>
      )}

      <Link to="/gallery" className="btn" style={{ marginTop: 40 }}>Continue Browsing</Link>
    </main>
  );
}
