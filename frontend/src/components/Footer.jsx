import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSiteSettings } from '../api.js';
import './Footer.css';

const DEFAULT_SOCIAL_LINKS = [
  { platform: 'Saatchi Art', url: 'https://www.saatchiart.com/en-ca/dahliabaasher', label: 'Saatchi Art' },
  { platform: 'Instagram', url: 'https://www.instagram.com/dahliabaasher', label: 'Instagram' },
];

export default function Footer() {
  const [tagline, setTagline] = useState('Contemporary Art · Toronto, Canada');
  const [socialLinks, setSocialLinks] = useState(DEFAULT_SOCIAL_LINKS);

  useEffect(() => {
    getSiteSettings()
      .then(data => {
        if (data.footerTagline) setTagline(data.footerTagline);
        if (Array.isArray(data.socialLinks) && data.socialLinks.length > 0) {
          setSocialLinks(data.socialLinks);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="footer">
      <div className="footer__inner container">
        <div className="footer__top">
          <div className="footer__brand">
            <p className="footer__name">Dahlia Baasher</p>
            <p className="footer__tagline">{tagline}</p>
          </div>
          <div className="footer__links">
            <Link to="/gallery">Artworks</Link>
            <Link to="/portfolio">Portfolio</Link>
            <Link to="/about">About</Link>
            <Link to="/commissions">Commissions</Link>
            <Link to="/cart">Cart</Link>
          </div>
          <div className="footer__social">
            {socialLinks.map((link, i) => (
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer">
                {link.label || link.platform}
              </a>
            ))}
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
