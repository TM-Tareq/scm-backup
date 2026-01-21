import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Package, ShoppingCart, Truck,
    DollarSign, BarChart2, Settings, LogOut, ChevronLeft, ChevronRight, MessageSquare
} from 'lucide-react';
import clsx from 'clsx';
import useAuthStore from '../../store/useAuthStore';

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const menuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/products', label: 'Products', icon: Package },
        { path: '/orders', label: 'Orders', icon: ShoppingCart },
        { path: '/messages', label: 'Messages', icon: MessageSquare },
        { path: '/inventory', label: 'Inventory & Supply', icon: Truck },
        { path: '/earnings', label: 'Earnings', icon: DollarSign },
        { path: '/analytics', label: 'Analytics', icon: BarChart2 },
        { path: '/settings', label: 'Settings', icon: Settings },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <motion.div
            animate={{ width: collapsed ? 80 : 256 }}
            className="h-screen bg-white dark:bg-slate-900 shadow-xl flex flex-col fixed left-0 top-0 z-50 border-r border-gray-100 dark:border-slate-800 transition-colors"
        >
            {/* Logo Section */}
            <div className="p-6 flex items-center justify-between">
                <AnimatePresence>
                    {!collapsed && (
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
                        >
                            VendorHub
                        </motion.h1>
                    )}
                </AnimatePresence>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1.5 rounded-lg bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400 transition"
                >
                    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => clsx(
                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                            isActive
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/40"
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
                        )}
                    >
                        <item.icon size={20} className="min-w-[20px]" />
                        <AnimatePresence>
                            {!collapsed && (
                                <motion.span
                                    initial={{ opacity: 0, w: 0 }}
                                    animate={{ opacity: 1, w: 'auto' }}
                                    exit={{ opacity: 0, w: 0 }}
                                    className="font-medium whitespace-nowrap overflow-hidden"
                                >
                                    {item.label}
                                </motion.span>
                            )}
                        </AnimatePresence>

                        {/* Hover Tooltip for collapsed state */}
                        {collapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 dark:bg-slate-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition z-50 whitespace-nowrap">
                                {item.label}
                            </div>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Logout Footer */}
            <div className="p-4 border-t border-gray-100 dark:border-slate-800 mb-2">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                >
                    <LogOut size={20} className="min-w-[20px]" />
                    {!collapsed && <span className="font-medium">Logout</span>}
                </button>
            </div>
        </motion.div>
    );
};

export default Sidebar;
