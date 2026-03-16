import { useState, useEffect, useCallback } from 'react';
import {
  adminVerify,
  adminGetPaintings,
  adminCreatePainting,
  adminUpdatePainting,
  adminDeletePainting,
  getSiteSettings,
  adminUpdateSiteSettings,
} from '../api.js';
import './AdminPage.css';

const SESSION_KEY = 'dahlia-admin-key';

const EMPTY_PAINTING = {
  title: '',
  description: '',
  price: '',
  imageUrl: '',
  medium: '',
  dimensions: '',
  year: '',
  status: 'available',
};

const EMPTY_SETTINGS = {
  siteName: '',
  tagline: '',
  heroTitle: '',
  heroSubtitle: '',
};

/* ─────────────────────────────── */
/*  Sub-components                 */
/* ─────────────────────────────── */

function StatusBadge({ status }) {
  const cls = {
    available: 'admin-badge admin-badge--green',
    sold: 'admin-badge admin-badge--red',
    reserved: 'admin-badge admin-badge--amber',
  }[String(status).toLowerCase()] ?? 'admin-badge';
  return <span className={cls}>{status}</span>;
}

/* ─────────────────────────────── */
/*  Login Screen                   */
/* ─────────────────────────────── */

function LoginScreen({ onLogin }) {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!key.trim()) { setError('Please enter your admin key.'); return; }
    setLoading(true);
    setError('');
    try {
      await adminVerify(key.trim());
      sessionStorage.setItem(SESSION_KEY, key.trim());
      onLogin(key.trim());
    } catch {
      setError('Invalid admin key. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login">
      <div className="admin-login__inner">
        <p className="admin-login__eyebrow">Dahlia</p>
        <h1 className="admin-login__title">Admin Access</h1>
        <form className="admin-login__form" onSubmit={handleSubmit}>
          <div className="admin-field">
            <label className="admin-label" htmlFor="admin-key">Admin Key</label>
            <input
              id="admin-key"
              className="admin-input"
              type="password"
              value={key}
              onChange={e => { setKey(e.target.value); setError(''); }}
              placeholder="Enter your admin key"
              autoComplete="current-password"
              disabled={loading}
            />
            {error && <p className="admin-err" role="alert">{error}</p>}
          </div>
          <button className="admin-btn admin-btn--primary" type="submit" disabled={loading}>
            {loading ? 'Verifying…' : 'Sign In'}
          </button>
        </form>
      </div>
    </main>
  );
}

/* ─────────────────────────────── */
/*  Paintings Tab                  */
/* ─────────────────────────────── */

