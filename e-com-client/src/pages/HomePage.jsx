import HeroSlider from "../common/components/HeroSlider";
import PopularCategories from "../common/components/PopularCategories";
import ProductCard from "../common/components/ProductCard";
import ProductGrid from "../common/components/ProductGrid";
import products from "../data/products.json";
import useSearchStore from "../store/useSearchStore";

const HomePage = () => {
  const { searchQuery, selectedCategory } = useSearchStore();

  const isSearching = searchQuery.trim() !== '';

  // ডিফল্ট সব প্রোডাক্ট
  let displayedProducts = products;

  // সার্চ করলে ম্যাচ করা প্রোডাক্ট প্রথমে + বাকি পরে
  if (isSearching) {
    const matchedProducts = products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    const nonMatchedProducts = products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      return !(matchesSearch && matchesCategory);
    });

    displayedProducts = [...matchedProducts, ...nonMatchedProducts];
  }

  return (
    <div>
      {/* সার্চ না করলে সব সেকশন দেখাবে */}
      {!isSearching ? (
        <>
          <HeroSlider />
          <PopularCategories />

          {/* Trending */}
          <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Trending Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.slice(0, 8).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>

          {/* Pre-order */}
          <section className="py-12 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <h2 className="text-4xl font-bold mb-6">Pre-Order Now!</h2>
              <div className="bg-white/10 rounded-xl p-8 max-w-2xl mx-auto">
                <img 
                  src={products[0]?.image} 
                  alt="Pre-order" 
                  className="w-full h-96 object-cover rounded-lg mb-6" 
                />
                <h3 className="text-3xl font-bold mb-4">{products[0]?.name}</h3>
                <p className="text-xl mb-6">Coming Soon - Be the first to get it!</p>
                <button className="bg-white text-purple-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100">
                  Pre-Order Now
                </button>
              </div>
            </div>
          </section>

          {/* Best Sellers */}
          <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Best Sellers</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.slice(8, 16).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        </>
      ) : (
        /* সার্চ করলে শুধু ফিল্টার্ড প্রোডাক্ট + infinite scroll */
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Search Results for "{searchQuery}"
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {displayedProducts.length} products found
            </p>

            {displayedProducts.length > 0 ? (
              <ProductGrid initialProducts={displayedProducts} />
            ) : (
              <div className="text-center py-20">
                <p className="text-3xl text-gray-500">No products found</p>
                <p className="text-lg text-gray-400 mt-4">Try a different search term</p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;