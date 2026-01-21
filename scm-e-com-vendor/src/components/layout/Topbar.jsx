import { Search, Bell, User, Moon, Sun } from 'lucide-react';
import useThemeStore from '../../store/useThemeStore';

const Topbar = () => {
    const { isDarkMode, toggleDarkMode } = useThemeStore();

    return (
        <div className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-40 transition-colors">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                    type="text"
                    placeholder="Search products, orders, or suppliers..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 dark:text-white transition"
                />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-6">
                <button
                    onClick={toggleDarkMode}
                    className="p-2.5 bg-gray-50 dark:bg-slate-800 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-all shadow-sm"
                >
                    {isDarkMode ? (
                        <Sun className="h-5 w-5 text-yellow-500" />
                    ) : (
                        <Moon className="h-5 w-5" />
                    )}
                </button>

                <button className="relative p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition">
                    <Bell className="h-6 w-6" />
                    <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                </button>

                <div className="h-8 w-[1px] bg-gray-200"></div>

                <div className="flex items-center gap-3 cursor-pointer">
                    <div className="h-10 w-10 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                        VS
                    </div>
                    <div className="hidden md:block">
                        <h4 className="text-sm font-semibold text-gray-800">Vendor Store</h4>
                        <p className="text-xs text-gray-500">Premium Vendor</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Topbar;
