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
import { Children } from 'react';
import { useEffect } from 'react';

// Private Route component
const PrivateRoute = ({children}) => {
  const { user, loading } = useAuthStore();
  const location = useLocation();

  if(loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if(!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const App = () => {
  const {checkAuth, loading} = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

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

    <div className='min-h-screen bg-gray-50'>
      <Header />
      <main className='flex-grow'>
        <Routes>
          {/* Public Routes */}
          <Route path='/' element= {<HomePage />} />
          <Route path='/product/:id' element={<ProductDetailPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          
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