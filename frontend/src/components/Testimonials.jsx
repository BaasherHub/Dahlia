import { useState, useEffect } from 'react';
import './Testimonials.css';

const BASE = import.meta.env.VITE_API_URL || '';

const FALLBACK_TESTIMONIALS = [
  { id: 1, name: 'Sarah Mitchell', title: 'Art Collector', text: "Dahlia's work is absolutely mesmerizing. The attention to detail and emotional depth in each piece is extraordinary.", rating: 5 },
  { id: 2, name: 'James Chen', title: 'Interior Designer', text: "I recommend Dahlia's art to all my clients. Her pieces add a sophisticated elegance to any space.", rating: 5 },
  { id: 3, name: 'Emma Rodriguez', title: 'Gallery Owner', text: 'Working with Dahlia has been a pleasure. Her professionalism and artistic vision are unmatched.', rating: 5 },
  { id: 4, name: 'Michael Thompson', title: 'Art Enthusiast', text: 'The commission I received exceeded all my expectations. Highly talented and truly professional.', rating: 5 },
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState(FALLBACK_TESTIMONIALS);

  useEffect(() => {
    fetch(`${BASE}/api/site-settings`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.testimonials && Array.isArray(data.testimonials) && data.testimonials.length > 0) {
          setTestimonials(data.testimonials);
        }
      })
      .catch(() => {});
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section className="testimonials">
      <div className="container">
        <div className="testimonials__header">
          <h2 className="testimonials__title">Client Testimonials</h2>
          <p className="testimonials__subtitle">What collectors and clients say about Dahlia's work</p>
        </div>

        <div className="testimonials__grid">
          {testimonials.map((testimonial, idx) => (
            <div key={testimonial.id || idx} className="testimonial-card">
              <div className="testimonial-card__stars">
                {[...Array(testimonial.rating || 5)].map((_, i) => (
                  <span key={i} className="testimonial-card__star">{'\u2605'}</span>
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
