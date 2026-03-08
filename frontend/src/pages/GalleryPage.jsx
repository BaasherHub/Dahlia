import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getPaintings, getCollections } from '../api.js';
import PaintingCard from '../components/PaintingCard.jsx';
import './GalleryPage.css';

export default function GalleryPage() {
  const [paintings, setPaintings] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const type = searchParams.get('type') || 'all';

  useEffect(() => {
    setLoading(true);
    Promise.all([getPaintings(), getCollections()])
      .then(([p, c]) => { setPaintings(p); setCollections(c); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Robust filtering — works with both old DB (no category/printAvailable) and new schema
  const originals = paintings.filter(p => !p.sold && (p.originalAvailable !== false) && (p.category !== 'print'));
  const prints = paintings.filter(p => p.printAvailable === true);

  return (
    <main className="gallery-page">
      <div className="gallery-page__header">
        <div className="container">
          <p className="label">Portfolio</p>
          <h1 className="gallery-page__title">Artworks</h1>
        </div>
      </div>

      <div className="container">
        <div className="gallery-page__filters">
          {[['all','All Works'],['original','Original Paintings'],['print','Limited Edition Prints'],['collections','Collections']].map(([val, label]) => (
            <button key={val}
              className={`gallery-filter ${type === val ? 'active' : ''}`}
              onClick={() => setSearchParams(val === 'all' ? {} : { type: val })}
            >{label}</button>
          ))}
        </div>

        {loading ? (
          <div className="gallery-grid">
            {[1,2,3,4,5,6].map(i => <div key={i} className="painting-skeleton" />)}
          </div>
        ) : type === 'collections' ? (
          <CollectionsView collections={collections} />
        ) : (
          <>
            {(type === 'all' || type === 'original') && originals.length > 0 && (
              <div className="gallery-section">
                {type === 'all' && <h2 className="gallery-section__title">Original Paintings</h2>}
                <div className="gallery-grid">
                  {originals.map(p => <PaintingCard key={p.id} painting={p} />)}
                </div>
              </div>
            )}
            {(type === 'all' || type === 'print') && prints.length > 0 && (
              <div className="gallery-section">
                {type === 'all' && <h2 className="gallery-section__title">Limited Edition Prints</h2>}
                <div className="gallery-grid">
                  {prints.map(p => <PaintingCard key={p.id} painting={p} type="print" />)}
                </div>
              </div>
            )}
            {originals.length === 0 && prints.length === 0 && (
              <p className="gallery-empty">No works available at this time.</p>
            )}
          </>
        )}
      </div>
    </main>
  );
}

function CollectionsView({ collections }) {
  if (collections.length === 0) return <p className="gallery-empty">No collections yet.</p>;
  return (
    <div className="collections-list">
      {collections.map(c => (
        <Link key={c.id} to={`/collections/${c.id}`} className="collection-row">
          {c.coverImage && <img src={c.coverImage} alt={c.name} className="collection-row__img" />}
          {!c.coverImage && <div className="collection-row__placeholder" />}
          <div className="collection-row__info">
            <h3 className="collection-row__name">{c.name}</h3>
            {c.description && <p className="collection-row__desc">{c.description}</p>}
            <span className="collection-row__link">View Collection →</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
