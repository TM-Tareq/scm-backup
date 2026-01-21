import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ProductCard from "../common/components/ProductCard";
import useCartStore from "../store/useCartStore";
import api from "../config/api";
import { ShoppingCart, Star, MessageSquare, Truck } from "lucide-react";
import ChatModal from "../common/components/ChatModal";
import useAuthStore from "../store/useAuthStore";
import toast from "react-hot-toast";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const { addToCart } = useCartStore();
  const { user } = useAuthStore();

  const [selectedImage, setSelectedImage] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/reviews/${id}`);
      setReviews(response.data);
    } catch (err) {
      console.error('Fetch reviews failed', err);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
        setSelectedImage(response.data.image);

        // Fetch related products (mock for now based on category)
        const allRes = await api.get('/products');
        const related = allRes.data
          .filter(p => p.category === response.data.category && p.id !== parseInt(id))
          .slice(0, 8);
        setRelatedProducts(related);
        fetchReviews();
      } catch (err) {
        console.error('Fetch product detail failed', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to review");
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

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-3xl text-gray-600">Product not found</p>
      </div>
    );
  }

  const productImages = [
    product?.image,
    "https://img.freepik.com/free-photo/modern-smartphone-with-blank-screen-isolated-white-background_93675-131899.jpg?w=1380",
    "https://img.freepik.com/free-photo/smartphone-with-blank-screen-isolated-white-background_93675-131900.jpg?w=1380",
    "https://img.freepik.com/free-photo/close-up-smartphone-with-blank-screen_93675-131901.jpg?w=1380",
  ].filter(Boolean);

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Gallery with Zoom */}
          <div className="space-y-4">
            {/* Main Image with Zoom */}
            <div
              className="relative overflow-hidden rounded-[2.5rem] shadow-2xl bg-gray-100 dark:bg-slate-900 cursor-zoom-in border border-gray-100 dark:border-slate-800 transition-colors"
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300"
                style={{
                  transform: isZooming ? `scale(2)` : "scale(1)",
                  transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                }}
              />

              {/* Zoom Lens Effect */}
              {isZooming && (
                <div
                  className="absolute w-48 h-48 border-4 border-white dark:border-slate-700 rounded-full pointer-events-none shadow-2xl"
                  style={{
                    left: `${mousePosition.x}%`,
                    top: `${mousePosition.y}%`,
                    transform: "translate(-50%, -50%)",
                    backgroundImage: `url(${selectedImage})`,
                    backgroundSize: "200%",
                    backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
                  }}
                />
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-4 transition ${selectedImage === img
                    ? "border-blue-600 shadow-lg"
                    : "border-transparent bg-white dark:bg-slate-900"
                    }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-4 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                  {product.category || 'Premium Collection'}
                </span>
                <span className="px-4 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  {product.inStock ? 'In Pipeline' : 'Backordered'}
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tighter leading-[1.1]">
                {product.name}
              </h1>

              <div className="flex items-center gap-6 mb-8">
                <div className="flex items-center bg-gray-100/50 dark:bg-slate-900/50 p-2 rounded-2xl border border-gray-100 dark:border-slate-800">
                  <div className="flex items-center px-2 mr-3 border-r border-gray-200 dark:border-slate-700">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300 dark:text-slate-700"
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-black text-gray-900 dark:text-white">{product.rating || '0.0'}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-1 font-bold uppercase tracking-widest pl-2">Customer Rating</span>
                </div>
              </div>
            </div>

            <div className="mb-10 p-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] shadow-2xl shadow-blue-600/20 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
              <p className="text-6xl font-black mb-2 tracking-tighter">
                ${product.price ? parseFloat(product.price).toFixed(2) : '0.00'}
              </p>
              <p className="text-sm font-bold opacity-70 uppercase tracking-widest flex items-center gap-2 text-white">
                <Truck size={16} /> Fast Global Logistics Included
              </p>
            </div>

            <div className="mb-12">
              <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] mb-4">Strategic Description</h3>
              <p className="text-xl text-gray-700 dark:text-gray-400 leading-relaxed font-medium">
                {product.description ||
                  "This high-tier asset integrates advanced engineering with a minimalist aesthetic, ensuring peak efficiency and longevity in any operational environment. Crafted for those who demand uncompromising performance."}
              </p>
              <div className="grid grid-cols-2 gap-4 mt-8">
                {[
                  { label: 'Integrity', val: 'Military Grade' },
                  { label: 'Lifecycle', val: 'Enterprise' },
                ].map((feat, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 transition-colors">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{feat.label}</p>
                    <p className="font-bold text-gray-900 dark:text-white uppercase text-xs">{feat.val}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button
                onClick={() => addToCart(product)}
                disabled={!product.inStock}
                className="flex-1 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 disabled:bg-gray-400 transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3 uppercase tracking-widest text-sm active:scale-95"
              >
                <ShoppingCart className="w-5 h-5" />
                Acquire Asset
              </button>

              {product.vendor_id && (
                <button
                  onClick={() => {
                    if (!user) return toast.error('Please login to chat');
                    setIsChatOpen(true);
                  }}
                  className="flex-1 py-5 border-2 border-blue-600 text-blue-600 dark:text-blue-400 font-black rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm active:scale-95"
                >
                  <MessageSquare className="w-5 h-5" />
                  Vendor Comms
                </button>
              )}
            </div>
          </div>
        </div>

        <ChatModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          vendorId={product.vendor_id}
          vendorName="Vendor Store" // This could be enriched
        />

        {/* Reviews Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 border-b dark:border-slate-800 pb-4">
            Customer Reviews ({reviews.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Review Form */}
            <div className="md:col-span-1">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
                <h3 className="text-xl font-bold dark:text-white mb-6">Write a Review</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setUserRating(star)}
                          className={`p-1 transition-transform hover:scale-110 ${userRating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                          <Star className={`w-8 h-8 ${userRating >= star ? 'fill-current' : ''}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Comment</label>
                    <textarea
                      required
                      value={userComment}
                      onChange={(e) => setUserComment(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 dark:text-white border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                      placeholder="Share your experience..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:bg-gray-400 transition shadow-lg shadow-blue-600/20"
                  >
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </div>
            </div>

            {/* Review List */}
            <div className="md:col-span-2 space-y-6">
              {reviews.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-800">
                  <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
                </div>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold">
                          {review.fname[0]}{review.lname[0]}
                        </div>
                        <div>
                          <h4 className="font-bold dark:text-white">{review.fname} {review.lname}</h4>
                          <p className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-slate-700'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 dark:text-white">
              Related Products
            </h2>
            <div className="flex overflow-x-auto gap-8 pb-4 scrollbar-hide">
              {relatedProducts.map((related) => (
                <div key={related.id} className="flex-shrink-0 w-72">
                  <ProductCard product={related} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
