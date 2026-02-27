import './AboutPage.css';

const EXHIBITIONS = [
  { year: '2025', name: 'Black Art Fair', location: 'Nia Art Centre, Toronto' },
  { year: '2024', name: 'The Other Art Fair', location: 'Barker Hangar, Santa Monica' },
  { year: '2023', name: 'Houston Art Fair', location: 'Matthew Reeves, Texas' },
  { year: '2023', name: 'Detour', location: 'Saatchi Art Gallery, London' },
  { year: '2023', name: 'Ici Le Soudan', location: 'Institut Français d\'Egypte' },
  { year: '2023', name: 'Sudan Heritage', location: 'Lamasat Art Gallery, Cairo' },
  { year: '2022', name: 'Pink Flame', location: 'Village Market, Nairobi' },
  { year: '2021', name: 'Solo Exhibition "A Place named Embrace"', location: 'Savanna Innovation Lab, Khartoum' },
  { year: '2021', name: 'Fragrance of Sudan', location: 'Karim Francis Gallery, Cairo' },
  { year: '2021', name: 'Group Exhibition "Art in Isolation"', location: 'Middle East Art Institute, Washington DC' },
  { year: '2020', name: 'L\'effet Papillon', location: 'French Institute, Khartoum' },
  { year: '2019', name: 'Sudan Contemporary Art', location: 'KICS, Khartoum' },
  { year: '2019', name: 'Blanc et Noir', location: 'French Institute, Khartoum' },
  { year: '2018', name: 'Conversation', location: 'French Cultural Center, Khartoum' },
  { year: '2018', name: 'Women in Art', location: 'Khartoum Applied College (Gunied Cultural Center)' },
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
                My artwork explores the complex intersection of identity, power and resistance 
                within the Sudanese community. Through a blend of visual symbolism, figures, 
                architectural references and layered narratives, I create work that challenges 
                the viewer to question what is normalized, what is erased, and who gets to be 
                seen and heard.
              </p>
              <p className="about-bio__para">
                Whether addressing state violence, displacement, or gender, I aim to unsettle 
                passive viewing and ignite dialogue. My paintings are not quiet — they are 
                deliberate acts of witnessing, of refusing erasure, of insisting on presence.
              </p>
              <p className="about-bio__para">
                Based in Toronto, I work primarily in oil on canvas, bringing together the 
                formal traditions of European painting with the visual languages and histories 
                of the African continent.
              </p>
            </div>
            <div className="about-bio__aside">
              <div className="about-bio__fact">
                <p className="label">Based in</p>
                <p>Toronto, Ontario, Canada</p>
              </div>
              <div className="about-bio__fact">
                <p className="label">Medium</p>
                <p>Oil on canvas</p>
              </div>
              <div className="about-bio__fact">
                <p className="label">Active Since</p>
                <p>2018</p>
              </div>
              <div className="about-bio__fact">
                <p className="label">Saatchi Art</p>
                <a href="https://www.saatchiart.com/en-ca/dahliabaasher" target="_blank" rel="noopener noreferrer" className="about-bio__link">
                  View Profile →
                </a>
              </div>
            </div>
          </section>

          {/* Exhibitions */}
          <section className="about-exhibitions">
            <p className="label" style={{ marginBottom: 32 }}>Exhibition History</p>
            <div className="about-exhibitions__list">
              {EXHIBITIONS.map((ex, i) => (
                <div key={i} className="about-ex-row">
                  <span className="about-ex-year">{ex.year}</span>
                  <div className="about-ex-info">
                    <p className="about-ex-name">{ex.name}</p>
                    <p className="about-ex-loc">{ex.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section className="about-education">
            <p className="label" style={{ marginBottom: 32 }}>Education & Training</p>
            <div className="about-education__list">
              {[
                { year: '2022', course: 'Oil Painting Techniques', org: 'Artist Muatasim H. Omar' },
                { year: '2020', course: 'Media and Arts for Social Change', org: 'USIP (Online)' },
                { year: '2020', course: 'What is Contemporary Art?', org: 'MoMA (Online)' },
                { year: '2020', course: 'Modern Art & Ideas', org: 'MoMA (Online)' },
                { year: '2020', course: 'European Painting: Leonardo to Rembrandt to Goya', org: 'Online Course' },
                { year: '2017', course: 'Portrait Drawing Workshop', org: 'Artist Tamim Sibai, Gunied Cultural Centre' },
                { year: '2016', course: 'Conflict Resolution & Peace-Building through Art', org: 'Safer World Organization, Nakuru, Kenya' },
              ].map((ed, i) => (
                <div key={i} className="about-ed-row">
                  <span className="about-ex-year">{ed.year}</span>
                  <div>
                    <p className="about-ex-name">{ed.course}</p>
                    <p className="about-ex-loc">{ed.org}</p>
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
