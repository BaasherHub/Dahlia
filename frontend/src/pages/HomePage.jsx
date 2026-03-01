import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPaintings, getCollections } from '../api.js';
import PaintingCard from '../components/PaintingCard.jsx';
import './HomePage.css';

export default function HomePage() {
  const [heroPainting, setHeroPainting] = useState(null);
  const [originals, setOriginals] = useState([]);
  const [prints, setPrints] = useState([]);
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    getPaintings().then(data => {
      const hero = data.find(p => p.heroImage) || data[0];
      setHeroPainting(hero);
      setOriginals(data.filter(p => !p.sold && (p.category === 'original' || p.category === 'both')).slice(0, 3));
      setPrints(data.filter(p => p.printAvailable && (p.category === 'print' || p.category === 'both')).slice(0, 3));
    }).catch(() => {});
    getCollections().then(setCollections).catch(() => {});
  }, []);

  return (
    <main className="home">

      {/* Hero — full screen painting */}
      <section className="hero">
        {heroPainting && (
          <div className="hero__img-wrap">
            <img src={heroPainting.images?.[0]} alt={heroPainting.title} className="hero__img" />
            <div className="hero__overlay" />
          </div>
        )}
        {!heroPainting && <div className="hero__placeholder" />}
        <div className="hero__content container">
          <div className="hero__text fade-up">
            <p className="label">Dahlia Baasher Studio</p>
            <div className="divider" style={{ marginTop: 14, marginBottom: 20 }} />
            <blockquote className="hero__quote">
              "The intricacy of human nature is rooted in our need for emotional connection 
              and social interaction, which is deceptively simple"
            </blockquote>
            <div className="hero__actions">
              <Link to="/gallery" className="btn">View Artworks</Link>
              <Link to="/about" className="btn btn-ghost">About the Artist</Link>
            </div>
          </div>
        </div>
        <div className="hero__scroll">
          <div className="hero__scroll-line" />
        </div>
      </section>

      {/* Original Paintings */}
      {originals.length > 0 && (
        <section className="home-section container">
          <div className="home-section__header">
            <div>
              <p className="label">Original Works</p>
              <h2 className="home-section__title">Original Paintings</h2>
            </div>
            <Link to="/gallery?type=original" className="home-section__all">
              View all <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
          <div className="home-section__grid">
            {originals.map(p => <PaintingCard key={p.id} painting={p} />)}
          </div>
        </section>
      )}

      {/* Limited Edition Prints */}
      {prints.length > 0 && (
        <section className="home-section home-section--alt">
          <div className="container">
            <div className="home-section__header">
              <div>
                <p className="label">Collectible Prints</p>
                <h2 className="home-section__title">Limited Edition Prints</h2>
              </div>
              <Link to="/gallery?type=print" className="home-section__all">
                View all <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
            <div className="home-section__grid">
              {prints.map(p => <PaintingCard key={p.id} painting={p} type="print" />)}
            </div>
          </div>
        </section>
      )}

      {/* Collections */}
      {collections.length > 0 && (
        <section className="home-collections container">
          <div className="home-section__header">
            <div>
              <p className="label">Browse by Series</p>
              <h2 className="home-section__title">Collections</h2>
            </div>
            <Link to="/gallery" className="home-section__all">
              All collections <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
          <div className="collections-grid">
            {collections.slice(0, 4).map(c => (
              <Link key={c.id} to={`/collections/${c.id}`} className="collection-card">
                {c.coverImage && <img src={c.coverImage} alt={c.name} className="collection-card__img" />}
                {!c.coverImage && <div className="collection-card__placeholder" />}
                <div className="collection-card__info">
                  <h3 className="collection-card__name">{c.name}</h3>
                  {c.description && <p className="collection-card__desc">{c.description}</p>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Statement */}
      <section className="statement">
        <div className="container">
          <div className="statement__inner">
            <p className="label" style={{ marginBottom: 20 }}>Artist Statement</p>
            <blockquote className="statement__quote">
              "Painting allows me to hold space for stories that are often silenced—faces lost 
              in protest, the quiet dignity of survival, the ongoing fight for justice."
            </blockquote>
            <p className="statement__attr">— Dahlia Baasher</p>
            <Link to="/about" className="btn btn-outline" style={{ marginTop: 32 }}>Read Full Statement</Link>
          </div>
        </div>
      </section>

      {/* Press */}
      <section className="press">
        <div className="container">
          <p className="label" style={{ textAlign: 'center', marginBottom: 48 }}>Exhibition History</p>
          <div className="press__grid">
            {[
              { year: '2025', name: 'Detour at the Italy Pavilion EXPO Osaka', location: 'Osaka, Japan' },
              { year: '2025', name: 'Black Art Fair', location: 'Nia Art Center, Toronto' },
              { year: '2024', name: 'Detour at the Pinacoteca Ambrosiana', location: 'Milan, Italy' },
              { year: '2024', name: 'The Other Art Fair by Saatchi Art', location: 'Barker Hangar, Los Angeles' },
              { year: '2023', name: 'Detour at Saatchi Art Gallery', location: 'London, UK' },
              { year: '2023', name: 'Ici Le Soudan', location: 'Institut Français d\'Egypte, Cairo' },
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
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/about" className="btn btn-outline">Full Exhibition History</Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter container">
        <div className="newsletter__card">
          <p className="label">Collector's List</p>
          <h2 className="newsletter__title">Stay close to the studio</h2>
          <p className="newsletter__sub">Early access to new works, exhibition invitations, and studio insights.</p>
          <NewsletterForm />
        </div>
      </section>

    </main>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true); };
  if (submitted) return <p className="newsletter__thanks">✦ Thank you — you're on the list.</p>;
  return (
    <form className="newsletter__form" onSubmit={handleSubmit}>
      <input className="form-input newsletter__input" type="email" placeholder="your@email.com"
        value={email} onChange={e => setEmail(e.target.value)} required />
      <button type="submit" className="btn">Join the List</button>
    </form>
  );
}
