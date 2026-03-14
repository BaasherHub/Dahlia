import './Testimonials.css';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    title: 'Art Collector',
    text: 'Dahlia\'s work is absolutely mesmerizing. The attention to detail and emotional depth in each piece is extraordinary.',
    rating: 5,
  },
  {
    id: 2,
    name: 'James Chen',
    title: 'Interior Designer',
    text: 'I recommend Dahlia\'s art to all my clients. Her pieces add a sophisticated elegance to any space.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Emma Rodriguez',
    title: 'Gallery Owner',
    text: 'Working with Dahlia has been a pleasure. Her professionalism and artistic vision are unmatched.',
    rating: 5,
  },
  {
    id: 4,
    name: 'Michael Thompson',
    title: 'Art Enthusiast',
    text: 'The commission I received exceeded all my expectations. Highly talented and truly professional.',
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="testimonials">
      <div className="container">
        <div className="testimonials__header">
          <h2 className="testimonials__title">Client Testimonials</h2>
          <p className="testimonials__subtitle">What collectors and clients say about Dahlia's work</p>
        </div>

        <div className="testimonials__grid">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-card__stars">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="testimonial-card__star">★</span>
                ))}
              </div>
              <p className="testimonial-card__text">"{testimonial.text}"</p>
              <div className="testimonial-card__author">
                <h4 className="testimonial-card__name">{testimonial.name}</h4>
                <p className="testimonial-card__title">{testimonial.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
