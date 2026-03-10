import { useState } from 'react';
import './CommissionsPage.css';

export default function CommissionsPage() {
  const [form, setForm] = useState({ name: '', email: '', description: '', size: '', budget: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate email sending - in production, connect to your backend
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      console.log('Commission inquiry submitted:', form);
    }, 1000);
  };

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
                <button 
                  className="btn" 
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: '', email: '', description: '', size: '', budget: '' });
                  }}
                  style={{ marginTop: 16 }}
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form className="commissions-form" onSubmit={handleSubmit}>
                <p className="label" style={{ marginBottom: 32 }}>Commission Inquiry</p>
                
                {error && (
                  <div style={{ 
                    padding: '12px',
                    backgroundColor: '#f3ede5',
                    border: '1px solid #d4a574',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    color: '#8b3a3a'
                  }}>
                    {error}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Your Name *</label>
                  <input 
                    className="form-input" 
                    type="text" 
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})} 
                    required 
                    placeholder="Jane Smith" 
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input 
                    className="form-input" 
                    type="email" 
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})} 
                    required 
                    placeholder="jane@example.com"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Describe Your Vision *</label>
                  <textarea 
                    className="form-input" 
                    value={form.description}
                    onChange={e => setForm({...form, description: e.target.value})} 
                    required 
                    placeholder="Tell us about your ideas, themes, and inspiration..." 
                    rows="5"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Approximate Size</label>
                  <input 
                    className="form-input" 
                    type="text" 
                    value={form.size}
                    onChange={e => setForm({...form, size: e.target.value})} 
                    placeholder="e.g., 24x36 inches"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Budget Range (USD)</label>
                  <select 
                    className="form-input" 
                    value={form.budget}
                    onChange={e => setForm({...form, budget: e.target.value})}
                    disabled={loading}
                  >
                    <option value="">Select a budget range</option>
                    <option value="800-1500">$800 - $1,500</option>
                    <option value="1500-3000">$1,500 - $3,000</option>
                    <option value="3000-5000">$3,000 - $5,000</option>
                    <option value="5000+">$5,000+</option>
                  </select>
                </div>

                <button 
                  className="btn" 
                  style={{ width: '100%', justifyContent: 'center' }}
                  disabled={loading}
                  type="submit"
                >
                  {loading ? 'Sending...' : 'Send Inquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
