import { useEffect, useState } from 'react';
import { getCollections } from '../api.js';
import CollectionCard from '../components/CollectionCard.jsx';
import './CollectionsPage.css';

export default function CollectionsPage() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCollections()
      .then(data => {
        setCollections(Array.isArray(data) ? data : (data?.data ?? []));
        setLoading(false);
      })
      .catch(() => {
        setError('Unable to load collections. Please try again.');
        setLoading(false);
      });
  }, []);

  return (
    <main className="collections-page">
      <header className="collections-page__header">
        <div className="container">
          <p className="collections-page__eyebrow">Browse</p>
          <h1 className="collections-page__title">Collections</h1>
          <p className="collections-page__subtitle">
            Curated series of original works, each collection tracing a distinct thread of exploration in Baasher's practice.
          </p>
        </div>
      </header>

      <div className="container collections-page__body">
        {loading ? (
          <div className="collections-page__loading">
            <div className="collections-spinner" aria-label="Loading collections…" />
            <p>Loading collections…</p>
          </div>
        ) : error ? (
          <div className="collections-page__error">
            <p>{error}</p>
            <button className="collections-page__retry" onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        ) : collections.length === 0 ? (
          <div className="collections-page__empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <p className="collections-page__empty-title">No collections yet</p>
            <p className="collections-page__empty-text">New collections will be announced soon. Check back later.</p>
          </div>
        ) : (
          <div className="collections-page__grid">
            {collections.map(c => (
              <CollectionCard key={c.id ?? c._id} collection={c} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
