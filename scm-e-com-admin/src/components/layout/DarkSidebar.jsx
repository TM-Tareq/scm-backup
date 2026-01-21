import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Store, DollarSign, CreditCard, BarChart3, Users,
    HelpCircle, FileText, Settings, LogOut, ChevronLeft, Shield, Megaphone, Truck, Newspaper
} from 'lucide-react';
import useThemeStore from '../../store/useThemeStore';

const DarkSidebar = ({ userRole = 'admin' }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { isDarkMode } = useThemeStore();

    const menuItems = {
        admin: [
            { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { path: '/vendors', label: 'Vendors', icon: Store },
            { path: '/commissions', label: 'Commissions', icon: DollarSign },
            { path: '/payouts', label: 'Payouts', icon: CreditCard },
            { path: '/analytics', label: 'Analytics', icon: BarChart3 },
            { path: '/users', label: 'Users', icon: Users },
            { path: '/editors', label: 'Editors', icon: Shield },
            { path: '/carriers', label: 'Carriers', icon: Truck },
            { path: '/blogs', label: 'Blogs', icon: Newspaper },
            { path: '/faq-manager', label: 'FAQ Manager', icon: HelpCircle },
            { path: '/announcements', label: 'Announcements', icon: Megaphone },
            { path: '/audit-logs', label: 'Audit Logs', icon: FileText },
            { path: '/settings', label: 'Settings', icon: Settings },
        ],
        editor: [
            { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { path: '/users', label: 'Users', icon: Users },
            { path: '/vendors', label: 'Vendors', icon: Store },
            { path: '/blogs', label: 'Blogs', icon: Newspaper },
            { path: '/faq-manager', label: 'FAQ Manager', icon: HelpCircle },
            { path: '/audit-logs', label: 'My Activity', icon: FileText },
        ],
    };

    const currentMenuItems = menuItems[userRole] || menuItems.editor;

    return (
        <motion.div
            initial={false}
            animate={{ width: isCollapsed ? 80 : 256 }}
            className={`fixed left-0 top-0 h-screen border-r z-50 flex flex-col transition-colors ${
                isDarkMode 
                    ? 'bg-gradient-to-b from-slate-900 to-slate-800 border-slate-700' 
                    : 'bg-white border-gray-200'
            }`}
        >
            {/* Header */}
            <div className={`p-6 border-b flex items-center justify-between transition-colors ${
                isDarkMode ? 'border-slate-700' : 'border-gray-200'
            }`}>
                <AnimatePresence mode="wait">
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex items-center gap-3"
                        >
                            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                                <Shield className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className={`font-bold text-lg transition-colors ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Admin Portal</h1>
                                <p className={`text-xs capitalize transition-colors ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{userRole}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={`p-2 rounded-lg transition ${
                        isDarkMode 
                            ? 'hover:bg-slate-700 text-slate-400 hover:text-white' 
                            : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                    }`}
                >
                    <motion.div
                        animate={{ rotate: isCollapsed ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </motion.div>
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-3">
                <div className="space-y-1">
                    {currentMenuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-3 rounded-lg transition-all group ${
                                        isActive
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                                            : isDarkMode
                                                ? 'text-slate-400 hover:bg-slate-700 hover:text-white'
                                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <Icon className={`h-5 w-5 flex-shrink-0 ${
                                            isActive 
                                                ? 'text-white' 
                                                : isDarkMode 
                                                    ? 'text-slate-400 group-hover:text-white' 
                                                    : 'text-gray-600 group-hover:text-gray-900'
                                        }`} />
                                        <AnimatePresence mode="wait">
                                            {!isCollapsed && (
                                                <motion.span
                                                    initial={{ opacity: 0, width: 0 }}
                                                    animate={{ opacity: 1, width: 'auto' }}
                                                    exit={{ opacity: 0, width: 0 }}
                                                    className="font-medium text-sm whitespace-nowrap overflow-hidden"
                                                >
                                                    {item.label}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </div>
            </nav>

            {/* Footer - Logout */}
            <div className={`p-3 border-t transition-colors ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                <button className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all w-full ${
                    isDarkMode 
                        ? 'text-slate-400 hover:bg-red-900/20 hover:text-red-400' 
                        : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
                }`}>
                    <LogOut className="h-5 w-5 flex-shrink-0" />
                    <AnimatePresence mode="wait">
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                className="font-medium text-sm whitespace-nowrap overflow-hidden"
                            >
                                Logout
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>
            </div>
        </motion.div>
    );
};

export default DarkSidebar;
