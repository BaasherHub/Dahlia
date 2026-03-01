import { useState, useEffect } from 'react';
import './AdminPage.css';

const API = import.meta.env.VITE_API_URL || '';

export default function AdminPage() {
  const [key, setKey] = useState(sessionStorage.getItem('adminKey') || '');
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState('paintings');

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/api/paintings/all`, { headers: { 'x-admin-key': key } });
      if (res.ok) { sessionStorage.setItem('adminKey', key); setAuthed(true); }
      else alert('Wrong admin key');
    } catch { alert('Cannot reach server'); }
  };

  if (!authed) return (
    <div className="admin-login">
      <div className="admin-login__card">
        <p className="label" style={{ marginBottom: 16 }}>Admin</p>
        <h1 className="admin-login__title">Dahlia Baasher<br/>Dashboard</h1>
        <form onSubmit={login} className="admin-login__form">
          <div className="form-group">
            <label className="form-label">Admin Key</label>
            <input className="form-input" type="password" value={key}
              onChange={e => setKey(e.target.value)} placeholder="Enter admin key" required />
          </div>
          <button type="submit" className="btn" style={{ width: '100%', justifyContent: 'center' }}>Enter Dashboard</button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <p className="label">Admin</p>
          <h1 className="admin-page__title">Dahlia Baasher Dashboard</h1>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => { sessionStorage.removeItem('adminKey'); setAuthed(false); }}>
          Log Out
        </button>
      </div>

      <div className="admin-tabs">
        {[['paintings','Paintings'],['collections','Collections'],['orders','Orders'],['add','+ Add Painting'],['addcol','+ Add Collection']].map(([t, label]) => (
          <button key={t} className={`admin-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{label}</button>
        ))}
      </div>

      <div className="admin-content">
        {tab === 'paintings' && <PaintingsTab adminKey={key} />}
        {tab === 'collections' && <CollectionsTab adminKey={key} />}
        {tab === 'orders' && <OrdersTab adminKey={key} />}
        {tab === 'add' && <AddPaintingTab adminKey={key} onSaved={() => setTab('paintings')} />}
        {tab === 'addcol' && <AddCollectionTab adminKey={key} onSaved={() => setTab('collections')} />}
      </div>
    </div>
  );
}

