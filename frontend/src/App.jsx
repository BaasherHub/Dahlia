import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import GalleryPage from './pages/GalleryPage.jsx';
import PaintingPage from './pages/PaintingPage.jsx';
import CollectionPage from './pages/CollectionPage.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrderSuccessPage from './pages/OrderSuccessPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import CommissionsPage from './pages/CommissionsPage.jsx';
import AdminPage from './pages/AdminPage.jsx';

export default function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <Nav />
        <Routes>
          <Route path="/"                   element={<HomePage />} />
          <Route path="/gallery"            element={<GalleryPage />} />
          <Route path="/paintings/:id"      element={<PaintingPage />} />
          <Route path="/collections/:id"    element={<CollectionPage />} />
          <Route path="/cart"               element={<CartPage />} />
          <Route path="/checkout"           element={<CheckoutPage />} />
          <Route path="/order/success"      element={<OrderSuccessPage />} />
          <Route path="/about"              element={<AboutPage />} />
          <Route path="/commissions"        element={<CommissionsPage />} />
          <Route path="/admin"              element={<AdminPage />} />
        </Routes>
        <Footer />
      </CartProvider>
    </ThemeProvider>
  );
}
