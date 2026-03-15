import { useState, useEffect, useRef } from 'react';
import './AdminPage.css';

const BASE = import.meta.env.VITE_API_URL || '';
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';

const adminGet = () => ({ 'x-admin-key': sessionStorage.getItem('adminKey') || '' });
const adminPost = () => ({ 'Content-Type': 'application/json', 'x-admin-key': sessionStorage.getItem('adminKey') || '' });

function CollapsibleSection({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="admin-collapsible">
      <button
        type="button"
        className={`admin-collapsible__toggle ${open ? 'open' : ''}`}
        onClick={() => setOpen(o => !o)}
      >
        <span>{title}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d={open ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'} />
        </svg>
      </button>
      {open && <div className="admin-collapsible__body">{children}</div>}
    </div>
  );
}

export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState('paintings');
  const [paintings, setPaintings] = useState([]);
  const [collections, setCollections] = useState([]);
  const [orders, setOrders] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const emptyForm = { title:'', year:'', medium:'Oil on canvas', dimensions:'', originalPrice:'', printPrice:'', description:'', images:[], category:'original', originalAvailable:true, printAvailable:false, featured:false, heroImage:false, collectionId:'' };
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('');

  const emptyCol = { name:'', description:'' };
  const [colForm, setColForm] = useState(emptyCol);
  const [colEditId, setColEditId] = useState(null);

  const defaultSettings = {
    aboutHeroSubtitle: '', aboutBio1: '', aboutBio2: '', aboutBio3: '',
    aboutStatement1: '', aboutStatement2: '', aboutStatement3: '',
    testimonials: [],
    heroTitle: '', heroSubtitle: '', heroDescription: '',
    featuredWorksTitle: '', featuredWorksSubtitle: '',
    printsTitle: '', printsSubtitle: '',
    ctaTitle: '', ctaDescription: '',
    newsletterTitle: '', newsletterSubtitle: '',
    footerTagline: '', socialLinks: [],
    commissionsSubtitle: '', commissionSteps: [], commissionFaqs: [], commissionFormHelpText: '',
    practiceCards: [],
    galleryLabel: '', galleryTitle: '', gallerySubtitle: '',
    navLogoSubtext: '',
    portfolioTitle: '', portfolioSubtitle: '', portfolioStatement: '',
  };
  const [siteSettings, setSiteSettings] = useState(defaultSettings);

  const emptyTestimonial = { name: '', title: '', text: '', rating: 5 };
  const [testimonialForm, setTestimonialForm] = useState(emptyTestimonial);
  const [editTestimonialIdx, setEditTestimonialIdx] = useState(null);
  const emptySocialLink = { platform: '', url: '', label: '' };
  const [socialLinkForm, setSocialLinkForm] = useState(emptySocialLink);
  const [editSocialIdx, setEditSocialIdx] = useState(null);
  const emptyStep = { title: '', description: '' };
  const [stepForm, setStepForm] = useState(emptyStep);
  const [editStepIdx, setEditStepIdx] = useState(null);
  const emptyFaq = { question: '', answer: '' };
  const [faqForm, setFaqForm] = useState(emptyFaq);
  const [editFaqIdx, setEditFaqIdx] = useState(null);
  const emptyCard = { title: '', description: '' };
  const [cardForm, setCardForm] = useState(emptyCard);
  const [editCardIdx, setEditCardIdx] = useState(null);

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
    try { const r = await fetch(`${BASE}/api/paintings/all`, { headers: adminGet() }); if (r.ok) { const d = await r.json(); setPaintings(Array.isArray(d.data||d) ? (d.data||d) : []); } } catch {}
    try { const r = await fetch(`${BASE}/api/collections`, { headers: adminGet() }); if (r.ok) { const d = await r.json(); setCollections(Array.isArray(d) ? d : []); } } catch {}
    try { const r = await fetch(`${BASE}/api/admin/orders`, { headers: adminGet() }); if (r.ok) { const d = await r.json(); setOrders(Array.isArray(d) ? d : []); } } catch {}
    try { const r = await fetch(`${BASE}/api/commissions`, { headers: adminGet() }); if (r.ok) { const d = await r.json(); setInquiries(Array.isArray(d) ? d : []); } } catch {}
    try { const r = await fetch(`${BASE}/api/newsletter`, { headers: adminGet() }); if (r.ok) { const d = await r.json(); setSubscribers(Array.isArray(d) ? d : []); } } catch {}
    try {
      const r = await fetch(`${BASE}/api/site-settings`);
      if (r.ok) {
        const d = await r.json();
        setSiteSettings(prev => ({
          ...defaultSettings, ...d,
          testimonials: Array.isArray(d.testimonials) ? d.testimonials : [],
          socialLinks: Array.isArray(d.socialLinks) ? d.socialLinks : [],
          commissionSteps: Array.isArray(d.commissionSteps) ? d.commissionSteps : [],
          commissionFaqs: Array.isArray(d.commissionFaqs) ? d.commissionFaqs : [],
          practiceCards: Array.isArray(d.practiceCards) ? d.practiceCards : [],
        }));
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

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (!CLOUD_NAME || !UPLOAD_PRESET) { flash('Cloudinary not configured.', 'error'); return; }
    setUploading(true);
    try {
      const fd = new FormData(); fd.append('file', file); fd.append('upload_preset', UPLOAD_PRESET); fd.append('folder', 'dahlia-paintings');
      const r = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: fd });
      if (!r.ok) { const err = await r.json().catch(()=>({})); throw new Error(err?.error?.message || 'Upload failed'); }
      const d = await r.json(); setForm(p => ({ ...p, images: [...p.images, d.secure_url] })); flash('Image uploaded!');
    } catch (err) { flash(err.message, 'error'); }
    setUploading(false); if (fileRef.current) fileRef.current.value = '';
  };

  const removeImage = (idx) => setForm(p => ({ ...p, images: p.images.filter((_,i)=>i!==idx) }));

  const savePainting = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { flash('Title required', 'error'); return; }
    if (form.images.length === 0 && !editId) { flash('Upload at least one image', 'error'); return; }
    const payload = { title: form.title.trim(), description: form.description||'', medium: form.medium||'Oil on canvas', dimensions: form.dimensions||'', category: form.category||'original', originalAvailable: form.originalAvailable, printAvailable: form.printAvailable, featured: form.featured, heroImage: form.heroImage, images: form.images };
    if (form.originalPrice) payload.originalPrice = Number(form.originalPrice);
    if (form.printPrice) payload.printPrice = Number(form.printPrice);
    if (form.year) payload.year = Number(form.year);
    payload.collectionId = form.collectionId || null;
    try {
      const url = editId ? `${BASE}/api/paintings/${editId}` : `${BASE}/api/paintings`;
      const r = await fetch(url, { method: editId?'PUT':'POST', headers: adminPost(), body: JSON.stringify(payload) });
      if (!r.ok) throw new Error('Failed');
      flash(editId ? 'Updated!' : 'Added!'); setForm(emptyForm); setEditId(null); load();
    } catch (err) { flash(err.message, 'error'); }
  };

  const editPainting = (p) => {
    setForm({ title:p.title||'', year:p.year||'', medium:p.medium||'', dimensions:p.dimensions||'', originalPrice:p.originalPrice||'', printPrice:p.printPrice||'', description:p.description||'', images:p.images||[], category:p.category||'original', originalAvailable:p.originalAvailable??true, printAvailable:p.printAvailable??false, featured:p.featured??false, heroImage:p.heroImage??false, collectionId:p.collectionId||'' });
    setEditId(p.id); setTab('paintings'); window.scrollTo({top:0,behavior:'smooth'});
  };

  const deletePainting = async (id) => {
    if (!confirm('Delete this painting?')) return;
    await fetch(`${BASE}/api/paintings/${id}`, { method:'DELETE', headers:adminPost() });
    flash('Deleted!'); load();
  };

  const saveCollection = async (e) => {
    e.preventDefault(); if (!colForm.name.trim()) { flash('Name required', 'error'); return; }
    const url = colEditId ? `${BASE}/api/collections/${colEditId}` : `${BASE}/api/collections`;
    await fetch(url, { method: colEditId?'PUT':'POST', headers: adminPost(), body: JSON.stringify(colForm) });
    flash(colEditId ? 'Updated!' : 'Created!'); setColForm(emptyCol); setColEditId(null); load();
  };

  const deleteCollection = async (id) => {
    if (!confirm('Delete this collection?')) return;
    await fetch(`${BASE}/api/collections/${id}`, { method:'DELETE', headers:adminPost() });
    flash('Deleted!'); load();
  };

  const updateInquiryStatus = async (id, status) => {
    try {
      await fetch(`${BASE}/api/commissions/${id}`, { method:'PUT', headers:adminPost(), body: JSON.stringify({ status }) });
      setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
      flash('Status updated!');
    } catch { flash('Failed to update', 'error'); }
  };

  const deleteSubscriber = async (id) => {
    if (!confirm('Remove this subscriber?')) return;
    try {
      await fetch(`${BASE}/api/newsletter/${id}`, { method:'DELETE', headers:adminPost() });
      setSubscribers(prev => prev.filter(s => s.id !== id));
      flash('Removed!');
    } catch { flash('Failed', 'error'); }
  };

  const saveSiteSettings = async (e) => {
    e.preventDefault();
    try {
      const r = await fetch(`${BASE}/api/site-settings`, { method: 'PUT', headers: adminPost(), body: JSON.stringify(siteSettings) });
      if (!r.ok) throw new Error('Failed to save');
      const d = await r.json();
      setSiteSettings(prev => ({ ...prev, ...d, testimonials: Array.isArray(d.testimonials)?d.testimonials:[], socialLinks: Array.isArray(d.socialLinks)?d.socialLinks:[], commissionSteps: Array.isArray(d.commissionSteps)?d.commissionSteps:[], commissionFaqs: Array.isArray(d.commissionFaqs)?d.commissionFaqs:[], practiceCards: Array.isArray(d.practiceCards)?d.practiceCards:[] }));
      flash('Site settings saved!');
    } catch (err) { flash(err.message, 'error'); }
  };

  const addOrUpdateTestimonial = (e) => {
    e.preventDefault();
    if (!testimonialForm.name.trim() || !testimonialForm.text.trim()) { flash('Name and text required', 'error'); return; }
    const item = { id: editTestimonialIdx !== null ? (siteSettings.testimonials[editTestimonialIdx]?.id || Date.now()) : Date.now(), name: testimonialForm.name.trim(), title: testimonialForm.title.trim(), text: testimonialForm.text.trim(), rating: Number(testimonialForm.rating) || 5 };
    const updated = editTestimonialIdx !== null ? siteSettings.testimonials.map((t,i) => i===editTestimonialIdx ? item : t) : [...siteSettings.testimonials, item];
    setSiteSettings(s => ({ ...s, testimonials: updated })); setTestimonialForm(emptyTestimonial); setEditTestimonialIdx(null);
    flash('Done (save to apply)');
  };
  const removeTestimonial = (idx) => { setSiteSettings(s => ({ ...s, testimonials: s.testimonials.filter((_,i)=>i!==idx) })); flash('Removed (save to apply)'); };

  const addOrUpdateSocialLink = (e) => {
    e.preventDefault(); if (!socialLinkForm.url.trim()) { flash('URL required', 'error'); return; }
    const item = { platform: socialLinkForm.platform.trim(), url: socialLinkForm.url.trim(), label: socialLinkForm.label.trim() || socialLinkForm.platform.trim() };
    const updated = editSocialIdx !== null ? siteSettings.socialLinks.map((l,i) => i===editSocialIdx ? item : l) : [...siteSettings.socialLinks, item];
    setSiteSettings(s => ({ ...s, socialLinks: updated })); setSocialLinkForm(emptySocialLink); setEditSocialIdx(null);
    flash('Done (save to apply)');
  };
  const removeSocialLink = (idx) => { setSiteSettings(s => ({ ...s, socialLinks: s.socialLinks.filter((_,i)=>i!==idx) })); flash('Removed (save to apply)'); };

  const addOrUpdateStep = (e) => {
    e.preventDefault(); if (!stepForm.title.trim()) { flash('Title required', 'error'); return; }
    const item = { title: stepForm.title.trim(), description: stepForm.description.trim() };
    const updated = editStepIdx !== null ? siteSettings.commissionSteps.map((s,i) => i===editStepIdx ? item : s) : [...siteSettings.commissionSteps, item];
    setSiteSettings(s => ({ ...s, commissionSteps: updated })); setStepForm(emptyStep); setEditStepIdx(null);
    flash('Done (save to apply)');
  };
  const removeStep = (idx) => { setSiteSettings(s => ({ ...s, commissionSteps: s.commissionSteps.filter((_,i)=>i!==idx) })); flash('Removed (save to apply)'); };

  const addOrUpdateFaq = (e) => {
    e.preventDefault(); if (!faqForm.question.trim()) { flash('Question required', 'error'); return; }
    const item = { question: faqForm.question.trim(), answer: faqForm.answer.trim() };
    const updated = editFaqIdx !== null ? siteSettings.commissionFaqs.map((f,i) => i===editFaqIdx ? item : f) : [...siteSettings.commissionFaqs, item];
    setSiteSettings(s => ({ ...s, commissionFaqs: updated })); setFaqForm(emptyFaq); setEditFaqIdx(null);
    flash('Done (save to apply)');
  };
  const removeFaq = (idx) => { setSiteSettings(s => ({ ...s, commissionFaqs: s.commissionFaqs.filter((_,i)=>i!==idx) })); flash('Removed (save to apply)'); };

  const addOrUpdateCard = (e) => {
    e.preventDefault(); if (!cardForm.title.trim()) { flash('Title required', 'error'); return; }
    const item = { title: cardForm.title.trim(), description: cardForm.description.trim() };
    const updated = editCardIdx !== null ? siteSettings.practiceCards.map((c,i) => i===editCardIdx ? item : c) : [...siteSettings.practiceCards, item];
    setSiteSettings(s => ({ ...s, practiceCards: updated })); setCardForm(emptyCard); setEditCardIdx(null);
    flash('Done (save to apply)');
  };
  const removeCard = (idx) => { setSiteSettings(s => ({ ...s, practiceCards: s.practiceCards.filter((_,i)=>i!==idx) })); flash('Removed (save to apply)'); };

  const statusCls = (status) => ({ new:'admin-status--pending', contacted:'admin-status--paid', completed:'admin-status--shipped', declined:'admin-status--cancelled' }[status] || '');

  if (!auth) return (
    <main className="admin-page"><div className="admin-container"><div className="admin-login"><div className="admin-login__card">
      <div className="admin-login__header"><h1>Admin Dashboard</h1><p>Enter your admin key to continue</p></div>
      <form className="admin-login__form" onSubmit={login}>
        <div className="form-group"><label>Admin Key</label><input type="password" value={key} onChange={e=>setKey(e.target.value)} placeholder="Enter ADMIN_KEY" autoFocus /></div>
        {error && <div className="admin-error">{error}</div>}
        <button type="submit" className="btn btn--large">Sign In</button>
      </form>
    </div></div></div></main>
  );

  const tabs = [['paintings',`Paintings (${paintings.length})`],['collections',`Collections (${collections.length})`],['orders',`Orders (${orders.length})`],['inquiries',`Inquiries (${inquiries.length})`],['newsletter',`Newsletter (${subscribers.length})`],['settings','Site Settings']];

  return (
    <main className="admin-page"><div className="admin-container">
      <div className="admin-header">
        <div><h1>Admin Dashboard</h1><p>Manage all website content, paintings, and customer inquiries</p></div>
        <button className="btn btn--secondary" onClick={()=>{sessionStorage.removeItem('adminKey');setAuth(false);}}>Sign Out</button>
      </div>
      {msg && <div className={`admin-${msgType==='error'?'error':'success'}`}>{msg}</div>}
      <div className="admin-tabs">
        {tabs.map(([k,l])=>(<button key={k} className={`admin-tab ${tab===k?'active':''}`} onClick={()=>setTab(k)}>{l}</button>))}
      </div>

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
            <div className="form-group">
              <label>Images *</label>
              <div className="admin-images">
                {form.images.map((url,i) => (
                  <div key={i} className="admin-images__item">
                    <img src={url} alt="" />
                    <button type="button" className="admin-images__remove" onClick={()=>removeImage(i)}>x</button>
                  </div>
                ))}
                <label className="admin-images__upload">
                  <input type="file" accept="image/*" onChange={handleUpload} ref={fileRef} hidden />
                  <span>{uploading ? 'Uploading...' : '+ Upload'}</span>
                </label>
              </div>
            </div>
            <div className="admin-form__checkboxes">
              <label className="checkbox-label"><input type="checkbox" checked={form.originalAvailable} onChange={e=>setForm({...form,originalAvailable:e.target.checked})} /> Original Available</label>
              <label className="checkbox-label"><input type="checkbox" checked={form.printAvailable} onChange={e=>setForm({...form,printAvailable:e.target.checked})} /> Print Available</label>
              <label className="checkbox-label"><input type="checkbox" checked={form.featured} onChange={e=>setForm({...form,featured:e.target.checked})} /> Featured (Portfolio page)</label>
              <label className="checkbox-label"><input type="checkbox" checked={form.heroImage} onChange={e=>setForm({...form,heroImage:e.target.checked})} /> Hero Image (homepage)</label>
            </div>
            <div className="admin-form__actions">
              <button type="submit" className="btn btn--large">{editId ? 'Update Painting' : 'Add Painting'}</button>
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
                  <p className="admin-painting-card__meta">{[p.year, p.medium].filter(Boolean).join(' · ')}</p>
                  {p.dimensions && <p className="admin-painting-card__meta">{p.dimensions}</p>}
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

      {tab==='collections' && <>
        <section className="admin-section">
          <h2>{colEditId ? 'Edit Collection' : 'Create Collection'}</h2>
          <form className="admin-form" onSubmit={saveCollection}>
            <div className="admin-form__row">
              <div className="form-group"><label>Name *</label><input value={colForm.name} onChange={e=>setColForm({...colForm,name:e.target.value})} required /></div>
              <div className="form-group"><label>Description</label><input value={colForm.description} onChange={e=>setColForm({...colForm,description:e.target.value})} /></div>
            </div>
            <div className="admin-form__actions">
              <button type="submit" className="btn btn--large">{colEditId ? 'Update' : 'Create'}</button>
              {colEditId && <button type="button" className="btn btn--ghost" onClick={()=>{setColForm(emptyCol);setColEditId(null);}}>Cancel</button>}
            </div>
          </form>
        </section>
        <section className="admin-section">
          <h2>All Collections ({collections.length})</h2>
          {collections.length===0 ? <div className="admin-empty">No collections yet.</div> : (
            <div className="admin-collections-list">{collections.map(c=>(
              <div key={c.id} className="admin-collection-card">
                <div className="admin-collection-card__info">
                  <h3>{c.name}</h3>
                  {c.description && <p>{c.description}</p>}
                  <p className="admin-collection-card__count">{c._count?.paintings||c.paintings?.length||0} paintings</p>
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

      {tab==='inquiries' && (
        <section className="admin-section">
          <h2>Commission Inquiries ({inquiries.length})</h2>
          {inquiries.length===0 ? (
            <div className="admin-empty">No inquiries yet. They will appear here when someone submits the commission form.</div>
          ) : (
            <div className="admin-inquiries">{inquiries.map(inq=>(
              <div key={inq.id} className="admin-inquiry-card">
                <div className="admin-inquiry-card__header">
                  <div>
                    <strong>{inq.name}</strong>
                    <a href={`mailto:${inq.email}`} className="admin-inquiry-card__email"> ({inq.email})</a>
                  </div>
                  <div className="admin-inquiry-card__meta">
                    <span className={`admin-status ${statusCls(inq.status)}`}>{inq.status}</span>
                    <span className="admin-inquiry-card__date">{new Date(inq.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="admin-inquiry-card__body">
                  <div className="admin-inquiry-card__field"><span className="admin-inquiry-card__label">Budget:</span> {inq.budget}</div>
                  <div className="admin-inquiry-card__field"><span className="admin-inquiry-card__label">Size:</span> {inq.size}</div>
                  <div className="admin-inquiry-card__field" style={{gridColumn:'1/-1'}}>
                    <span className="admin-inquiry-card__label">Vision:</span>
                    <p style={{marginTop:'4px',whiteSpace:'pre-wrap'}}>{inq.vision}</p>
                  </div>
                </div>
                <div className="admin-inquiry-card__actions">
                  <span style={{fontSize:'12px',color:'var(--color-text-secondary)',alignSelf:'center'}}>Status:</span>
                  {['new','contacted','completed','declined'].map(s=>(
                    <button key={s} className={`admin-btn ${inq.status===s?'admin-btn--edit':'admin-btn--status'}`} onClick={()=>updateInquiryStatus(inq.id,s)} disabled={inq.status===s}>{s}</button>
                  ))}
                </div>
              </div>
            ))}</div>
          )}
        </section>
      )}

      {tab==='newsletter' && (
        <section className="admin-section">
          <h2>Newsletter Subscribers ({subscribers.length})</h2>
          {subscribers.length===0 ? (
            <div className="admin-empty">No subscribers yet.</div>
          ) : (
            <div className="admin-subscribers">
              <div className="admin-subscribers__header"><span>Email</span><span>Date Subscribed</span><span>Action</span></div>
              {subscribers.map(s=>(
                <div key={s.id} className="admin-subscriber-row">
                  <span>{s.email}</span>
                  <span>{new Date(s.createdAt).toLocaleDateString()}</span>
                  <button className="admin-btn admin-btn--delete" onClick={()=>deleteSubscriber(s.id)}>Remove</button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {tab==='settings' && (
        <form onSubmit={saveSiteSettings}>

          <CollapsibleSection title="Navigation" defaultOpen={false}>
            <div className="form-group">
              <label>Logo Sub-text (under "Dahlia Baasher" in the nav)</label>
              <input value={siteSettings.navLogoSubtext} onChange={e=>setSiteSettings(s=>({...s,navLogoSubtext:e.target.value}))} placeholder="Studio" />
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Homepage Content" defaultOpen={true}>
            <div className="admin-form__row">
              <div className="form-group"><label>Hero Title</label><input value={siteSettings.heroTitle} onChange={e=>setSiteSettings(s=>({...s,heroTitle:e.target.value}))} placeholder="Dahlia Baasher" /></div>
              <div className="form-group"><label>Hero Subtitle</label><input value={siteSettings.heroSubtitle} onChange={e=>setSiteSettings(s=>({...s,heroSubtitle:e.target.value}))} placeholder="Contemporary Oil Paintings" /></div>
            </div>
            <div className="form-group"><label>Hero Description</label><textarea rows="2" value={siteSettings.heroDescription} onChange={e=>setSiteSettings(s=>({...s,heroDescription:e.target.value}))} /></div>
            <div className="admin-form__row">
              <div className="form-group"><label>Featured Works Title</label><input value={siteSettings.featuredWorksTitle} onChange={e=>setSiteSettings(s=>({...s,featuredWorksTitle:e.target.value}))} /></div>
              <div className="form-group"><label>Featured Works Subtitle</label><input value={siteSettings.featuredWorksSubtitle} onChange={e=>setSiteSettings(s=>({...s,featuredWorksSubtitle:e.target.value}))} /></div>
            </div>
            <div className="admin-form__row">
              <div className="form-group"><label>Prints Title</label><input value={siteSettings.printsTitle} onChange={e=>setSiteSettings(s=>({...s,printsTitle:e.target.value}))} /></div>
              <div className="form-group"><label>Prints Subtitle</label><input value={siteSettings.printsSubtitle} onChange={e=>setSiteSettings(s=>({...s,printsSubtitle:e.target.value}))} /></div>
            </div>
            <div className="admin-form__row">
              <div className="form-group"><label>CTA Title</label><input value={siteSettings.ctaTitle} onChange={e=>setSiteSettings(s=>({...s,ctaTitle:e.target.value}))} /></div>
            </div>
            <div className="form-group"><label>CTA Description</label><textarea rows="2" value={siteSettings.ctaDescription} onChange={e=>setSiteSettings(s=>({...s,ctaDescription:e.target.value}))} /></div>
            <div className="admin-form__row">
              <div className="form-group"><label>Newsletter Section Title</label><input value={siteSettings.newsletterTitle} onChange={e=>setSiteSettings(s=>({...s,newsletterTitle:e.target.value}))} /></div>
            </div>
            <div className="form-group"><label>Newsletter Subtitle</label><textarea rows="2" value={siteSettings.newsletterSubtitle} onChange={e=>setSiteSettings(s=>({...s,newsletterSubtitle:e.target.value}))} /></div>
          </CollapsibleSection>

          <CollapsibleSection title="Footer and Social Links" defaultOpen={false}>
            <div className="form-group">
              <label>Footer Tagline</label>
              <input value={siteSettings.footerTagline} onChange={e=>setSiteSettings(s=>({...s,footerTagline:e.target.value}))} placeholder="Contemporary Art, Toronto, Canada" />
            </div>
            <h3 style={{fontSize:'15px',marginBottom:'12px',marginTop:'20px'}}>Social Links ({siteSettings.socialLinks.length})</h3>
            <div style={{background:'#f9f9f9',padding:'16px',borderRadius:'8px',marginBottom:'12px',border:'1px solid var(--color-border)'}}>
              <h4 style={{fontSize:'13px',marginBottom:'10px'}}>{editSocialIdx!==null?'Edit':'Add'} Social Link</h4>
              <div className="admin-form__row">
                <div className="form-group"><label>Platform</label><input value={socialLinkForm.platform} onChange={e=>setSocialLinkForm(f=>({...f,platform:e.target.value}))} placeholder="Instagram" /></div>
                <div className="form-group"><label>Display Label</label><input value={socialLinkForm.label} onChange={e=>setSocialLinkForm(f=>({...f,label:e.target.value}))} placeholder="Instagram" /></div>
                <div className="form-group"><label>URL *</label><input value={socialLinkForm.url} onChange={e=>setSocialLinkForm(f=>({...f,url:e.target.value}))} placeholder="https://..." /></div>
              </div>
              <div style={{display:'flex',gap:'8px'}}>
                <button type="button" className="btn" style={{flex:'none'}} onClick={addOrUpdateSocialLink}>{editSocialIdx!==null?'Update':'Add Link'}</button>
                {editSocialIdx!==null && <button type="button" className="btn btn--ghost" style={{flex:'none'}} onClick={()=>{setSocialLinkForm(emptySocialLink);setEditSocialIdx(null);}}>Cancel</button>}
              </div>
            </div>
            {siteSettings.socialLinks.map((l,i)=>(
              <div key={i} className="admin-collection-card" style={{marginBottom:'8px'}}>
                <div className="admin-collection-card__info"><h3>{l.label||l.platform}</h3><p style={{wordBreak:'break-all',fontSize:'12px'}}>{l.url}</p></div>
                <div className="admin-collection-card__actions">
                  <button type="button" className="admin-btn admin-btn--edit" onClick={()=>{setSocialLinkForm({platform:l.platform||'',url:l.url||'',label:l.label||''});setEditSocialIdx(i);}}>Edit</button>
                  <button type="button" className="admin-btn admin-btn--delete" onClick={()=>removeSocialLink(i)}>Remove</button>
                </div>
              </div>
            ))}
          </CollapsibleSection>

          <CollapsibleSection title="Gallery Page Header" defaultOpen={false}>
            <div className="admin-form__row">
              <div className="form-group"><label>Page Label (small text)</label><input value={siteSettings.galleryLabel} onChange={e=>setSiteSettings(s=>({...s,galleryLabel:e.target.value}))} placeholder="Portfolio" /></div>
              <div className="form-group"><label>Page Title</label><input value={siteSettings.galleryTitle} onChange={e=>setSiteSettings(s=>({...s,galleryTitle:e.target.value}))} placeholder="Artworks" /></div>
            </div>
            <div className="form-group"><label>Page Subtitle</label><input value={siteSettings.gallerySubtitle} onChange={e=>setSiteSettings(s=>({...s,gallerySubtitle:e.target.value}))} /></div>
          </CollapsibleSection>

          <CollapsibleSection title="Portfolio Page" defaultOpen={false}>
            <div className="admin-form__row">
              <div className="form-group"><label>Page Title</label><input value={siteSettings.portfolioTitle} onChange={e=>setSiteSettings(s=>({...s,portfolioTitle:e.target.value}))} placeholder="Portfolio" /></div>
              <div className="form-group"><label>Page Subtitle</label><input value={siteSettings.portfolioSubtitle} onChange={e=>setSiteSettings(s=>({...s,portfolioSubtitle:e.target.value}))} /></div>
            </div>
            <div className="form-group"><label>Artist Statement</label><textarea rows="4" value={siteSettings.portfolioStatement} onChange={e=>setSiteSettings(s=>({...s,portfolioStatement:e.target.value}))} /></div>
            <p style={{fontSize:'12px',color:'var(--color-text-secondary)'}}>Tip: Mark paintings as "Featured" in the Paintings tab to control which appear on the Portfolio page.</p>
          </CollapsibleSection>

          <CollapsibleSection title="Commissions Page" defaultOpen={false}>
            <div className="form-group"><label>Page Subtitle</label><textarea rows="2" value={siteSettings.commissionsSubtitle} onChange={e=>setSiteSettings(s=>({...s,commissionsSubtitle:e.target.value}))} /></div>
            <div className="form-group"><label>Form Help Text</label><input value={siteSettings.commissionFormHelpText} onChange={e=>setSiteSettings(s=>({...s,commissionFormHelpText:e.target.value}))} /></div>

            <h3 style={{fontSize:'15px',margin:'20px 0 10px'}}>Process Steps ({siteSettings.commissionSteps.length})</h3>
            <div style={{background:'#f9f9f9',padding:'16px',borderRadius:'8px',marginBottom:'12px',border:'1px solid var(--color-border)'}}>
              <div className="admin-form__row">
                <div className="form-group"><label>Title *</label><input value={stepForm.title} onChange={e=>setStepForm(f=>({...f,title:e.target.value}))} placeholder="Initial Consultation" /></div>
                <div className="form-group"><label>Description</label><input value={stepForm.description} onChange={e=>setStepForm(f=>({...f,description:e.target.value}))} /></div>
              </div>
              <div style={{display:'flex',gap:'8px'}}>
                <button type="button" className="btn" style={{flex:'none'}} onClick={addOrUpdateStep}>{editStepIdx!==null?'Update':'Add Step'}</button>
                {editStepIdx!==null && <button type="button" className="btn btn--ghost" style={{flex:'none'}} onClick={()=>{setStepForm(emptyStep);setEditStepIdx(null);}}>Cancel</button>}
              </div>
            </div>
            {siteSettings.commissionSteps.length===0 ? <p style={{fontSize:'13px',color:'var(--color-text-secondary)'}}>No steps yet. Page uses built-in defaults.</p> : siteSettings.commissionSteps.map((s,i)=>(
              <div key={i} className="admin-collection-card" style={{marginBottom:'8px'}}>
                <div className="admin-collection-card__info"><h3>{i+1}. {s.title}</h3><p>{s.description}</p></div>
                <div className="admin-collection-card__actions">
                  <button type="button" className="admin-btn admin-btn--edit" onClick={()=>{setStepForm({title:s.title,description:s.description||''});setEditStepIdx(i);}}>Edit</button>
                  <button type="button" className="admin-btn admin-btn--delete" onClick={()=>removeStep(i)}>Remove</button>
                </div>
              </div>
            ))}

            <h3 style={{fontSize:'15px',margin:'20px 0 10px'}}>FAQs ({siteSettings.commissionFaqs.length})</h3>
            <div style={{background:'#f9f9f9',padding:'16px',borderRadius:'8px',marginBottom:'12px',border:'1px solid var(--color-border)'}}>
              <div className="form-group"><label>Question *</label><input value={faqForm.question} onChange={e=>setFaqForm(f=>({...f,question:e.target.value}))} /></div>
              <div className="form-group"><label>Answer</label><textarea rows="2" value={faqForm.answer} onChange={e=>setFaqForm(f=>({...f,answer:e.target.value}))} /></div>
              <div style={{display:'flex',gap:'8px'}}>
                <button type="button" className="btn" style={{flex:'none'}} onClick={addOrUpdateFaq}>{editFaqIdx!==null?'Update':'Add FAQ'}</button>
                {editFaqIdx!==null && <button type="button" className="btn btn--ghost" style={{flex:'none'}} onClick={()=>{setFaqForm(emptyFaq);setEditFaqIdx(null);}}>Cancel</button>}
              </div>
            </div>
            {siteSettings.commissionFaqs.length===0 ? <p style={{fontSize:'13px',color:'var(--color-text-secondary)'}}>No FAQs yet. Page uses built-in defaults.</p> : siteSettings.commissionFaqs.map((f,i)=>(
              <div key={i} className="admin-collection-card" style={{marginBottom:'8px'}}>
                <div className="admin-collection-card__info"><h3>{f.question}</h3><p>{f.answer}</p></div>
                <div className="admin-collection-card__actions">
                  <button type="button" className="admin-btn admin-btn--edit" onClick={()=>{setFaqForm({question:f.question,answer:f.answer||''});setEditFaqIdx(i);}}>Edit</button>
                  <button type="button" className="admin-btn admin-btn--delete" onClick={()=>removeFaq(i)}>Remove</button>
                </div>
              </div>
            ))}
          </CollapsibleSection>

          <CollapsibleSection title="About Page Content" defaultOpen={false}>
            <div className="form-group"><label>Hero Subtitle</label><input value={siteSettings.aboutHeroSubtitle} onChange={e=>setSiteSettings(s=>({...s,aboutHeroSubtitle:e.target.value}))} /></div>
            <div className="form-group"><label>Bio Paragraph 1</label><textarea rows="3" value={siteSettings.aboutBio1} onChange={e=>setSiteSettings(s=>({...s,aboutBio1:e.target.value}))} /></div>
            <div className="form-group"><label>Bio Paragraph 2</label><textarea rows="3" value={siteSettings.aboutBio2} onChange={e=>setSiteSettings(s=>({...s,aboutBio2:e.target.value}))} /></div>
            <div className="form-group"><label>Bio Paragraph 3</label><textarea rows="3" value={siteSettings.aboutBio3} onChange={e=>setSiteSettings(s=>({...s,aboutBio3:e.target.value}))} /></div>
            <div className="form-group"><label>Artist Statement 1</label><textarea rows="3" value={siteSettings.aboutStatement1} onChange={e=>setSiteSettings(s=>({...s,aboutStatement1:e.target.value}))} /></div>
            <div className="form-group"><label>Artist Statement 2</label><textarea rows="3" value={siteSettings.aboutStatement2} onChange={e=>setSiteSettings(s=>({...s,aboutStatement2:e.target.value}))} /></div>
            <div className="form-group"><label>Artist Statement 3</label><textarea rows="3" value={siteSettings.aboutStatement3} onChange={e=>setSiteSettings(s=>({...s,aboutStatement3:e.target.value}))} /></div>

            <h3 style={{fontSize:'15px',margin:'20px 0 10px'}}>Practice Cards ({siteSettings.practiceCards.length})</h3>
            <div style={{background:'#f9f9f9',padding:'16px',borderRadius:'8px',marginBottom:'12px',border:'1px solid var(--color-border)'}}>
              <div className="form-group"><label>Title *</label><input value={cardForm.title} onChange={e=>setCardForm(f=>({...f,title:e.target.value}))} placeholder="Materials and Technique" /></div>
              <div className="form-group"><label>Description</label><textarea rows="2" value={cardForm.description} onChange={e=>setCardForm(f=>({...f,description:e.target.value}))} /></div>
              <div style={{display:'flex',gap:'8px'}}>
                <button type="button" className="btn" style={{flex:'none'}} onClick={addOrUpdateCard}>{editCardIdx!==null?'Update':'Add Card'}</button>
                {editCardIdx!==null && <button type="button" className="btn btn--ghost" style={{flex:'none'}} onClick={()=>{setCardForm(emptyCard);setEditCardIdx(null);}}>Cancel</button>}
              </div>
            </div>
            {siteSettings.practiceCards.length===0 ? <p style={{fontSize:'13px',color:'var(--color-text-secondary)'}}>No custom cards. Page uses built-in defaults.</p> : siteSettings.practiceCards.map((c,i)=>(
              <div key={i} className="admin-collection-card" style={{marginBottom:'8px'}}>
                <div className="admin-collection-card__info"><h3>{c.title}</h3><p>{c.description}</p></div>
                <div className="admin-collection-card__actions">
                  <button type="button" className="admin-btn admin-btn--edit" onClick={()=>{setCardForm({title:c.title,description:c.description||''});setEditCardIdx(i);}}>Edit</button>
                  <button type="button" className="admin-btn admin-btn--delete" onClick={()=>removeCard(i)}>Remove</button>
                </div>
              </div>
            ))}
          </CollapsibleSection>

          <CollapsibleSection title="Testimonials" defaultOpen={false}>
            <div style={{background:'#f9f9f9',padding:'16px',borderRadius:'8px',marginBottom:'12px',border:'1px solid var(--color-border)'}}>
              <h3 style={{fontSize:'13px',marginBottom:'10px'}}>{editTestimonialIdx!==null?'Edit':'Add'} Testimonial</h3>
              <div className="admin-form__row">
                <div className="form-group"><label>Name *</label><input value={testimonialForm.name} onChange={e=>setTestimonialForm(f=>({...f,name:e.target.value}))} placeholder="Sarah Mitchell" /></div>
                <div className="form-group"><label>Title/Role</label><input value={testimonialForm.title} onChange={e=>setTestimonialForm(f=>({...f,title:e.target.value}))} placeholder="Art Collector" /></div>
                <div className="form-group"><label>Rating</label>
                  <select value={testimonialForm.rating} onChange={e=>setTestimonialForm(f=>({...f,rating:Number(e.target.value)}))}>
                    {[5,4,3,2,1].map(n=><option key={n} value={n}>{n} Star{n>1?'s':''}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group"><label>Testimonial Text *</label><textarea rows="2" value={testimonialForm.text} onChange={e=>setTestimonialForm(f=>({...f,text:e.target.value}))} /></div>
              <div style={{display:'flex',gap:'8px'}}>
                <button type="button" className="btn" style={{flex:'none'}} onClick={addOrUpdateTestimonial}>{editTestimonialIdx!==null?'Update':'Add'}</button>
                {editTestimonialIdx!==null && <button type="button" className="btn btn--ghost" style={{flex:'none'}} onClick={()=>{setTestimonialForm(emptyTestimonial);setEditTestimonialIdx(null);}}>Cancel</button>}
              </div>
            </div>
            {siteSettings.testimonials.length===0 ? <div className="admin-empty">No testimonials yet.</div> : (
              <div className="admin-collections-list">{siteSettings.testimonials.map((t,idx)=>(
                <div key={t.id||idx} className="admin-collection-card">
                  <div className="admin-collection-card__info">
                    <h3>{t.name} <span style={{fontSize:'12px',color:'var(--color-accent)',fontWeight:400}}>{Array.from({length:t.rating||5}).map(()=>'*').join('')}</span></h3>
                    {t.title && <p style={{fontSize:'11px',color:'var(--color-accent)',textTransform:'uppercase',letterSpacing:'0.05em'}}>{t.title}</p>}
                    <p style={{fontSize:'13px',fontStyle:'italic',color:'var(--color-text-secondary)'}}>{t.text}</p>
                  </div>
                  <div className="admin-collection-card__actions">
                    <button type="button" className="admin-btn admin-btn--edit" onClick={()=>{setTestimonialForm({name:t.name,title:t.title||'',text:t.text,rating:t.rating||5});setEditTestimonialIdx(idx);}}>Edit</button>
                    <button type="button" className="admin-btn admin-btn--delete" onClick={()=>removeTestimonial(idx)}>Remove</button>
                  </div>
                </div>
              ))}</div>
            )}
          </CollapsibleSection>

          <div className="admin-form__actions" style={{marginTop:'24px'}}>
            <button type="submit" className="btn btn--large">Save All Site Settings</button>
          </div>
        </form>
      )}
    </div></main>
  );
}
