import { useState, useEffect, useRef } from 'react';
import './AdminPage.css';

const BASE = import.meta.env.VITE_API_URL || '';
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';

const adminGet = () => ({ 'x-admin-key': sessionStorage.getItem('adminKey') || '' });
const adminPost = () => ({ 'Content-Type': 'application/json', 'x-admin-key': sessionStorage.getItem('adminKey') || '' });

export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState('paintings');
  const [paintings, setPaintings] = useState([]);
  const [collections, setCollections] = useState([]);
  const [orders, setOrders] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  // Painting form
  const emptyForm = { title:'', year:'', medium:'Oil on canvas', dimensions:'', originalPrice:'', printPrice:'', description:'', images:[], category:'original', originalAvailable:true, printAvailable:false, featured:false, heroImage:false, collectionId:'' };
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('');

  // Collection form
  const emptyCol = { name:'', description:'' };
  const [colForm, setColForm] = useState(emptyCol);
  const [colEditId, setColEditId] = useState(null);

  // Site Settings state
  const [siteSettings, setSiteSettings] = useState({
    aboutHeroSubtitle: '',
    aboutBio1: '', aboutBio2: '', aboutBio3: '',
    aboutStatement1: '', aboutStatement2: '', aboutStatement3: '',
    testimonials: [],
  });
  const emptyTestimonial = { name: '', title: '', text: '', rating: 5 };
  const [testimonialForm, setTestimonialForm] = useState(emptyTestimonial);
  const [editTestimonialIdx, setEditTestimonialIdx] = useState(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('adminKey');
    if (saved) verify(saved);
  }, []);

  const verify = async (k) => {
    try {
      const r = await fetch(`${BASE}/api/admin/verify`, { headers: { 'x-admin-key': k } });
      if (r.ok) { sessionStorage.setItem('adminKey', k); setAuth(true); load(); }
      else sessionStorage.removeItem('adminKey');
    } catch {}
  };

  const load = async () => {
    try {
      const r = await fetch(`${BASE}/api/paintings/all`, { headers: adminGet() });
      if (r.ok) { const d = await r.json(); setPaintings(Array.isArray(d.data||d) ? (d.data||d) : []); }
    } catch {}
    try {
      const r = await fetch(`${BASE}/api/collections`, { headers: adminGet() });
      if (r.ok) { const d = await r.json(); setCollections(Array.isArray(d) ? d : []); }
    } catch {}
    try {
      const r = await fetch(`${BASE}/api/admin/orders`, { headers: adminGet() });
      if (r.ok) { const d = await r.json(); setOrders(Array.isArray(d) ? d : []); }
    } catch {}
    try {
      const r = await fetch(`${BASE}/api/site-settings`);
      if (r.ok) {
        const d = await r.json();
        setSiteSettings({
          aboutHeroSubtitle: d.aboutHeroSubtitle || '',
          aboutBio1: d.aboutBio1 || '', aboutBio2: d.aboutBio2 || '', aboutBio3: d.aboutBio3 || '',
          aboutStatement1: d.aboutStatement1 || '', aboutStatement2: d.aboutStatement2 || '', aboutStatement3: d.aboutStatement3 || '',
          testimonials: Array.isArray(d.testimonials) ? d.testimonials : [],
        });
      }
    } catch {}
  };

  const flash = (m, t='success') => { setMsg(m); setMsgType(t); setTimeout(()=>setMsg(''), 3000); };

  const login = async (e) => {
    e.preventDefault(); setError('');
    const k = key.trim();
    sessionStorage.setItem('adminKey', k);
    try {
      const r = await fetch(`${BASE}/api/admin/verify`, { headers: { 'x-admin-key': k } });
      if (r.ok) { setAuth(true); setKey(''); load(); }
      else { sessionStorage.removeItem('adminKey'); setError('Invalid admin key.'); }
    } catch { setError('Cannot connect to server.'); }
  };

  // ── Image upload (direct to Cloudinary from frontend) ──
  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      flash('Cloudinary not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your .env file.', 'error');
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('upload_preset', UPLOAD_PRESET);
      fd.append('folder', 'dahlia-paintings');
      const r = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST', body: fd,
      });
      if (!r.ok) {
        const errData = await r.json().catch(() => ({}));
        throw new Error(errData?.error?.message || 'Upload failed');
      }
      const d = await r.json();
      setForm(p => ({ ...p, images: [...p.images, d.secure_url] }));
      flash('Image uploaded!');
    } catch (err) { flash(err.message, 'error'); }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const removeImage = (idx) => setForm(p => ({ ...p, images: p.images.filter((_,i)=>i!==idx) }));

  // ── Save painting ──
  const savePainting = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { flash('Title required', 'error'); return; }
    if (form.images.length === 0 && !editId) { flash('Upload at least one image', 'error'); return; }
    const payload = {
      title: form.title.trim(), description: form.description||'', medium: form.medium||'Oil on canvas',
      dimensions: form.dimensions||'', category: form.category||'original',
      originalAvailable: form.originalAvailable, printAvailable: form.printAvailable,
      featured: form.featured, heroImage: form.heroImage, images: form.images,
    };
    if (form.originalPrice) payload.originalPrice = Number(form.originalPrice);
    if (form.printPrice) payload.printPrice = Number(form.printPrice);
    if (form.year) payload.year = Number(form.year);
    if (form.collectionId) payload.collectionId = form.collectionId;
    else payload.collectionId = null;
    try {
      const url = editId ? `${BASE}/api/paintings/${editId}` : `${BASE}/api/paintings`;
      const r = await fetch(url, { method: editId?'PUT':'POST', headers: adminPost(), body: JSON.stringify(payload) });
      if (!r.ok) throw new Error('Failed');
      flash(editId ? 'Updated!' : 'Added!'); setForm(emptyForm); setEditId(null); load();
    } catch (err) { flash(err.message, 'error'); }
  };

  const editPainting = (p) => {
    setForm({ title:p.title||'', year:p.year||'', medium:p.medium||'', dimensions:p.dimensions||'',
      originalPrice:p.originalPrice||'', printPrice:p.printPrice||'', description:p.description||'',
      images:p.images||[], category:p.category||'original', originalAvailable:p.originalAvailable??true,
      printAvailable:p.printAvailable??false, featured:p.featured??false, heroImage:p.heroImage??false,
      collectionId:p.collectionId||'' });
    setEditId(p.id); setTab('paintings'); window.scrollTo({top:0,behavior:'smooth'});
  };

  const deletePainting = async (id) => {
    if (!confirm('Delete this painting?')) return;
    await fetch(`${BASE}/api/paintings/${id}`, { method:'DELETE', headers:adminPost() });
    flash('Deleted!'); load();
  };

  // ── Collections ──
  const saveCollection = async (e) => {
    e.preventDefault();
    if (!colForm.name.trim()) { flash('Collection name required', 'error'); return; }
    const url = colEditId ? `${BASE}/api/collections/${colEditId}` : `${BASE}/api/collections`;
    await fetch(url, { method: colEditId?'PUT':'POST', headers: adminPost(), body: JSON.stringify(colForm) });
    flash(colEditId ? 'Collection updated!' : 'Collection created!');
    setColForm(emptyCol); setColEditId(null); load();
  };

  const deleteCollection = async (id) => {
    if (!confirm('Delete this collection?')) return;
    await fetch(`${BASE}/api/collections/${id}`, { method:'DELETE', headers:adminPost() });
    flash('Deleted!'); load();
  };

  // ── Site Settings ──
  const saveSiteSettings = async (e) => {
    e.preventDefault();
    try {
      const r = await fetch(`${BASE}/api/site-settings`, {
        method: 'PUT', headers: adminPost(),
        body: JSON.stringify(siteSettings),
      });
      if (!r.ok) throw new Error('Failed to save');
      const d = await r.json();
      setSiteSettings({
        aboutHeroSubtitle: d.aboutHeroSubtitle || '',
        aboutBio1: d.aboutBio1 || '', aboutBio2: d.aboutBio2 || '', aboutBio3: d.aboutBio3 || '',
        aboutStatement1: d.aboutStatement1 || '', aboutStatement2: d.aboutStatement2 || '', aboutStatement3: d.aboutStatement3 || '',
        testimonials: Array.isArray(d.testimonials) ? d.testimonials : [],
      });
      flash('Site settings saved!');
    } catch (err) { flash(err.message, 'error'); }
  };

  const addOrUpdateTestimonial = (e) => {
    e.preventDefault();
    if (!testimonialForm.name.trim() || !testimonialForm.text.trim()) {
      flash('Name and text are required', 'error'); return;
    }
    const newTestimonial = {
      id: editTestimonialIdx !== null ? (siteSettings.testimonials[editTestimonialIdx]?.id || Date.now()) : Date.now(),
      name: testimonialForm.name.trim(),
      title: testimonialForm.title.trim(),
      text: testimonialForm.text.trim(),
      rating: Number(testimonialForm.rating) || 5,
    };
    let updated;
    if (editTestimonialIdx !== null) {
      updated = siteSettings.testimonials.map((t, i) => i === editTestimonialIdx ? newTestimonial : t);
    } else {
      updated = [...siteSettings.testimonials, newTestimonial];
    }
    setSiteSettings(prev => ({ ...prev, testimonials: updated }));
    setTestimonialForm(emptyTestimonial);
    setEditTestimonialIdx(null);
    flash(editTestimonialIdx !== null ? 'Testimonial updated (save to apply)' : 'Testimonial added (save to apply)');
  };

  const removeTestimonial = (idx) => {
    setSiteSettings(prev => ({
      ...prev,
      testimonials: prev.testimonials.filter((_, i) => i !== idx),
    }));
    flash('Testimonial removed (save to apply)');
  };

  // ── LOGIN SCREEN ──
  if (!auth) return (
    <main className="admin-page"><div className="admin-container"><div className="admin-login"><div className="admin-login__card">
      <div className="admin-login__header"><h1>Admin Dashboard</h1><p>Enter your admin key</p></div>
      <form className="admin-login__form" onSubmit={login}>
        <div className="form-group"><label>Admin Key</label>
          <input type="password" value={key} onChange={e=>setKey(e.target.value)} placeholder="Enter ADMIN_KEY from Railway" autoFocus />
        </div>
        {error && <div className="admin-error">{error}</div>}
        <button type="submit" className="btn btn--large">Sign In</button>
      </form>
    </div></div></div></main>
  );

  // ── MAIN DASHBOARD ──
  return (
    <main className="admin-page"><div className="admin-container">
      <div className="admin-header">
        <div><h1>Admin Dashboard</h1><p>Manage paintings, collections, orders, and site content</p></div>
        <button className="btn btn--secondary" onClick={()=>{sessionStorage.removeItem('adminKey');setAuth(false);}}>Sign Out</button>
      </div>

      {msg && <div className={`admin-${msgType==='error'?'error':'success'}`}>{msg}</div>}

      <div className="admin-tabs">
        {[['paintings','Paintings'],['collections','Collections'],['orders','Orders'],['settings','Site Settings']].map(([k,l])=>(
          <button key={k} className={`admin-tab ${tab===k?'active':''}`} onClick={()=>setTab(k)}>
            {l} {k==='paintings'?`(${paintings.length})`:k==='collections'?`(${collections.length})`:k==='orders'?`(${orders.length})`:''}
          </button>
        ))}
      </div>

      {/* ═══ PAINTINGS TAB ═══ */}
      {tab==='paintings' && <>
        <section className="admin-section">
          <h2>{editId ? 'Edit Painting' : 'Add New Painting'}</h2>
          <form className="admin-form" onSubmit={savePainting}>
            <div className="admin-form__row">
              <div className="form-group"><label>Title *</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required /></div>
              <div className="form-group"><label>Year</label><input type="number" value={form.year} onChange={e=>setForm({...form,year:e.target.value})} /></div>
              <div className="form-group"><label>Medium</label><input value={form.medium} onChange={e=>setForm({...form,medium:e.target.value})} /></div>
            </div>
            <div className="admin-form__row">
              <div className="form-group"><label>Dimensions</label><input value={form.dimensions} onChange={e=>setForm({...form,dimensions:e.target.value})} /></div>
              <div className="form-group"><label>Category</label>
                <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                  <option value="original">Original Only</option><option value="print">Print Only</option><option value="both">Original + Print</option>
                </select>
              </div>
              <div className="form-group"><label>Collection</label>
                <select value={form.collectionId} onChange={e=>setForm({...form,collectionId:e.target.value})}>
                  <option value="">No Collection</option>
                  {collections.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div className="admin-form__row">
              <div className="form-group"><label>Original Price ($)</label><input type="number" value={form.originalPrice} onChange={e=>setForm({...form,originalPrice:e.target.value})} /></div>
              <div className="form-group"><label>Print Price ($)</label><input type="number" value={form.printPrice} onChange={e=>setForm({...form,printPrice:e.target.value})} /></div>
            </div>
            <div className="form-group"><label>Description</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows="3" /></div>

            {/* Image Upload */}
            <div className="form-group">
              <label>Images *</label>
              <div className="admin-images">
                {form.images.map((url,i) => (
                  <div key={i} className="admin-images__item">
                    <img src={url} alt={`Image ${i+1}`} />
                    <button type="button" className="admin-images__remove" onClick={()=>removeImage(i)}>✕</button>
                  </div>
                ))}
                <label className="admin-images__upload">
                  <input type="file" accept="image/*" onChange={handleUpload} ref={fileRef} hidden />
                  <span>{uploading ? 'Uploading...' : '+ Upload Image'}</span>
                </label>
              </div>
            </div>

            <div className="admin-form__checkboxes">
              <label className="checkbox-label"><input type="checkbox" checked={form.originalAvailable} onChange={e=>setForm({...form,originalAvailable:e.target.checked})} /> Original Available</label>
              <label className="checkbox-label"><input type="checkbox" checked={form.printAvailable} onChange={e=>setForm({...form,printAvailable:e.target.checked})} /> Print Available</label>
              <label className="checkbox-label"><input type="checkbox" checked={form.featured} onChange={e=>setForm({...form,featured:e.target.checked})} /> Featured</label>
              <label className="checkbox-label"><input type="checkbox" checked={form.heroImage} onChange={e=>setForm({...form,heroImage:e.target.checked})} /> Hero Image</label>
            </div>
            <div className="admin-form__actions">
              <button type="submit" className="btn btn--large">{editId ? 'Update' : 'Add Painting'}</button>
              {editId && <button type="button" className="btn btn--ghost" onClick={()=>{setForm(emptyForm);setEditId(null);}}>Cancel</button>}
            </div>
          </form>
        </section>

        <section className="admin-section">
          <h2>All Paintings ({paintings.length})</h2>
          {paintings.length===0 ? <div className="admin-empty">No paintings yet</div> : (
            <div className="admin-paintings-grid">{paintings.map(p=>(
              <div key={p.id} className="admin-painting-card">
                {p.images?.[0] && <img src={p.images[0]} alt={p.title} />}
                <div className="admin-painting-card__content">
                  <h3>{p.title}</h3>
                  <p className="admin-painting-card__meta">{p.year} &middot; {p.medium}</p>
                  <p className="admin-painting-card__meta">{p.dimensions}</p>
                  {p.collection && <p className="admin-painting-card__meta" style={{color:'var(--color-accent)'}}>Collection: {p.collection.name}</p>}
                  <div className="admin-painting-card__prices">
                    {p.originalPrice && <p>Original: ${p.originalPrice}</p>}
                    {p.printPrice && <p>Print: ${p.printPrice}</p>}
                  </div>
                  <div className="admin-painting-card__tags">
                    {p.featured && <span className="admin-tag">Featured</span>}
                    {p.heroImage && <span className="admin-tag admin-tag--hero">Hero</span>}
                    {p.printAvailable && <span className="admin-tag admin-tag--print">Print</span>}
                    {!p.originalAvailable && <span className="admin-tag admin-tag--sold">Sold</span>}
                  </div>
                  <div className="admin-painting-card__actions">
                    <button className="admin-btn admin-btn--edit" onClick={()=>editPainting(p)}>Edit</button>
                    <button className="admin-btn admin-btn--delete" onClick={()=>deletePainting(p.id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}</div>
          )}
        </section>
      </>}

      {/* ═══ COLLECTIONS TAB ═══ */}
      {tab==='collections' && <>
        <section className="admin-section">
          <h2>{colEditId ? 'Edit Collection' : 'Create Collection'}</h2>
          <form className="admin-form" onSubmit={saveCollection}>
            <div className="admin-form__row">
              <div className="form-group"><label>Collection Name *</label><input value={colForm.name} onChange={e=>setColForm({...colForm,name:e.target.value})} required /></div>
              <div className="form-group"><label>Description</label><input value={colForm.description} onChange={e=>setColForm({...colForm,description:e.target.value})} /></div>
            </div>
            <div className="admin-form__actions">
              <button type="submit" className="btn btn--large">{colEditId ? 'Update' : 'Create Collection'}</button>
              {colEditId && <button type="button" className="btn btn--ghost" onClick={()=>{setColForm(emptyCol);setColEditId(null);}}>Cancel</button>}
            </div>
          </form>
        </section>

        <section className="admin-section">
          <h2>All Collections ({collections.length})</h2>
          {collections.length===0 ? <div className="admin-empty">No collections yet. Create one above, then assign paintings to it.</div> : (
            <div className="admin-collections-list">{collections.map(c=>(
              <div key={c.id} className="admin-collection-card">
                <div className="admin-collection-card__info">
                  <h3>{c.name}</h3>
                  {c.description && <p>{c.description}</p>}
                  <p className="admin-collection-card__count">{c._count?.paintings || c.paintings?.length || 0} paintings</p>
                </div>
                <div className="admin-collection-card__actions">
                  <button className="admin-btn admin-btn--edit" onClick={()=>{setColForm({name:c.name,description:c.description||''});setColEditId(c.id);}}>Edit</button>
                  <button className="admin-btn admin-btn--delete" onClick={()=>deleteCollection(c.id)}>Delete</button>
                </div>
              </div>
            ))}</div>
          )}
        </section>
      </>}

      {/* ═══ ORDERS TAB ═══ */}
      {tab==='orders' && (
        <section className="admin-section">
          <h2>Orders ({orders.length})</h2>
          {orders.length===0 ? <div className="admin-empty">No orders yet</div> : (
            <div className="admin-orders">{orders.map(o=>(
              <div key={o.id} className="admin-order-card">
                <div><strong>{o.customerName}</strong></div>
                <div>{o.customerEmail}</div>
                <div>${o.total?.toFixed(2)}</div>
                <div className={`admin-status admin-status--${o.status?.toLowerCase()}`}>{o.status}</div>
                <div>{new Date(o.createdAt).toLocaleDateString()}</div>
              </div>
            ))}</div>
          )}
        </section>
      )}

      {/* ═══ SITE SETTINGS TAB ═══ */}
      {tab==='settings' && <>
        <form onSubmit={saveSiteSettings}>
          {/* About Page Content */}
          <section className="admin-section">
            <h2>About Page Content</h2>
            <div className="form-group">
              <label>Hero Subtitle</label>
              <input value={siteSettings.aboutHeroSubtitle} onChange={e=>setSiteSettings(s=>({...s,aboutHeroSubtitle:e.target.value}))} placeholder="Subtitle shown on the About page hero" />
            </div>
            <div className="form-group">
              <label>Bio Paragraph 1</label>
              <textarea rows="3" value={siteSettings.aboutBio1} onChange={e=>setSiteSettings(s=>({...s,aboutBio1:e.target.value}))} placeholder="First biography paragraph" />
            </div>
            <div className="form-group">
              <label>Bio Paragraph 2</label>
              <textarea rows="3" value={siteSettings.aboutBio2} onChange={e=>setSiteSettings(s=>({...s,aboutBio2:e.target.value}))} placeholder="Second biography paragraph" />
            </div>
            <div className="form-group">
              <label>Bio Paragraph 3</label>
              <textarea rows="3" value={siteSettings.aboutBio3} onChange={e=>setSiteSettings(s=>({...s,aboutBio3:e.target.value}))} placeholder="Third biography paragraph" />
            </div>
            <div className="form-group">
              <label>Artist Statement 1</label>
              <textarea rows="3" value={siteSettings.aboutStatement1} onChange={e=>setSiteSettings(s=>({...s,aboutStatement1:e.target.value}))} placeholder="First statement paragraph" />
            </div>
            <div className="form-group">
              <label>Artist Statement 2</label>
              <textarea rows="3" value={siteSettings.aboutStatement2} onChange={e=>setSiteSettings(s=>({...s,aboutStatement2:e.target.value}))} placeholder="Second statement paragraph" />
            </div>
            <div className="form-group">
              <label>Artist Statement 3</label>
              <textarea rows="3" value={siteSettings.aboutStatement3} onChange={e=>setSiteSettings(s=>({...s,aboutStatement3:e.target.value}))} placeholder="Third statement paragraph" />
            </div>
          </section>

          {/* Testimonials */}
          <section className="admin-section">
            <h2>Testimonials ({siteSettings.testimonials.length})</h2>

            {/* Add / Edit testimonial form */}
            <div style={{ background:'#f9f9f9', padding:'20px', borderRadius:'8px', marginBottom:'24px', border:'1px solid var(--color-border)' }}>
              <h3 style={{ fontSize:'16px', marginBottom:'16px' }}>
                {editTestimonialIdx !== null ? 'Edit Testimonial' : 'Add Testimonial'}
              </h3>
              <div className="admin-form__row">
                <div className="form-group">
                  <label>Client Name *</label>
                  <input value={testimonialForm.name} onChange={e=>setTestimonialForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Sarah Mitchell" />
                </div>
                <div className="form-group">
                  <label>Client Title</label>
                  <input value={testimonialForm.title} onChange={e=>setTestimonialForm(f=>({...f,title:e.target.value}))} placeholder="e.g. Art Collector" />
                </div>
                <div className="form-group">
                  <label>Rating (1-5)</label>
                  <select value={testimonialForm.rating} onChange={e=>setTestimonialForm(f=>({...f,rating:Number(e.target.value)}))}>
                    {[5,4,3,2,1].map(n=><option key={n} value={n}>{n} Star{n>1?'s':''}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Testimonial Text *</label>
                <textarea rows="2" value={testimonialForm.text} onChange={e=>setTestimonialForm(f=>({...f,text:e.target.value}))} placeholder="What did the client say?" />
              </div>
              <div style={{ display:'flex', gap:'12px' }}>
                <button type="button" className="btn" onClick={addOrUpdateTestimonial} style={{ flex:'none' }}>
                  {editTestimonialIdx !== null ? 'Update' : 'Add'}
                </button>
                {editTestimonialIdx !== null && (
                  <button type="button" className="btn btn--ghost" onClick={()=>{setTestimonialForm(emptyTestimonial);setEditTestimonialIdx(null);}} style={{ flex:'none' }}>
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Testimonials list */}
            {siteSettings.testimonials.length === 0 ? (
              <div className="admin-empty">No testimonials yet. Add one above.</div>
            ) : (
              <div className="admin-collections-list">
                {siteSettings.testimonials.map((t, idx) => (
                  <div key={t.id || idx} className="admin-collection-card">
                    <div className="admin-collection-card__info">
                      <h3>{t.name} <span style={{ fontSize:'12px', color:'var(--color-accent)', fontWeight:400 }}>{'★'.repeat(t.rating || 5)}</span></h3>
                      <p style={{ fontSize:'11px', color:'var(--color-accent)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'4px' }}>{t.title}</p>
                      <p style={{ fontSize:'13px', fontStyle:'italic', color:'var(--color-text-secondary)' }}>"{t.text}"</p>
                    </div>
                    <div className="admin-collection-card__actions">
                      <button type="button" className="admin-btn admin-btn--edit" onClick={()=>{
                        setTestimonialForm({ name:t.name, title:t.title||'', text:t.text, rating:t.rating||5 });
                        setEditTestimonialIdx(idx);
                      }}>Edit</button>
                      <button type="button" className="admin-btn admin-btn--delete" onClick={()=>removeTestimonial(idx)}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="admin-form__actions" style={{ marginTop:'24px' }}>
            <button type="submit" className="btn btn--large">Save All Site Settings</button>
          </div>
        </form>
      </>}
    </div></main>
  );
}
