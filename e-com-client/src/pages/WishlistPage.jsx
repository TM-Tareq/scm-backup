import ProductCard from "../common/components/ProductCard";
import useWishlistStore from "../store/useWishlistStore";
import { Heart } from "lucide-react";

const WishlistPage = () => {
    const wishlist = useWishlistStore((state) => state.wishlist);

    if(wishlist.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <Heart className="w-32 h-32 text-gray-300 mb-8" />
                <h2 className="text-3xl font-bold text-gray-700 mb-4">
                    Your wishlist is empty
                </h2>
                <p className="text-lg text-gray-500">
                    Explore products and add your favorites!
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-gray-600 mb-4">
                    My Wishlist
                </h1>
                <p className="text-lg text-gray-600 mb-10">
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