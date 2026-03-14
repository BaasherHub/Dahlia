import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import './Nav.css';

export default function Nav() {
  const { items } = useCart();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

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

      <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
        <a href="#main-content" className="skip-to-main">Skip to main content</a>
        
        <div className="nav__inner container">
          <Link to="/" className="nav__logo" onClick={closeMenu}>
            <svg 
              className="nav__logo-icon" 
              width="32" 
              height="32" 
              viewBox="0 0 32 32" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="1.2"/>
              <path 
                d="M10 16C10 12.7 12.7 10 16 10C19.3 10 22 12.7 22 16" 
                stroke="currentColor" 
                strokeWidth="1.2" 
                fill="none"
                strokeLinecap="round"
              />
              <circle cx="12" cy="18" r="1.5" fill="currentColor"/>
              <circle cx="16" cy="20" r="1.5" fill="currentColor"/>
              <circle cx="20" cy="18" r="1.5" fill="currentColor"/>
            </svg>
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
        </div>
      </header>

      <nav
        id="nav-menu"
        className={`nav__links ${menuOpen ? 'open' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <NavLink
          to="/gallery"
          className={({ isActive }) => `nav__link ${isActive ? 'active' : ''}`}
          onClick={closeMenu}
        >
          Artworks
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) => `nav__link ${isActive ? 'active' : ''}`}
          onClick={closeMenu}
        >
          About
        </NavLink>
        <NavLink
          to="/commissions"
          className={({ isActive }) => `nav__link ${isActive ? 'active' : ''}`}
          onClick={closeMenu}
        >
          Commissions
        </NavLink>

        <Link
          to="/wishlist"
          className="nav__wishlist"
          onClick={closeMenu}
          aria-label="Wishlist"
          title="My Wishlist"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </Link>

        <Link
          to="/cart"
          className="nav__cart"
          onClick={closeMenu}
          aria-label={`Shopping cart with ${items.length} ${items.length === 1 ? 'item' : 'items'}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
          </svg>
          {items.length > 0 && <span className="nav__cart-count">{items.length}</span>}
        </Link>
      </nav>
    </>
  );
}
