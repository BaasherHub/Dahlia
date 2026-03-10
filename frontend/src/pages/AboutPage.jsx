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
      {/* HEADER */}
      <div className="about-page__header">
        <div className="container">
          <p className="label">The Artist</p>
          <h1 className="about-page__title">Dahlia Baasher</h1>
          <p className="about-page__location">Sudanese Artist · Toronto, Canada</p>
        </div>
      </div>

      <div className="container">
        {/* BIO */}
        <section className="about-bio">
          <div className="about-bio__content">
            <p className="about-bio__para">
              Dahlia Baasher is a contemporary painter based in Toronto, working primarily with oil on premium linen canvas. Her practice is rooted in the exploration of human connection and emotional nuance, rendered through confident, expressive brushwork.
            </p>
            <p className="about-bio__para">
              Each work begins with intention and evolves through a careful dialogue between concept and medium. Employing the palette knife as a primary tool, Dahlia builds surfaces of depth and movement, creating pieces that reward both immediate and sustained attention.
            </p>
            <p className="about-bio__para">
              Her paintings are held in private collections internationally and have been exhibited across North America, Europe, Africa, and Asia. Dahlia holds a degree in Fine Arts from Khartoum University and continues to develop her practice through constant experimentation with form, color, and material.
            </p>

            <blockquote className="about-bio__quote">
              "The intricacy of human nature is rooted in our need for emotional connection and social interaction, which is deceptively simple."
            </blockquote>
          </div>

          <div className="about-bio__aside">
            <div className="about-bio__fact">
              <span className="label">Location</span>
              <p>Toronto, Canada</p>
            </div>
            <div className="about-bio__fact">
              <span className="label">Medium</span>
              <p>Oil on Linen Canvas</p>
            </div>
            <div className="about-bio__fact">
              <span className="label">Education</span>
              <p>Fine Arts Degree, Khartoum University</p>
            </div>
            <div className="about-bio__fact">
              <span className="label">Follow</span>
              <a href="#" className="about-bio__link">Instagram</a>
            </div>
          </div>
        </section>

        {/* EXHIBITIONS */}
        <section className="about-exhibitions">
          <h2 className="about-section-title">Exhibitions</h2>
          <div className="exhibitions-list">
            {EXHIBITIONS.map((ex, i) => (
              <div key={i} className="exhibition-item">
                <span className="exhibition-year">{ex.year}</span>
                <div className="exhibition-content">
                  <p className="exhibition-name">{ex.name}</p>
                  <p className="exhibition-location">{ex.location}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PRESS */}
        <section className="about-press">
          <h2 className="about-section-title">Press & Publications</h2>
          <div className="press-list">
            {PRESS.map((item, i) => (
              <div key={i} className="press-item">
                <span className="press-outlet">{item.outlet}</span>
                <p className="press-title">{item.title}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
