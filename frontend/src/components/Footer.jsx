import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner container">
        <div className="footer__top">
          <div className="footer__brand">
            <p className="footer__name">Dahlia Baasher</p>
            <p className="footer__tagline">Contemporary Art · Toronto, Canada</p>
          </div>
          <div className="footer__links">
            <Link to="/gallery">Works</Link>
            <Link to="/about">About</Link>
            <Link to="/commissions">Commissions</Link>
            <Link to="/cart">Cart</Link>
          </div>
          <div className="footer__social">
            <a href="https://www.saatchiart.com/en-ca/dahliabaasher" target="_blank" rel="noopener noreferrer">Saatchi Art</a>
            <a href="https://www.instagram.com/dahliabaasher" target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>
        </div>
        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} Dahlia Baasher. All rights reserved.</p>
          <p>All artworks are original and protected by copyright.</p>
        </div>
      </div>
    </footer>
  );
}
