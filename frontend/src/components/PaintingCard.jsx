import { Link } from 'react-router-dom';
import './PaintingCard.css';

export default function PaintingCard({ painting, type }) {
  const showPrint = type === 'print';
  const price = showPrint ? painting.printPrice : painting.originalPrice || painting.price;
  const isAvailable = showPrint ? painting.printAvailable : painting.originalAvailable;
  const status = painting.sold && !showPrint ? 'Sold' : showPrint ? 'Print' : null;

  const title = `${painting.title}${painting.year ? ` (${painting.year})` : ''}`;

  return (
    <Link
      to={`/paintings/${painting.id}`}
      className={`painting-card ${!isAvailable ? 'painting-card--unavailable' : ''}`}
      aria-label={`View ${title}. ${price ? `$${Number(price).toLocaleString()}` : 'Price unavailable'}.`}
    >
      <div className="painting-card__img-wrap">
        <img
          src={painting.images?.[0]}
          alt={title}
          className="painting-card__img"
          loading="lazy"
          decoding="async"
        />
        {status && <div className={`painting-card__badge painting-card__badge--${status.toLowerCase()}`}>{status}</div>}
        {isAvailable && <div className="painting-card__hover" aria-hidden="true"><span>View →</span></div>}
      </div>

      <div className="painting-card__info">
        <h3 className="painting-card__title">{painting.title}</h3>

        <div className="painting-card__meta">
          {painting.medium && <span>{painting.medium}</span>}
          {painting.dimensions && (
            <>
              <span className="painting-card__dot" aria-hidden="true">·</span>
              <span>{painting.dimensions}</span>
            </>
          )}
          {painting.year && (
            <>
              <span className="painting-card__dot" aria-hidden="true">·</span>
              <span>{painting.year}</span>
            </>
          )}
        </div>

        {price && <p className="painting-card__price">${Number(price).toLocaleString()}</p>}
      </div>
    </Link>
  );
}
