// src/components/PaintingCard.jsx
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import './PaintingCard.css';

export default function PaintingCard({ painting }) {
  const { add, items } = useCart();
  const inCart = items.some((p) => p.id === painting.id);

  return (
    <article className="card">
      <Link to={`/paintings/${painting.id}`} className="card__image-wrap">
        <img
          src={painting.images[0]}
          alt={painting.title}
          className="card__image"
          loading="lazy"
        />
        {painting.sold && <div className="card__sold-badge">Sold</div>}
      </Link>

      <div className="card__body">
        <Link to={`/paintings/${painting.id}`}>
          <h3 className="card__title">{painting.title}</h3>
        </Link>
        <p className="card__meta">{painting.medium} · {painting.dimensions}</p>
        <div className="card__footer">
          <span className="card__price">${painting.price.toLocaleString()}</span>
          {!painting.sold && (
            <button
              className={`btn card__btn ${inCart ? 'btn-outline' : ''}`}
              onClick={() => add(painting)}
              disabled={inCart}
            >
              {inCart ? 'In Cart' : 'Add to Cart'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
