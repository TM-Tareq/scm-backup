import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import useThemeStore from './store/useThemeStore';
import DarkSidebar from './components/layout/DarkSidebar';
import AdminTopbar from './components/layout/AdminTopbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Vendors from './scenes/vendors/index';
import Users from './pages/Users';
import Commissions from './pages/Commissions';
import Payouts from './pages/Payouts';
import Analytics from './pages/Analytics';
import Logistics from './pages/Logistics';
import FaqManager from './pages/FaqManager';
import Announcements from './pages/Announcements';
import AuditLogs from './pages/AuditLogs';
import Settings from './pages/Settings';
import Blogs from './pages/Blogs';
import Editors from './pages/Editors';
import LiveShipments from './pages/LiveShipments';
import Warehouses from './pages/Warehouses';

const Placeholder = ({ title }) => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">{title}</h1>
    <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-400">
      This module is currently under development.
    </div>
  </div>
);

function App() {
  const { user, loading } = useAuth();
  const { initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  const userRole = user?.role || 'editor';
  const userName = user?.fname && user?.lname ? `${user.fname} ${user.lname}` : user?.email || 'Admin User';

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <DarkSidebar userRole={userRole} />

      <div className="flex-1 ml-20 md:ml-64 transition-all duration-300">
        <AdminTopbar userName={userName} />

        <main className="p-8 pb-20">
          <Routes>
            <Route path="/login" element={<Navigate to="/dashboard" replace />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/users" element={<Users />} />

            <Route path="/commissions" element={<Commissions />} />
            <Route path="/payouts" element={<Payouts />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/editors" element={<Editors />} />
            <Route path="/carriers" element={<Logistics />} />
            <Route path="/warehouses" element={<Warehouses />} />
            <Route path="/live-shipments" element={<LiveShipments />} />
            <Route path="/faq-manager" element={<FaqManager />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/audit-logs" element={<AuditLogs />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
