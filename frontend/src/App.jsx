import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Toast from './components/Toast';
import Breadcrumbs from './components/Breadcrumbs';
import SEOSchema, { artistSchema, gallerySchema } from './components/SEOSchema';
import useToast from './hooks/useToast';

// ✅ Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname]);

  return null;
}

// Pages
import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import PaintingPage from './pages/PaintingPage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import CommissionsPage from './pages/CommissionsPage';
import CollectionPage from './pages/CollectionPage';
import WishlistPage from './pages/WishlistPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

// Components
import Nav from './components/Nav';
import Footer from './components/Footer';

function AppContent() {
  const { toasts, removeToast } = useToast();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#fefdfb'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #e8e3db',
            borderRadius: '50%',
            borderTopColor: '#a89968',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: '#4a4540', fontFamily: "'DM Sans', sans-serif" }}>Loading...</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />
      <SEOSchema type="artist" data={artistSchema} />
      <SEOSchema type="gallery" data={gallerySchema} />
      <Nav />
      <Breadcrumbs />
      <Toast toasts={toasts} onRemove={removeToast} />
      <main style={{ minHeight: '100vh' }} id="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/paintings/:id" element={<PaintingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogPostPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/commissions" element={<CommissionsPage />} />
          <Route path="/collection/:id" element={<CollectionPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

export default App;
