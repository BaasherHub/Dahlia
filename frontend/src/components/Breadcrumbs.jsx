import { Link, useLocation } from 'react-router-dom';
import './Breadcrumbs.css';

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  if (pathnames.length === 0) return null;

  const breadcrumbNames = {
    'gallery': 'Gallery',
    'paintings': 'Artworks',
    'about': 'About',
    'blog': 'Blog',
    'commissions': 'Commissions',
    'cart': 'Cart',
    'checkout': 'Checkout',
    'order-success': 'Order Confirmation',
    'collection': 'Collection',
    'wishlist': 'Wishlist',
  };

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol className="breadcrumbs__list">
        <li className="breadcrumbs__item">
          <Link to="/" className="breadcrumbs__link">Home</Link>
        </li>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const displayName = breadcrumbNames[name] || name.charAt(0).toUpperCase() + name.slice(1);

          return (
            <li key={routeTo} className="breadcrumbs__item">
              <span className="breadcrumbs__separator">/</span>
              {isLast ? (
                <span className="breadcrumbs__current">{displayName}</span>
              ) : (
                <Link to={routeTo} className="breadcrumbs__link">{displayName}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
