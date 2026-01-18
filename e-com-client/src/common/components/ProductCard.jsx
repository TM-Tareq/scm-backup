import React, { useState } from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import useWishlistStore from '../../store/useWishlistStore';
import useCartStore from '../../store/useCartStore';

const ProductCard = ({ product }) => {
  const { toggleWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();
  const [imageError, setImageError] = useState(false);

  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));
  
  const wishlisted = isInWishlist;


  const handleWishlist = (e) => {
    e.preventDefault(); // for closing navigation
    e.stopPropagation(); // for stopping the hierarchical click from child to parent, parent to grand parent and so on and so far
    toggleWishlist(product);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">

      <Link to={`/product/${product.id}`} className="block">
        {/* Image Section */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img
            src={imageError ? "https://via.placeholder.com/400x400?text=No+Image" : product.image}
            alt={product.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />

          {/* Out of Stock Badge */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white text-2xl font-bold tracking-wider">
                OUT OF STOCK
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-3 group-hover:text-blue-600 transition">
            {product.name}
          </h3>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">({product.rating})</span>
          </div>

          <div className="flex items-end justify-between mt-auto mb-5">
            <p className="text-3xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </p>
          </div>
        </div>
      </Link>

      {/* Buttons - absolute position, Link-এর বাইরে */}
      {/* Wishlist Heart */}
      <button
        onClick={handleWishlist}
        className="absolute top-4 right-12 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:scale-110 transition z-10"
      >
        <Heart
          className={`w-5 h-5 transition-colors ${
            wishlisted ? "fill-red-500 text-red-500" : "text-gray-700"
          }`}
        />
      </button>

      <button
        onClick={handleAddToCart}
        disabled={!product.inStock}
        className="absolute bottom-4 left-4 right-4 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition shadow-lg hover:shadow-xl z-10"
      >
        <ShoppingCart className="w-5 h-5 inline mr-2" />
        {product.inStock ? "Add to Cart" : "Unavailable"}
      </button>
    </div>
  );
};

export default ProductCard;