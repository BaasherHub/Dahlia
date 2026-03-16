import { useState } from 'react';
import { submitCommission } from '../api.js';
import './CommissionsPage.css';

const STEPS = [
  {
    num: '01',
    title: 'Consultation',
    desc: 'We begin with a conversation about your vision, the space the work will inhabit, your aesthetic preferences, and your timeline.',
  },
  {
    num: '02',
    title: 'Creation',
    desc: 'Once terms are agreed, Baasher begins work on your piece, sharing progress photographs at key stages of development.',
  },
  {
    num: '03',
    title: 'Delivery',
    desc: 'Your finished work is professionally packed and shipped with full insurance, accompanied by a certificate of authenticity.',
  },
];

const TYPES = [
  {
    title: 'Portrait',
    desc: 'Intimate, expressive studies of the human form — painted from life or reference with a characteristic emphasis on light and psychological depth.',
  },
  {
    title: 'Landscape',
    desc: "Atmospheric interpretations of the natural world. Large or intimate, each landscape carries Baasher's distinct tonal vocabulary.",
  },
  {
    title: 'Abstract',
    desc: 'Works guided by form, colour, and emotion rather than representation. Ideal for collectors seeking something wholly singular.',
  },
];

const INITIAL_FORM = {
  name: '',
  email: '',
  commissionType: '',
  size: '',
  description: '',
  budget: '',
};

