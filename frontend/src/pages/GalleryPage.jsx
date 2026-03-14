import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getPaintings, getCollections } from '../api.js';
import PaintingCard from '../components/PaintingCard.jsx';
import GalleryFilters from '../components/GalleryFilters.jsx';
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
  const type = searchParams.get('type') || 'all';

  const [filters, setFilters] = useState({
    medium: null,
    year: null,
    priceRange: null,
  });

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

  // Scroll to top when filters change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [filters, type]);

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

  // Apply additional filters
  if (filters.medium) {
    displayPaintings = displayPaintings.filter(p => p.medium === filters.medium);
  }
  if (filters.year) {
    displayPaintings = displayPaintings.filter(p => p.year === filters.year);
  }
  if (filters.priceRange) {
    displayPaintings = displayPaintings.filter(p => {
      const price = p.price || 0;
      if (filters.priceRange === 'under-1000') return price < 1000;
      if (filters.priceRange === '1000-5000') return price >= 1000 && price <= 5000;
      if (filters.priceRange === 'above-5000') return price > 5000;
      return true;
    });
  }

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
          <div className="gallery-page__layout">
            <aside className="gallery-page__filters-sidebar">
              <GalleryFilters 
                filters={filters}
                onFilterChange={(newFilters) => {
                  setFilters(newFilters);
                  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                }}
                availableMediums={['Oil', 'Acrylic', 'Watercolor', 'Mixed Media']}
                availableYears={['2024', '2023', '2022', '2021', '2020']}
              />
            </aside>

            <div className="gallery-page__content">
              {displayPaintings.length > 0 ? (
                <div className="gallery-grid">
                  {displayPaintings.map(painting => (
                    <PaintingCard key={painting.id} painting={painting} />
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <h3>No artworks found</h3>
                  <p>Try adjusting your filters</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
