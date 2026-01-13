import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './common/components/Header'
import HomePage from './pages/HomePage'
import WishlistPage from './pages/WishlistPage'
import CartPage from './pages/CartPage'
import Footer from './common/components/Footer'
import ProductDetailPage from './pages/ProductDetailPage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

const App = () => {
  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />
      <main className='flex-grow'>
        <Routes>
          <Route path='/' element= {<HomePage />} />
          <Route path='/wishlist' element = {<WishlistPage />} />
          <Route path='/cart' element = {<CartPage />} />
          <Route path='/product/:id' element={<ProductDetailPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/profile' element={<ProfilePage />} />
        </Routes>
      </main>
      <Footer />

    </div>
  )
}

export default App