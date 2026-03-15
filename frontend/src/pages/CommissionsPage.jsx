import { useState, useEffect } from 'react';
import { getSiteSettings, submitCommission } from '../api.js';
import './CommissionsPage.css';

const DEFAULT_STEPS = [
  { title: 'Initial Consultation', description: 'We discuss your vision, space, preferences, and timeline.' },
  { title: 'Concept Development', description: 'I create sketches and mock-ups for your approval.' },
  { title: 'Execution', description: 'I create the artwork with regular progress updates.' },
  { title: 'Installation', description: 'I provide guidance on proper installation and care.' },
];

const DEFAULT_FAQS = [
  { question: "What's your typical timeline?", answer: 'Commission timelines vary from 4-12 weeks depending on size and complexity.' },
  { question: 'Do you require a deposit?', answer: 'Yes, a 50% deposit is required to begin the project, with the balance due upon completion.' },
  { question: 'Can I request specific colors or styles?', answer: 'Absolutely! I collaborate closely with clients to ensure the final piece matches their vision.' },
  { question: 'Do you ship internationally?', answer: 'Yes, I ship worldwide. Shipping costs are calculated based on size and destination.' },
];

export default function CommissionsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    vision: '',
    size: '',
    budget: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState({
    commissionsSubtitle: 'I work with collectors and designers worldwide to create bespoke artwork tailored to your vision and space.',
    commissionSteps: DEFAULT_STEPS,
    commissionFaqs: DEFAULT_FAQS,
    commissionFormHelpText: 'I typically respond within 48 hours. Looking forward to collaborating with you!',
  });

  useEffect(() => {
    getSiteSettings()
      .then(data => {
        setContent({
          commissionsSubtitle: data.commissionsSubtitle || content.commissionsSubtitle,
          commissionSteps: Array.isArray(data.commissionSteps) && data.commissionSteps.length > 0
            ? data.commissionSteps : DEFAULT_STEPS,
          commissionFaqs: Array.isArray(data.commissionFaqs) && data.commissionFaqs.length > 0
            ? data.commissionFaqs : DEFAULT_FAQS,
          commissionFormHelpText: data.commissionFormHelpText || content.commissionFormHelpText,
        });
      })
      .catch(() => {});
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.vision.trim()) {
      newErrors.vision = 'Please describe your vision';
    } else if (formData.vision.length < 20) {
      newErrors.vision = 'Please provide at least 20 characters';
    }

    if (!formData.size.trim()) {
      newErrors.size = 'Please specify approximate size';
    }

    if (!formData.budget) {
      newErrors.budget = 'Please select a budget range';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await submitCommission(formData);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        vision: '',
        size: '',
        budget: '',
      });

      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: error.message || 'Failed to submit. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="commissions-page">
      <header className="commissions-page__header">
        <div className="container">
          <p className="label">Custom Work</p>
          <h1>Commission an Artwork</h1>
          <p className="commissions-page__subtitle">
            {content.commissionsSubtitle}
          </p>
        </div>
      </header>

      <div className="container">
        <div className="commissions-page__content">
          {/* Left Column - Info */}
          <div className="commissions-page__info">
            <h2>The Commission Process</h2>
            <ol className="commissions-page__process">
              {content.commissionSteps.map((step, i) => (
                <li key={i}>
                  <strong>{step.title}:</strong> {step.description}
                </li>
              ))}
            </ol>

            <div className="commissions-page__faq">
              <h3>FAQ</h3>
              <dl className="commissions-page__dl">
                {content.commissionFaqs.map((faq, i) => (
                  <div key={i}>
                    <dt>{faq.question}</dt>
                    <dd>{faq.answer}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="commissions-page__form-container">
            {submitted && (
              <div className="form-success-message">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <div>
                  <h3>Thank you!</h3>
                  <p>Your inquiry has been received. I'll contact you within 48 hours.</p>
                </div>
              </div>
            )}

            <form className="commissions-form" onSubmit={handleSubmit}>
              <h2>Commission Inquiry Form</h2>

              <div className="form-group">
                <label htmlFor="name" className="required">Your Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Jane Smith"
                  disabled={loading}
                  required
                />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email" className="required">Email Address</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jane@example.com"
                  disabled={loading}
                  required
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="vision" className="required">Describe Your Vision</label>
                <textarea
                  id="vision"
                  name="vision"
                  value={formData.vision}
                  onChange={handleChange}
                  placeholder="Tell me about your ideas, themes, and inspiration..."
                  disabled={loading}
                  required
                />
                {errors.vision && <span className="form-error">{errors.vision}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="size" className="required">Approximate Size</label>
                <input
                  id="size"
                  type="text"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  placeholder="e.g., 24x36 inches"
                  disabled={loading}
                  required
                />
                {errors.size && <span className="form-error">{errors.size}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="budget" className="required">Budget Range (USD)</label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  disabled={loading}
                  required
                >
                  <option value="">Select a budget range</option>
                  <option value="under-1000">Under $1,000</option>
                  <option value="1000-3000">$1,000 - $3,000</option>
                  <option value="3000-5000">$3,000 - $5,000</option>
                  <option value="5000-10000">$5,000 - $10,000</option>
                  <option value="10000plus">$10,000+</option>
                </select>
                {errors.budget && <span className="form-error">{errors.budget}</span>}
              </div>

              {errors.submit && (
                <div className="form-error">{errors.submit}</div>
              )}

              <button
                type="submit"
                className="btn btn--large"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Inquiry'}
              </button>

              <p className="form-help">
                {content.commissionFormHelpText}
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

