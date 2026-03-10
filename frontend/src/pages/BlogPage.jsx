import { useState } from 'react';
import { Link } from 'react-router-dom';
import './BlogPage.css';

const blogPosts = [
  {
    id: 1,
    title: 'The Art of Color Theory in Contemporary Painting',
    excerpt: 'Exploring how color relationships shape mood and emotion in modern artwork.',
    date: '2024-03-10',
    category: 'Technique',
    readTime: '5 min read',
    image: 'https://via.placeholder.com/600x400?text=Color+Theory',
  },
  {
    id: 2,
    title: 'Behind the Scenes: Creating a Large-Scale Commission',
    excerpt: 'An in-depth look at the process of creating a monumental piece from concept to completion.',
    date: '2024-03-05',
    category: 'Process',
    readTime: '8 min read',
    image: 'https://via.placeholder.com/600x400?text=Commission+Process',
  },
  {
    id: 3,
    title: 'Collecting Contemporary Art: What to Look For',
    excerpt: 'A guide for first-time art collectors on selecting pieces that speak to them.',
    date: '2024-02-28',
    category: 'Collecting',
    readTime: '6 min read',
    image: 'https://via.placeholder.com/600x400?text=Collecting+Art',
  },
  {
    id: 4,
    title: 'Studio Inspirations: Books, Films, and Experiences',
    excerpt: 'Discover the creative influences that shape my artistic vision and practice.',
    date: '2024-02-20',
    category: 'Inspiration',
    readTime: '7 min read',
    image: 'https://via.placeholder.com/600x400?text=Studio+Inspirations',
  },
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = ['Technique', 'Process', 'Collecting', 'Inspiration'];

  const filteredPosts = selectedCategory
    ? blogPosts.filter(post => post.category === selectedCategory)
    : blogPosts;

  return (
    <main className="blog-page">
      <header className="blog-page__header">
        <div className="container">
          <h1 className="blog-page__title">Insights & Inspiration</h1>
          <p className="blog-page__subtitle">
            Thoughts on art, creativity, and the creative process
          </p>
        </div>
      </header>

      <div className="container">
        {/* Category Filter */}
        <div className="blog-page__filters">
          <button
            className={`blog-filter ${!selectedCategory ? 'active' : ''}`}
            onClick={() => setSelectedCategory(null)}
          >
            All Posts
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              className={`blog-filter ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        {filteredPosts.length > 0 ? (
          <div className="blog-grid">
            {filteredPosts.map(post => (
              <article key={post.id} className="blog-card">
                <div className="blog-card__img-wrap">
                  <img src={post.image} alt={post.title} className="blog-card__img" decoding="async" />
                </div>
                <div className="blog-card__content">
                  <div className="blog-card__meta">
                    <span className="blog-card__category">{post.category}</span>
                    <span className="blog-card__read-time">{post.readTime}</span>
                  </div>
                  <h3 className="blog-card__title">{post.title}</h3>
                  <p className="blog-card__excerpt">{post.excerpt}</p>
                  <div className="blog-card__footer">
                    <time className="blog-card__date">
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                    <Link to={`/blog/${post.id}`} className="blog-card__link">
                      Read More →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <h3>No blog posts found</h3>
            <p>Try selecting a different category</p>
          </div>
        )}
      </div>
    </main>
  );
}
