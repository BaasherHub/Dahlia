// src/pages/GalleryPage.jsx
import { useEffect, useState } from 'react';
import { fetchPaintings } from '../api.js';
import PaintingCard from '../components/PaintingCard.jsx';
import './GalleryPage.css';

export default function GalleryPage() {
  const [paintings, setPaintings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('available'); // 'all' | 'available'

  useEffect(() => {
    setLoading(true);
    fetchPaintings()
      .then(setPaintings)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const visible = filter === 'available'
    ? paintings.filter((p) => !p.sold)
    : paintings;

  return (
    <main className="gallery-page container">
      <div className="gallery-page__header fade-up">
        <div>
          <p className="label">Gallery</p>
          <h1 className="gallery-page__title">All Works</h1>
        </div>
        <div className="gallery-page__filters">
          <button
            className={`filter-btn ${filter === 'available' ? 'active' : ''}`}
            onClick={() => setFilter('available')}
          >
            Available
          </button>
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
        </div>
      </div>

      {loading ? (
        <div className="gallery-page__loading">
          <div className="spinner" />
        </div>
      ) : visible.length === 0 ? (
        <p className="gallery-page__empty">No paintings found.</p>
      ) : (
        <div className="paintings-grid fade-up">
          {visible.map((p) => (
            <PaintingCard key={p.id} painting={p} />
          ))}
        </div>
      )}
    </main>
  );
}
