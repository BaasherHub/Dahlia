import { useState, useEffect } from 'react';
import './AdminPage.css';

const ADMIN_PASSWORD = 'dahlia2026';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('paintings');
  
  // Paintings state
  const [paintings, setPaintings] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [newsletter, setNewsletter] = useState([]);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    year: '',
    medium: '',
    dimensions: '',
    price: '',
    originalPrice: '',
    printPrice: '',
    description: '',
    image: '',
    category: 'original',
    originalAvailable: true,
    printAvailable: false,
  });
  
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      loadData();
    }
  }, []);

  const loadData = () => {
    const paintingsData = JSON.parse(localStorage.getItem('paintings') || '[]');
    const commissionsData = JSON.parse(localStorage.getItem('commissions') || '[]');
    const newsletterData = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');

    setPaintings(paintingsData);
    setCommissions(commissionsData);
    setNewsletter(newsletterData);
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

  // Painting Management Functions
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validatePaintingForm = () => {
    if (!formData.title.trim()) {
      setFormError('Title is required');
      return false;
    }
    if (!formData.price && !formData.originalPrice && !formData.printPrice) {
      setFormError('At least one price is required');
      return false;
    }
    setFormError('');
    return true;
  };

  const handleSavePainting = (e) => {
    e.preventDefault();
    
    if (!validatePaintingForm()) {
      return;
    }

    let updated = [...paintings];

    if (editingId) {
      // Update existing
      updated = updated.map(p => 
        p.id === editingId ? { ...formData, id: editingId } : p
      );
      setFormSuccess('Painting updated successfully!');
    } else {
      // Add new
      const newPainting = {
        ...formData,
        id: Date.now()
      };
      updated.push(newPainting);
      setFormSuccess('Painting added successfully!');
    }

    setPaintings(updated);
    localStorage.setItem('paintings', JSON.stringify(updated));
    
    // Reset form
    setFormData({
      title: '',
      year: '',
      medium: '',
      dimensions: '',
      price: '',
      originalPrice: '',
      printPrice: '',
      description: '',
      image: '',
      category: 'original',
      originalAvailable: true,
      printAvailable: false,
    });
    setEditingId(null);

    setTimeout(() => setFormSuccess(''), 3000);
  };

  const handleEditPainting = (painting) => {
    setFormData(painting);
    setEditingId(painting.id);
    setActiveTab('paintings');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeletePainting = (id) => {
    if (window.confirm('Delete this painting?')) {
      const updated = paintings.filter(p => p.id !== id);
      setPaintings(updated);
      localStorage.setItem('paintings', JSON.stringify(updated));
      setFormSuccess('Painting deleted!');
      setTimeout(() => setFormSuccess(''), 3000);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      title: '',
      year: '',
      medium: '',
      dimensions: '',
      price: '',
      originalPrice: '',
      printPrice: '',
      description: '',
      image: '',
      category: 'original',
      originalAvailable: true,
      printAvailable: false,
    });
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
            <p>Manage your gallery, paintings, inquiries and subscribers</p>
          </div>
          <button className="btn btn--secondary" onClick={handleLogout}>
            Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === 'paintings' ? 'active' : ''}`}
            onClick={() => setActiveTab('paintings')}
          >
            Paintings ({paintings.length})
          </button>
          <button
            className={`admin-tab ${activeTab === 'commissions' ? 'active' : ''}`}
            onClick={() => setActiveTab('commissions')}
          >
            Commissions ({commissions.length})
          </button>
          <button
            className={`admin-tab ${activeTab === 'newsletter' ? 'active' : ''}`}
            onClick={() => setActiveTab('newsletter')}
          >
            Newsletter ({newsletter.length})
          </button>
        </div>

        {/* PAINTINGS TAB */}
        {activeTab === 'paintings' && (
          <>
            {/* Form Section */}
            <section className="admin-section">
              <h2>{editingId ? 'Edit Painting' : 'Add New Painting'}</h2>

              {formError && <div className="admin-error">{formError}</div>}
              {formSuccess && <div className="admin-success">{formSuccess}</div>}

              <form className="admin-form" onSubmit={handleSavePainting}>
                <div className="admin-form__row">
                  <div className="form-group">
                    <label htmlFor="title">Title *</label>
                    <input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleFormChange}
                      placeholder="e.g., Golden Hour"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="year">Year</label>
                    <input
                      id="year"
                      name="year"
                      value={formData.year}
                      onChange={handleFormChange}
                      placeholder="e.g., 2024"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="medium">Medium</label>
                    <input
                      id="medium"
                      name="medium"
                      value={formData.medium}
                      onChange={handleFormChange}
                      placeholder="e.g., Oil on canvas"
                    />
                  </div>
                </div>

                <div className="admin-form__row">
                  <div className="form-group">
                    <label htmlFor="dimensions">Dimensions</label>
                    <input
                      id="dimensions"
                      name="dimensions"
                      value={formData.dimensions}
                      onChange={handleFormChange}
                      placeholder="e.g., 24 x 36 inches"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleFormChange}
                    >
                      <option value="original">Original</option>
                      <option value="print">Print</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                </div>

                <div className="admin-form__row">
                  <div className="form-group">
                    <label htmlFor="originalPrice">Original Price ($)</label>
                    <input
                      id="originalPrice"
                      name="originalPrice"
                      type="number"
                      value={formData.originalPrice}
                      onChange={handleFormChange}
                      placeholder="e.g., 5000"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="printPrice">Print Price ($)</label>
                    <input
                      id="printPrice"
                      name="printPrice"
                      type="number"
                      value={formData.printPrice}
                      onChange={handleFormChange}
                      placeholder="e.g., 150"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="price">Price ($) - General</label>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleFormChange}
                      placeholder="e.g., 3000"
                    />
                  </div>
                </div>

                <div className="admin-form__row">
                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      placeholder="Painting description..."
                      rows="4"
                    />
                  </div>
                </div>

                <div className="admin-form__row">
                  <div className="form-group">
                    <label htmlFor="image">Image URL</label>
                    <input
                      id="image"
                      name="image"
                      value={formData.image}
                      onChange={handleFormChange}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="admin-form__row">
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="originalAvailable"
                        checked={formData.originalAvailable}
                        onChange={handleFormChange}
                      />
                      Original Available
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="printAvailable"
                        checked={formData.printAvailable}
                        onChange={handleFormChange}
                      />
                      Print Available
                    </label>
                  </div>
                </div>

                <div className="admin-form__actions">
                  <button type="submit" className="btn btn--large">
                    {editingId ? 'Update Painting' : 'Add Painting'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      className="btn btn--ghost"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </section>

            {/* Paintings List */}
            <section className="admin-section">
              <h2>All Paintings ({paintings.length})</h2>

              {paintings.length === 0 ? (
                <div className="admin-empty">No paintings yet</div>
              ) : (
                <div className="admin-paintings-grid">
                  {paintings.map(painting => (
                    <div key={painting.id} className="admin-painting-card">
                      {painting.image && (
                        <img src={painting.image} alt={painting.title} />
                      )}
                      <div className="admin-painting-card__content">
                        <h3>{painting.title}</h3>
                        <p className="admin-painting-card__meta">
                          {painting.year} • {painting.medium}
                        </p>
                        <p className="admin-painting-card__meta">
                          {painting.dimensions}
                        </p>
                        <div className="admin-painting-card__prices">
                          {painting.originalPrice && (
                            <p>Original: ${painting.originalPrice}</p>
                          )}
                          {painting.printPrice && (
                            <p>Print: ${painting.printPrice}</p>
                          )}
                        </div>
                        <div className="admin-painting-card__actions">
                          <button
                            className="admin-btn admin-btn--edit"
                            onClick={() => handleEditPainting(painting)}
                          >
                            Edit
                          </button>
                          <button
                            className="admin-btn admin-btn--delete"
                            onClick={() => handleDeletePainting(painting.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {/* COMMISSIONS TAB */}
        {activeTab === 'commissions' && (
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
                        onClick={() => alert(`Vision: ${commission.vision}\nSize: ${commission.size}`)}
                      >
                        View
                      </button>
                      <button
                        className="admin-table__btn-delete"
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
        )}

        {/* NEWSLETTER TAB */}
        {activeTab === 'newsletter' && (
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
        )}
      </div>
    </main>
  );
}
