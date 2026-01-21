import ProductCard from "../common/components/ProductCard";
import useWishlistStore from "../store/useWishlistStore";
import { Heart } from "lucide-react";

const WishlistPage = () => {
    const wishlist = useWishlistStore((state) => state.wishlist);

    if (wishlist.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col items-center justify-center transition-colors">
                <Heart className="w-32 h-32 text-gray-200 dark:text-slate-800 mb-8" />
                <h2 className="text-4xl font-black text-gray-600 dark:text-slate-700 mb-4 tracking-tighter">
                    Wishlist is Empty
                </h2>
                <p className="text-xl text-gray-400 font-medium">
                    Explore our premium collection and save your favorites!
                </p>
                <button
                    onClick={() => window.location.href = '/'}
                    className="mt-8 px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"
                >
                    Discover Products
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-12 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-gray-600 dark:text-white mb-4">
                    My Wishlist
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-10">
                    {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {wishlist.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WishlistPage;