import React, { Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import ErrorBoundary from './components/ErrorBoundary'
import Toast from './components/Toast'
import { useToast } from './hooks/useToast'

const HomePage = React.lazy(() => import('./pages/HomePage'))
const GalleryPage = React.lazy(() => import('./pages/GalleryPage'))
const PaintingPage = React.lazy(() => import('./pages/PaintingPage'))
const AboutPage = React.lazy(() => import('./pages/AboutPage'))
const CartPage = React.lazy(() => import('./pages/CartPage'))
const CheckoutPage = React.lazy(() => import('./pages/CheckoutPage'))
const OrderSuccessPage = React.lazy(() => import('./pages/OrderSuccessPage'))
const CommissionsPage = React.lazy(() => import('./pages/CommissionsPage'))
const CollectionsPage = React.lazy(() => import('./pages/CollectionsPage'))
const CollectionPage = React.lazy(() => import('./pages/CollectionPage'))
const WishlistPage = React.lazy(() => import('./pages/WishlistPage'))
const AdminPage = React.lazy(() => import('./pages/AdminPage'))
const PortfolioPage = React.lazy(() => import('./pages/PortfolioPage'))
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function PageLoader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="spinner" />
    </div>
  )
}

export default function App() {
  const { toasts, addToast, removeToast } = useToast()

  return (
    <ErrorBoundary>
      <ScrollToTop />
      <Nav />
      <main id="main-content">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage addToast={addToast} />} />
            <Route path="/gallery" element={<GalleryPage addToast={addToast} />} />
            <Route path="/gallery/:id" element={<PaintingPage addToast={addToast} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/cart" element={<CartPage addToast={addToast} />} />
            <Route path="/checkout" element={<CheckoutPage addToast={addToast} />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
            <Route path="/commissions" element={<CommissionsPage addToast={addToast} />} />
            <Route path="/collections" element={<CollectionsPage />} />
            <Route path="/collections/:id" element={<CollectionPage addToast={addToast} />} />
            <Route path="/wishlist" element={<WishlistPage addToast={addToast} />} />
            <Route path="/admin" element={<AdminPage addToast={addToast} />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <Toast toasts={toasts} removeToast={removeToast} />
    </ErrorBoundary>
  )
}
