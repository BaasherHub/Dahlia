import { useState } from 'react';
import './CommissionsPage.css';

export default function CommissionsPage() {
  const [form, setForm] = useState({ name: '', email: '', description: '', size: '', budget: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production this would send an email via your backend
    setSubmitted(true);
  };

  return (
    <main className="commissions-page">
      <div className="commissions-page__header">
        <div className="container">
          <p className="label">Custom Work</p>
          <h1 className="commissions-page__title">Commissions</h1>
          <p className="commissions-page__sub">
            Commission an original painting made specifically for you.
          </p>
        </div>
      </div>

      <div className="container">
        <div className="commissions-page__body">
          <div className="commissions-info">
            <p className="label" style={{ marginBottom: 24 }}>The Process</p>
            {[
              { n: '01', title: 'Inquiry', desc: 'Fill out the form with your vision, size, and budget. I\'ll get back to you within 3 business days.' },
              { n: '02', title: 'Consultation', desc: 'We\'ll discuss your ideas, the themes you\'d like to explore, and the space the work will live in.' },
              { n: '03', title: 'Creation', desc: 'I\'ll create your painting — typically 4 to 8 weeks depending on size and complexity.' },
              { n: '04', title: 'Delivery', desc: 'Your painting is carefully packed and shipped directly to your door, fully insured.' },
            ].map(step => (
              <div key={step.n} className="commissions-step">
                <span className="commissions-step__n">{step.n}</span>
                <div>
                  <p className="commissions-step__title">{step.title}</p>
                  <p className="commissions-step__desc">{step.desc}</p>
                </div>
              </div>
            ))}
            <div className="commissions-note">
              <p className="label" style={{ marginBottom: 12 }}>Please Note</p>
              <p>Commissions start at $800 USD. A 50% deposit is required to begin work, with the remainder due upon completion. All commissions include a certificate of authenticity.</p>
            </div>
          </div>

          <div className="commissions-form-wrap">
            {submitted ? (
              <div className="commissions-thanks">
                <p className="label" style={{ marginBottom: 16 }}>Thank You</p>
                <h2>Inquiry received.</h2>
                <p>I'll be in touch within 3 business days to discuss your commission.</p>
              </div>
            ) : (
              <form className="commissions-form" onSubmit={handleSubmit}>
                <p className="label" style={{ marginBottom: 32 }}>Commission Inquiry</p>
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input className="form-input" type="text" value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})} required placeholder="Jane Smith" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})} required placeholder="jane@example.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">Describe your vision</label>
                  <textarea className="form-input" rows={5} value={form.description}
                    onChange={e => setForm({...form, description: e.target.value})} required
                    placeholder="What themes, imagery, or feeling are you looking for?" />
                </div>
                <div className="commissions-form__row">
                  <div className="form-group">
                    <label className="form-label">Approximate Size</label>
                    <input className="form-input" type="text" value={form.size}
                      onChange={e => setForm({...form, size: e.target.value})}
                      placeholder="e.g. 60 x 80 cm" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Budget (USD)</label>
                    <input className="form-input" type="text" value={form.budget}
                      onChange={e => setForm({...form, budget: e.target.value})}
                      placeholder="e.g. $1,500" />
                  </div>
                </div>
                <button type="submit" className="btn" style={{ marginTop: 8, width: '100%', justifyContent: 'center' }}>
                  Send Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
