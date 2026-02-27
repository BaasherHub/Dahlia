import { Link } from 'react-router-dom';
import './PaintingCard.css';

export default function PaintingCard({ painting }) {
  return (
    <Link to={`/paintings/${painting.id}`} className="painting-card">
      <div className="painting-card__img-wrap">
        <img
          src={painting.images[0]}
          alt={painting.title}
          className="painting-card__img"
          loading="lazy"
        />
        {painting.sold && <div className="painting-card__sold">Sold</div>}
        <div className="painting-card__hover">
          <span className="painting-card__view">View Work →</span>
        </div>
      </div>
      <div className="painting-card__info">
        <h3 className="painting-card__title">{painting.title}</h3>
        <div className="painting-card__meta">
          <span>{painting.medium}</span>
          <span>{painting.dimensions}</span>
        </div>
        {!painting.sold && (
          <p className="painting-card__price">${painting.price.toLocaleString()}</p>
        )}
      </div>
    </Link>
  );
}
