import { Link } from 'react-router-dom';
import './PaintingCard.css';

export default function PaintingCard({ painting, type }) {
  const showPrint = type === 'print';
  const price = showPrint ? painting.printPrice : (painting.originalPrice || painting.price);
  
  return (
    <Link to={`/paintings/${painting.id}`} className="painting-card">
      <div className="painting-card__img-wrap">
        <img src={painting.images?.[0]} alt={painting.title} className="painting-card__img" loading="lazy" />
        {painting.sold && !showPrint && <div className="painting-card__badge">Sold</div>}
        {showPrint && <div className="painting-card__badge painting-card__badge--print">Print</div>}
        <div className="painting-card__hover"><span>View →</span></div>
      </div>
      <div className="painting-card__info">
        <h3 className="painting-card__title">{painting.title}</h3>
        <div className="painting-card__meta">
          <span>{painting.medium}</span>
          {painting.dimensions && <><span className="painting-card__dot">·</span><span>{painting.dimensions}</span></>}
        </div>
        {price && <p className="painting-card__price">${Number(price).toLocaleString()}</p>}
      </div>
    </Link>
  );
}
