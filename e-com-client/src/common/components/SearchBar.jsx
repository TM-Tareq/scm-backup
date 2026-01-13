// src/common/components/SearchBar.jsx
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import useSearchStore from '../../store/useSearchStore';
import { useNavigate } from 'react-router-dom';
import products from '../../data/products.json'

const categories = [
  "All Categories",
  "Air Conditioner",
  "Headphone",
  "Mobile",
  "Laptop",
  "Desktop",
  "Smartwatch",
  "Televisions",
  "Robot Cleaner",
  "Cameras",
  "Gaming",
  "Sports"
];

const SearchBar = () => {
  const { searchQuery, selectedCategory, setSearchQuery, setSelectedCategory } = useSearchStore();
  const navigate = useNavigate();
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = products
    .filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = setSelectedCategory === "All Categories" || selectedCategory == "All" || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    })
    .slice(0, 6);

    useEffect(() => {
    if (searchQuery.trim()) {
      setShowSuggestions(true);
    }
  }, [searchQuery]);

    const handleInputChange = (value) => {
        setSearchQuery(value);
        // navigate('/');
    };

    const handleCategoryChange = (value) => {
        // setSelectedCategory(value === "All Categories" ? "All" : value);
        // if(window.location.pathname === '/') {
        //     navigate('/', {replace: true});
        // }
        setSelectedCategory(value === "All Categories" ? "All" : value);
    };

  const handleSearch = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    navigate('/');
  };

  const handleSuggestionClick = (name) => {
    setSearchQuery(name);
    setShowSuggestions(false);
    navigate('/');
  };

  return (
    <div className="relative flex items-center flex-1 max-w-2xl">
      <form onSubmit={handleSearch} className="flex w-full">
        {/* Category Dropdown with Arrow */}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="appearance-none bg-gray-100 px-4 py-3 pr-10 rounded-l-lg text-gray-700 focus:outline-none border border-gray-300 cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {/* Arrow Icon */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Search Input with Suggestions */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => handleInputChange(e.target.value)}
            // onFocus={() => setShowSuggestions(true)}
            onFocus={()=> setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full px-4 py-3 border-t border-b border-gray-300 focus:outline-none focus:border-blue-500"
          />

          {/* Auto Suggestions */}
          {showSuggestions && searchQuery && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-b-lg shadow-lg z-50 max-h-60 overflow-y-auto">
              {suggestions.map((product) => (
                <button
                  key={product.id}
                  onMouseDown={() => handleSuggestionClick(product.name)}  // onMouseDown দিয়ে onBlur-এর আগে কাজ করবে
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 transition flex items-center gap-3"
                >
                  <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded" />
                  <span>{product.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Button */}
        <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-r-lg hover:bg-blue-700 transition">
          <Search className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;