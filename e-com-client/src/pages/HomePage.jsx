import HeroSlider from "../common/components/HeroSlider";
import PopularCategories from "../common/components/PopularCategories";
import ProductCard from "../common/components/ProductCard";
import ProductGrid from "../common/components/ProductGrid";
import useProductStore from "../store/useProductStore";
import useSearchStore from "../store/useSearchStore";
import { useEffect } from "react";

const HomePage = () => {
  const { searchQuery, selectedCategory } = useSearchStore();
  const { products, fetchProducts, loading } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const isSearching = searchQuery.trim() !== '';

  // Default all product
  let displayedProducts = products;

  // first product by searching then rest of the product
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

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div>
      {/* all section if not search */}
      {!isSearching ? (
        <>
          <HeroSlider />
          <PopularCategories />

          {/* Trending */}
          <section className="py-16 bg-white dark:bg-slate-900 transition-colors">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white">Trending Products</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Our most popular picks this week</p>
                </div>
                <div className="h-1 flex-1 bg-gray-100 dark:bg-slate-800 mx-8 hidden md:block"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.slice(0, 8).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>

          {/* Pre-order */}
          <section className="py-20 bg-gradient-to-br from-indigo-700 via-blue-600 to-indigo-900 text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <div className="max-w-7xl mx-auto px-4 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
                <div>
                  <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-black tracking-widest uppercase mb-6">Exclusive Launch</span>
                  <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">Pre-Order the Next Generation.</h2>
                  <p className="text-xl opacity-80 mb-10 max-w-lg">Be among the first to experience the future of technology. Limited stock available for pre-launch customers.</p>
                  <div className="flex flex-wrap gap-4">
                    <button className="bg-white text-indigo-700 px-10 py-4 rounded-2xl font-black hover:bg-gray-100 transition-all shadow-xl shadow-white/10 active:scale-95">
                      Secure Mine Now
                    </button>
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-75 group-hover:scale-100 transition-transform duration-1000"></div>
                  <img
                    src={products[0]?.image}
                    alt="Pre-order"
                    className="w-full h-[500px] object-cover rounded-3xl shadow-2xl relative z-10 transition-transform duration-500 group-hover:-translate-y-4"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Best Sellers */}
          <section className="py-16 bg-gray-50 dark:bg-slate-950/50 transition-colors">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white">Best Sellers</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Top-rated by our global community</p>
                </div>
                <div className="h-1 flex-1 bg-gray-100 dark:bg-slate-800 mx-8 hidden md:block"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.slice(8, 16).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        </>
      ) : (
        /* default product if search and infinite scroll */
        <section className="py-16 bg-white dark:bg-slate-900 min-h-screen transition-colors">
          <div className="max-w-7xl mx-auto px-4">
            <div className="mb-12">
              <h2 className="text-lg font-bold text-blue-600 uppercase tracking-widest mb-2">Search Results</h2>
              <h3 className="text-4xl font-black text-gray-900 dark:text-white">
                Exploring "{searchQuery}"
              </h3>
              <p className="text-gray-500 mt-2 font-medium">Found {displayedProducts.length} premium products matching your criteria</p>
            </div>

            {displayedProducts.length > 0 ? (
              <ProductGrid initialProducts={displayedProducts} />
            ) : (
              <div className="text-center py-32 bg-gray-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-slate-800">
                <p className="text-3xl font-black text-gray-400 dark:text-gray-600">No products discovered</p>
                <p className="text-lg text-gray-400 mt-4">Try refining your search terms or exploring categories</p>
                <button
                  onClick={() => useSearchStore.getState().clearSearch()}
                  className="mt-8 px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;