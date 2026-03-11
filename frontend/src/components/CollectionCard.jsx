import { Link } from 'react-router-dom';
import './CollectionCard.css';

export default function CollectionCard({ collection }) {
  const cover = collection.coverImage || collection.paintings?.[0]?.images?.[0];
  return (
    <Link to={`/collection/${collection.id}`} className="collection-card">
      <div className="collection-card__img-wrap">
        {cover ? <img src={cover} alt={collection.name} className="collection-card__img" /> : <div className="collection-card__placeholder" />}
        <div className="collection-card__hover"><span>Explore Collection →</span></div>
      </div>
      <div className="collection-card__info">
        <h3 className="collection-card__title">{collection.name}</h3>
        {collection.description && <p className="collection-card__desc">{collection.description}</p>}
        <p className="collection-card__count">{collection._count?.paintings || 0} works</p>
      </div>
    </Link>
  );
}
