import { useEffect, useState } from 'react';
import { getPaintings } from '../api.js';
import PaintingCard from '../components/PaintingCard.jsx';
import './GalleryPage.css';

export default function GalleryPage() {
  const [paintings, setPaintings] = useState([]);
  const [filter, setFilter] = useState('available');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPaintings()
      .then(data => { setPaintings(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? paintings : paintings.filter(p => !p.sold);

  return (
    <main className="gallery-page">
      <div className="gallery-page__header">
        <div className="container">
          <p className="label">Portfolio</p>
          <h1 className="gallery-page__title">Works</h1>
          <p className="gallery-page__sub">
            Original paintings exploring identity, resistance, and the Sudanese experience.
          </p>
        </div>
      </div>

      <div className="container">
        <div className="gallery-page__filters">
          <button
            className={`gallery-filter ${filter === 'available' ? 'active' : ''}`}
            onClick={() => setFilter('available')}
          >
            Available
          </button>
          <button
            className={`gallery-filter ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Works
          </button>
        </div>

        {loading ? (
          <div className="gallery-page__grid">
            {[1,2,3,4,5,6].map(i => <div key={i} className="painting-skeleton" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="gallery-page__empty">
            <p>No works available at this time.</p>
          </div>
        ) : (
          <div className="gallery-page__grid">
            {filtered.map(p => <PaintingCard key={p.id} painting={p} />)}
          </div>
        )}
      </div>
    </main>
  );
}
