import { useState } from 'react';
import './CommissionsPage.css';

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Store commission inquiry in localStorage
      const inquiries = JSON.parse(localStorage.getItem('commissions') || '[]');
      inquiries.push({
        ...formData,
        id: Date.now(),
        date: new Date().toISOString()
      });
      localStorage.setItem('commissions', JSON.stringify(inquiries));

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
      setErrors({ submit: 'Failed to submit. Please try again.' });
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
            I work with collectors and designers worldwide to create bespoke artwork tailored to your vision and space.
          </p>
        </div>
      </header>

      <div className="container">
        <div className="commissions-page__content">
          {/* Left Column - Info */}
          <div className="commissions-page__info">
            <h2>The Commission Process</h2>
            <ol className="commissions-page__process">
              <li>
                <strong>Initial Consultation:</strong> We discuss your vision, space, preferences, and timeline.
              </li>
              <li>
                <strong>Concept Development:</strong> I create sketches and mock-ups for your approval.
              </li>
              <li>
                <strong>Execution:</strong> I create the artwork with regular progress updates.
              </li>
              <li>
                <strong>Installation:</strong> I provide guidance on proper installation and care.
              </li>
            </ol>

            <div className="commissions-page__faq">
              <h3>FAQ</h3>
              <dl className="commissions-page__dl">
                <dt>What's your typical timeline?</dt>
                <dd>Commission timelines vary from 4-12 weeks depending on size and complexity.</dd>

                <dt>Do you require a deposit?</dt>
                <dd>Yes, a 50% deposit is required to begin the project, with the balance due upon completion.</dd>

                <dt>Can I request specific colors or styles?</dt>
                <dd>Absolutely! I collaborate closely with clients to ensure the final piece matches their vision.</dd>

                <dt>Do you ship internationally?</dt>
                <dd>Yes, I ship worldwide. Shipping costs are calculated based on size and destination.</dd>
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
                I typically respond within 48 hours. Looking forward to collaborating with you!
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
