import { Link } from 'react-router-dom';
import './AboutPage.css';

export default function AboutPage() {
  return (
    <main className="about-page">

      {/* ── HERO ── */}
      <section className="about-hero">
        <div className="about-hero__decor" aria-hidden="true">
          <div className="about-hero__decor-line" />
          <div className="about-hero__decor-circle" />
        </div>
        <div className="container">
          <p className="about-hero__eyebrow">The Artist</p>
          <h1 className="about-hero__title">About the Artist</h1>
          <p className="about-hero__subtitle">
            Baasher — contemporary painter working in oils on linen
          </p>
        </div>
      </section>

      {/* ── BIO ── */}
      <section className="about-bio section">
        <div className="container">
          <div className="about-bio__grid">
            <div className="about-bio__text">
              <h2 className="about-bio__heading">The Work</h2>
              <p>
                Baasher is a contemporary painter whose practice is rooted in the materiality
                of oil on linen. His work is quiet and deliberate — each canvas built through
                accumulated layers of mark-making that are at once disciplined and intuitive.
                He works slowly, allowing each layer to speak before the next is applied,
                giving his paintings a depth that rewards sustained looking.
              </p>
              <p>
                His palette tends toward the muted and complex: ochres, ash whites,
                deep umbers, and occasional flashes of warmth. Colour for Baasher is not
                decorative but structural — the way hues sit against one another determines
                the emotional temperature of the whole. He draws from observation, memory,
                and the visual residue of everyday life, though his works resist easy
                narrative or literal description.
              </p>
              <p>
                Trained in classical technique and later self-directed through years of
                sustained studio practice, Baasher is largely self-taught in the broader
                art-historical sense — his education arriving through looking: at the
                great masters in museum storerooms, at light on linen early in the morning,
                at the way certain colours become other colours when placed in proximity
                to one another.
              </p>
            </div>
            <div className="about-bio__portrait">
              <div className="about-bio__portrait-frame">
                <div className="about-bio__portrait-placeholder">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75" aria-hidden="true">
                    <circle cx="12" cy="8" r="4"/>
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                  </svg>
                  <span>Portrait</span>
                </div>
              </div>
              <p className="about-bio__portrait-caption">Baasher in his studio, 2024</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRACTICE CARDS ── */}
      <section className="about-practice section">
        <div className="container">
          <h2 className="about-practice__heading">The Practice</h2>
          <div className="about-practice__grid">
            <div className="about-practice__card">
              <div className="about-practice__card-num">01</div>
              <h3>Materials & Medium</h3>
              <p>
                All works are executed in professional-grade oils on Belgian linen.
                Baasher uses a restricted range of pigments — favouring permanence and
                archival quality — and works with both brush and palette knife to
                achieve the characteristic texture of his surfaces.
              </p>
            </div>
            <div className="about-practice__card">
              <div className="about-practice__card-num">02</div>
              <h3>Process</h3>
              <p>
                Each painting begins in observation: a composition sketched loosely
                in charcoal, then built in thin washes before thicker impasto passages
                arrive in later stages. Drying time is built into the process — some
                works take months to complete.
              </p>
            </div>
            <div className="about-practice__card">
              <div className="about-practice__card-num">03</div>
              <h3>Commissions</h3>
              <p>
                Baasher works with private collectors and interior designers worldwide
                on bespoke commissions. The process is collaborative and unhurried —
                beginning with conversation, moving through preliminary studies, and
                arriving at a work made entirely for you.
              </p>
            </div>
            <div className="about-practice__card">
              <div className="about-practice__card-num">04</div>
              <h3>Exhibitions</h3>
              <p>
                His work has been shown in solo and group exhibitions across the United
                Kingdom, the Gulf, and North America. Works are held in private
                collections in over fifteen countries. He continues to exhibit
                regularly and accepts applications for studio visits by appointment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ARTIST STATEMENT ── */}
      <section className="about-statement section">
        <div className="container">
          <div className="about-statement__inner">
            <div className="about-statement__rule" aria-hidden="true" />
            <p className="about-statement__label">Artist Statement</p>
            <blockquote className="about-statement__quote">
              <p>
                "I am interested in the moment just before a painting becomes legible —
                when it is still pure colour, pure surface, pure material. I try to
                extend that moment as long as possible. The work is an attempt to slow
                the eye, to insist on presence, to resist the speed at which we
                ordinarily move through visual experience."
              </p>
              <p>
                "My practice is a negotiation between intention and accident. I plan
                carefully and then I try to forget the plan. The best paintings are
                the ones that surprise me — that arrive at something I did not know
                I was looking for."
              </p>
              <footer>— Baasher, 2024</footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── COMMISSION CTA ── */}
      <section className="about-cta">
        <div className="container">
          <div className="about-cta__inner">
            <h2 className="about-cta__title">Commission a Piece</h2>
            <p className="about-cta__body">
              Work directly with Baasher to create an original painting made for your
              space and your story.
            </p>
            <Link to="/commissions" className="btn btn--large about-cta__btn">
              Begin a Commission
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
