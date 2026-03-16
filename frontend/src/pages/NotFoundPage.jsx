import { Link } from 'react-router-dom';
import './NotFoundPage.css';

export default function NotFoundPage() {
  return (
    <main className="not-found">
      <div className="container not-found__inner">
        <p className="not-found__num" aria-hidden="true">404</p>
        <div className="not-found__rule" aria-hidden="true" />
        <h1 className="not-found__title">Page Not Found</h1>
        <p className="not-found__desc">
          The page you are looking for does not exist, may have moved, or is no longer available.
        </p>
        <div className="not-found__actions">
          <Link to="/gallery" className="not-found__btn not-found__btn--primary">
            Go to Gallery
          </Link>
          <Link to="/" className="not-found__btn not-found__btn--ghost">
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}
