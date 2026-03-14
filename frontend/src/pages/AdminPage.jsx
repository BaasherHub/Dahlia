import { useState, useEffect } from 'react';
import './AdminPage.css';

const BASE = import.meta.env.VITE_API_URL || '';

const adminGetHeaders = () => ({
  'x-admin-key': sessionStorage.getItem('adminKey') || '',
});

const adminPostHeaders = () => ({
  'Content-Type': 'application/json',
  'x-admin-key': sessionStorage.getItem('adminKey') || '',
});

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('paintings');

  const [paintings, setPaintings] = useState([]);
  const [orders, setOrders] = useState([]);

  const [formData, setFormData] = useState({
    title: '', year: '', medium: 'Oil on canvas', dimensions: '',
    originalPrice: '', printPrice: '', description: '', images: '',
    category: 'original', originalAvailable: true, printAvailable: false,
    featured: false, heroImage: false,
  });
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    const saved = sessionStorage.getItem('adminKey');
    if (saved) {
      verifyAndLoad(saved);
    }
  }, []);

  const verifyAndLoad = async (key) => {
    try {
      const res = await fetch(`${BASE}/api/admin/verify`, { headers: { 'x-admin-key': key } });
      if (res.ok) {
        sessionStorage.setItem('adminKey', key);
        setIsAuthenticated(true);
        loadData();
      } else {
        sessionStorage.removeItem('adminKey');
      }
    } catch (err) {
      console.error('Verify failed:', err);
    }
  };

  const loadData = async () => {
    try {
      const res = await fetch(`${BASE}/api/paintings/all`, { headers: adminGetHeaders() });
      if (res.ok) {
        const data = await res.json();
        setPaintings(Array.isArray(data.data || data) ? (data.data || data) : []);
      }
    } catch (err) { console.error('Load paintings failed:', err); }

    try {
      const res = await fetch(`${BASE}/api/admin/orders`, { headers: adminGetHeaders() });
      if (res.ok) {
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch (err) { console.error('Load orders failed:', err); }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const key = adminKey.trim();
    sessionStorage.setItem('adminKey', key);

    try {
      const res = await fetch(`${BASE}/api/admin/verify`, { headers: { 'x-admin-key': key } });
      if (res.ok) {
        setIsAuthenticated(true);
        setAdminKey('');
        loadData();
      } else {
        sessionStorage.removeItem('adminKey');
        setError('Invalid admin key. Please check your ADMIN_KEY on Railway.');
      }
    } catch (err) {
      setError('Cannot connect to server. Please try again.');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminKey');
    setIsAuthenticated(false);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const resetForm = () => {
    setFormData({
      title: '', year: '', medium: 'Oil on canvas', dimensions: '',
      originalPrice: '', printPrice: '', description: '', images: '',
      category: 'original', originalAvailable: true, printAvailable: false,
      featured: false, heroImage: false,
    });
    setEditingId(null);
    setFormError('');
  };

  const handleSavePainting = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!formData.title.trim()) { setFormError('Title is required'); return; }

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
      images: formData.images ? formData.images.split(',').map(s => s.trim()).filter(Boolean) : [],
    };
    if (formData.originalPrice) payload.originalPrice = Number(formData.originalPrice);
    if (formData.printPrice) payload.printPrice = Number(formData.printPrice);
    if (formData.year) payload.year = Number(formData.year);

    try {
      const url = editingId ? `${BASE}/api/paintings/${editingId}` : `${BASE}/api/paintings`;
      const method = editingId ? 'PUT' : 'POST';
      if (!editingId && payload.images.length === 0) { setFormError('At least one image URL is required'); return; }
      const res = await fetch(url, { method, headers: adminPostHeaders(), body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Failed to save');
      setFormSuccess(editingId ? 'Painting updated!' : 'Painting added!');
      resetForm();
      loadData();
      setTimeout(() => setFormSuccess(''), 3000);
    } catch (err) { setFormError(err.message); }
  };

  const handleEditPainting = (p) => {
    setFormData({
      title: p.title || '', year: p.year || '', medium: p.medium || '',
      dimensions: p.dimensions || '', originalPrice: p.originalPrice || '',
      printPrice: p.printPrice || '', description: p.description || '',
      images: (p.images || []).join(', '), category: p.category || 'original',
      originalAvailable: p.originalAvailable ?? true, printAvailable: p.printAvailable ?? false,
      featured: p.featured ?? false, heroImage: p.heroImage ?? false,
    });
    setEditingId(p.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeletePainting = async (id) => {
    if (!window.confirm('Delete this painting?')) return;
    try {
      await fetch(`${BASE}/api/paintings/${id}`, { method: 'DELETE', headers: adminPostHeaders() });
      loadData();
      setFormSuccess('Painting deleted!');
      setTimeout(() => setFormSuccess(''), 3000);
    } catch (err) { setFormError(err.message); }
  };

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
                  <input id="adminKey" type="password" value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    placeholder="Enter admin key from Railway" autoFocus />
                </div>
                {error && <div className="admin-error">{error}</div>}
                <button type="submit" className="btn btn--large" disabled={loading}>
                  {loading ? 'Verifying...' : 'Sign In'}
                </button>
              </form>
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
            <p>Manage your gallery and orders</p>
          </div>
          <button className="btn btn--secondary" onClick={handleLogout}>Sign Out</button>
        </div>

        <div className="admin-tabs">
          <button className={`admin-tab ${activeTab === 'paintings' ? 'active' : ''}`} onClick={() => setActiveTab('paintings')}>
            Paintings ({paintings.length})
          </button>
          <button className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            Orders ({orders.length})
          </button>
        </div>

        {activeTab === 'paintings' && (
          <>
            <section className="admin-section">
              <h2>{editingId ? 'Edit Painting' : 'Add New Painting'}</h2>
              {formError && <div className="admin-error">{formError}</div>}
              {formSuccess && <div className="admin-success">{formSuccess}</div>}
              <form className="admin-form" onSubmit={handleSavePainting}>
                <div className="admin-form__row">
                  <div className="form-group"><label>Title *</label><input name="title" value={formData.title} onChange={handleFormChange} required /></div>
                  <div className="form-group"><label>Year</label><input name="year" type="number" value={formData.year} onChange={handleFormChange} /></div>
                  <div className="form-group"><label>Medium</label><input name="medium" value={formData.medium} onChange={handleFormChange} /></div>
                </div>
                <div className="admin-form__row">
                  <div className="form-group"><label>Dimensions</label><input name="dimensions" value={formData.dimensions} onChange={handleFormChange} /></div>
                  <div className="form-group"><label>Category</label>
                    <select name="category" value={formData.category} onChange={handleFormChange}>
                      <option value="original">Original</option><option value="print">Print</option><option value="both">Both</option>
                    </select>
                  </div>
                </div>
                <div className="admin-form__row">
                  <div className="form-group"><label>Original Price ($)</label><input name="originalPrice" type="number" value={formData.originalPrice} onChange={handleFormChange} /></div>
                  <div className="form-group"><label>Print Price ($)</label><input name="printPrice" type="number" value={formData.printPrice} onChange={handleFormChange} /></div>
                </div>
                <div className="admin-form__row">
                  <div className="form-group"><label>Description</label><textarea name="description" value={formData.description} onChange={handleFormChange} rows="3" /></div>
                </div>
                <div className="admin-form__row">
                  <div className="form-group"><label>Image URLs (comma-separated)</label><input name="images" value={formData.images} onChange={handleFormChange} /></div>
                </div>
                <div className="admin-form__checkboxes">
                  <label className="checkbox-label"><input type="checkbox" name="originalAvailable" checked={formData.originalAvailable} onChange={handleFormChange} /> Original Available</label>
                  <label className="checkbox-label"><input type="checkbox" name="printAvailable" checked={formData.printAvailable} onChange={handleFormChange} /> Print Available</label>
                  <label className="checkbox-label"><input type="checkbox" name="featured" checked={formData.featured} onChange={handleFormChange} /> Featured</label>
                  <label className="checkbox-label"><input type="checkbox" name="heroImage" checked={formData.heroImage} onChange={handleFormChange} /> Hero Image</label>
                </div>
                <div className="admin-form__actions">
                  <button type="submit" className="btn btn--large">{editingId ? 'Update Painting' : 'Add Painting'}</button>
                  {editingId && <button type="button" className="btn btn--ghost" onClick={resetForm}>Cancel</button>}
                </div>
              </form>
            </section>

            <section className="admin-section">
              <h2>All Paintings ({paintings.length})</h2>
              {paintings.length === 0 ? (
                <div className="admin-empty">No paintings in the database yet.</div>
              ) : (
                <div className="admin-paintings-grid">
                  {paintings.map(p => (
                    <div key={p.id} className="admin-painting-card">
                      {p.images?.[0] && <img src={p.images[0]} alt={p.title} />}
                      <div className="admin-painting-card__content">
                        <h3>{p.title}</h3>
                        <p className="admin-painting-card__meta">{p.year} &middot; {p.medium}</p>
                        <p className="admin-painting-card__meta">{p.dimensions}</p>
                        <div className="admin-painting-card__prices">
                          {p.originalPrice && <p>Original: ${p.originalPrice}</p>}
                          {p.printPrice && <p>Print: ${p.printPrice}</p>}
                        </div>
                        <div className="admin-painting-card__actions">
                          <button className="admin-btn admin-btn--edit" onClick={() => handleEditPainting(p)}>Edit</button>
                          <button className="admin-btn admin-btn--delete" onClick={() => handleDeletePainting(p.id)}>Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {activeTab === 'orders' && (
          <section className="admin-section">
            <h2>Orders ({orders.length})</h2>
            {orders.length === 0 ? (
              <div className="admin-empty">No orders yet</div>
            ) : (
              <div className="admin-orders">
                {orders.map(o => (
                  <div key={o.id} className="admin-order-card">
                    <div><strong>{o.customerName}</strong></div>
                    <div>{o.customerEmail}</div>
                    <div>${o.total?.toFixed(2)}</div>
                    <div className={`admin-status admin-status--${o.status?.toLowerCase()}`}>{o.status}</div>
                    <div>{new Date(o.createdAt).toLocaleDateString()}</div>
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
