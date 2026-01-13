import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ initialProducts }) => {
  const [displayedProducts, setDisplayedProducts] = useState(initialProducts.slice(0, 20));
  const [hasMore, setHasMore] = useState(initialProducts.length > 20);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop + 100 >= document.documentElement.offsetHeight) {
        if (hasMore) {
          const currentLength = displayedProducts.length;
          const more = initialProducts.slice(currentLength, currentLength + 20);
          if (more.length > 0) {
            setDisplayedProducts(prev => [...prev, ...more]);
          } else {
            setHasMore(false);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [displayedProducts.length, hasMore, initialProducts]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {displayedProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}

      {hasMore && (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500 text-xl">Loading more products...</p>
        </div>
      )}

      {!hasMore && displayedProducts.length > 20 && (
        <div className="col-span-full text-center py-8">
          <p className="text-gray-400">No more products</p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;