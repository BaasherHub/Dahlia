// src/components/Footer.jsx
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <p className="footer__name">Dahlia Baasher</p>
          <p className="footer__tagline">Each painting is one of a kind</p>
        </div>
        <p className="footer__copy">© {new Date().getFullYear()} Dahlia Baasher. All rights reserved.</p>
      </div>
    </footer>
  );
}
