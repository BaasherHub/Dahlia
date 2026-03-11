import { useState, useEffect } from 'react';
import {
  adminVerify,
  adminGetPaintings,
  adminCreatePainting,
  adminUpdatePainting,
  adminDeletePainting,
  adminGetOrders,
} from '../api.js';
import './AdminPage.css';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('paintings');

  // Data state
  const [paintings, setPaintings] = useState([]);
  const [orders, setOrders] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    year: '',
    medium: 'Oil on canvas',
    dimensions: '',
    originalPrice: '',
    printPrice: '',
    description: '',
    images: '',
    category: 'original',
    originalAvailable: true,
    printAvailable: false,
    featured: false,
    heroImage: false,
  });

  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Check existing auth on mount
  useEffect(() => {
    const savedKey = sessionStorage.getItem('adminKey');
    if (savedKey) {
      adminVerify()
        .then((ok) => {
          if (ok) {
            setIsAuthenticated(true);
            loadData();
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const loadData = async () => {
    try {
      const paintingsRes = await adminGetPaintings();
      const pData = paintingsRes.data || paintingsRes;
      setPaintings(Array.isArray(pData) ? pData : []);
    } catch (err) {
      console.error('Failed to load paintings:', err);
    }

    try {
      const ordersRes = await adminGetOrders();
      setOrders(Array.isArray(ordersRes) ? ordersRes : []);
    } catch (err) {
      console.error('Failed to load orders:', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Store key in sessionStorage for API calls
    sessionStorage.setItem('adminKey', adminKey);

    const ok = await adminVerify();
    if (ok) {
      setIsAuthenticated(true);
      setAdminKey('');
      loadData();
    } else {
      sessionStorage.removeItem('adminKey');
      setError('Invalid admin key. Please try again.');
      setAdminKey('');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminKey');
    setIsAuthenticated(false);
    setAdminKey('');
  };

  // ── Painting form handlers ──

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      year: '',
      medium: 'Oil on canvas',
      dimensions: '',
      originalPrice: '',
      printPrice: '',
      description: '',
      images: '',
      category: 'original',
      originalAvailable: true,
      printAvailable: false,
      featured: false,
      heroImage: false,
    });
    setEditingId(null);
    setFormError('');
  };

  const handleSavePainting = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!formData.title.trim()) {
      setFormError('Title is required');
      return;
    }

    // Build payload matching backend Zod schema
    const payload = {
      title: formData.title.trim(),
      description: formData.description || '',
      medium: formData.medium || 'Oil on canvas',
      dimensions: formData.dimensions || '',
      category: formData.category || 'original',
      originalAvailable: formData.originalAvailable,
      printAvailable: formData.printAvailable,
      featured: formData.featured || false,
      heroImage: formData.heroImage || false,
      images: formData.images
        ? formData.images.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
    };

    if (formData.originalPrice) payload.originalPrice = Number(formData.originalPrice);
    if (formData.printPrice) payload.printPrice = Number(formData.printPrice);
    if (formData.year) payload.year = Number(formData.year);

    try {
      if (editingId) {
        await adminUpdatePainting(editingId, payload);
        setFormSuccess('Painting updated successfully!');
      } else {
        if (payload.images.length === 0) {
          setFormError('At least one image URL is required');
          return;
        }
        await adminCreatePainting(payload);
        setFormSuccess('Painting added successfully!');
      }
      resetForm();
      loadData();
      setTimeout(() => setFormSuccess(''), 3000);
    } catch (err) {
      setFormError(err.message || 'Failed to save painting');
    }
  };

  const handleEditPainting = (painting) => {
    setFormData({
      title: painting.title || '',
      year: painting.year || '',
      medium: painting.medium || '',
      dimensions: painting.dimensions || '',
      originalPrice: painting.originalPrice || '',
      printPrice: painting.printPrice || '',
      description: painting.description || '',
      images: (painting.images || []).join(', '),
      category: painting.category || 'original',
      originalAvailable: painting.originalAvailable ?? true,
      printAvailable: painting.printAvailable ?? false,
      featured: painting.featured ?? false,
      heroImage: painting.heroImage ?? false,
    });
    setEditingId(painting.id);
    setActiveTab('paintings');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeletePainting = async (id) => {
    if (!window.confirm('Delete this painting? This cannot be undone.')) return;
    try {
      await adminDeletePainting(id);
      setFormSuccess('Painting deleted!');
      loadData();
      setTimeout(() => setFormSuccess(''), 3000);
    } catch (err) {
      setFormError(err.message || 'Failed to delete');
    }
  };

  // ── Loading / Auth screens ──

  if (loading) {
    return (
      <main className="admin-page">
        <div className="admin-container" style={{ textAlign: 'center', padding: '80px 0' }}>
          <div className="spinner" />
          <p>Checking authentication...</p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="admin-page">
        <div className="admin-container">
          <div className="admin-login">
            <div className="admin-login__card">
              <div className="admin-login__header">
                <h1>Admin Dashboard</h1>
                <p>Enter your admin key to continue</p>
              </div>

              <form className="admin-login__form" onSubmit={handleLogin}>
                <div className="form-group">
                  <label htmlFor="adminKey">Admin Key</label>
                  <input
                    id="adminKey"
                    type="password"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    placeholder="Enter admin key"
                    autoFocus
                  />
                </div>

                {error && <div className="admin-error">{error}</div>}

                <button type="submit" className="btn btn--large">
                  Sign In
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ── Main dashboard ──

  return (
    <main className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage your gallery, paintings, and orders</p>
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
            className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders ({orders.length})
          </button>
        </div>

        {/* PAINTINGS TAB */}
        {activeTab === 'paintings' && (
          <>
            <section className="admin-section">
              <h2>{editingId ? 'Edit Painting' : 'Add New Painting'}</h2>

              {formError && <div className="admin-error">{formError}</div>}
              {formSuccess && <div className="admin-success">{formSuccess}</div>}

              <form className="admin-form" onSubmit={handleSavePainting}>
                <div className="admin-form__row">
                  <div className="form-group">
                    <label htmlFor="title">Title *</label>
                    <input id="title" name="title" value={formData.title} onChange={handleFormChange} placeholder="e.g., Golden Hour" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="year">Year</label>
                    <input id="year" name="year" type="number" value={formData.year} onChange={handleFormChange} placeholder="e.g., 2024" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="medium">Medium</label>
                    <input id="medium" name="medium" value={formData.medium} onChange={handleFormChange} placeholder="e.g., Oil on canvas" />
                  </div>
                </div>

                <div className="admin-form__row">
                  <div className="form-group">
                    <label htmlFor="dimensions">Dimensions</label>
                    <input id="dimensions" name="dimensions" value={formData.dimensions} onChange={handleFormChange} placeholder="e.g., 24 x 36 inches" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select id="category" name="category" value={formData.category} onChange={handleFormChange}>
                      <option value="original">Original</option>
                      <option value="print">Print</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                </div>

                <div className="admin-form__row">
                  <div className="form-group">
                    <label htmlFor="originalPrice">Original Price ($)</label>
                    <input id="originalPrice" name="originalPrice" type="number" value={formData.originalPrice} onChange={handleFormChange} placeholder="e.g., 5000" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="printPrice">Print Price ($)</label>
                    <input id="printPrice" name="printPrice" type="number" value={formData.printPrice} onChange={handleFormChange} placeholder="e.g., 150" />
                  </div>
                </div>

                <div className="admin-form__row">
                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea id="description" name="description" value={formData.description} onChange={handleFormChange} placeholder="Painting description..." rows="4" />
                  </div>
                </div>

                <div className="admin-form__row">
                  <div className="form-group">
                    <label htmlFor="images">Image URLs (comma-separated)</label>
                    <input id="images" name="images" value={formData.images} onChange={handleFormChange} placeholder="https://..., https://..." />
                  </div>
                </div>

                <div className="admin-form__row">
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input type="checkbox" name="originalAvailable" checked={formData.originalAvailable} onChange={handleFormChange} />
                      Original Available
                    </label>
                  </div>
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input type="checkbox" name="printAvailable" checked={formData.printAvailable} onChange={handleFormChange} />
                      Print Available
                    </label>
                  </div>
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input type="checkbox" name="featured" checked={formData.featured} onChange={handleFormChange} />
                      Featured
                    </label>
                  </div>
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input type="checkbox" name="heroImage" checked={formData.heroImage} onChange={handleFormChange} />
                      Hero Image
                    </label>
                  </div>
                </div>

                <div className="admin-form__actions">
                  <button type="submit" className="btn btn--large">
                    {editingId ? 'Update Painting' : 'Add Painting'}
                  </button>
                  {editingId && (
                    <button type="button" className="btn btn--ghost" onClick={resetForm}>
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
                <div className="admin-empty">No paintings yet. Add your first painting above.</div>
              ) : (
                <div className="admin-paintings-grid">
                  {paintings.map((painting) => (
                    <div key={painting.id} className="admin-painting-card">
                      {painting.images?.[0] && <img src={painting.images[0]} alt={painting.title} />}
                      <div className="admin-painting-card__content">
                        <h3>{painting.title}</h3>
                        <p className="admin-painting-card__meta">
                          {painting.year} &middot; {painting.medium}
                        </p>
                        <p className="admin-painting-card__meta">{painting.dimensions}</p>
                        <div className="admin-painting-card__prices">
                          {painting.originalPrice && <p>Original: ${painting.originalPrice}</p>}
                          {painting.printPrice && <p>Print: ${painting.printPrice}</p>}
                        </div>
                        <div className="admin-painting-card__badges">
                          {painting.featured && <span className="admin-badge">Featured</span>}
                          {painting.heroImage && <span className="admin-badge admin-badge--hero">Hero</span>}
                          {!painting.originalAvailable && <span className="admin-badge admin-badge--sold">Sold</span>}
                        </div>
                        <div className="admin-painting-card__actions">
                          <button className="admin-btn admin-btn--edit" onClick={() => handleEditPainting(painting)}>Edit</button>
                          <button className="admin-btn admin-btn--delete" onClick={() => handleDeletePainting(painting.id)}>Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <section className="admin-section">
            <h2>Orders</h2>

            {orders.length === 0 ? (
              <div className="admin-empty">No orders yet</div>
            ) : (
              <div className="admin-table">
                <div className="admin-table__header">
                  <div>Customer</div>
                  <div>Email</div>
                  <div>Total</div>
                  <div>Status</div>
                  <div>Date</div>
                </div>

                {orders.map((order) => (
                  <div key={order.id} className="admin-table__row">
                    <div className="admin-table__cell">
                      <strong>{order.customerName}</strong>
                    </div>
                    <div className="admin-table__cell">
                      <a href={`mailto:${order.customerEmail}`}>{order.customerEmail}</a>
                    </div>
                    <div className="admin-table__cell">${order.total?.toFixed(2)}</div>
                    <div className="admin-table__cell">
                      <span className={`admin-status admin-status--${order.status?.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="admin-table__cell">
                      {new Date(order.createdAt).toLocaleDateString()}
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