export default function CommissionsPage({ addToast }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Please enter your name.';
    if (!form.email.trim()) e.email = 'Please enter your email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email address.';
    if (!form.commissionType) e.commissionType = 'Please select a commission type.';
    if (!form.size) e.size = 'Please select a size.';
    if (!form.description.trim()) e.description = 'Please describe your vision.';
    if (!form.budget) e.budget = 'Please select a budget range.';
    return e;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      await submitCommission(form);
      setSubmitted(true);
      setForm(INITIAL_FORM);
      addToast?.("Inquiry sent — we'll be in touch soon.", 'success');
    } catch (err) {
      console.error('Commission submission error:', err);
      setErrors({ submit: 'There was a problem sending your inquiry. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="commissions">

      {/* ── HERO ── */}
      <header className="commissions__hero">
        <div className="container">
          <p className="commissions__eyebrow">Bespoke Artworks</p>
          <h1 className="commissions__title">Commission a Piece</h1>
          <p className="commissions__subtitle">
            Work directly with Baasher to create an original painting conceived entirely around your vision, space, and sensibility.
          </p>
        </div>
      </header>

      {/* ── HOW IT WORKS ── */}
      <section className="commissions__process">
        <div className="container">
          <p className="commissions__section-eyebrow">The Process</p>
          <h2 className="commissions__section-title">How It Works</h2>
          <ol className="commissions__steps" aria-label="Commission process steps">
            {STEPS.map(step => (
              <li key={step.num} className="commissions__step">
                <span className="commissions__step-num" aria-hidden="true">{step.num}</span>
                <div className="commissions__step-body">
                  <h3 className="commissions__step-title">{step.title}</h3>
                  <p className="commissions__step-desc">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── COMMISSION TYPES ── */}
      <section className="commissions__types">
        <div className="container">
          <p className="commissions__section-eyebrow">What We Offer</p>
          <h2 className="commissions__section-title">Commission Types</h2>
          <div className="commissions__types-grid">
            {TYPES.map(t => (
              <div key={t.title} className="commissions__type-card">
                <h3 className="commissions__type-title">{t.title}</h3>
                <p className="commissions__type-desc">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="commissions__pricing">
        <div className="container">
          <div className="commissions__pricing-inner">
            <div className="commissions__pricing-text">
              <p className="commissions__section-eyebrow">Investment</p>
              <h2 className="commissions__section-title">Pricing</h2>
              <p className="commissions__pricing-body">
                Commission prices are determined by size, complexity, and timeline. Baasher works with a limited number of commissions each year to ensure each piece receives the care it deserves.
              </p>
            </div>
            <div className="commissions__pricing-from">
              <span className="commissions__pricing-label">Starting from</span>
              <span className="commissions__pricing-amount">$1,200</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── INQUIRY FORM ── */}
      <section className="commissions__form-section">
        <div className="container">
          <div className="commissions__form-wrap">
            <div className="commissions__form-intro">
              <p className="commissions__section-eyebrow">Get in Touch</p>
              <h2 className="commissions__section-title">Commission Inquiry</h2>
              <p className="commissions__form-intro-text">
                Fill in the form and Baasher will respond within 48 hours to discuss your project. All enquiries are treated with complete confidentiality.
              </p>
            </div>

            {submitted ? (
              <div className="commissions__success" role="alert">
                <div className="commissions__success-check" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="commissions__success-title">Inquiry Received</h3>
                <p className="commissions__success-msg">
                  Thank you for reaching out. Baasher will be in touch within 48 hours to begin the conversation.
                </p>
                <button className="commissions__success-reset" onClick={() => setSubmitted(false)}>
                  Submit another inquiry
                </button>
              </div>
            ) : (
              <form className="commissions__form" onSubmit={handleSubmit} noValidate>
                <div className="commissions__fields">
                  <div className="commissions__field">
                    <label className="commissions__label" htmlFor="c-name">Your Name <span aria-hidden="true">*</span></label>
                    <input
                      id="c-name"
                      className={`commissions__input${errors.name ? ' commissions__input--err' : ''}`}
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Full name"
                      autoComplete="name"
                      disabled={submitting}
                    />
                    {errors.name && <p className="commissions__err" role="alert">{errors.name}</p>}
                  </div>

                  <div className="commissions__field">
                    <label className="commissions__label" htmlFor="c-email">Email Address <span aria-hidden="true">*</span></label>
                    <input
                      id="c-email"
                      className={`commissions__input${errors.email ? ' commissions__input--err' : ''}`}
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      autoComplete="email"
                      disabled={submitting}
                    />
                    {errors.email && <p className="commissions__err" role="alert">{errors.email}</p>}
                  </div>

                  <div className="commissions__field">
                    <label className="commissions__label" htmlFor="c-type">Commission Type <span aria-hidden="true">*</span></label>
                    <select
                      id="c-type"
                      className={`commissions__select${errors.commissionType ? ' commissions__input--err' : ''}`}
                      name="commissionType"
                      value={form.commissionType}
                      onChange={handleChange}
                      disabled={submitting}
                    >
                      <option value="">Select a type…</option>
                      <option value="portrait">Portrait</option>
                      <option value="landscape">Landscape</option>
                      <option value="abstract">Abstract</option>
                      <option value="other">Other / Discuss</option>
                    </select>
                    {errors.commissionType && <p className="commissions__err" role="alert">{errors.commissionType}</p>}
                  </div>

                  <div className="commissions__field">
                    <label className="commissions__label" htmlFor="c-size">Approximate Size <span aria-hidden="true">*</span></label>
                    <select
                      id="c-size"
                      className={`commissions__select${errors.size ? ' commissions__input--err' : ''}`}
                      name="size"
                      value={form.size}
                      onChange={handleChange}
                      disabled={submitting}
                    >
                      <option value="">Select a size…</option>
                      <option value="small">Small — up to 40 × 50 cm</option>
                      <option value="medium">Medium — 50 × 70 cm to 80 × 100 cm</option>
                      <option value="large">Large — 100 × 120 cm to 120 × 150 cm</option>
                      <option value="xl">Extra Large — over 150 cm</option>
                      <option value="discuss">To be discussed</option>
                    </select>
                    {errors.size && <p className="commissions__err" role="alert">{errors.size}</p>}
                  </div>

                  <div className="commissions__field commissions__field--full">
                    <label className="commissions__label" htmlFor="c-desc">Your Vision <span aria-hidden="true">*</span></label>
                    <textarea
                      id="c-desc"
                      className={`commissions__textarea${errors.description ? ' commissions__input--err' : ''}`}
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Describe the work you have in mind — subject matter, mood, colours, the space it will occupy, any references…"
                      rows={6}
                      disabled={submitting}
                    />
                    {errors.description && <p className="commissions__err" role="alert">{errors.description}</p>}
                  </div>

                  <div className="commissions__field">
                    <label className="commissions__label" htmlFor="c-budget">Budget Range <span aria-hidden="true">*</span></label>
                    <select
                      id="c-budget"
                      className={`commissions__select${errors.budget ? ' commissions__input--err' : ''}`}
                      name="budget"
                      value={form.budget}
                      onChange={handleChange}
                      disabled={submitting}
                    >
                      <option value="">Select a range…</option>
                      <option value="1200-3000">$1,200 – $3,000</option>
                      <option value="3000-6000">$3,000 – $6,000</option>
                      <option value="6000-12000">$6,000 – $12,000</option>
                      <option value="12000+">$12,000+</option>
                    </select>
                    {errors.budget && <p className="commissions__err" role="alert">{errors.budget}</p>}
                  </div>
                </div>

                {errors.submit && (
                  <p className="commissions__err commissions__err--submit" role="alert">{errors.submit}</p>
                )}

                <button className="commissions__submit" type="submit" disabled={submitting}>
                  {submitting ? 'Sending…' : 'Send Inquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

    </main>
  );
}
