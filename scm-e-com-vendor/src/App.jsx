import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/useAuthStore';
import useThemeStore from './store/useThemeStore';

// Pages
import VendorLogin from './pages/VendorLogin';
import VendorRegister from './pages/VendorRegister';
import StoreSetup from './pages/StoreSetup';
import VendorDashboard from './pages/VendorDashboard';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import Orders from './pages/Orders';
import Inventory from './pages/Inventory';
import Earnings from './pages/Earnings';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Messages from './pages/Messages';

// Components
import VendorLayout from './components/VendorLayout';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const { checkAuth } = useAuthStore();
  const { initTheme } = useThemeStore();

  useEffect(() => {
    checkAuth();
    initTheme();
  }, [checkAuth]);

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<VendorLogin />} />
        <Route path="/register" element={<VendorRegister />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/setup-store" element={<StoreSetup />} />

          <Route element={<VendorLayout />}>
            <Route path="/dashboard" element={<VendorDashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/new" element={<AddProduct />} />
            <Route path="/products/edit/:id" element={<AddProduct />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/earnings" element={<Earnings />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}

export default App;
