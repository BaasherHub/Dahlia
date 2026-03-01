import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCollection } from '../api.js';
import PaintingCard from '../components/PaintingCard.jsx';
import './CollectionPage.css';

export default function CollectionPage() {
  const { id } = useParams();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCollection(id).then(c => { setCollection(c); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="collection-page collection-page--loading"><p>Loading...</p></div>;
  if (!collection) return <div className="collection-page"><div className="container"><p>Collection not found.</p></div></div>;

  return (
    <main className="collection-page">
      <div className="collection-page__header">
        <div className="container">
          <Link to="/gallery?type=collections" className="collection-page__back">← Back to Collections</Link>
          <p className="label" style={{ marginTop: 24 }}>Collection</p>
          <h1 className="collection-page__title">{collection.name}</h1>
          {collection.description && <p className="collection-page__desc">{collection.description}</p>}
        </div>
      </div>
      <div className="container">
        {collection.paintings?.length > 0 ? (
          <div className="collection-page__grid">
            {collection.paintings.map(p => <PaintingCard key={p.id} painting={p} />)}
          </div>
        ) : (
          <p className="collection-page__empty">No paintings in this collection yet.</p>
        )}
      </div>
    </main>
  );
}
