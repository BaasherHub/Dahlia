import './AboutPage.css';

const EXHIBITIONS = [
  { year: '2025', name: 'Detour at the Italy Pavilion EXPO Osaka', location: 'Osaka, Japan' },
  { year: '2025', name: 'Black Art Fair', location: 'Nia Art Center, Toronto, Canada' },
  { year: '2024', name: 'Detour at the Pinacoteca Ambrosiana', location: 'Milan, Italy' },
  { year: '2024', name: 'The Other Art Fair by Saatchi Art', location: 'Barker Hangar, Los Angeles, USA' },
  { year: '2024', name: 'Houston Art Fair', location: 'Matthew Reeves Gallery, Texas, USA' },
  { year: '2023', name: 'Detour at Saatchi Art Gallery', location: 'London, UK' },
  { year: '2023', name: 'Ici Le Soudan', location: 'Institut Français d\'Egypte, Cairo, Egypt' },
  { year: '2023', name: 'Sudan Heritage', location: 'Lamasat Art Gallery, Cairo, Egypt' },
  { year: '2022', name: 'Pink Flame', location: 'Village Market, Nairobi, Kenya' },
  { year: '2021', name: 'Solo Exhibition — A Place Named Embrace', location: 'Savanna Innovation Lab, Khartoum, Sudan' },
  { year: '2021', name: 'Fragrance of Sudan', location: 'Karim Francis Gallery, Cairo, Egypt' },
  { year: '2020', name: 'Art in Isolation', location: 'Middle East Art Institute, Washington DC, USA' },
  { year: '2020', name: 'L\'effet Papillon', location: 'French Cultural Institute, Khartoum, Sudan' },
  { year: '2020', name: 'Sudan Contemporary Art', location: 'Khartoum International Community School, Sudan' },
  { year: '2019', name: 'Blanc et Noir', location: 'French Cultural Institute, Khartoum, Sudan' },
  { year: '2019', name: 'Group Exhibition Conversations', location: 'French Cultural Center, Khartoum, Sudan' },
  { year: '2018', name: 'Group Exhibition Women in Art', location: 'Al-Gunied Cultural Center, Khartoum, Sudan' },
];

const PRESS = [
  { outlet: 'LOTA', title: 'Artist Dahlia Baasher — A canvas of revolution and resilience capturing stories of Sudan' },
  { outlet: 'The New York Times', title: 'Sudan War Strikes a Blow to the Country\'s Emerging Art Scene' },
  { outlet: 'AD Middle East', title: 'Meet 7 Sudanese Artists Who Are Giving Voice to Sudan\'s Civil War' },
  { outlet: 'The Muse Multi Studio', title: 'A Place Named Embrace' },
];

export default function AboutPage() {
  return (
    <main className="about-page">
      <div className="about-page__header">
        <div className="container">
          <p className="label">The Artist</p>
          <h1 className="about-page__title">Dahlia Baasher</h1>
          <p className="about-page__location">Sudanese Artist · Toronto, Canada</p>
        </div>
      </div>

      <div className="container">
        <div className="about-page__body">

          {/* Bio */}
          <section className="about-bio">
            <div className="about-bio__text">
              <p className="label" style={{ marginBottom: 24 }}>Statement</p>
              <p className="about-bio__para">
                A refined collection of original oil paintings on premium linen canvas, defined by the 
                deliberate use of palette knife and confident, expressive brushstrokes. Each work emphasizes 
                texture, depth, and movement, offering a bold visual presence designed to elevate and enhance 
                sophisticated interior spaces.
              </p>
              <p className="about-bio__para">
                Born in the vibrant city of Port-Sudan by the Red Sea, and then moved to Khartoum where the 
                dusty atmosphere influenced the colour palette of my artwork. I'm often intrigued by blending 
                figures and buildings as they symbolize the simple concept of shelter providing us with a place 
                for comfort, safety, and belonging.
              </p>
              <p className="about-bio__para">
                A concept that has been scattered after the breakout of war in Sudan last April, causing millions 
                of people to be displaced. Following the outbreak of war in Sudan in April 2023, thousands of 
                individuals, including myself, were displaced. I spent over six months in Cairo before settling 
                in Canada. During this period, I got involved in raising awareness about the ongoing conflict in 
                Sudan; at the group exhibition "Ici Le Soudan" that was commissioned by Institut Français d'Egypte 
                in response to the large number of people displaced.
              </p>
              <p className="about-bio__para">
                In addition to a collaboration with the Moleskine Foundation on the project "The Legendary Power 
                of Creativity on Paper" in "Detour" — the travelling exhibition showcased at Saatchi Gallery in 
                London, the Pinacoteca Ambrosiana in Milan and the Italian Pavilion in Osaka, Japan.
              </p>
              <blockquote className="about-bio__quote">
                "Painting allows me to hold space for stories that are often silenced—faces lost in protest, 
                the quiet dignity of survival, the ongoing fight for justice."
              </blockquote>
            </div>
            <div className="about-bio__aside">
              <div className="about-bio__fact">
                <p className="label">Based in</p>
                <p>Toronto, Ontario, Canada</p>
              </div>
              <div className="about-bio__fact">
                <p className="label">Medium</p>
                <p>Oil on canvas & linen</p>
              </div>
              <div className="about-bio__fact">
                <p className="label">Technique</p>
                <p>Palette knife & expressive brushwork</p>
              </div>
              <div className="about-bio__fact">
                <p className="label">Active Since</p>
                <p>2018</p>
              </div>
              <div className="about-bio__fact">
                <p className="label">Saatchi Art</p>
                <a href="https://www.saatchiart.com/en-ca/dahliabaasher" target="_blank" rel="noopener noreferrer" className="about-bio__link">View Profile →</a>
              </div>
            </div>
          </section>

          {/* Press */}
          <section className="about-press">
            <p className="label" style={{ marginBottom: 32 }}>Press & Features</p>
            <div className="about-press__list">
              {PRESS.map((p, i) => (
                <div key={i} className="about-press__item">
                  <span className="about-press__outlet">{p.outlet}</span>
                  <p className="about-press__title">{p.title}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Exhibitions */}
          <section className="about-exhibitions">
            <p className="label" style={{ marginBottom: 8 }}>Exhibition History</p>
            <p className="about-exhibitions__intro">
              My work has been featured in numerous exhibitions earning recognition for its unique 
              ability to evoke emotional responses and inspire introspection.
            </p>
            <div className="about-exhibitions__list">
              {EXHIBITIONS.map((ex, i) => (
                <div key={i} className="about-ex-row">
                  <span className="about-ex-year">{ex.year}</span>
                  <div>
                    <p className="about-ex-name">{ex.name}</p>
                    <p className="about-ex-loc">{ex.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
