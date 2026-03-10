import { useParams, useNavigate, Link } from 'react-router-dom';
import './BlogPostPage.css';

const blogPostsData = {
  '1': {
    id: 1,
    title: 'The Art of Color Theory in Contemporary Painting',
    author: 'Dahlia Baasher',
    date: '2024-03-10',
    category: 'Technique',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1578926078328-123456789?w=1200&h=400&fit=crop',
    content: `
      <p>Color theory is the foundation of every great painting. Understanding how colors interact, complement, and contrast with each other is essential for creating work that resonates emotionally with viewers.</p>
      
      <h3>The Color Wheel</h3>
      <p>The traditional color wheel consists of twelve colors: three primary colors (red, yellow, blue), three secondary colors (green, orange, purple), and six tertiary colors created by mixing primary and secondary colors.</p>
      
      <h3>Color Harmony</h3>
      <p>There are several ways to create harmony in color choices: complementary, analogous, triadic, and tetradic schemes. Each approach offers different emotional impacts and visual effects.</p>
      
      <h3>Personal Application</h3>
      <p>In my own work, I often use a limited palette to create stronger emotional connections. By restricting my color choices, I can focus on the relationships between colors rather than getting lost in the possibilities.</p>
    `,
  },
  '2': {
    id: 2,
    title: 'Behind the Scenes: Creating a Large-Scale Commission',
    author: 'Dahlia Baasher',
    date: '2024-03-05',
    category: 'Process',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=400&fit=crop',
    content: `
      <p>Large-scale commissions require careful planning and execution. This post walks you through my process from initial concept to final installation.</p>
      
      <h3>Initial Consultation</h3>
      <p>Everything starts with a detailed conversation with the client about their vision, space, and preferences. Understanding their needs is crucial.</p>
      
      <h3>Sketching & Planning</h3>
      <p>I create multiple sketches and mock-ups to explore different compositions and color schemes before beginning work on the final piece.</p>
      
      <h3>Execution</h3>
      <p>The actual painting process for large-scale work can take weeks or months, depending on the complexity and size of the piece.</p>
      
      <h3>Installation</h3>
      <p>Proper installation is essential to ensure the work is displayed beautifully and securely in its final location.</p>
    `,
  },
  '3': {
    id: 3,
    title: 'Collecting Contemporary Art: What to Look For',
    author: 'Dahlia Baasher',
    date: '2024-02-28',
    category: 'Collecting',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1200&h=400&fit=crop',
    content: `
      <p>Starting an art collection can feel overwhelming, but with a few key principles, you can build a meaningful collection that brings joy for years.</p>
      
      <h3>Invest in What You Love</h3>
      <p>The most important rule in collecting: buy what speaks to you personally. If you love a piece, it belongs in your collection.</p>
      
      <h3>Consider the Artist</h3>
      <p>Learn about the artist's practice, exhibition history, and recognition. This context can help you make more informed decisions.</p>
      
      <h3>Budget Wisely</h3>
      <p>Set a budget before you start collecting. Art can be a good investment, but it should primarily bring you joy.</p>
      
      <h3>Proper Care</h3>
      <p>Once you own a piece, proper framing, lighting, and environmental conditions are essential to preserve it for the future.</p>
    `,
  },
  '4': {
    id: 4,
    title: 'Studio Inspirations: Books, Films, and Experiences',
    author: 'Dahlia Baasher',
    date: '2024-02-20',
    category: 'Inspiration',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=1200&h=400&fit=crop',
    content: `
      <p>Creativity doesn't exist in a vacuum. I'm constantly inspired by other artists, books, films, and life experiences.</p>
      
      <h3>Artistic Influences</h3>
      <p>I draw inspiration from contemporary artists who push boundaries and challenge conventional thinking about what painting can be.</p>
      
      <h3>Literature</h3>
      <p>Reading poetry and literature helps me understand different ways of expressing emotion and meaning through language, which translates to my visual work.</p>
      
      <h3>Cinema</h3>
      <p>Film teaches me about composition, light, and narrative. I often spend time studying how cinematographers use light and shadow.</p>
      
      <h3>Travel & Experience</h3>
      <p>Traveling exposes me to new cultures, landscapes, and perspectives that inevitably influence my artistic practice and vision.</p>
    `,
  },
};

export default function BlogPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  if (!id || !blogPostsData[id]) {
    return (
      <main className="blog-post-page blog-post-page--not-found">
        <div className="container">
          <h1>Blog Post Not Found</h1>
          <p>The blog post you're looking for doesn't exist.</p>
          <Link to="/blog" className="btn">Back to Blog</Link>
        </div>
      </main>
    );
  }

  const post = blogPostsData[id];

  const handleNavigateBack = () => {
    try {
      navigate(-1);
    } catch (err) {
      console.error('Navigation error:', err);
      navigate('/blog');
    }
  };

  return (
    <main className="blog-post-page">
      <article className="blog-post">
        <header className="blog-post__header">
          <img 
            src={post.image} 
            alt={post.title} 
            className="blog-post__image" 
            decoding="async"
          />
          <div className="blog-post__info">
            <div className="blog-post__meta">
              <span className="blog-post__category">{post.category}</span>
              <span className="blog-post__read-time">{post.readTime}</span>
            </div>
            <h1 className="blog-post__title">{post.title}</h1>
            <div className="blog-post__byline">
              <span className="blog-post__author">By {post.author}</span>
              <time className="blog-post__date">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
          </div>
        </header>

        <div className="container">
          <div className="blog-post__content">
            <div 
              className="blog-post__body"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          <footer className="blog-post__footer">
            <Link to="/blog" className="blog-post__back">
              ← Back to Blog
            </Link>
            <button 
              onClick={handleNavigateBack}
              className="blog-post__nav-btn"
            >
              ← Previous Page
            </button>
          </footer>
        </div>
      </article>
    </main>
  );
}
