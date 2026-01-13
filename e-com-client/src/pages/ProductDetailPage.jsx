// src/pages/ProductDetailPage.jsx
import { useParams } from "react-router-dom";
import { useState } from "react";
import ProductCard from "../common/components/ProductCard";
import products from "../data/products.json";
import useCartStore from "../store/useCartStore";
import { ShoppingCart, Star } from "lucide-react";

const ProductDetailPage = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));

  const { addToCart } = useCartStore();

  const [selectedImage, setSelectedImage] = useState(product?.image || "");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);

  // dummy data
  const productImages = [
    product?.image,
    "https://img.freepik.com/free-photo/modern-smartphone-with-blank-screen-isolated-white-background_93675-131899.jpg?w=1380",
    "https://img.freepik.com/free-photo/smartphone-with-blank-screen-isolated-white-background_93675-131900.jpg?w=1380",
    "https://img.freepik.com/free-photo/close-up-smartphone-with-blank-screen_93675-131901.jpg?w=1380",
  ].filter(Boolean);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-3xl text-gray-600">Product not found</p>
      </div>
    );
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 8);

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Gallery with Zoom */}
          <div className="space-y-4">
            {/* Main Image with Zoom */}
            <div
              className="relative overflow-hidden rounded-2xl shadow-2xl bg-gray-100 cursor-zoom-in"
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
                  className="absolute w-48 h-48 border-4 border-white rounded-full pointer-events-none shadow-2xl"
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
            <div className="flex gap-4 overflow-x-auto pb-2">
              {productImages.map((img, index) => (
                <button
                  onClick={() => setSelectedImage(img)}
                  className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-4 transition ${
                    selectedImage === img
                      ? "border-blue-600 shadow-lg"
                      : "border-transparent"
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
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 ${
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xl text-gray-600">({product.rating})</span>
            </div>

            <p className="text-5xl font-bold text-blue-600 mb-8">
              ${product.price.toFixed(2)}
            </p>

            <p className="text-lg text-gray-700 mb-10">
              {product.description ||
                "High quality product with premium features. Perfect for everyday use."}
            </p>

            <div className="flex items-center gap-6 mb-10">
              <button
                onClick={() => addToCart(product)}
                disabled={!product.inStock}
                className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:bg-gray-400 transition flex items-center justify-center gap-3"
              >
                <ShoppingCart className="w-6 h-6" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
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
