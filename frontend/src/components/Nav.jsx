import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import './Nav.css';

export default function Nav() {
  const { items } = useCart();
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <a href="#main-content" className="skip-to-main">Skip to main content</a>
      
      <div className="nav__inner container">
        <Link to="/" className="nav__logo" onClick={() => setMenuOpen(false)}>
          <span className="nav__logo-name">Dahlia Baasher</span>
          <span className="nav__logo-sub">Studio</span>
        </Link>

        <button
          className={`nav__hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          aria-controls="nav-menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav
          id="nav-menu"
          className={`nav__links ${menuOpen ? 'open' : ''}`}
          role="navigation"
          aria-label="Main navigation"
        >
          <NavLink
            to="/gallery"
            className={({ isActive }) => `nav__link ${isActive ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            Artworks
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => `nav__link ${isActive ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            About
          </NavLink>
          <NavLink
            to="/commissions"
            className={({ isActive }) => `nav__link ${isActive ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            Commissions
          </NavLink>

          <Link
            to="/cart"
            className="nav__cart"
            onClick={() => setMenuOpen(false)}
            aria-label={`Shopping cart with ${items.length} ${items.length === 1 ? 'item' : 'items'}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
            </svg>
            {items.length > 0 && <span className="nav__cart-count">{items.length}</span>}
          </Link>

          <button
            className="nav__theme-btn"
            onClick={toggle}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
