import { useState } from 'react';
import './CommissionsPage.css';

export default function CommissionsPage() {
  const [form, setForm] = useState({ name: '', email: '', description: '', size: '', budget: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const steps = [
    { 
      n: '01', 
      title: 'Inquiry', 
      desc: 'Fill out the form with your vision, size, and budget. We will respond within 3 business days.' 
    },
    { 
      n: '02', 
      title: 'Consultation', 
      desc: 'Discuss your ideas, themes, and the space where the work will be displayed.' 
    },
    { 
      n: '03', 
      title: 'Creation', 
      desc: 'The painting is created — typically 4 to 8 weeks depending on size and complexity.' 
    },
    { 
      n: '04', 
      title: 'Delivery', 
      desc: 'Your painting is carefully packaged and shipped directly, fully insured.' 
    },
  ];

  return (
    <main className="commissions-page">
      <div className="commissions-page__header">
        <div className="container">
          <p className="label">Custom Work</p>
          <h1 className="commissions-page__title">Commissions</h1>
          <p className="commissions-page__sub">
            Commission an original painting made specifically for your collection.
          </p>
        </div>
      </div>

      <div className="container">
        <div className="commissions-page__body">
          <div className="commissions-info">
            <p className="label" style={{ marginBottom: 24 }}>The Process</p>
            {steps.map(step => (
              <div key={step.n} className="commissions-step">
                <span className="commissions-step__n">{step.n}</span>
                <div>
                  <p className="commissions-step__title">{step.title}</p>
                  <p className="commissions-step__desc">{step.desc}</p>
                </div>
              </div>
            ))}
            <div className="commissions-note">
              <p className="label" style={{ marginBottom: 12 }}>Pricing</p>
              <p>Commissions start at $800 USD. A 50% deposit is required to begin work, with the remainder due upon completion. All commissions include a certificate of authenticity.</p>
            </div>
          </div>

          <div className="commissions-form-wrap">
            {submitted ? (
              <div className="commissions-thanks">
                <p className="label" style={{ marginBottom: 16 }}>Inquiry Received</p>
                <h2>Thank you</h2>
                <p>We will be in touch within 3 business days to discuss your commission.</p>
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
                  <label className="form-label">Vision & Description</label>
                  <textarea className="form-input" rows="4" value={form.description}
                    onChange={e => setForm({...form, description: e.target.value})} required placeholder="Tell us about your vision..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Approximate Size</label>
                  <input className="form-input" type="text" value={form.size}
                    onChange={e => setForm({...form, size: e.target.value})} placeholder="e.g., 36 x 48 inches" />
                </div>
                <div className="form-group">
                  <label className="form-label">Budget Range</label>
                  <input className="form-input" type="text" value={form.budget}
                    onChange={e => setForm({...form, budget: e.target.value})} placeholder="e.g., $1000 - $2000" />
                </div>
                <button type="submit" className="btn" style={{ width: '100%', justifyContent: 'center' }}>
                  Submit Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
