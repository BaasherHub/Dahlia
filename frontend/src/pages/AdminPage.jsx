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
      setPaintings(p); setCollections(c); setOrders(o);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { loadAll(); }, []);

  return (
    <div className="admin-page">
      {toast && (
        <div className="admin-toast">
          {toast}
          <button onClick={() => setToast('')}>×</button>
        </div>
      )}

      <div className="admin-header container">
        <div>
          <p className="label">Admin</p>
          <h1 className="admin-header__title">
            Dahlia Baasher<br /><span>Dashboard</span>
          </h1>
        </div>
        <button className="btn btn-ghost" onClick={onLogout}>Log Out</button>
      </div>

      <div className="admin-body container">
        <div className="admin-tabs">
          <button className={`admin-tab ${tab === 'paintings' ? 'active' : ''}`} onClick={() => setTab('paintings')}>
            Paintings ({paintings.length})
          </button>
          <button className={`admin-tab ${tab === 'collections' ? 'active' : ''}`} onClick={() => setTab('collections')}>
            Collections ({collections.length})
          </button>
          <button className={`admin-tab ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>
            Orders ({orders.length})
          </button>
          <button className={`admin-tab admin-tab--add ${tab === 'add-painting' ? 'active' : ''}`} onClick={() => setTab('add-painting')}>
            + Add Painting
          </button>
          <button className={`admin-tab admin-tab--add ${tab === 'add-collection' ? 'active' : ''}`} onClick={() => setTab('add-collection')}>
            + Add Collection
          </button>
        </div>

        {loading ? (
          <div className="admin-loading">Loading…</div>
        ) : (
          <>
            {tab === 'paintings' && (
              <PaintingsTab paintings={paintings} collections={collections} onRefresh={loadAll} showToast={showToast} />
            )}
            {tab === 'collections' && (
              <CollectionsTab collections={collections} onRefresh={loadAll} showToast={showToast} />
            )}
            {tab === 'orders' && <OrdersTab orders={orders} />}
            {tab === 'add-painting' && (
              <AddPaintingTab collections={collections} onRefresh={loadAll} showToast={showToast} onDone={() => setTab('paintings')} />
            )}
            {tab === 'add-collection' && (
              <AddCollectionTab onRefresh={loadAll} showToast={showToast} onDone={() => setTab('collections')} />
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

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await adminDeletePainting(id);
    showToast('Painting deleted');
    onRefresh();
  };

  const handleSetHero = async (id) => {
    await adminUpdatePainting(id, { heroImage: true });
    showToast('✓ Hero image updated!');
    onRefresh();
  };

  if (editing) return (
    <EditPaintingForm
      painting={editing}
      collections={collections}
      onSave={async (data) => {
        await adminUpdatePainting(editing.id, data);
        showToast(`✓ "${editing.title}" updated!`);
        setEditing(null);
        onRefresh();
      }}
      onCancel={() => setEditing(null)}
    />
  );

  if (paintings.length === 0) return (
    <p className="admin-empty">No paintings yet. Click "+ Add Painting" to get started.</p>
  );

  return (
    <div className="admin-paintings">
      {paintings.map(p => (
        <div key={p.id} className="admin-painting-row">
          {p.images?.[0] && (
            <img src={p.images[0]} alt={p.title} className="admin-painting-img" />
          )}
          <div className="admin-painting-info">
            <p className="admin-painting-title">{p.title}</p>
            <p className="admin-painting-meta">{p.medium} · {p.dimensions} · {p.year}</p>
            <div className="admin-painting-prices">
              {p.originalPrice != null && (
                <span className="admin-price-tag">
                  Original: ${Number(p.originalPrice).toLocaleString()}
                  {p.originalAvailable ? ' ✓' : ' ✗'}
                </span>
              )}
              {p.printPrice != null && (
                <span className="admin-price-tag admin-price-tag--print">
                  Print: ${Number(p.printPrice).toLocaleString()}
                  {p.printAvailable ? ' ✓' : ' ✗'}
                </span>
              )}
            </div>
            {p.collection && (
              <p className="admin-painting-collection">Collection: {p.collection.name}</p>
            )}
          </div>
          <div className="admin-painting-badges">
            {p.heroImage && <span className="admin-badge admin-badge--hero">Hero</span>}
            {p.sold && <span className="admin-badge admin-badge--sold">Sold</span>}
            {p.featured && <span className="admin-badge admin-badge--featured">Featured</span>}
          </div>
          <div className="admin-painting-actions">
            <button className="admin-btn" onClick={() => setEditing(p)}>Edit</button>
            {!p.heroImage && (
              <button className="admin-btn" onClick={() => handleSetHero(p.id)}>Set Hero</button>
            )}
            <button className="admin-btn admin-btn--danger" onClick={() => handleDelete(p.id, p.title)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Edit Form ── */
function EditPaintingForm({ painting, collections, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: painting.title || '',
    description: painting.description || '',
    originalPrice: painting.originalPrice ?? '',
    originalAvailable: painting.originalAvailable !== false,
    printPrice: painting.printPrice ?? '',
    printAvailable: painting.printAvailable === true,
    dimensions: painting.dimensions || '',
    medium: painting.medium || 'Oil on linen canvas',
    year: painting.year || new Date().getFullYear(),
    featured: painting.featured || false,
    sold: painting.sold || false,
    collectionId: painting.collectionId || '',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="admin-form-wrap">
      <div className="admin-form-header">
        <h2 className="admin-form-title">Edit: {painting.title}</h2>
        <button className="admin-btn" onClick={onCancel}>← Back</button>
      </div>
      <div className="admin-form">
        <div className="form-group">
          <label className="form-label">Title</label>
          <input className="form-input" value={form.title} onChange={e => set('title', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-input" rows={3} value={form.description} onChange={e => set('description', e.target.value)} />
        </div>

        <div className="admin-form__section-title">Original Painting</div>
        <div className="admin-form__row">
          <div className="form-group">
            <label className="form-label">Price ($)</label>
            <input className="form-input" type="number" value={form.originalPrice} onChange={e => set('originalPrice', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Availability</label>
            <select className="form-input form-select" value={String(form.originalAvailable)} onChange={e => set('originalAvailable', e.target.value === 'true')}>
              <option value="true">Available</option>
              <option value="false">Not Available / Sold</option>
            </select>
          </div>
        </div>

        <div className="admin-form__section-title">Limited Edition Print (optional)</div>
        <div className="admin-form__row">
          <div className="form-group">
            <label className="form-label">Print Price ($)</label>
            <input className="form-input" type="number" value={form.printPrice} onChange={e => set('printPrice', e.target.value)} placeholder="Leave empty if no print" />
          </div>
          <div className="form-group">
            <label className="form-label">Print Availability</label>
            <select className="form-input form-select" value={String(form.printAvailable)} onChange={e => set('printAvailable', e.target.value === 'true')}>
              <option value="false">Not Available</option>
              <option value="true">Available</option>
            </select>
          </div>
        </div>

        <div className="admin-form__row">
          <div className="form-group">
            <label className="form-label">Dimensions</label>
            <input className="form-input" value={form.dimensions} onChange={e => set('dimensions', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Year</label>
            <input className="form-input" type="number" value={form.year} onChange={e => set('year', e.target.value)} />
          </div>
        </div>
        <div className="admin-form__row">
          <div className="form-group">
            <label className="form-label">Medium</label>
            <input className="form-input" value={form.medium} onChange={e => set('medium', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Collection</label>
            <select className="form-input form-select" value={form.collectionId} onChange={e => set('collectionId', e.target.value)}>
              <option value="">No Collection</option>
              {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <div className="admin-form__row">
          <div className="form-group">
            <label className="form-label">Featured on Homepage</label>
            <select className="form-input form-select" value={String(form.featured)} onChange={e => set('featured', e.target.value === 'true')}>
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Mark as Sold</label>
            <select className="form-input form-select" value={String(form.sold)} onChange={e => set('sold', e.target.value === 'true')}>
              <option value="false">No</option>
              <option value="true">Sold</option>
            </select>
          </div>
        </div>
        <div className="admin-form__actions">
          <button className="btn" onClick={() => onSave(form)}>Save Changes</button>
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* ── Add Painting ── */
function AddPaintingTab({ collections, onRefresh, showToast, onDone }) {
  const [form, setForm] = useState({
    title: '', description: '',
    originalPrice: '', originalAvailable: true,
    printPrice: '', printAvailable: false,
    dimensions: '', medium: 'Oil on linen canvas',
    year: new Date().getFullYear(),
    featured: false, collectionId: '',
    imageUrl: '', imageFile: null,
  });
  const [useFile, setUseFile] = useState(false);
  const [uploading, setUploading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const uploadToCloudinary = async (file) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !preset) {
      throw new Error('Cloudinary not configured. Please paste an image URL instead, or add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to your Railway frontend environment variables.');
    }
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', preset);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: data });
    const json = await res.json();
    if (!json.secure_url) throw new Error('Upload failed');
    return json.secure_url;
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) { alert('Title is required'); return; }
    let imageUrl = form.imageUrl.trim();
    if (useFile && form.imageFile) {
      setUploading(true);
      try { imageUrl = await uploadToCloudinary(form.imageFile); }
      catch (e) { alert(e.message); setUploading(false); return; }
      setUploading(false);
    }
    if (!imageUrl) { alert('Please provide an image URL or upload a file'); return; }
    try {
      await adminCreatePainting({
        title: form.title, description: form.description,
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
        originalAvailable: form.originalAvailable,
        printPrice: form.printPrice ? parseFloat(form.printPrice) : null,
        printAvailable: form.printAvailable,
        images: [imageUrl],
        dimensions: form.dimensions, medium: form.medium,
        year: parseInt(form.year), featured: form.featured,
        collectionId: form.collectionId || null,
      });
      showToast(`✓ "${form.title}" added!`);
      onRefresh();
      onDone();
    } catch (e) { alert(e.message); }
  };

  return (
    <div className="admin-form-wrap">
      <h2 className="admin-form-title">Add New Painting</h2>
      <div className="admin-form">
        <div className="form-group">
          <label className="form-label">Title *</label>
          <input className="form-input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Painting title" />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-input" rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="About this painting…" />
        </div>

        <div className="admin-form__section-title">Original Painting</div>
        <div className="admin-form__row">
          <div className="form-group">
            <label className="form-label">Price ($)</label>
            <input className="form-input" type="number" value={form.originalPrice} onChange={e => set('originalPrice', e.target.value)} placeholder="e.g. 2000" />
          </div>
          <div className="form-group">
            <label className="form-label">Availability</label>
            <select className="form-input form-select" value={String(form.originalAvailable)} onChange={e => set('originalAvailable', e.target.value === 'true')}>
              <option value="true">Available</option>
              <option value="false">Not Available</option>
            </select>
          </div>
        </div>

        <div className="admin-form__section-title">Limited Edition Print <span style={{ fontWeight: 300, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></div>
        <div className="admin-form__row">
          <div className="form-group">
            <label className="form-label">Print Price ($)</label>
            <input className="form-input" type="number" value={form.printPrice} onChange={e => set('printPrice', e.target.value)} placeholder="Leave empty if none" />
          </div>
          <div className="form-group">
            <label className="form-label">Print Availability</label>
            <select className="form-input form-select" value={String(form.printAvailable)} onChange={e => set('printAvailable', e.target.value === 'true')}>
              <option value="false">Not Available</option>
              <option value="true">Available</option>
            </select>
          </div>
        </div>

        <div className="admin-form__row">
          <div className="form-group">
            <label className="form-label">Dimensions</label>
            <input className="form-input" value={form.dimensions} onChange={e => set('dimensions', e.target.value)} placeholder="e.g. 80 x 100 cm" />
          </div>
          <div className="form-group">
            <label className="form-label">Year</label>
            <input className="form-input" type="number" value={form.year} onChange={e => set('year', e.target.value)} />
          </div>
        </div>
        <div className="admin-form__row">
          <div className="form-group">
            <label className="form-label">Medium</label>
            <input className="form-input" value={form.medium} onChange={e => set('medium', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Collection</label>
            <select className="form-input form-select" value={form.collectionId} onChange={e => set('collectionId', e.target.value)}>
              <option value="">No Collection</option>
              {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Featured on Homepage</label>
          <select className="form-input form-select" value={String(form.featured)} onChange={e => set('featured', e.target.value === 'true')}>
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>

        <div className="admin-form__section-title">Image</div>
        <div className="admin-upload-toggle">
          <button type="button" className={`admin-upload-btn ${!useFile ? 'active' : ''}`} onClick={() => setUseFile(false)}>Paste URL</button>
          <button type="button" className={`admin-upload-btn ${useFile ? 'active' : ''}`} onClick={() => setUseFile(true)}>Upload File</button>
        </div>
        {!useFile ? (
          <div className="form-group">
            <label className="form-label">Image URL</label>
            <input className="form-input" value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} placeholder="https://..." />
          </div>
        ) : (
          <div className="form-group">
            <label className="form-label">Image File</label>
            <input className="form-input" type="file" accept="image/*" onChange={e => set('imageFile', e.target.files[0])} />
          </div>
        )}

        <button type="button" className="btn" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} onClick={handleSubmit} disabled={uploading}>
          {uploading ? 'Uploading…' : 'Add Painting'}
        </button>
      </div>
    </div>
  );
}

/* ── Collections List ── */
function CollectionsTab({ collections, onRefresh, showToast }) {
  const [editing, setEditing] = useState(null);

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete collection "${name}"? Paintings will remain.`)) return;
    await adminDeleteCollection(id);
    showToast('Collection deleted');
    onRefresh();
  };

  if (editing) return (
    <EditCollectionForm
      collection={editing}
      onSave={async (data) => {
        await adminUpdateCollection(editing.id, data);
        showToast(`✓ "${editing.name}" updated!`);
        setEditing(null);
        onRefresh();
      }}
      onCancel={() => setEditing(null)}
    />
  );

  if (collections.length === 0) return (
    <p className="admin-empty">No collections yet. Click "+ Add Collection" to get started.</p>
  );

  return (
    <div className="admin-paintings">
      {collections.map(c => (
        <div key={c.id} className="admin-painting-row">
          {c.coverImage && <img src={c.coverImage} alt={c.name} className="admin-painting-img" />}
          <div className="admin-painting-info">
            <p className="admin-painting-title">{c.name}</p>
            {c.description && <p className="admin-painting-meta">{c.description}</p>}
            <p className="admin-painting-meta">{c._count?.paintings || 0} paintings</p>
          </div>
          <div className="admin-painting-actions">
            <button className="admin-btn" onClick={() => setEditing(c)}>Edit</button>
            <button className="admin-btn admin-btn--danger" onClick={() => handleDelete(c.id, c.name)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function EditCollectionForm({ collection, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: collection.name || '',
    description: collection.description || '',
    coverImage: collection.coverImage || '',
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div className="admin-form-wrap">
      <div className="admin-form-header">
        <h2 className="admin-form-title">Edit: {collection.name}</h2>
        <button className="admin-btn" onClick={onCancel}>← Back</button>
      </div>
      <div className="admin-form">
        <div className="form-group"><label className="form-label">Name</label><input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" rows={3} value={form.description} onChange={e => set('description', e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Cover Image URL</label><input className="form-input" value={form.coverImage} onChange={e => set('coverImage', e.target.value)} placeholder="https://..." /></div>
        <div className="admin-form__actions">
          <button className="btn" onClick={() => onSave(form)}>Save Changes</button>
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* ── Add Collection ── */
function AddCollectionTab({ onRefresh, showToast, onDone }) {
  const [form, setForm] = useState({ name: '', description: '', coverImage: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const handleSubmit = async () => {
    if (!form.name.trim()) { alert('Name is required'); return; }
    try {
      await adminCreateCollection(form);
      showToast(`✓ Collection "${form.name}" created!`);
      onRefresh(); onDone();
    } catch (e) { alert(e.message); }
  };
  return (
    <div className="admin-form-wrap">
      <h2 className="admin-form-title">Add New Collection</h2>
      <div className="admin-form">
        <div className="form-group"><label className="form-label">Name *</label><input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Sudan Series" /></div>
        <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="About this collection…" /></div>
        <div className="form-group"><label className="form-label">Cover Image URL</label><input className="form-input" value={form.coverImage} onChange={e => set('coverImage', e.target.value)} placeholder="https://..." /></div>
        <button type="button" className="btn" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} onClick={handleSubmit}>Create Collection</button>
      </div>
    </div>
  );
}

/* ── Orders ── */
function OrdersTab({ orders }) {
  if (orders.length === 0) return <p className="admin-empty">No orders yet.</p>;
  return (
    <div className="admin-orders">
      {orders.map(o => (
        <div key={o.id} className="admin-order-row">
          <div className="admin-order-header">
            <div>
              <p className="admin-order-id">#{o.id.slice(-8).toUpperCase()}</p>
              <p className="admin-order-customer">{o.customerName} · {o.customerEmail}</p>
              <p className="admin-order-date">{new Date(o.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="admin-order-right">
              <span className={`admin-status admin-status--${o.status.toLowerCase()}`}>{o.status}</span>
              <p className="admin-order-total">${Number(o.total).toLocaleString()}</p>
            </div>
          </div>
          <div className="admin-order-items">
            {o.items?.map((item, i) => (
              <div key={i} className="admin-order-item">
                <span>{item.painting?.title || 'Unknown'}</span>
                <span className="admin-order-item-version">{item.version}</span>
                <span>${Number(item.price).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <p className="admin-order-ship">{o.shipName} · {o.shipCity}, {o.shipCountry}</p>
        </div>
      ))}
    </div>
  );
}
