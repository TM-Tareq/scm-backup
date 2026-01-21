import { useState } from "react";
import {
    Search,
    ShoppingCart,
    Heart,
    Menu,
    X,
    User,
    LogOut,
    Moon,
    Sun,
} from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import useCartStore from "../../store/useCartStore";
import useWishlistStore from "../../store/useWishlistStore";
import SearchBar from "./SearchBar";
import useSearchStore from "../../store/useSearchStore";
import useAuthStore from "../../store/useAuthStore";
import useThemeStore from "../../store/useThemeStore";
import { useEffect } from "react";

const Header = () => {
    const { isDarkMode, toggleDarkMode } = useThemeStore();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const cartCount = useCartStore((state) => state.cartCount());
    const wishlistCount = useWishlistStore((state) => state.wishlistCount());

    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    // clear search function
    const clearSearch = () => {
        useSearchStore.getState().clearSearch();
    };

    const handleLogout = () => {
        console.log("Handle logout clicked");
        logout();
        navigate("/");
    };

    useEffect(() => {
        if (user) {
            console.log("User logged in, fetching cart & wishlist...");

            useCartStore.getState().fetchCart?.();

            const fetchWishlist = useWishlistStore.getState().fetchWishlist;
            if (fetchWishlist) {
                fetchWishlist();
            } else {
                console.warn("fetchWishlist function not found in store");
            }
        }
    }, [user]);

    return (
        <header className="bg-white dark:bg-slate-900 shadow-md sticky top-0 z-50 transition-colors border-b border-gray-100 dark:border-slate-800">
            {/* Row-1: Welcome Message + Dark/Light Mode + Login/Profile */}
            <div className="bg-gray-100 dark:bg-slate-950/50 py-1.5 border-b border-gray-200 dark:border-slate-800 transition-colors">
                <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-sm overflow-hidden">
                    <div className="marquee-container flex-1 mr-8">
                        <div className="animate-marquee inline-block">
                            <span className="text-gray-700 dark:text-gray-300 font-medium">
                                🚀 Welcome to MyShop! Enjoy free shipping on orders over $100 — New collections just arrived! — Sign up today for 10% off your first order! — 🚀 Welcome to MyShop! Enjoy free shipping on orders over $100 — New collections just arrived! — Sign up today for 10% off your first order!
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                        {/* Dark/Light Mode */}
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors"
                        >
                            {isDarkMode ? (
                                <Sun className="w-5 h-5 text-yellow-500" />
                            ) : (
                                <Moon className="w-5 h-5 text-gray-700" />
                            )}
                        </button>

                        {/* Login / Profile */}
                        {user ? (
                            <div className="flex items-center gap-4 dark:text-gray-300">
                                <div className="hidden sm:flex items-center gap-2">
                                    <User className="w-4 h-4 text-blue-600" />
                                    <span className="font-bold">{user.fname}</span>
                                </div>
                                <Link
                                    to="/profile"
                                    className="hover:text-blue-600 transition-colors"
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-1 text-red-500 hover:text-red-600 font-bold transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 dark:text-gray-300">
                                <Link to="/login" className="hover:text-blue-600 transition-colors">
                                    Login
                                </Link>
                                <div className="h-4 w-px bg-gray-300 dark:bg-slate-700"></div>
                                <Link to="/register" className="hover:text-blue-600 transition-colors">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Row-2: Logo + Search + Order Tracking + Icons */}
            <div className="py-4 bg-white dark:bg-slate-900 transition-colors">
                <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-8">
                    {/* Logo */}
                    <Link
                        to="/"
                        onClick={() => useSearchStore.getState().clearSearch()}
                        className="text-3xl font-black text-blue-600 dark:text-blue-500 tracking-tighter shrink-0"
                    >
                        MY<span className="text-gray-900 dark:text-white">SHOP</span>
                    </Link>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-2xl hidden md:block">
                        <SearchBar />
                    </div>

                    {/* Right Side Icons */}
                    <div className="flex items-center gap-6 shrink-0">
                        <Link
                            to="/track-order"
                            className="hidden lg:flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors"
                        >
                            Track Order
                        </Link>

                        <Link to="/wishlist" className="relative group p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all">
                            <Heart className="w-7 h-7 text-gray-700 dark:text-gray-300 group-hover:text-red-500 transition-all" />
                            {user && wishlistCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-lg shadow-red-500/20">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>

                        <Link to="/cart" className="relative group p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all">
                            <ShoppingCart className="w-7 h-7 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-all" />
                            {user && cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-lg shadow-blue-600/20">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Row-3: Navigation Menu */}
            <nav className="bg-blue-600 dark:bg-blue-700 text-white shadow-inner">
                <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
                    {/* Shop Categories Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="flex items-center gap-3 px-5 py-2.5 bg-blue-700 dark:bg-blue-800 rounded-xl hover:bg-black/20 transition-all font-bold text-sm"
                        >
                            <Menu className="w-5 h-5" />
                            SHOP CATEGORIES
                        </button>
                    </div>

                    {/* Main Menu */}
                    <ul className="hidden md:flex items-center gap-10">
                        {['Home', 'Blog', 'FAQ', 'Contact'].map((item) => (
                            <li key={item}>
                                <Link
                                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                    onClick={clearSearch}
                                    className="text-sm font-bold hover:text-blue-200 transition-colors tracking-wide uppercase"
                                >
                                    {item === 'FAQ' ? "FAQ's" : item}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 hover:bg-white/10 rounded-lg transition"
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default Header;


