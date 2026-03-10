import ErrorBoundary from './components/ErrorBoundary';
import Toast from './components/Toast';
import useToast from './hooks/useToast';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';

// Import all pages
import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import PaintingPage from './pages/PaintingPage';
import AboutPage from './pages/AboutPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import CommissionsPage from './pages/CommissionsPage';
import CollectionPage from './pages/CollectionPage';
import AdminPage from './pages/AdminPage';

function App() {
  const { toasts, addToast, removeToast } = useToast();

  return (
    <ErrorBoundary>
      <Router>
        <Navigation />
        <Toast toasts={toasts} onRemove={removeToast} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/paintings/:id" element={<PaintingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/commissions" element={<CommissionsPage />} />
          <Route path="/collection/:id" element={<CollectionPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
        <Footer />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
