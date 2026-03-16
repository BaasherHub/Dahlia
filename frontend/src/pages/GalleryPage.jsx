import { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPaintings, getCollections } from '../api.js';
import PaintingCard from '../components/PaintingCard.jsx';
import CollectionCard from '../components/CollectionCard.jsx';
import { useCart } from '../context/CartContext.jsx';
import './GalleryPage.css';

const FILTERS = [
  { value: 'all', label: 'All Works' },
  { value: 'available', label: 'Available' },
  { value: 'sold', label: 'Sold' },
  { value: 'collections', label: 'Collections' },
];

export default function GalleryPage() {
  const [paintings, setPaintings] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const debounceTimer = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { addItem } = useCart();

  const filter = searchParams.get('filter') ?? 'all';

  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([getPaintings(), getCollections()])
      .then(([pData, cData]) => {
        setPaintings(Array.isArray(pData) ? pData : (pData?.data ?? []));
        setCollections(Array.isArray(cData) ? cData : (cData?.data ?? []));
        setLoading(false);
      })
      .catch(err => {
        setError('Unable to load the gallery. Please try again.');
        setLoading(false);
      });
  }, []);

  /* debounce search */
  const handleSearch = useCallback(e => {
    const val = e.target.value;
    setSearchQuery(val);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => setDebouncedQuery(val), 350);
  }, []);

  const setFilter = val => {
    setSearchParams(val === 'all' ? {} : { filter: val });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* derive visible paintings */
  const filteredPaintings = paintings
    .filter(p => {
      if (filter === 'available') return !p.sold && p.originalAvailable !== false;
      if (filter === 'sold') return !!p.sold;
      return true;
    })
    .filter(p => {
      if (!debouncedQuery) return true;
      const q = debouncedQuery.toLowerCase();
      return (
        p.title?.toLowerCase().includes(q) ||
        p.medium?.toLowerCase().includes(q) ||
        p.year?.toString().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    });

  return (
    <main className="gallery-page">

      {/* ── PAGE HEADER ── */}
      <header className="gallery-header">
        <div className="container">
          <p className="gallery-header__eyebrow">Fine Art</p>
          <h1 className="gallery-header__title">The Gallery</h1>
          <p className="gallery-header__subtitle">
            Original paintings by Baasher — each a unique work on linen canvas
          </p>
        </div>
      </header>

      <div className="container gallery-body">

        {/* ── CONTROLS ── */}
        <div className="gallery-controls">
          <nav className="gallery-filters" role="tablist" aria-label="Filter artworks">
            {FILTERS.map(({ value, label }) => (
              <button
                key={value}
                role="tab"
                aria-selected={filter === value}
                className={`gallery-filter-tab${filter === value ? ' active' : ''}`}
                onClick={() => setFilter(value)}
              >
                {label}
              </button>
            ))}
          </nav>

          {filter !== 'collections' && (
            <div className="gallery-search">
              <svg className="gallery-search__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="search"
                className="gallery-search__input"
                placeholder="Search by title, medium, year…"
                value={searchQuery}
                onChange={handleSearch}
                aria-label="Search artworks"
              />
            </div>
          )}
        </div>

        {/* ── CONTENT ── */}
        {error && (
          <div className="gallery-error">
            <p>{error}</p>
            <button className="btn btn--ghost" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="gallery-loading">
            <div className="gallery-spinner" />
            <p>Loading the gallery…</p>
          </div>
        ) : filter === 'collections' ? (
          collections.length > 0 ? (
            <div className="gallery-collections-grid">
              {collections.map(c => (
                <CollectionCard key={c.id ?? c._id} collection={c} />
              ))}
            </div>
          ) : (
            <div className="gallery-empty">
              <p className="gallery-empty__text">No collections available.</p>
            </div>
          )
        ) : filteredPaintings.length > 0 ? (
          <>
            <p className="gallery-count">
              {filteredPaintings.length} {filteredPaintings.length === 1 ? 'work' : 'works'}
              {debouncedQuery ? ` for "${debouncedQuery}"` : ''}
            </p>
            <div className="gallery-grid">
              {filteredPaintings.map(p => (
                <PaintingCard
                  key={p.id ?? p._id}
                  painting={p}
                  onAddToCart={addItem}
                  showWishlist
                />
              ))}
            </div>
          </>
        ) : (
          <div className="gallery-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <p className="gallery-empty__title">No works found</p>
            <p className="gallery-empty__text">
              {debouncedQuery
                ? `No artworks match "${debouncedQuery}"`
                : 'No artworks in this category yet.'}
            </p>
            {debouncedQuery && (
              <button
                className="btn btn--ghost"
                onClick={() => { setSearchQuery(''); setDebouncedQuery(''); }}
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
