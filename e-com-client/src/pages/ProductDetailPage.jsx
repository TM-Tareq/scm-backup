import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ProductCard from "../common/components/ProductCard";
import useCartStore from "../store/useCartStore";
import useWishlistStore from "../store/useWishlistStore";
import api from "../config/api";
import { ShoppingCart, Star, MessageSquare, Truck, Heart, ArrowLeft, ZoomIn, Package, Shield, Leaf } from "lucide-react";
import ChatModal from "../common/components/ChatModal";
import useAuthStore from "../store/useAuthStore";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const { addToCart } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const { user } = useAuthStore();

  const [selectedImage, setSelectedImage] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/reviews/${id}`);
      setReviews(response.data);
    } catch (err) {
      console.error('Fetch reviews failed', err);
    }
  };

  const checkPurchaseStatus = async () => {
    if (!user) return;
    try {
      const response = await api.get('/orders/user');
      const userOrders = response.data;
      const purchased = userOrders.some(order =>
        order.items && order.items.some(item => item.product_id === parseInt(id))
      );
      setHasPurchased(purchased);
    } catch (err) {
      console.error('Check purchase failed', err);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
        setSelectedImage(response.data.image);

        // Fetch related products
        const allRes = await api.get('/products');
        const related = allRes.data
          .filter(p => p.category === response.data.category && p.id !== parseInt(id))
          .slice(0, 8);
        setRelatedProducts(related);
        fetchReviews();
        checkPurchaseStatus();
      } catch (err) {
        console.error('Fetch product detail failed', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, user]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to review");
    if (!hasPurchased) return toast.error("You must purchase this product to review it");

    setSubmittingReview(true);
    try {
      await api.post('/reviews/add', { productId: id, rating: userRating, comment: userComment });
      toast.success("Review added!");
      setUserComment("");
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleWishlist = () => {
    if (!user) return toast.error("Please login to add to wishlist");
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center">
        <p className="text-3xl text-gray-600 dark:text-gray-400">Product not found</p>
      </div>
    );
  }

  // Use actual product image (vendor can upload multiple images in future)
  const productImages = [product.image].filter(Boolean);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  const handleAddToCart = () => {
    if (!user) return toast.error("Please login to add to cart");
    addToCart(product);
    toast.success("Added to cart!");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Products</span>
        </Link>

        {/* Product Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Main Image with Zoom */}
            <div
              className="relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-slate-800"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
            >
              <img
                src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/${selectedImage}`}
                alt={product.name}
                className="w-full h-[500px] object-contain p-8"
                style={
                  isZooming
                    ? {
                      transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                      transform: "scale(1.5)",
                      transition: "transform 0.1s ease-out",
                    }
                    : {}
                }
              />
              {isZooming && (
                <div className="absolute top-4 right-4 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2">
                  <ZoomIn className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Zoomed</span>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery (if multiple images exist) */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`bg-white dark:bg-slate-900 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === img
                      ? "border-blue-600 dark:border-blue-500"
                      : "border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700"
                      }`}
                  >
                    <img
                      src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/${img}`}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-20 object-contain p-2"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating || 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                        }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600 dark:text-gray-400">({reviews.length} reviews)</span>
              </div>
              <p className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-6">
                ${Number(product.price).toFixed(2)}
              </p>
            </div>

            {/* Description */}
            <div className="prose dark:prose-invert max-w-none">
              <div
                className="text-gray-700 dark:text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.description || "No description available." }}
              />
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-green-600 dark:text-green-400 font-medium">
                {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <ShoppingCart className="w-6 h-6" />
                Add to Cart
              </button>
              <button
                onClick={handleWishlist}
                className={`px-6 py-4 rounded-xl border-2 transition-colors ${isInWishlist(product.id)
                  ? "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-500"
                  : "border-gray-300 dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:border-red-500 hover:text-red-500"
                  }`}
              >
                <Heart className={`w-6 h-6 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-slate-800">
              <div className="text-center">
                <Truck className="w-8 h-8 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">Free Shipping</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">On orders over $50</p>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 mx-auto mb-2 text-green-600 dark:text-green-400" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">Secure Payment</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">100% protected</p>
              </div>
              <div className="text-center">
                <Leaf className="w-8 h-8 mx-auto mb-2 text-emerald-600 dark:text-emerald-400" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">Eco Friendly</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Sustainable packaging</p>
              </div>
            </div>

            {/* Vendor Info */}
            {product.store_name && (
              <div className="bg-gray-100 dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Sold by</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{product.store_name}</p>
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="mt-2 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium flex items-center gap-1"
                >
                  <MessageSquare className="w-4 h-4" />
                  Contact Seller
                </button>
              </div>
            )}
          </motion.div>
        </div>

        {/* Reviews Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Customer Reviews</h2>

          {/* Review Form - Only for buyers who purchased */}
          {user && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-8 mb-8 border border-gray-200 dark:border-slate-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Write a Review</h3>
              {hasPurchased ? (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Rating
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setUserRating(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-8 h-8 ${star <= userRating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300 dark:text-gray-600"
                              }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Review
                    </label>
                    <textarea
                      value={userComment}
                      onChange={(e) => setUserComment(e.target.value)}
                      required
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                      placeholder="Share your experience with this product..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-xl font-medium transition-colors"
                  >
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              ) : (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                  <p className="text-yellow-800 dark:text-yellow-200">
                    You must purchase this product to leave a review.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-center text-gray-600 dark:text-gray-400 py-8">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((review, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-slate-800"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{review.user_name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300 dark:text-gray-600"
                                }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
                          Verified Purchase
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Chat Modal */}
      {isChatOpen && product.vendor_user_id && (
        <ChatModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          vendorId={product.vendor_user_id}
          vendorName={product.store_name || 'Vendor'}
        />
      )}
    </div>
  );
};

export default ProductDetailPage;
