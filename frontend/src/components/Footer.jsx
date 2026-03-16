import { Link } from 'react-router-dom';
import './Footer.css';

const NAV_LINKS = [
  { label: 'Gallery', to: '/gallery' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Collections', to: '/collections' },
  { label: 'About', to: '/about' },
  { label: 'Commissions', to: '/commissions' },
  { label: 'Cart', to: '/cart' },
];

const SOCIAL_LINKS = [
  { label: 'Saatchi Art', href: '#' },
  { label: 'Instagram', href: '#' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">
          <div className="footer__brand">
            <Link to="/" className="footer__logo">DAHLIA</Link>
            <p className="footer__tagline">Original Paintings by Baasher</p>
          </div>

          <nav className="footer__nav" aria-label="Footer navigation">
            {NAV_LINKS.map(({ label, to }) => (
              <Link key={to} to={to} className="footer__link">
                {label}
              </Link>
            ))}
          </nav>

          <div className="footer__social">
            <p className="footer__social-heading">Find Us</p>
            {SOCIAL_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="footer__social-link"
                rel="noopener noreferrer"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">
            &copy; {new Date().getFullYear()} Dahlia. All rights reserved.
          </p>
          <p className="footer__note">
            All artworks are original and protected by copyright.
          </p>
        </div>
      </div>
    </footer>
  );
}
