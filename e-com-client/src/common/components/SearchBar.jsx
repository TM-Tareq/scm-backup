
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSearchStore from '../../store/useSearchStore';
import useProductStore from '../../store/useProductStore';

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
  const { products } = useProductStore();
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
            className="appearance-none bg-gray-100 dark:bg-slate-800 px-5 py-3.5 pr-12 rounded-l-2xl text-gray-700 dark:text-gray-200 focus:outline-none border-none cursor-pointer font-bold text-sm transition-colors"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="dark:bg-slate-900">
                {cat}
              </option>
            ))}
          </select>
          {/* Arrow Icon */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Search Input with Suggestions */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full px-6 py-3.5 bg-gray-50 dark:bg-slate-800/50 dark:text-white border-y border-transparent focus:outline-none focus:bg-white dark:focus:bg-slate-800 transition-all font-medium"
          />

          {/* Auto Suggestions */}
          {showSuggestions && searchQuery && suggestions.length > 0 && (
            <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-2xl z-[100] max-h-80 overflow-y-auto">
              {suggestions.map((product) => (
                <button
                  key={product.id}
                  onMouseDown={() => handleSuggestionClick(product.name)}
                  className="w-full text-left px-5 py-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition flex items-center gap-4 group/item border-b border-gray-50 dark:border-slate-800/50 last:border-0"
                >
                  <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-xl shadow-sm" />
                  <div>
                    <p className="font-bold text-sm text-gray-900 dark:text-white group-hover/item:text-blue-600 transition-colors">{product.name}</p>
                    <p className="text-[10px] uppercase font-black text-gray-400">{product.category}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Button */}
        <button type="submit" className="bg-blue-600 text-white px-8 py-3.5 rounded-r-2xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center">
          <Search className="w-6 h-6" />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;