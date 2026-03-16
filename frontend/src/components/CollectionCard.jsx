import { Link } from 'react-router-dom';
import './CollectionCard.css';

export default function CollectionCard({ collection }) {
  const thumbnail =
    collection.imageUrl ||
    collection.image_url ||
    collection.coverImage ||
    collection.paintings?.[0]?.imageUrl ||
    collection.paintings?.[0]?.image_url ||
    null;

  const count =
    collection.paintingCount ??
    collection._count?.paintings ??
    collection.paintings?.length ??
    0;

  const description = collection.description
    ? collection.description.length > 100
      ? collection.description.slice(0, 100).trimEnd() + '…'
      : collection.description
    : null;

  return (
    <Link to={`/collections/${collection.id}`} className="collection-card">
      <div className="collection-card__img-wrap">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={collection.name || 'Collection'}
            className="collection-card__img"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="collection-card__placeholder" aria-hidden="true">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
        <div className="collection-card__overlay" aria-hidden="true">
          <span className="collection-card__cta">Explore Collection</span>
        </div>
      </div>

      <div className="collection-card__info">
        <h3 className="collection-card__name">{collection.name || 'Untitled Collection'}</h3>
        {description && (
          <p className="collection-card__desc">{description}</p>
        )}
        <p className="collection-card__count">
          {count} {count === 1 ? 'work' : 'works'}
        </p>
      </div>
    </Link>
  );
}
