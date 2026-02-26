// src/components/Nav.jsx
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import './Nav.css';

export default function Nav() {
  const { count } = useCart();
  const { pathname } = useLocation();

  return (
    <header className="nav">
      <div className="nav__inner container">
        <Link to="/" className="nav__logo">
          <span className="nav__logo-name">Dahlia Baasher</span>
          <span className="nav__logo-sub">Original Art</span>
        </Link>

        <nav className="nav__links">
          <Link to="/"        className={`nav__link ${pathname === '/' ? 'active' : ''}`}>Home</Link>
          <Link to="/gallery" className={`nav__link ${pathname === '/gallery' ? 'active' : ''}`}>Gallery</Link>
        </nav>

        <Link to="/cart" className="nav__cart">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          {count > 0 && <span className="nav__cart-count">{count}</span>}
        </Link>
      </div>
    </header>
  );
}