function PaintingsTab({ adminKey, addToast }) {
  const [paintings, setPaintings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_PAINTING);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    adminGetPaintings(adminKey)
      .then(data => { setPaintings(Array.isArray(data) ? data : (data?.data ?? [])); setLoading(false); })
      .catch(() => { addToast?.('Failed to load paintings', 'error'); setLoading(false); });
  }, [adminKey]);

  useEffect(() => { load(); }, [load]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => { setForm(EMPTY_PAINTING); setEditId(null); setShowForm(false); };

  const startEdit = painting => {
    setForm({
      title: painting.title ?? '',
      description: painting.description ?? '',
      price: painting.price ?? '',
      imageUrl: painting.imageUrl ?? painting.image_url ?? '',
      medium: painting.medium ?? '',
      dimensions: painting.dimensions ?? '',
      year: painting.year ?? '',
      status: painting.status ?? 'available',
    });
    setEditId(painting.id ?? painting._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.title.trim()) { addToast?.('Title is required', 'error'); return; }
    setSaving(true);
    const payload = {
      ...form,
      price: form.price !== '' ? Number(form.price) : undefined,
      year: form.year !== '' ? Number(form.year) : undefined,
    };
    try {
      if (editId) {
        await adminUpdatePainting(adminKey, editId, payload);
        addToast?.('Painting updated', 'success');
      } else {
        await adminCreatePainting(adminKey, payload);
        addToast?.('Painting created', 'success');
      }
      resetForm();
      load();
    } catch (err) {
      addToast?.(err.message ?? 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await adminDeletePainting(adminKey, id);
      addToast?.(`"${title}" deleted`, 'success');
      load();
    } catch (err) {
      addToast?.(err.message ?? 'Delete failed', 'error');
    }
  };

  return (
    <div className="admin-tab-content">

      {/* ── Form ── */}
      <div className="admin-section">
        <div className="admin-section__hd">
          <h2 className="admin-section__title">{editId ? 'Edit Painting' : 'Add Painting'}</h2>
          {!showForm && !editId && (
            <button className="admin-btn admin-btn--secondary" onClick={() => setShowForm(true)}>
              + New Painting
            </button>
          )}
        </div>

        {(showForm || editId) && (
          <form className="admin-painting-form" onSubmit={handleSubmit}>
            <div className="admin-form-grid">
              <div className="admin-field">
                <label className="admin-label" htmlFor="p-title">Title *</label>
                <input id="p-title" className="admin-input" name="title" value={form.title} onChange={handleChange} placeholder="Painting title" disabled={saving} />
              </div>
              <div className="admin-field">
                <label className="admin-label" htmlFor="p-price">Price (USD)</label>
                <input id="p-price" className="admin-input" type="number" name="price" value={form.price} onChange={handleChange} placeholder="1200" min="0" disabled={saving} />
              </div>
              <div className="admin-field">
                <label className="admin-label" htmlFor="p-medium">Medium</label>
                <input id="p-medium" className="admin-input" name="medium" value={form.medium} onChange={handleChange} placeholder="Oil on linen" disabled={saving} />
              </div>
              <div className="admin-field">
                <label className="admin-label" htmlFor="p-dims">Dimensions</label>
                <input id="p-dims" className="admin-input" name="dimensions" value={form.dimensions} onChange={handleChange} placeholder="60 × 80 cm" disabled={saving} />
              </div>
              <div className="admin-field">
                <label className="admin-label" htmlFor="p-year">Year</label>
                <input id="p-year" className="admin-input" type="number" name="year" value={form.year} onChange={handleChange} placeholder="2024" min="1900" max="2099" disabled={saving} />
              </div>
              <div className="admin-field">
                <label className="admin-label" htmlFor="p-status">Status</label>
                <select id="p-status" className="admin-select" name="status" value={form.status} onChange={handleChange} disabled={saving}>
                  <option value="available">Available</option>
                  <option value="sold">Sold</option>
                  <option value="reserved">Reserved</option>
                </select>
              </div>
              <div className="admin-field admin-field--full">
                <label className="admin-label" htmlFor="p-img">Image URL</label>
                <input id="p-img" className="admin-input" name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://…" type="url" disabled={saving} />
              </div>
              <div className="admin-field admin-field--full">
                <label className="admin-label" htmlFor="p-desc">Description</label>
                <textarea id="p-desc" className="admin-textarea" name="description" value={form.description} onChange={handleChange} placeholder="About this work…" rows={4} disabled={saving} />
              </div>
            </div>

            <div className="admin-form-actions">
              <button className="admin-btn admin-btn--primary" type="submit" disabled={saving}>
                {saving ? 'Saving…' : editId ? 'Update Painting' : 'Create Painting'}
              </button>
              <button className="admin-btn admin-btn--ghost" type="button" onClick={resetForm} disabled={saving}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ── List ── */}
      <div className="admin-section">
        <div className="admin-section__hd">
          <h2 className="admin-section__title">All Paintings</h2>
          <span className="admin-count">{paintings.length} works</span>
        </div>

        {loading ? (
          <div className="admin-loading"><div className="admin-spinner" /></div>
        ) : paintings.length === 0 ? (
          <p className="admin-empty">No paintings yet.</p>
        ) : (
          <div className="admin-paintings-list">
            {paintings.map(p => {
              const img = p.imageUrl || p.image_url || p.images?.[0];
              return (
                <div key={p.id ?? p._id} className="admin-painting-row">
                  <div className="admin-painting-row__thumb">
                    {img
                      ? <img src={img} alt="" aria-hidden="true" loading="lazy" />
                      : <span className="admin-painting-row__thumb-ph" aria-hidden="true" />}
                  </div>
                  <div className="admin-painting-row__body">
                    <p className="admin-painting-row__title">{p.title ?? 'Untitled'}</p>
                    <p className="admin-painting-row__meta">
                      {[p.year, p.medium, p.dimensions].filter(Boolean).join(' · ')}
                    </p>
                    {p.price != null && (
                      <p className="admin-painting-row__price">${Number(p.price).toLocaleString()}</p>
                    )}
                  </div>
                  <StatusBadge status={p.status ?? (p.sold ? 'sold' : 'available')} />
                  <div className="admin-painting-row__actions">
                    <button className="admin-row-btn" onClick={() => startEdit(p)}>Edit</button>
                    <button className="admin-row-btn admin-row-btn--danger" onClick={() => handleDelete(p.id ?? p._id, p.title ?? 'Untitled')}>Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────── */
/*  Site Settings Tab              */
/* ─────────────────────────────── */

function SettingsTab({ adminKey, addToast }) {
  const [settings, setSettings] = useState(EMPTY_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSiteSettings()
      .then(data => {
        setSettings({
          siteName: data.siteName ?? '',
          tagline: data.tagline ?? '',
          heroTitle: data.heroTitle ?? '',
          heroSubtitle: data.heroSubtitle ?? '',
        });
        setLoading(false);
      })
      .catch(() => { addToast?.('Failed to load settings', 'error'); setLoading(false); });
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminUpdateSiteSettings(adminKey, settings);
      addToast?.('Settings saved', 'success');
    } catch (err) {
      addToast?.(err.message ?? 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-loading"><div className="admin-spinner" /></div>;

  return (
    <div className="admin-tab-content">
      <div className="admin-section">
        <div className="admin-section__hd">
          <h2 className="admin-section__title">Site Settings</h2>
        </div>
        <form className="admin-settings-form" onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            <div className="admin-field">
              <label className="admin-label" htmlFor="s-name">Site Name</label>
              <input id="s-name" className="admin-input" name="siteName" value={settings.siteName} onChange={handleChange} placeholder="Dahlia" disabled={saving} />
            </div>
            <div className="admin-field">
              <label className="admin-label" htmlFor="s-tagline">Tagline</label>
              <input id="s-tagline" className="admin-input" name="tagline" value={settings.tagline} onChange={handleChange} placeholder="Fine art by Baasher" disabled={saving} />
            </div>
            <div className="admin-field admin-field--full">
              <label className="admin-label" htmlFor="s-hero-title">Hero Title</label>
              <input id="s-hero-title" className="admin-input" name="heroTitle" value={settings.heroTitle} onChange={handleChange} placeholder="Original paintings" disabled={saving} />
            </div>
            <div className="admin-field admin-field--full">
              <label className="admin-label" htmlFor="s-hero-sub">Hero Subtitle</label>
              <textarea id="s-hero-sub" className="admin-textarea" name="heroSubtitle" value={settings.heroSubtitle} onChange={handleChange} placeholder="Hero subtitle text…" rows={3} disabled={saving} />
            </div>
          </div>
          <div className="admin-form-actions">
            <button className="admin-btn admin-btn--primary" type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─────────────────────────────── */
/*  Main Admin Page                */
/* ─────────────────────────────── */

export default function AdminPage({ addToast }) {
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem(SESSION_KEY) ?? null);
  const [tab, setTab] = useState('paintings');

  const handleLogin = key => setAdminKey(key);

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAdminKey(null);
  };

  if (!adminKey) return <LoginScreen onLogin={handleLogin} />;

  return (
    <main className="admin-page">
      <div className="admin-page__topbar">
        <div className="container admin-page__topbar-inner">
          <div className="admin-page__brand">
            <span className="admin-page__brand-name">Dahlia</span>
            <span className="admin-page__brand-label">Admin</span>
          </div>
          <button className="admin-btn admin-btn--ghost admin-btn--sm" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </div>

      <div className="container admin-page__body">
        <nav className="admin-tabs" aria-label="Admin sections">
          <button
            className={`admin-tab${tab === 'paintings' ? ' admin-tab--active' : ''}`}
            onClick={() => setTab('paintings')}
          >
            Paintings
          </button>
          <button
            className={`admin-tab${tab === 'settings' ? ' admin-tab--active' : ''}`}
            onClick={() => setTab('settings')}
          >
            Site Settings
          </button>
        </nav>

        {tab === 'paintings' && <PaintingsTab adminKey={adminKey} addToast={addToast} />}
        {tab === 'settings' && <SettingsTab adminKey={adminKey} addToast={addToast} />}
      </div>
    </main>
  );
}