/* ── PAINTINGS TAB ── */
function PaintingsTab({ adminKey }) {
  const [paintings, setPaintings] = useState([]);
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState('');

  const load = () => fetch(`${API}/api/paintings/all`, { headers: { 'x-admin-key': adminKey } })
    .then(r => r.json()).then(setPaintings).catch(() => {});

  useEffect(() => { load(); }, []);

  const del = async (id) => {
    if (!confirm('Delete this painting?')) return;
    await fetch(`${API}/api/paintings/${id}`, { method: 'DELETE', headers: { 'x-admin-key': adminKey } });
    setMsg('Deleted'); load(); setTimeout(() => setMsg(''), 3000);
  };

  const toggleSold = async (p) => {
    await fetch(`${API}/api/paintings/${p.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
      body: JSON.stringify({ sold: !p.sold }),
    });
    load();
  };

  const toggleHero = async (p) => {
    // Unset all heroes first, then set this one
    for (const painting of paintings) {
      if (painting.heroImage) {
        await fetch(`${API}/api/paintings/${painting.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
          body: JSON.stringify({ heroImage: false }),
        });
      }
    }
    await fetch(`${API}/api/paintings/${p.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
      body: JSON.stringify({ heroImage: true }),
    });
    setMsg(`"${p.title}" set as homepage hero`);
    load(); setTimeout(() => setMsg(''), 3000);
  };

  if (editing) return <EditPaintingTab painting={editing} adminKey={adminKey} onSaved={() => { setEditing(null); load(); }} onCancel={() => setEditing(null)} />;

  return (
    <div>
      {msg && <div className="admin-msg">{msg}</div>}
      {paintings.length === 0 && <p className="admin-empty">No paintings yet. Click "+ Add Painting" to get started.</p>}
      {paintings.map(p => (
        <div key={p.id} className="admin-painting-row">
          <img src={p.images?.[0]} alt={p.title} className="admin-painting-row__img" />
          <div className="admin-painting-row__info">
            <p className="admin-painting-row__title">{p.title}</p>
            <p className="admin-painting-row__meta">{p.medium} · {p.dimensions}</p>
            <div className="admin-painting-row__prices">
              {p.originalPrice && <span>Original: ${Number(p.originalPrice).toLocaleString()}</span>}
              {p.printPrice && <span>Print: ${Number(p.printPrice).toLocaleString()}</span>}
            </div>
          </div>
          <div className="admin-painting-row__badges">
            {p.heroImage && <span className="admin-badge admin-badge--hero">Hero</span>}
            <span className={`admin-badge ${p.sold ? 'admin-badge--sold' : 'admin-badge--avail'}`}>{p.sold ? 'Sold' : 'Available'}</span>
          </div>
          <div className="admin-painting-row__actions">
            <button className="admin-btn" onClick={() => toggleHero(p)}>Set as Hero</button>
            <button className="admin-btn" onClick={() => toggleSold(p)}>{p.sold ? 'Mark Available' : 'Mark Sold'}</button>
            <button className="admin-btn" onClick={() => setEditing(p)}>Edit</button>
            <button className="admin-btn admin-btn--danger" onClick={() => del(p.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── EDIT PAINTING TAB ── */
function EditPaintingTab({ painting, adminKey, onSaved, onCancel }) {
  const [form, setForm] = useState({
    title: painting.title || '',
    description: painting.description || '',
    medium: painting.medium || '',
    dimensions: painting.dimensions || '',
    year: painting.year || new Date().getFullYear(),
    category: painting.category || 'both',
    originalPrice: painting.originalPrice || '',
    originalAvailable: painting.originalAvailable !== false,
    printPrice: painting.printPrice || '',
    printAvailable: painting.printAvailable || false,
    images: painting.images || [],
  });
  const [saving, setSaving] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    const body = { ...form, year: Number(form.year), originalPrice: form.originalPrice ? Number(form.originalPrice) : null, printPrice: form.printPrice ? Number(form.printPrice) : null };
    await fetch(`${API}/api/paintings/${painting.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
      body: JSON.stringify(body),
    });
    setSaving(false);
    onSaved();
  };

  return (
    <div className="admin-form-wrap">
      <div className="admin-form-header">
        <h2>Edit: {painting.title}</h2>
        <button className="admin-btn" onClick={onCancel}>← Back</button>
      </div>
      <form onSubmit={save} className="admin-form">
        <PaintingFormFields form={form} setForm={setForm} adminKey={adminKey} />
        <div className="admin-form__actions">
          <button type="submit" className="btn" disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</button>
          <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

/* ── ADD PAINTING TAB ── */
function AddPaintingTab({ adminKey, onSaved }) {
  const [form, setForm] = useState({
    title: '', description: '', medium: 'Oil on canvas', dimensions: '',
    year: new Date().getFullYear(), category: 'both',
    originalPrice: '', originalAvailable: true,
    printPrice: '', printAvailable: false,
    images: [],
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const save = async (e) => {
    e.preventDefault();
    if (form.images.length === 0) return alert('Please add at least one image');
    setSaving(true);
    const body = { ...form, year: Number(form.year), originalPrice: form.originalPrice ? Number(form.originalPrice) : null, printPrice: form.printPrice ? Number(form.printPrice) : null, sold: false };
    const res = await fetch(`${API}/api/paintings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
      body: JSON.stringify(body),
    });
    setSaving(false);
    if (res.ok) { setMsg('Painting saved!'); setTimeout(() => { setMsg(''); onSaved(); }, 1500); }
    else alert('Error saving');
  };

  return (
    <div className="admin-form-wrap">
      <h2 className="admin-form-wrap__title">Add New Painting</h2>
      {msg && <div className="admin-msg">{msg}</div>}
      <form onSubmit={save} className="admin-form">
        <PaintingFormFields form={form} setForm={setForm} adminKey={adminKey} />
        <button type="submit" className="btn" disabled={saving} style={{ marginTop: 8 }}>{saving ? 'Saving…' : 'Add Painting'}</button>
      </form>
    </div>
  );
}

/* ── SHARED PAINTING FORM FIELDS ── */
function PaintingFormFields({ form, setForm, adminKey }) {
  const [uploading, setUploading] = useState(false);
  const f = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const uploadFile = async (file) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !preset) { alert('Cloudinary not configured. Use URL mode.'); return null; }
    setUploading(true);
    const fd = new FormData(); fd.append('file', file); fd.append('upload_preset', preset);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: fd });
    const data = await res.json();
    setUploading(false);
    return data.secure_url;
  };

  const addImageUrl = (url) => { if (url) setForm(prev => ({ ...prev, images: [...prev.images, url] })); };
  const removeImage = (i) => setForm(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }));

  return (
    <>
      <div className="admin-form__row">
        <div className="form-group">
          <label className="form-label">Title *</label>
          <input className="form-input" value={form.title} onChange={f('title')} required placeholder="Golden Hour" />
        </div>
        <div className="form-group">
          <label className="form-label">Year</label>
          <input className="form-input" type="number" value={form.year} onChange={f('year')} />
        </div>
      </div>
      <div className="admin-form__row">
        <div className="form-group">
          <label className="form-label">Medium</label>
          <input className="form-input" value={form.medium} onChange={f('medium')} placeholder="Oil on linen canvas" />
        </div>
        <div className="form-group">
          <label className="form-label">Dimensions</label>
          <input className="form-input" value={form.dimensions} onChange={f('dimensions')} placeholder="80 x 100 cm" />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea className="form-input" rows={3} value={form.description} onChange={f('description')} placeholder="About this painting..." />
      </div>

      {/* Category */}
      <div className="form-group">
        <label className="form-label">Available as</label>
        <select className="form-input form-select" value={form.category} onChange={f('category')}>
          <option value="original">Original Only</option>
          <option value="print">Print Only</option>
          <option value="both">Both Original & Print</option>
        </select>
      </div>

      {/* Original pricing */}
      {(form.category === 'original' || form.category === 'both') && (
        <div className="admin-form__version-box">
          <p className="admin-form__version-title">Original Painting</p>
          <div className="admin-form__row">
            <div className="form-group">
              <label className="form-label">Price (USD)</label>
              <input className="form-input" type="number" value={form.originalPrice} onChange={f('originalPrice')} placeholder="2000" />
            </div>
            <div className="form-group admin-form__checkbox-group">
              <label className="admin-form__checkbox">
                <input type="checkbox" checked={form.originalAvailable} onChange={f('originalAvailable')} />
                Available
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Print pricing */}
      {(form.category === 'print' || form.category === 'both') && (
        <div className="admin-form__version-box admin-form__version-box--print">
          <p className="admin-form__version-title">Limited Edition Print</p>
          <div className="admin-form__row">
            <div className="form-group">
              <label className="form-label">Print Price (USD)</label>
              <input className="form-input" type="number" value={form.printPrice} onChange={f('printPrice')} placeholder="500" />
            </div>
            <div className="form-group admin-form__checkbox-group">
              <label className="admin-form__checkbox">
                <input type="checkbox" checked={form.printAvailable} onChange={f('printAvailable')} />
                Print Available
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Images */}
      <div className="form-group">
        <label className="form-label">Images</label>
        <div className="admin-images">
          {form.images.map((url, i) => (
            <div key={i} className="admin-image-item">
              <img src={url} alt="" className="admin-image-item__img" />
              <button type="button" className="admin-image-item__remove" onClick={() => removeImage(i)}>×</button>
            </div>
          ))}
          <div className="admin-image-add">
            <label className="admin-image-add__upload">
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                const url = await uploadFile(e.target.files[0]);
                if (url) addImageUrl(url);
              }} />
              {uploading ? '⏳' : '+ Upload'}
            </label>
          </div>
        </div>
        <div className="admin-url-add">
          <input className="form-input" placeholder="Or paste image URL" id="urlInput" style={{ flex: 1 }} />
          <button type="button" className="admin-btn" onClick={() => {
            const el = document.getElementById('urlInput');
            addImageUrl(el.value); el.value = '';
          }}>Add URL</button>
        </div>
      </div>
    </>
  );
}

/* ── COLLECTIONS TAB ── */
function CollectionsTab({ adminKey }) {
  const [collections, setCollections] = useState([]);
  const [msg, setMsg] = useState('');

  const load = () => fetch(`${API}/api/collections`).then(r => r.json()).then(setCollections).catch(() => {});
  useEffect(() => { load(); }, []);

  const del = async (id) => {
    if (!confirm('Delete this collection?')) return;
    await fetch(`${API}/api/collections/${id}`, { method: 'DELETE', headers: { 'x-admin-key': adminKey } });
    setMsg('Deleted'); load(); setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div>
      {msg && <div className="admin-msg">{msg}</div>}
      {collections.length === 0 && <p className="admin-empty">No collections yet. Click "+ Add Collection".</p>}
      {collections.map(c => (
        <div key={c.id} className="admin-collection-row">
          {c.coverImage && <img src={c.coverImage} alt={c.name} className="admin-collection-row__img" />}
          {!c.coverImage && <div className="admin-collection-row__placeholder" />}
          <div className="admin-collection-row__info">
            <p className="admin-collection-row__name">{c.name}</p>
            {c.description && <p className="admin-collection-row__desc">{c.description}</p>}
            <p className="admin-collection-row__count">{c._count?.paintings || 0} paintings</p>
          </div>
          <button className="admin-btn admin-btn--danger" onClick={() => del(c.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

/* ── ADD COLLECTION TAB ── */
function AddCollectionTab({ adminKey, onSaved }) {
  const [form, setForm] = useState({ name: '', description: '', coverImage: '' });
  const [saving, setSaving] = useState(false);
  const f = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    await fetch(`${API}/api/collections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
      body: JSON.stringify(form),
    });
    setSaving(false);
    onSaved();
  };

  return (
    <div className="admin-form-wrap">
      <h2 className="admin-form-wrap__title">Add New Collection</h2>
      <form onSubmit={save} className="admin-form">
        <div className="form-group">
          <label className="form-label">Collection Name *</label>
          <input className="form-input" value={form.name} onChange={f('name')} required placeholder="e.g. Figures & Shelter" />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-input" rows={3} value={form.description} onChange={f('description')} placeholder="About this collection..." />
        </div>
        <div className="form-group">
          <label className="form-label">Cover Image URL</label>
          <input className="form-input" value={form.coverImage} onChange={f('coverImage')} placeholder="https://..." />
        </div>
        <button type="submit" className="btn" disabled={saving}>{saving ? 'Saving…' : 'Create Collection'}</button>
      </form>
    </div>
  );
}

/* ── ORDERS TAB ── */
function OrdersTab({ adminKey }) {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    fetch(`${API}/api/orders/all`, { headers: { 'x-admin-key': adminKey } })
      .then(r => r.json()).then(setOrders).catch(() => {});
  }, []);

  if (orders.length === 0) return <p className="admin-empty">No orders yet.</p>;

  return (
    <div>
      {orders.map(o => (
        <div key={o.id} className="admin-order-row">
          <div className="admin-order-row__header">
            <div>
              <p className="admin-order-row__name">{o.customerName}</p>
              <p className="admin-order-row__email">{o.customerEmail}</p>
            </div>
            <div className="admin-order-row__right">
              <span className={`admin-badge admin-badge--${o.status.toLowerCase()}`}>{o.status}</span>
              <span className="admin-order-row__total">${Number(o.total).toLocaleString()}</span>
            </div>
          </div>
          <div className="admin-order-row__items">
            {o.items?.map(item => (
              <span key={item.id} className="admin-order-row__item">
                {item.painting?.title} ({item.version})
              </span>
            ))}
          </div>
          <p className="admin-order-row__ship">
            {o.shipStreet}, {o.shipCity}, {o.shipCountry}
          </p>
        </div>
      ))}
    </div>
  );
}
