import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getPaintings, getCollections, getSiteSettings } from '../api.js';
import PaintingCard from '../components/PaintingCard.jsx';
import './GalleryPage.css';

const HEADER_DEFAULTS = {
  galleryLabel: 'Portfolio',
  galleryTitle: 'Artworks',
  gallerySubtitle: 'Explore original paintings and limited edition prints',
};

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
              <img 
                src={collection.paintings[0].images[0]} 
                alt={collection.name} 
                decoding="async"
                loading="lazy"
              />
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
  const [header, setHeader] = useState(HEADER_DEFAULTS);
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

    getSiteSettings()
      .then(data => setHeader({ ...HEADER_DEFAULTS, ...data }))
      .catch(() => {});
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [type]);

  const originals = paintings.filter(p => 
    !p.sold && (p.originalAvailable !== false) && (p.category !== 'print')
  );
  const prints = paintings.filter(p => p.printAvailable === true);

  let displayPaintings = [];
  if (type === 'original') {
    displayPaintings = originals;
  } else if (type === 'print') {
    displayPaintings = prints;
  } else {
    displayPaintings = paintings;
  }

  return (
    <main className="gallery-page">
      <div className="gallery-page__header">
        <div className="container">
          <p className="label">{header.galleryLabel}</p>
          <h1 className="gallery-page__title">{header.galleryTitle}</h1>
          <p className="gallery-page__subtitle">{header.gallerySubtitle}</p>
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
              onClick={() => {
                setSearchParams(val === 'all' ? {} : { type: val });
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {error && (
          <div className="gallery-error">
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="gallery-page--loading">
            <div className="spinner" />
            <p>Loading gallery...</p>
          </div>
        ) : type === 'collections' ? (
          collections.length > 0 ? (
            <CollectionsView collections={collections} />
          ) : (
            <p style={{ textAlign: 'center', padding: '60px 0' }}>No collections available.</p>
          )
        ) : (
          displayPaintings.length > 0 ? (
            <div className="gallery-grid">
              {displayPaintings.map(painting => (
                <PaintingCard key={painting.id} painting={painting} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <h3>No artworks found</h3>
            </div>
          )
        )}
      </div>
    </main>
  );
}
