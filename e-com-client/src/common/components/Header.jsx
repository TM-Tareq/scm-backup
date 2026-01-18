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
import { useEffect } from "react";
// import { useEffect } from "react";

const Header = () => {
    const [darkMode, setDarkMode] = useState(false);
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
        <header className="bg-white shadow-md sticky top-0 z-50">
            {/* Row-1: Welcome Message + Dark/Light Mode + Login/Profile */}
            <div className="bg-gray-100 py-1.5">
                <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-sm">
                    <p className="text-gray-700">
                        Welcome to MyShop! Enjoy free shipping on orders over $100
                    </p>

                    <div className="flex items-center gap-4">
                        {/* Dark/Light Mode */}
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="p-2 rounded-full hover:bg-gray-200"
                        >
                            {darkMode ? (
                                <Sun className="w-5 h-5" />
                            ) : (
                                <Moon className="w-5 h-5" />
                            )}
                        </button>

                        {/* Login / Profile */}
                        {user ? (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    <span className="font-medium">{user.name}</span>
                                </div>
                                <Link
                                    to="/profile"
                                    className="flex items-center gap-2 hover:text-blue-600"
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 text-red-600 hover:underline"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="hover:text-blue-600">
                                    Login
                                </Link>
                                <Link to="/register" className="hover:text-blue-600">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Row-2: Logo + Search + Order Tracking + Icons */}
            <div className="py-3">
                <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
                    {/* Logo */}
                    <Link
                        to="/"
                        onClick={() => useSearchStore.getState().clearSearch()}
                        className="text-3xl font-bold text-blue-600"
                    >
                        MyShop
                    </Link>

                    {/* Search Bar */}
                    <SearchBar />

                    {/* Right Side */}
                    <div className="flex items-center gap-6">
                        <Link
                            to="/track-order"
                            className="text-gray-700 hover:text-blue-600"
                        >
                            Order Tracking
                        </Link>

                        {/* Here from wishlist and Cart */}
                        <Link to="/wishlist" className="relative">
                            <Heart className="w-8 h-8 text-gray-700 hover:text-red-500" />
                            {user && wishlistCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>

                        <Link to="/cart" className="relative">
                            <ShoppingCart className="w-8 h-8 text-gray-700 hover:text-blue-600" />
                            {user && cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>;
                    </div>
                </div>
            </div>

            {/* Row-3: Navigation Menu */}
            <nav className="bg-blue-600 text-white">
                <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
                    {/* Shop Categories Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-700 rounded-lg hover:bg-blue-800"
                        >
                            <Menu className="w-5 h-5" />
                            Shop Categories
                        </button>
                    </div>

                    {/* Main Menu */}
                    <ul className="hidden md:flex items-center gap-8">
                        <li>
                            <Link to="/" onClick={clearSearch} className="hover:underline">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/blog"
                                onClick={clearSearch}
                                className="hover:underline"
                            >
                                Blog
                            </Link>
                        </li>
                        <li>
                            <Link to="/faq" onClick={clearSearch} className="hover:underline">
                                FAQ's
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/contact"
                                onClick={clearSearch}
                                className="hover:underline"
                            >
                                Contact
                            </Link>
                        </li>
                    </ul>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden"
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


