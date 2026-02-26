// src/pages/AdminPage.jsx
import { useState, useEffect } from 'react';
import './AdminPage.css';

const API = import.meta.env.VITE_API_URL || '';

export default function AdminPage() {
  const [authed, setAuthed] = useState(() => !!sessionStorage.getItem('admin_key'));
  const [keyInput, setKeyInput] = useState('');
  const [keyError, setKeyError] = useState('');
  const [tab, setTab] = useState('paintings'); // 'paintings' | 'orders' | 'add'
  const [paintings, setPaintings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const adminKey = sessionStorage.getItem('admin_key');

  // ── Login ─────────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    // Test the key by trying to fetch paintings with it
    const res = await fetch(`${API}/api/paintings`);
    if (res.ok) {
      sessionStorage.setItem('admin_key', keyInput);
      setAuthed(true);
    } else {
      setKeyError('Wrong key — try again');
    }
  };

  // ── Fetch data ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!authed) return;
    fetchPaintings();
    fetchOrders();
  }, [authed]);

  const fetchPaintings = async () => {
    const res = await fetch(`${API}/api/paintings/all`, {
      headers: { 'x-admin-key': adminKey },
    });
    if (res.ok) setPaintings(await res.json());
  };

  const fetchOrders = async () => {
    const res = await fetch(`${API}/api/orders/all`, {
      headers: { 'x-admin-key': adminKey },
    });
    if (res.ok) setOrders(await res.json());
  };

  // ── Delete painting ───────────────────────────────────────────────────────
  const deletePainting = async (id, title) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await fetch(`${API}/api/paintings/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-key': adminKey },
    });
    setPaintings(prev => prev.filter(p => p.id !== id));
    setMsg(`"${title}" deleted.`);
  };

  // ── Toggle sold ───────────────────────────────────────────────────────────
  const toggleSold = async (painting) => {
    const res = await fetch(`${API}/api/paintings/${painting.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
      body: JSON.stringify({ sold: !painting.sold }),
    });
    if (res.ok) {
      setPaintings(prev => prev.map(p => p.id === painting.id ? { ...p, sold: !p.sold } : p));
    }
  };

  if (!authed) return <LoginScreen keyInput={keyInput} setKeyInput={setKeyInput} keyError={keyError} onLogin={handleLogin} />;

  return (
    <main className="admin-page container fade-up">
      <div className="admin-header">
        <div>
          <p className="label">Admin</p>
          <h1 className="admin-title">Dashboard</h1>
        </div>
        <button className="btn btn-outline admin-logout" onClick={() => { sessionStorage.removeItem('admin_key'); setAuthed(false); }}>
          Log out
        </button>
      </div>

      {msg && <div className="admin-msg">{msg} <button onClick={() => setMsg('')}>✕</button></div>}

      {/* Tabs */}
      <div className="admin-tabs">
        <button className={`admin-tab ${tab === 'paintings' ? 'active' : ''}`} onClick={() => setTab('paintings')}>
          Paintings ({paintings.length})
        </button>
        <button className={`admin-tab ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>
          Orders ({orders.length})
        </button>
        <button className={`admin-tab ${tab === 'add' ? 'active' : ''}`} onClick={() => setTab('add')}>
          + Add Painting
        </button>
      </div>

      {tab === 'paintings' && (
        <PaintingsTab paintings={paintings} onDelete={deletePainting} onToggleSold={toggleSold} />
      )}
      {tab === 'orders' && <OrdersTab orders={orders} />}
      {tab === 'add' && (
        <AddPaintingTab
          adminKey={adminKey}
          api={API}
          onAdded={(p) => { setPaintings(prev => [p, ...prev]); setTab('paintings'); setMsg(`"${p.title}" added!`); }}
        />
      )}
    </main>
  );
}

// ── Login screen ──────────────────────────────────────────────────────────────
function LoginScreen({ keyInput, setKeyInput, keyError, onLogin }) {
  return (
    <main className="admin-login container fade-up">
      <div className="admin-login__card">
        <p className="label">Admin Access</p>
        <h1 className="admin-login__title">Dashboard</h1>
        <form onSubmit={onLogin} className="admin-login__form">
          <input
            className="form-input"
            type="password"
            placeholder="Enter admin key"
            value={keyInput}
            onChange={e => setKeyInput(e.target.value)}
            required
          />
          {keyError && <p className="admin-login__error">{keyError}</p>}
          <button type="submit" className="btn" style={{ width: '100%', justifyContent: 'center' }}>
            Enter Dashboard
          </button>
        </form>
      </div>
    </main>
  );
}

// ── Paintings tab ─────────────────────────────────────────────────────────────
function PaintingsTab({ paintings, onDelete, onToggleSold }) {
  if (paintings.length === 0) return (
    <div className="admin-empty">No paintings yet. Click "+ Add Painting" to get started.</div>
  );
  return (
    <div className="admin-paintings">
      {paintings.map(p => (
        <div key={p.id} className={`admin-painting-row ${p.sold ? 'sold' : ''}`}>
          <img src={p.images[0]} alt={p.title} className="admin-painting-img" />
          <div className="admin-painting-info">
            <h3 className="admin-painting-title">{p.title}</h3>
            <p className="admin-painting-meta">{p.medium} · {p.dimensions} · {p.year}</p>
            <p className="admin-painting-price">${p.price.toLocaleString()}</p>
          </div>
          <div className="admin-painting-status">
            <span className={`status-badge ${p.sold ? 'sold' : 'available'}`}>
              {p.sold ? 'Sold' : 'Available'}
            </span>
          </div>
          <div className="admin-painting-actions">
            <button className="admin-btn" onClick={() => onToggleSold(p)}>
              {p.sold ? 'Mark Available' : 'Mark Sold'}
            </button>
            <button className="admin-btn danger" onClick={() => onDelete(p.id, p.title)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Orders tab ────────────────────────────────────────────────────────────────
function OrdersTab({ orders }) {
  if (orders.length === 0) return (
    <div className="admin-empty">No orders yet.</div>
  );
  return (
    <div className="admin-orders">
      {orders.map(o => (
        <div key={o.id} className="admin-order-row">
          <div className="admin-order-info">
            <p className="admin-order-name">{o.customerName}</p>
            <p className="admin-order-email">{o.customerEmail}</p>
            <p className="admin-order-address">{o.shipStreet}, {o.shipCity}, {o.shipCountry}</p>
          </div>
          <div className="admin-order-items">
            {o.items?.map(item => (
              <p key={item.id} className="admin-order-item">{item.painting?.title}</p>
            ))}
          </div>
          <div className="admin-order-right">
            <p className="admin-order-total">${o.total?.toLocaleString()}</p>
            <span className={`status-badge ${o.status?.toLowerCase()}`}>{o.status}</span>
            {o.trackingCode && (
              <p className="admin-order-tracking">{o.carrier}: {o.trackingCode}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Add painting tab ──────────────────────────────────────────────────────────
function AddPaintingTab({ adminKey, api, onAdded }) {
  const [form, setForm] = useState({
    title: '', description: '', price: '', dimensions: '',
    medium: 'Oil on canvas', year: new Date().getFullYear(), featured: false,
  });
  const [imageMode, setImageMode] = useState('url'); // 'url' | 'upload'
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadToCloudinary = async (file) => {
    // Uses Cloudinary unsigned upload — set VITE_CLOUDINARY_CLOUD_NAME in frontend env
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) {
      throw new Error('Cloudinary not configured. Please use URL mode or add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to your frontend environment variables.');
    }
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', uploadPreset);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST', body: data,
    });
    const json = await res.json();
    if (!json.secure_url) throw new Error('Image upload failed');
    return json.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let finalImageUrl = imageUrl;
      if (imageMode === 'upload' && imageFile) {
        finalImageUrl = await uploadToCloudinary(imageFile);
      }
      if (!finalImageUrl) throw new Error('Please provide an image URL or upload a photo');

      const res = await fetch(`${api}/api/paintings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          price: parseFloat(form.price),
          images: [finalImageUrl],
          dimensions: form.dimensions,
          medium: form.medium,
          year: parseInt(form.year),
          featured: form.featured,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add painting');
      onAdded(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-add-form">
      <h2 className="admin-add-title">Add New Painting</h2>
      <form onSubmit={handleSubmit}>
        <div className="admin-add-grid">

          {/* Image */}
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Painting Photo</label>
            <div className="image-mode-toggle">
              <button type="button" className={`mode-btn ${imageMode === 'url' ? 'active' : ''}`}
                onClick={() => setImageMode('url')}>Paste URL</button>
              <button type="button" className={`mode-btn ${imageMode === 'upload' ? 'active' : ''}`}
                onClick={() => setImageMode('upload')}>Upload from Computer</button>
            </div>
            {imageMode === 'url' ? (
              <input className="form-input" type="url" placeholder="https://..." value={imageUrl}
                onChange={e => { setImageUrl(e.target.value); setImagePreview(e.target.value); }} />
            ) : (
              <div className="file-upload-area" onClick={() => document.getElementById('painting-file').click()}>
                {imagePreview
                  ? <img src={imagePreview} alt="Preview" className="file-preview" />
                  : <div className="file-upload-placeholder">Click to choose a photo from your computer</div>
                }
                <input id="painting-file" type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={handleFileChange} />
              </div>
            )}
            {imagePreview && <img src={imagePreview} alt="Preview" className="admin-img-preview" />}
          </div>

          {/* Title */}
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Title</label>
            <input className="form-input" type="text" placeholder="Golden Hour" value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>

          {/* Description */}
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Description</label>
            <textarea className="form-input form-textarea" placeholder="Describe the painting..." value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })} required rows={4} />
          </div>

          {/* Price */}
          <div className="form-group">
            <label className="form-label">Price (USD)</label>
            <input className="form-input" type="number" placeholder="1200" value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })} required min="1" />
          </div>

          {/* Year */}
          <div className="form-group">
            <label className="form-label">Year</label>
            <input className="form-input" type="number" value={form.year}
              onChange={e => setForm({ ...form, year: e.target.value })} required />
          </div>

          {/* Medium */}
          <div className="form-group">
            <label className="form-label">Medium</label>
            <select className="form-input form-select" value={form.medium}
              onChange={e => setForm({ ...form, medium: e.target.value })}>
              <option>Oil on canvas</option>
              <option>Oil on linen</option>
              <option>Oil on panel</option>
              <option>Acrylic on canvas</option>
              <option>Watercolour</option>
              <option>Mixed media</option>
              <option>Pastel</option>
              <option>Other</option>
            </select>
          </div>

          {/* Dimensions */}
          <div className="form-group">
            <label className="form-label">Dimensions</label>
            <input className="form-input" type="text" placeholder="80 x 100 cm" value={form.dimensions}
              onChange={e => setForm({ ...form, dimensions: e.target.value })} required />
          </div>

          {/* Featured */}
          <div className="form-group featured-check" style={{ gridColumn: '1 / -1' }}>
            <label className="check-label">
              <input type="checkbox" checked={form.featured}
                onChange={e => setForm({ ...form, featured: e.target.checked })} />
              Show on homepage as a featured painting
            </label>
          </div>

        </div>

        {error && <p className="checkout-form__error">{error}</p>}

        <button type="submit" className="btn" style={{ marginTop: 24 }} disabled={loading}>
          {loading ? 'Adding painting…' : 'Add Painting to Gallery'}
        </button>
      </form>
    </div>
  );
}
