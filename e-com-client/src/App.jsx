import React from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/useAuthStore.js';

// Components and Pages
import Header from './common/components/Header'
import HomePage from './pages/HomePage'
import WishlistPage from './pages/WishlistPage'
import CartPage from './pages/CartPage'
import Footer from './common/components/Footer'
import ProductDetailPage from './pages/ProductDetailPage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import OrderTracking from './pages/OrderTracking'
import Blog from './pages/Blog'
import FAQ from './pages/FAQ'
import Contact from './pages/Contact'
import CheckoutPage from './pages/CheckoutPage'
import useThemeStore from './store/useThemeStore'
import useCartStore from './store/useCartStore'
import useWishlistStore from './store/useWishlistStore'
import { useEffect } from 'react';

// Private Route component
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuthStore();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const App = () => {
  const { checkAuth, loading, user } = useAuthStore();
  const { initTheme } = useThemeStore();
  const { fetchCart } = useCartStore();
  const { fetchWishlist } = useWishlistStore();

  useEffect(() => {
    const initApp = async () => {
      await checkAuth();
      initTheme();
    };
    initApp();
  }, []);

  useEffect(() => {
    if (user) {
      fetchCart();
      fetchWishlist();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
            maxWidth: '400px',
          },
        }}
      />

      <div className='min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors'>
        <Header />
        <main className='flex-grow'>
          <Routes>
            {/* Public Routes */}
            <Route path='/' element={<HomePage />} />
            <Route path='/product/:id' element={<ProductDetailPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/track-order' element={<OrderTracking />} />
            <Route path='/blog' element={<Blog />} />
            <Route path='/faq' element={<FAQ />} />
            <Route path='/contact' element={<Contact />} />

            {/* Private Routes */}
            <Route
              path='/profile'
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            <Route
              path='/cart'
              element={
                <PrivateRoute>
                  <CartPage />
                </PrivateRoute>
              }
            />
            <Route
              path='/wishlist'
              element={
                <PrivateRoute>
                  <WishlistPage />
                </PrivateRoute>
              }
            />
            <Route
              path='/checkout'
              element={
                <PrivateRoute>
                  <CheckoutPage />
                </PrivateRoute>
              }
            />

            {/* 404 or any other page */}
            <Route path='*' element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />

      </div>

    </>
  )
}

export default App