import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import './Nav.css';

const NAV_LINKS = [
  { label: 'Gallery', to: '/gallery' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Collections', to: '/collections' },
  { label: 'About', to: '/about' },
  { label: 'Commissions', to: '/commissions' },
];

export default function Nav() {
  const { count } = useCart();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {menuOpen && (
        <div
          className="nav__overlay"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      <header className={`nav${scrolled ? ' scrolled' : ''}`}>
        <a href="#main-content" className="nav__skip">Skip to main content</a>

        <div className="nav__inner">
          <Link to="/" className="nav__logo" onClick={closeMenu}>
            <span className="nav__logo-text">DAHLIA</span>
          </Link>

          <nav
            id="nav-menu"
            className={`nav__links${menuOpen ? ' open' : ''}`}
            aria-label="Main navigation"
          >
            {NAV_LINKS.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `nav__link${isActive ? ' active' : ''}`}
                onClick={closeMenu}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="nav__actions">
            <Link
              to="/wishlist"
              className="nav__icon-btn"
              aria-label="Wishlist"
              onClick={closeMenu}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </Link>

            <Link
              to="/cart"
              className="nav__icon-btn nav__cart-btn"
              aria-label={`Cart${count > 0 ? `, ${count} item${count !== 1 ? 's' : ''}` : ''}`}
              onClick={closeMenu}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {count > 0 && (
                <span className="nav__badge" aria-hidden="true">
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </Link>

            <button
              className={`nav__hamburger${menuOpen ? ' open' : ''}`}
              onClick={() => setMenuOpen(prev => !prev)}
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              aria-controls="nav-menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
