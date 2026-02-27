import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPaintings } from '../api.js';
import PaintingCard from '../components/PaintingCard.jsx';
import './HomePage.css';

export default function HomePage() {
  const [paintings, setPaintings] = useState([]);

  useEffect(() => {
    getPaintings({ featured: true }).then(setPaintings).catch(() => {});
  }, []);

  return (
    <main className="home">

      {/* Hero */}
      <section className="hero">
        <div className="hero__bg">
          <div className="hero__overlay" />
        </div>
        <div className="hero__content container">
          <div className="hero__text fade-up">
            <p className="label">Dahlia Baasher</p>
            <div className="divider" style={{ marginTop: 16 }} />
            <h1 className="hero__title">
              Art that<br/>
              <em>refuses</em><br/>
              to be silent
            </h1>
            <p className="hero__sub">
              Paintings that explore identity, power, and resistance — 
              through the lens of the Sudanese experience.
            </p>
            <div className="hero__actions">
              <Link to="/gallery" className="btn">View Works</Link>
              <Link to="/about" className="btn btn-ghost">About the Artist</Link>
            </div>
          </div>
        </div>
        <div className="hero__scroll">
          <span>Scroll</span>
          <div className="hero__scroll-line" />
        </div>
      </section>

      {/* Statement */}
      <section className="statement container">
        <div className="statement__inner">
          <p className="label">Artist Statement</p>
          <blockquote className="statement__quote">
            "My artwork explores the complex intersection of identity, power and resistance 
            within the Sudanese community. I create work that challenges the viewer to 
            question what is normalized, what is erased, and who gets to be seen and heard."
          </blockquote>
          <p className="statement__attr">— Dahlia Baasher, Toronto</p>
        </div>
      </section>

      {/* Featured Works */}
      <section className="featured container">
        <div className="featured__header">
          <div>
            <p className="label">Selected Works</p>
            <h2 className="featured__title">Available Paintings</h2>
          </div>
          <Link to="/gallery" className="featured__all">
            View all works
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
        <div className="featured__grid">
          {paintings.length > 0
            ? paintings.slice(0, 3).map(p => <PaintingCard key={p.id} painting={p} />)
            : [1,2,3].map(i => <div key={i} className="painting-skeleton" />)
          }
        </div>
      </section>

      {/* Press */}
      <section className="press">
        <div className="press__inner container">
          <p className="label" style={{ textAlign: 'center', marginBottom: 40 }}>Exhibition History</p>
          <div className="press__grid">
            {[
              { year: '2025', name: 'Black Art Fair', location: 'Nia Art Centre, Toronto' },
              { year: '2024', name: 'The Other Art Fair', location: 'Barker Hangar, Santa Monica' },
              { year: '2023', name: 'Houston Art Fair', location: 'Matthew Reeves, Texas' },
              { year: '2023', name: 'Detour', location: 'Saatchi Art Gallery, London' },
              { year: '2023', name: 'Ici Le Soudan', location: 'Institut Français d\'Egypte' },
              { year: '2021', name: 'Solo Exhibition', location: 'Savanna Innovation Lab, Khartoum' },
            ].map((ex, i) => (
              <div key={i} className="press__item">
                <span className="press__year">{ex.year}</span>
                <div>
                  <p className="press__name">{ex.name}</p>
                  <p className="press__loc">{ex.location}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link to="/about" className="btn btn-outline">Full Biography & Exhibitions</Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter container">
        <div className="newsletter__card">
          <p className="label">Collector's List</p>
          <h2 className="newsletter__title">Stay close to the studio</h2>
          <p className="newsletter__sub">
            Early access to new works, exhibition invitations, and studio insights.
          </p>
          <NewsletterForm />
        </div>
      </section>

    </main>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production connect to Resend/Mailchimp audience
    setSubmitted(true);
  };

  if (submitted) return (
    <p className="newsletter__thanks">
      ✦ Thank you — you're on the list.
    </p>
  );

  return (
    <form className="newsletter__form" onSubmit={handleSubmit}>
      <input
        className="form-input newsletter__input"
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <button type="submit" className="btn">Join the List</button>
    </form>
  );
}
