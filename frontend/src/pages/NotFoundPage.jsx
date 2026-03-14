import { Link } from 'react-router-dom';
import './NotFoundPage.css';

export default function NotFoundPage() {
  return (
    <main className="not-found">
      <div className="not-found__content container">
        <div className="not-found__inner">
          <h1 className="not-found__title">404</h1>
          <p className="not-found__message">Page Not Found</p>
          <p className="not-found__desc">
            The page you're looking for doesn't exist or may have been moved. 
            Explore our collection or return to the home page.
          </p>
          <div className="not-found__actions">
            <Link to="/" className="btn">
              Go Home
            </Link>
            <Link to="/gallery" className="btn btn--outline">
              Browse Gallery
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
