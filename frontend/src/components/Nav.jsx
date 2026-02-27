import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import './Nav.css';

export default function Nav() {
  const { items } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const count = items.length;

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="nav__inner container">
        <Link to="/" className="nav__logo">
          <span className="nav__logo-name">Dahlia Baasher</span>
          <span className="nav__logo-sub">Studio</span>
        </Link>

        <nav className={`nav__links ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/gallery" className="nav__link" onClick={() => setMenuOpen(false)}>Works</NavLink>
          <NavLink to="/about" className="nav__link" onClick={() => setMenuOpen(false)}>About</NavLink>
          <NavLink to="/commissions" className="nav__link" onClick={() => setMenuOpen(false)}>Commissions</NavLink>
          <Link to="/cart" className="nav__cart" onClick={() => setMenuOpen(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/>
            </svg>
            {count > 0 && <span className="nav__cart-count">{count}</span>}
          </Link>
        </nav>

        <button className="nav__hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span className={menuOpen ? 'open' : ''}></span>
          <span className={menuOpen ? 'open' : ''}></span>
          <span className={menuOpen ? 'open' : ''}></span>
        </button>
      </div>
    </header>
  );
}
