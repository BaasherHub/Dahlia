import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getPaintings, getCollections } from '../api.js';
import PaintingCard from '../components/PaintingCard.jsx';
import './GalleryPage.css';

export default function GalleryPage() {
  const [paintings, setPaintings] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const type = searchParams.get('type') || 'all';

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([getPaintings(), getCollections()])
      .then(([paintingsData, collectionsData]) => {
        const pData = paintingsData.data || paintingsData;
        const cData = collectionsData.data || collectionsData;
        setPaintings(Array.isArray(pData) ? pData : []);
        setCollections(Array.isArray(cData) ? cData : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load data:', err);
        setError('Failed to load artworks');
        setLoading(false);
      });
  }, []);

  const originals = paintings.filter(p => 
    !p.sold && (p.originalAvailable !== false) && (p.category !== 'print')
  );
  const prints = paintings.filter(p => p.printAvailable === true);

  return (
    <main className="gallery-page">
      <div className="gallery-page__header">
        <div className="container">
          <p className="label">Portfolio</p>
          <h1 className="gallery-page__title">Artworks</h1>
          <p className="gallery-page__subtitle">Explore original paintings and limited edition prints</p>
        </div>
      </div>

      <div className="container">
        <div className="gallery-page__filters">
          {[
            ['all', 'All Works'],
            ['original', 'Original Paintings'],
            ['print', 'Limited Edition Prints'],
            ['collections', 'Collections']
          ].map(([val, label]) => (
            <button
              key={val}
              className={`gallery-filter ${type === val ? 'active' : ''}`}
              onClick={() => setSearchParams(val === 'all' ? {} : { type: val })}
            >
              {label}
            </button>
          ))}
        </div>

        {error && (
          <div className="gallery-error">
            <p>{error}</p>
            <button className="btn" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="gallery-grid">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="painting-skeleton" />
            ))}
          </div>
        ) : type === 'collections' ? (
          <CollectionsView collections={collections} />
        ) : (
          <>
            {(type === 'all' || type === 'original') && originals.length > 0 && (
              <div className="gallery-section">
                {type === 'all' && (
                  <h2 className="gallery-section__title">Original Paintings</h2>
                )}
                <div className="gallery-grid">
                  {originals.map(p => (
                    <PaintingCard key={p.id} painting={p} />
                  ))}
                </div>
              </div>
            )}

            {(type === 'all' || type === 'print') && prints.length > 0 && (
              <div className="gallery-section">
                {type === 'all' && (
                  <h2 className="gallery-section__title">Limited Edition Prints</h2>
                )}
                <div className="gallery-grid">
                  {prints.map(p => (
                    <PaintingCard key={p.id} painting={p} type="print" />
                  ))}
                </div>
              </div>
            )}

            {((type === 'original' && originals.length === 0) || 
              (type === 'print' && prints.length === 0)) && (
              <div className="gallery-empty">
                <p>No artworks available in this category.</p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

function CollectionsView({ collections }) {
  return (
    <div className="collections-grid">
      {collections.map(c => (
        <Link key={c.id} to={`/collection/${c.id}`} className="collection-card">
          {c.paintings?.[0]?.images?.[0] && (
            <div className="collection-card__image">
              <img src={c.paintings[0].images[0]} alt={c.name} />
            </div>
          )}
          <h3 className="collection-card__name">{c.name}</h3>
          <p className="collection-card__count">{c.paintings?.length || 0} works</p>
        </Link>
      ))}
    </div>
  );
}
