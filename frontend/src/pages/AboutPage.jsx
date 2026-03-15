import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AboutPage.css';

const BASE = import.meta.env.VITE_API_URL || '';

const DEFAULT_PRACTICE_CARDS = [
  {
    title: 'Materials & Technique',
    description: 'I work exclusively with premium materials: linen canvas, oil pigments, and professional-grade mediums. My technique emphasizes the palette knife for texture and expressive mark-making.',
  },
  {
    title: 'Creative Process',
    description: 'Each piece begins with careful composition planning, followed by multiple layers of paint application. I allow each layer to inform the next, creating depth and visual interest.',
  },
  {
    title: 'Commissions & Collaborations',
    description: 'I welcome commission inquiries from collectors and designers. I work closely with clients to bring their vision to life, creating bespoke artwork for homes and commercial spaces.',
  },
  {
    title: 'Exhibition History',
    description: 'My work has been featured in contemporary galleries and private collections. I continue to exhibit regularly and participate in art fairs and curated shows.',
  },
];

const DEFAULTS = {
  aboutHeroSubtitle: 'Contemporary artist creating refined works on premium linen canvas',
  aboutBio1: 'I am a contemporary artist specializing in oil paintings on premium linen canvas. My work is defined by deliberate palette knife technique and expressive brushwork, creating pieces that resonate with collectors and designers worldwide.',
  aboutBio2: 'Each painting begins with careful consideration of color, composition, and emotional resonance. I work exclusively with the finest materials to ensure longevity and visual impact that endures through time.',
  aboutBio3: 'My practice combines technical precision with spontaneous creativity, resulting in works that are both carefully considered and intuitively executed.',
  aboutStatement1: 'My practice is rooted in a deep engagement with color, form, and the physical materiality of paint. I create work that exists in conversation with contemporary art practice while maintaining a reverence for the traditions of painting.',
  aboutStatement2: 'Through careful observation and intuitive response, I build paintings that invite contemplation and emotional engagement. Each piece is an attempt to capture a moment of synthesis between intention and spontaneity, between control and surrender.',
  aboutStatement3: 'I am committed to creating work of lasting value\u2014both visually and materially. My practice is defined by a pursuit of excellence and a dedication to the craft of painting.',
  practiceCards: DEFAULT_PRACTICE_CARDS,
};

export default function AboutPage() {
  const [content, setContent] = useState(DEFAULTS);

  useEffect(() => {
    fetch(`${BASE}/api/site-settings`)
      .then(r => r.ok ? r.json() : DEFAULTS)
      .then(data => {
        setContent({
          ...DEFAULTS,
          ...data,
          practiceCards: Array.isArray(data.practiceCards) && data.practiceCards.length > 0
            ? data.practiceCards : DEFAULT_PRACTICE_CARDS,
        });
      })
      .catch(() => setContent(DEFAULTS));
  }, []);

  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="container">
          <p className="label">About</p>
          <h1>About Dahlia Baasher</h1>
          <p className="about-hero__subtitle">{content.aboutHeroSubtitle}</p>
        </div>
      </section>

      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>My Artistic Journey</h2>
              <p>{content.aboutBio1}</p>
              <p>{content.aboutBio2}</p>
              <p>{content.aboutBio3}</p>
            </div>
            <div className="about-image">
              <div className="about-image__placeholder">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                <p>Studio Portrait</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section about-section--alt">
        <div className="container">
          <h2>My Practice</h2>
          <div className="about-grid">
            {content.practiceCards.map((card, i) => (
              <div key={i} className="about-card">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="container">
          <div className="about-statement">
            <h2>Artist Statement</h2>
            <p>{content.aboutStatement1}</p>
            <p>{content.aboutStatement2}</p>
            <p>{content.aboutStatement3}</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2 className="cta-section__title">Ready to Start a Collaboration?</h2>
          <p className="cta-section__desc">I'm always open to discussing new projects, exhibitions, and commissions.</p>
          <Link to="/commissions" className="btn btn--large">Start a Commission</Link>
        </div>
      </section>
    </main>
  );
}

