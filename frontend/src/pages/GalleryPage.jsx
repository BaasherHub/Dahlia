import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getPaintings, getCollections } from '../api.js';
import PaintingCard from '../components/PaintingCard.jsx';
import './GalleryPage.css';

function CollectionsView({ collections }) {
  return (
    <div className="gallery-grid gallery-grid--3">
      {collections.map(collection => (
        <Link 
          key={collection.id} 
          to={`/collection/${collection.id}`}
          className="collection-card"
        >
          <div className="collection-card__img">
            {collection.paintings?.[0]?.images?.[0] && (
              <img src={collection.paintings[0].images[0]} alt={collection.name} />
            )}
          </div>
          <h3 className="collection-card__name">{collection.name}</h3>
          <p className="collection-card__count">
            {collection.paintings?.length || 0} Painting{collection.paintings?.length !== 1 ? 's' : ''}
          </p>
        </Link>
      ))}
    </div>
  );
}

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
        try {
          const pData = paintingsData.data || paintingsData;
          const cData = collectionsData.data || collectionsData;
          setPaintings(Array.isArray(pData) ? pData : []);
          setCollections(Array.isArray(cData) ? cData : []);
        } catch (e) {
          console.error('Error processing data:', e);
          setPaintings([]);
          setCollections([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load data:', err);
        setError('Failed to load artworks. Please try again.');
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
                    <PaintingCard key={p.id} painting={p} />
                  ))}
                </div>
              </div>
            )}

            {type !== 'collections' && originals.length === 0 && prints.length === 0 && !loading && (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <p style={{ fontSize: '16px', color: '#4a4540' }}>No artworks found.</p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
