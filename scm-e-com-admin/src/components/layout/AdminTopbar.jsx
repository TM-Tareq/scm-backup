import { Bell, Search, User, Moon, Sun } from 'lucide-react';
import useThemeStore from '../../store/useThemeStore';

const AdminTopbar = ({ userName = "Admin User" }) => {
    const { isDarkMode, toggleDarkMode } = useThemeStore();

    return (
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 px-8 py-4 sticky top-0 z-40 transition-all">
            <div className="flex items-center justify-between">
                {/* Search */}
                <div className="flex-1 max-w-xl text-black dark:text-white">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search users, vendors, orders..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 dark:text-white text-sm transition-all"
                        />
                    </div>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-4">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition"
                    >
                        {isDarkMode ? (
                            <Sun className="h-5 w-5 text-yellow-500" />
                        ) : (
                            <Moon className="h-5 w-5 text-gray-600" />
                        )}
                    </button>

                    {/* Notifications */}
                    <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition">
                        <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* User Profile */}
                    <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-slate-800 transition-colors">
                        <div className="text-right">
                            <p className="text-sm font-semibold text-gray-800 dark:text-white leading-tight">{userName}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                            <User className="h-5 w-5 text-white" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminTopbar;
