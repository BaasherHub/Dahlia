import { useState, useEffect } from 'react';
import {
  adminVerify, adminGetPaintings, adminCreatePainting, adminUpdatePainting, adminDeletePainting,
  adminGetCollections, adminCreateCollection, adminUpdateCollection, adminDeleteCollection,
  adminGetOrders
} from '../api.js';
import './AdminPage.css';

export default function AdminPage() {
  const [key, setKey] = useState('');
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const saved = sessionStorage.getItem('adminKey');
    if (saved) {
      setKey(saved);
      adminVerify().then(ok => {
        if (ok) setAuthed(true);
        setChecking(false);
      });
    } else {
      setChecking(false);
    }
  }, []);

  const handleLogin = async () => {
    if (!key.trim()) return;
    setError('');
    sessionStorage.setItem('adminKey', key);
    const ok = await adminVerify();
    if (ok) {
      setAuthed(true);
    } else {
      sessionStorage.removeItem('adminKey');
      setError('Incorrect admin key. Please try again.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminKey');
    setAuthed(false);
    setKey('');
  };

  if (checking) return <div className="admin-loading-screen" />;

  if (!authed) return (
    <div className="admin-login">
      <div className="admin-login__card">
        <p className="label" style={{ marginBottom: 24 }}>Admin Access</p>
        <h1 className="admin-login__title">Dahlia Baasher<br /><span>Dashboard</span></h1>
        {error && <p className="admin-login__error">{error}</p>}
        <div className="form-group" style={{ marginBottom: 20 }}>
          <label className="form-label">Admin Key</label>
          <input
            className="form-input" type="password" value={key}
            onChange={e => setKey(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="Enter your admin key"
            autoFocus
          />
        </div>
        <button className="btn" style={{ width: '100%', justifyContent: 'center' }} onClick={handleLogin}>
          Enter Dashboard
        </button>
      </div>
    </div>
  );

  return <Dashboard onLogout={handleLogout} />;
}

function Dashboard({ onLogout }) {
  const [tab, setTab] = useState('paintings');
  const [paintings, setPaintings] = useState([]);
  const [collections, setCollections] = useState([]);
  const [orders, setOrders] = useState([]);
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(true);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  const loadAll = async () => {
    setLoading(true);
    try {
      const [p, c, o] = await Promise.all([adminGetPaintings(), adminGetCollections(), adminGetOrders()]);
      setPaintings(p.data || p); 
      setCollections(c.data || c); 
      setOrders(o.data || o);
    } catch (e) { 
      console.error(e);
      showToast('Failed to load data');
    }
    setLoading(false);
  };

  useEffect(() => { loadAll(); }, []);

  return (
    <div className="admin-page">
      {toast && <div className="admin-toast">{toast}</div>}
      
      <div className="admin-header">
        <div className="admin-header__content">
          <h1>Admin Dashboard</h1>
          <p>Manage your art collection</p>
        </div>
        <button className="btn btn--secondary" onClick={onLogout}>Logout</button>
      </div>

      <div className="admin-tabs">
        <button 
          className={`admin-tab ${tab === 'paintings' ? 'admin-tab--active' : ''}`}
          onClick={() => setTab('paintings')}
        >
          📸 Paintings ({paintings.length})
        </button>
        <button 
          className={`admin-tab ${tab === 'add-painting' ? 'admin-tab--active' : ''}`}
          onClick={() => setTab('add-painting')}
        >
          ➕ Add Painting
        </button>
        <button 
          className={`admin-tab ${tab === 'collections' ? 'admin-tab--active' : ''}`}
          onClick={() => setTab('collections')}
        >
          📚 Collections ({collections.length})
        </button>
        <button 
          className={`admin-tab ${tab === 'orders' ? 'admin-tab--active' : ''}`}
          onClick={() => setTab('orders')}
        >
          📦 Orders ({orders.length})
        </button>
      </div>

      <div className="admin-content">
        {loading ? (
          <p className="admin-loading">Loading...</p>
        ) : (
          <>
            {tab === 'paintings' && (
              <PaintingsTab paintings={paintings} collections={collections} onRefresh={loadAll} showToast={showToast} />
            )}
            {tab === 'add-painting' && (
              <AddPaintingTab collections={collections} onRefresh={loadAll} showToast={showToast} onDone={() => setTab('paintings')} />
            )}
            {tab === 'collections' && (
              <CollectionsTab collections={collections} onRefresh={loadAll} showToast={showToast} />
            )}
            {tab === 'add-collection' && (
              <AddCollectionTab onRefresh={loadAll} showToast={showToast} onDone={() => setTab('collections')} />
            )}
            {tab === 'orders' && (
              <OrdersTab orders={orders} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ── Paintings List ── */
function PaintingsTab({ paintings, collections, onRefresh, showToast }) {
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await adminDeletePainting(id);
      showToast('✓ Painting deleted');
      onRefresh();
    } catch (e) {
      showToast('✗ Failed to delete');
    }
  };

  const handleSetHero = async (id) => {
    try {
      await adminUpdatePainting(id, { heroImage: true });
      showToast('✓ Hero image updated!');
      onRefresh();
    } catch (e) {
      showToast('✗ Failed to update');
    }
  };

  const handleToggleAvailability = async (painting, type) => {
    try {
      const key = type === 'original' ? 'originalAvailable' : 'printAvailable';
      await adminUpdatePainting(painting.id, {
        [key]: !painting[key]
      });
      showToast(`✓ ${type} availability updated`);
      onRefresh();
    } catch (e) {
      showToast('✗ Failed to update');
    }
  };

  if (editing) {
    return (
      <EditPaintingForm
        painting={editing}
        collections={collections}
        onSave={async (data) => {
          try {
            await adminUpdatePainting(editing.id, data);
            showToast(`✓ "${editing.title}" updated!`);
            setEditing(null);
            onRefresh();
          } catch (e) {
            showToast('✗ Failed to update');
          }
        }}
        onCancel={() => setEditing(null)}
      />
    );
  }

  // Filter paintings
  let filtered = paintings;
  if (search) {
    filtered = filtered.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
  }
  if (filter === 'available') {
    filtered = filtered.filter(p => p.originalAvailable);
  } else if (filter === 'sold') {
    filtered = filtered.filter(p => !p.originalAvailable);
  }

  if (filtered.length === 0) {
    return (
      <div className="admin-empty">
        <p>No paintings found. <button className="link-btn" onClick={() => {}}>Add one now</button></p>
      </div>
    );
  }

  return (
    <div className="admin-paintings-container">
      <div className="admin-filters">
        <input
          type="text"
          placeholder="Search paintings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-search"
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="admin-select">
          <option value="all">All Paintings</option>
          <option value="available">Available</option>
          <option value="sold">Sold</option>
        </select>
      </div>

      <div className="admin-paintings-grid">
        {filtered.map(p => (
          <div key={p.id} className="admin-painting-card">
            {p.images?.[0] && (
              <div className="admin-painting-image">
                <img src={p.images[0]} alt={p.title} />
                {p.heroImage && <span className="admin-badge admin-badge--hero">Hero</span>}
                {!p.originalAvailable && <span className="admin-badge admin-badge--sold">Sold</span>}
              </div>
            )}
            <div className="admin-painting-details">
              <h3>{p.title}</h3>
              <p className="admin-meta">{p.medium} • {p.dimensions}</p>
              
              <div className="admin-prices">
                {p.originalPrice != null && (
                  <div className="admin-price-item">
                    <span>Original:</span>
                    <strong>${Number(p.originalPrice).toLocaleString()}</strong>
                    <button
                      className={`admin-status ${p.originalAvailable ? 'active' : 'inactive'}`}
                      onClick={() => handleToggleAvailability(p, 'original')}
                      title={p.originalAvailable ? 'Click to mark sold' : 'Click to mark available'}
                    >
                      {p.originalAvailable ? '✓ Available' : '✗ Sold'}
                    </button>
                  </div>
                )}
                {p.printPrice != null && (
                  <div className="admin-price-item">
                    <span>Print:</span>
                    <strong>${Number(p.printPrice).toLocaleString()}</strong>
                    <button
                      className={`admin-status ${p.printAvailable ? 'active' : 'inactive'}`}
                      onClick={() => handleToggleAvailability(p, 'print')}
                    >
                      {p.printAvailable ? '✓ Available' : '✗ Sold'}
                    </button>
                  </div>
                )}
              </div>

              {p.collection && (
                <p className="admin-collection">Collection: <strong>{p.collection.name}</strong></p>
              )}
            </div>

            <div className="admin-actions">
              <button className="admin-btn" onClick={() => setEditing(p)}>✏️ Edit</button>
              {!p.heroImage && (
                <button className="admin-btn" onClick={() => handleSetHero(p.id)}>⭐ Set Hero</button>
              )}
              <button className="admin-btn admin-btn--danger" onClick={() => handleDelete(p.id, p.title)}>🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Edit Painting Form ── */
function EditPaintingForm({ painting, collections, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: painting.title || '',
    description: painting.description || '',
    originalPrice: painting.originalPrice ?? '',
    originalAvailable: painting.originalAvailable !== false,
    printPrice: painting.printPrice ?? '',
    printAvailable: painting.printAvailable === true,
    dimensions: painting.dimensions || '',
    medium: painting.medium || 'Oil on linen',
    year: painting.year || new Date().getFullYear(),
    featured: painting.featured === true,
    heroImage: painting.heroImage === true,
    images: (painting.images || []).join('\n'),
    collectionId: painting.collectionId || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      images: form.images.split('\n').filter(url => url.trim()),
      originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
      printPrice: form.printPrice ? parseFloat(form.printPrice) : null,
      year: parseInt(form.year),
    });
  };

  return (
    <div className="admin-form-wrapper">
      <h2>Edit Painting: {painting.title}</h2>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Year</label>
            <input
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Medium</label>
            <input
              type="text"
              value={form.medium}
              onChange={(e) => setForm({ ...form, medium: e.target.value })}
              placeholder="e.g., Oil on canvas"
            />
          </div>

          <div className="form-group">
            <label>Dimensions</label>
            <input
              type="text"
              value={form.dimensions}
              onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
              placeholder="e.g., 80 × 100 cm"
            />
          </div>

          <div className="form-group">
            <label>Original Price ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.originalPrice}
              onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
              placeholder="Leave empty if not for sale"
            />
          </div>

          <div className="form-group">
            <label>Print Price ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.printPrice}
              onChange={(e) => setForm({ ...form, printPrice: e.target.value })}
              placeholder="Leave empty if not for sale"
            />
          </div>

          <div className="form-group">
            <label>Collection</label>
            <select value={form.collectionId} onChange={(e) => setForm({ ...form, collectionId: e.target.value })}>
              <option value="">None</option>
              {(Array.isArray(collections) ? collections : []).map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={form.originalAvailable}
                onChange={(e) => setForm({ ...form, originalAvailable: e.target.checked })}
              />
              Original Available
            </label>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={form.printAvailable}
                onChange={(e) => setForm({ ...form, printAvailable: e.target.checked })}
              />
              Print Available
            </label>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />
              Featured
            </label>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={form.heroImage}
                onChange={(e) => setForm({ ...form, heroImage: e.target.checked })}
              />
              Hero Image
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Painting description..."
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>Image URLs (one per line)</label>
          <textarea
            value={form.images}
            onChange={(e) => setForm({ ...form, images: e.target.value })}
            placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
            rows="4"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn">💾 Save Changes</button>
          <button type="button" className="btn btn--secondary" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

/* ── Add Painting ── */
function AddPaintingTab({ collections, onRefresh, showToast, onDone }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    originalPrice: '',
    originalAvailable: true,
    printPrice: '',
    printAvailable: false,
    dimensions: '',
    medium: 'Oil on linen',
    year: new Date().getFullYear(),
    featured: false,
    images: '',
    collectionId: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const images = form.images.split('\n').filter(url => url.trim());
    if (images.length === 0) {
      showToast('✗ Please add at least one image URL');
      return;
    }

    try {
      await adminCreatePainting({
        ...form,
        images,
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
        printPrice: form.printPrice ? parseFloat(form.printPrice) : null,
        year: parseInt(form.year),
      });
      showToast('✓ Painting added successfully!');
      onRefresh();
      onDone();
    } catch (e) {
      showToast('✗ Failed to add painting');
    }
  };

  return (
    <div className="admin-form-wrapper">
      <h2>Add New Painting</h2>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Painting title"
            />
          </div>

          <div className="form-group">
            <label>Year</label>
            <input
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Medium</label>
            <input
              type="text"
              value={form.medium}
              onChange={(e) => setForm({ ...form, medium: e.target.value })}
              placeholder="e.g., Oil on canvas"
            />
          </div>

          <div className="form-group">
            <label>Dimensions *</label>
            <input
              type="text"
              required
              value={form.dimensions}
              onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
              placeholder="e.g., 80 × 100 cm"
            />
          </div>

          <div className="form-group">
            <label>Original Price ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.originalPrice}
              onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
              placeholder="Leave empty if not for sale"
            />
          </div>

          <div className="form-group">
            <label>Print Price ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.printPrice}
              onChange={(e) => setForm({ ...form, printPrice: e.target.value })}
              placeholder="Leave empty if not for sale"
            />
          </div>

          <div className="form-group">
            <label>Collection</label>
            <select value={form.collectionId} onChange={(e) => setForm({ ...form, collectionId: e.target.value })}>
              <option value="">None</option>
              {(Array.isArray(collections) ? collections : []).map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={form.originalAvailable}
                onChange={(e) => setForm({ ...form, originalAvailable: e.target.checked })}
              />
              Original Available
            </label>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={form.printAvailable}
                onChange={(e) => setForm({ ...form, printAvailable: e.target.checked })}
              />
              Print Available
            </label>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />
              Featured
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Painting description..."
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>Image URLs * (one per line)</label>
          <textarea
            required
            value={form.images}
            onChange={(e) => setForm({ ...form, images: e.target.value })}
            placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
            rows="4"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn">➕ Add Painting</button>
          <button type="button" className="btn btn--secondary" onClick={onDone}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

/* ── Collections ── */
function CollectionsTab({ collections, onRefresh, showToast }) {
  const [editing, setEditing] = useState(null);

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete collection "${name}"?`)) return;
    try {
      await adminDeleteCollection(id);
      showToast('✓ Collection deleted');
      onRefresh();
    } catch (e) {
      showToast('✗ Failed to delete');
    }
  };

  if (editing) {
    return (
      <EditCollectionForm
        collection={editing}
        onSave={async (data) => {
          try {
            await adminUpdateCollection(editing.id, data);
            showToast('✓ Collection updated');
            setEditing(null);
            onRefresh();
          } catch (e) {
            showToast('✗ Failed to update');
          }
        }}
        onCancel={() => setEditing(null)}
      />
    );
  }

  return (
    <div className="admin-collections">
      <button className="btn" onClick={() => {}}>➕ Add Collection</button>
      {collections.length === 0 ? (
        <p className="admin-empty">No collections yet</p>
      ) : (
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {collections.map(c => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.description || '-'}</td>
                  <td>
                    <button className="admin-btn" onClick={() => setEditing(c)}>Edit</button>
                    <button className="admin-btn admin-btn--danger" onClick={() => handleDelete(c.id, c.name)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function EditCollectionForm({ collection, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: collection.name || '',
    description: collection.description || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="admin-form-wrapper">
      <h2>Edit Collection</h2>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows="3"
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn">Save</button>
          <button type="button" className="btn btn--secondary" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

function AddCollectionTab({ onRefresh, showToast, onDone }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminCreateCollection(form);
      showToast('✓ Collection added');
      onRefresh();
      onDone();
    } catch (e) {
      showToast('✗ Failed to add collection');
    }
  };

  return (
    <div className="admin-form-wrapper">
      <h2>Add Collection</h2>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Name *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Collection name"
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Collection description..."
            rows="4"
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn">➕ Add Collection</button>
          <button type="button" className="btn btn--secondary" onClick={onDone}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

/* ── Orders ── */
function OrdersTab({ orders }) {
  if (orders.length === 0) {
    return <p className="admin-empty">No orders yet</p>;
  }

  return (
    <div className="admin-orders">
      <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td><code>{order.id.slice(0, 8)}...</code></td>
                <td>{order.customerName}</td>
                <td>{order.customerEmail}</td>
                <td>${Number(order.total).toLocaleString()}</td>
                <td>{order.trackingCode ? '📦 Shipped' : '⏳ Pending'}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
