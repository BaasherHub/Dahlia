import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPainting } from '../api.js';
import { useCart } from '../context/CartContext.jsx';
import './PaintingPage.css';

export default function PaintingPage() {
  const { id } = useParams();
  const [painting, setPainting] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [version, setVersion] = useState('original'); // 'original' | 'print'
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    getPainting(id).then(p => { setPainting(p); }).catch(() => {});
  }, [id]);

  if (!painting) return (
    <div className="painting-page">
      <div className="container"><div className="painting-page__loading">Loading...</div></div>
    </div>
  );

  const hasOriginal = painting.category === 'original' || painting.category === 'both';
  const hasPrint = painting.category === 'print' || painting.category === 'both';
  const originalAvailable = hasOriginal && painting.originalAvailable && !painting.sold;
  const printAvailable = hasPrint && painting.printAvailable;

  const currentPrice = version === 'print' ? painting.printPrice : painting.originalPrice || painting.price;
  const currentAvailable = version === 'print' ? printAvailable : originalAvailable;

  const handleAddToCart = () => {
    addItem({ ...painting, selectedVersion: version, price: currentPrice });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <main className="painting-page">
      <div className="container">
        <Link to="/gallery" className="painting-page__back">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to Gallery
        </Link>
        <div className="painting-page__grid">
          {/* Images */}
          <div className="painting-page__imgs">
            <div className="painting-page__main-img-wrap">
              <img src={painting.images?.[activeImg]} alt={painting.title} className="painting-page__main-img" />
            </div>
            {painting.images?.length > 1 && (
              <div className="painting-page__thumbs">
                {painting.images.map((img, i) => (
                  <img key={i} src={img} alt="" className={`painting-page__thumb ${activeImg === i ? 'active' : ''}`}
                    onClick={() => setActiveImg(i)} />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="painting-page__info">
            <p className="label painting-page__label">{painting.medium}</p>
            <h1 className="painting-page__title">{painting.title}</h1>
            {painting.year && <p className="painting-page__year">{painting.year}</p>}

            {/* Version selector */}
            {(hasOriginal || hasPrint) && (
              <div className="painting-page__versions">
                {hasOriginal && (
                  <button
                    className={`version-btn ${version === 'original' ? 'active' : ''}`}
                    onClick={() => setVersion('original')}
                  >
                    <span className="version-btn__name">Original</span>
                    <span className="version-btn__price">
                      {painting.originalPrice ? `$${Number(painting.originalPrice).toLocaleString()}` : 'POA'}
                    </span>
                    <span className="version-btn__status">
                      {originalAvailable ? 'Available' : 'Sold'}
                    </span>
                  </button>
                )}
                {hasPrint && (
                  <button
                    className={`version-btn ${version === 'print' ? 'active' : ''}`}
                    onClick={() => setVersion('print')}
                  >
                    <span className="version-btn__name">Limited Edition Print</span>
                    <span className="version-btn__price">
                      {painting.printPrice ? `$${Number(painting.printPrice).toLocaleString()}` : 'POA'}
                    </span>
                    <span className="version-btn__status">
                      {printAvailable ? 'Available' : 'Sold Out'}
                    </span>
                  </button>
                )}
              </div>
            )}

            <p className="painting-page__price">
              {currentPrice ? `$${Number(currentPrice).toLocaleString()}` : 'Price on Application'}
            </p>

            {painting.description && <p className="painting-page__desc">{painting.description}</p>}

            <div className="painting-page__details">
              {painting.dimensions && (
                <div className="painting-page__detail">
                  <span className="painting-page__detail-label">Dimensions</span>
                  <span>{painting.dimensions}</span>
                </div>
              )}
              {painting.medium && (
                <div className="painting-page__detail">
                  <span className="painting-page__detail-label">Medium</span>
                  <span>{painting.medium}</span>
                </div>
              )}
              {painting.year && (
                <div className="painting-page__detail">
                  <span className="painting-page__detail-label">Year</span>
                  <span>{painting.year}</span>
                </div>
              )}
              <div className="painting-page__detail">
                <span className="painting-page__detail-label">Type</span>
                <span style={{ textTransform: 'capitalize' }}>{version === 'print' ? 'Limited Edition Print' : 'Original Painting'}</span>
              </div>
            </div>

            {currentAvailable ? (
              added ? (
                <p className="painting-page__added">Added to cart ✓</p>
              ) : (
                <button className="btn painting-page__add-btn" onClick={handleAddToCart}>
                  Add to Cart — ${Number(currentPrice).toLocaleString()}
                </button>
              )
            ) : (
              <div className="painting-page__sold-badge">
                {version === 'print' ? 'Print Sold Out' : 'Original Sold'}
              </div>
            )}

            <p className="painting-page__ship">
              🎁 Ships carefully packaged with certificate of authenticity
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
