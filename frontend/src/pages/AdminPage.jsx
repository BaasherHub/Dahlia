import { useState, useEffect } from 'react';
import './AdminPage.css';

const ADMIN_PASSWORD = 'dahlia2026';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [commissions, setCommissions] = useState([]);
  const [newsletter, setNewsletter] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    // Check if already authenticated
    const auth = localStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      loadData();
    }
  }, []);

  const loadData = () => {
    const commissionsData = JSON.parse(localStorage.getItem('commissions') || '[]');
    const newsletterData = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
    const wishlistData = JSON.parse(localStorage.getItem('wishlist') || '[]');

    setCommissions(commissionsData);
    setNewsletter(newsletterData);
    setWishlist(wishlistData);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('admin_auth', 'true');
      setIsAuthenticated(true);
      setPassword('');
      loadData();
    } else {
      setError('Invalid password. Please try again.');
      setPassword('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
    setPassword('');
  };

  const deleteCommission = (id) => {
    if (window.confirm('Delete this commission inquiry?')) {
      const updated = commissions.filter(c => c.id !== id);
      setCommissions(updated);
      localStorage.setItem('commissions', JSON.stringify(updated));
    }
  };

  const deleteNewsletter = (email) => {
    if (window.confirm(`Remove ${email} from newsletter?`)) {
      const updated = newsletter.filter(e => e !== email);
      setNewsletter(updated);
      localStorage.setItem('newsletter_subscribers', JSON.stringify(updated));
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="admin-page">
        <div className="admin-container">
          <div className="admin-login">
            <div className="admin-login__card">
              <div className="admin-login__header">
                <h1>Admin Dashboard</h1>
                <p>Enter your password to continue</p>
              </div>

              <form className="admin-login__form" onSubmit={handleLogin}>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    autoFocus
                  />
                </div>

                {error && <div className="admin-error">{error}</div>}

                <button type="submit" className="btn btn--large">
                  Sign In
                </button>
              </form>

              <p className="admin-login__hint">
                Demo password: dahlia2026
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage your gallery inquiries and subscribers</p>
          </div>
          <button className="btn btn--secondary" onClick={handleLogout}>
            Sign Out
          </button>
        </div>

        <div className="admin-stats">
          <div className="admin-stat-card">
            <div className="admin-stat-card__number">{commissions.length}</div>
            <div className="admin-stat-card__label">Commission Inquiries</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-card__number">{newsletter.length}</div>
            <div className="admin-stat-card__label">Newsletter Subscribers</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-card__number">{wishlist.length}</div>
            <div className="admin-stat-card__label">Wishlisted Artworks</div>
          </div>
        </div>

        {/* Commission Inquiries */}
        <section className="admin-section">
          <h2>Commission Inquiries</h2>

          {commissions.length === 0 ? (
            <div className="admin-empty">No commission inquiries yet</div>
          ) : (
            <div className="admin-table">
              <div className="admin-table__header">
                <div>Name</div>
                <div>Email</div>
                <div>Budget</div>
                <div>Date</div>
                <div></div>
              </div>

              {commissions.map(commission => (
                <div key={commission.id} className="admin-table__row">
                  <div className="admin-table__cell"><strong>{commission.name}</strong></div>
                  <div className="admin-table__cell">
                    <a href={`mailto:${commission.email}`}>{commission.email}</a>
                  </div>
                  <div className="admin-table__cell">{commission.budget}</div>
                  <div className="admin-table__cell">
                    {new Date(commission.date).toLocaleDateString()}
                  </div>
                  <div className="admin-table__cell admin-table__cell--actions">
                    <button
                      className="admin-table__btn-details"
                      title="View details"
                      onClick={() => alert(`Vision: ${commission.vision}\nSize: ${commission.size}`)}
                    >
                      View
                    </button>
                    <button
                      className="admin-table__btn-delete"
                      title="Delete"
                      onClick={() => deleteCommission(commission.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Newsletter Subscribers */}
        <section className="admin-section">
          <h2>Newsletter Subscribers</h2>

          {newsletter.length === 0 ? (
            <div className="admin-empty">No newsletter subscribers yet</div>
          ) : (
            <div className="admin-table">
              <div className="admin-table__header">
                <div>Email Address</div>
                <div></div>
              </div>

              {newsletter.map((email, idx) => (
                <div key={idx} className="admin-table__row">
                  <div className="admin-table__cell">
                    <a href={`mailto:${email}`}>{email}</a>
                  </div>
                  <div className="admin-table__cell admin-table__cell--actions">
                    <button
                      className="admin-table__btn-delete"
                      title="Remove subscriber"
                      onClick={() => deleteNewsletter(email)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Wishlist Statistics */}
        <section className="admin-section">
          <h2>Most Wishlisted Items</h2>

          {wishlist.length === 0 ? (
            <div className="admin-empty">No wishlist data yet</div>
          ) : (
            <div className="admin-table">
              <div className="admin-table__header">
                <div>Artwork Title</div>
                <div>Year</div>
                <div>Price</div>
              </div>

              {wishlist.slice(0, 10).map((item, idx) => (
                <div key={idx} className="admin-table__row">
                  <div className="admin-table__cell">{item.title}</div>
                  <div className="admin-table__cell">{item.year}</div>
                  <div className="admin-table__cell">${item.price?.toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
