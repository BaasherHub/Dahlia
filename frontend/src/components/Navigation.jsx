import { Link } from 'react-router-dom';
import './Navigation.css';

export default function Navigation() {
  return (
    <nav className="navigation">
      <div className="container">
        <Link to="/" className="navigation__logo">
          Dahlia Baasher
        </Link>
        <ul className="navigation__menu">
          <li><Link to="/gallery">Gallery</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/commissions">Commissions</Link></li>
          <li><Link to="/cart" className="navigation__cart">Cart</Link></li>
        </ul>
      </div>
    </nav>
  );
}
