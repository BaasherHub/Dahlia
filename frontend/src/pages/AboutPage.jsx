import { Link } from 'react-router-dom';
import './AboutPage.css';

export default function AboutPage() {
  return (
    <main className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <p className="label">About</p>
          <h1>About Dahlia Baasher</h1>
          <p className="about-hero__subtitle">
            Contemporary artist creating refined works on premium linen canvas
          </p>
        </div>
      </section>

      {/* Bio Section */}
      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>My Artistic Journey</h2>
              <p>
                I am a contemporary artist specializing in oil paintings on premium linen canvas. 
                My work is defined by deliberate palette knife technique and expressive brushwork, 
                creating pieces that resonate with collectors and designers worldwide.
              </p>
              <p>
                Each painting begins with careful consideration of color, composition, and emotional 
                resonance. I work exclusively with the finest materials to ensure longevity and visual 
                impact that endures through time.
              </p>
              <p>
                My practice combines technical precision with spontaneous creativity, resulting in 
                works that are both carefully considered and intuitively executed.
              </p>
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

      {/* Practice Section */}
      <section className="about-section about-section--alt">
        <div className="container">
          <h2>My Practice</h2>
          
          <div className="about-grid">
            <div className="about-card">
              <h3>Materials & Technique</h3>
              <p>
                I work exclusively with premium materials: linen canvas, oil pigments, and 
                professional-grade mediums. My technique emphasizes the palette knife for 
                texture and expressive mark-making.
              </p>
            </div>

            <div className="about-card">
              <h3>Creative Process</h3>
              <p>
                Each piece begins with careful composition planning, followed by multiple 
                layers of paint application. I allow each layer to inform the next, creating 
                depth and visual interest.
              </p>
            </div>

            <div className="about-card">
              <h3>Commissions & Collaborations</h3>
              <p>
                I welcome commission inquiries from collectors and designers. I work closely 
                with clients to bring their vision to life, creating bespoke artwork for 
                homes and commercial spaces.
              </p>
            </div>

            <div className="about-card">
              <h3>Exhibition History</h3>
              <p>
                My work has been featured in contemporary galleries and private collections. 
                I continue to exhibit regularly and participate in art fairs and curated shows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statement Section */}
      <section className="about-section">
        <div className="container">
          <div className="about-statement">
            <h2>Artist Statement</h2>
            <p>
              My practice is rooted in a deep engagement with color, form, and the physical 
              materiality of paint. I create work that exists in conversation with contemporary 
              art practice while maintaining a reverence for the traditions of painting.
            </p>
            <p>
              Through careful observation and intuitive response, I build paintings that invite 
              contemplation and emotional engagement. Each piece is an attempt to capture a moment 
              of synthesis between intention and spontaneity, between control and surrender.
            </p>
            <p>
              I am committed to creating work of lasting value—both visually and materially. 
              My practice is defined by a pursuit of excellence and a dedication to the craft 
              of painting.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2 className="cta-section__title">Ready to Start a Collaboration?</h2>
          <p className="cta-section__desc">
            I'm always open to discussing new projects, exhibitions, and commissions.
          </p>
          <Link to="/commissions" className="btn btn--large">
            Start a Commission
          </Link>
        </div>
      </section>
    </main>
  );
}
