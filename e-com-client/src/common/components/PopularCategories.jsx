import useSearchStore from "../../store/useSearchStore";

const categoryIcons = [
    { name: "Electronics", value: "electronics", icon: "🔌" },
    { name: "Clothing", value: "clothing", icon: "👕" },
    { name: "Footwear", value: "footwear", icon: "👟" },
    { name: "Accessories", value: "accessories", icon: "👜" },
    { name: "Home & Living", value: "home", icon: "🏠" },
    { name: "Mobile", value: "mobile", icon: "📱" },
    { name: "Laptops", value: "laptop", icon: "💻" },
    { name: "Gaming", value: "gaming", icon: "🎮" },
];

const PopularCategories = () => {
    const { selectedCategory, setSelectedCategory } = useSearchStore();

    return (
        <section className="py-12 bg-gray-50 dark:bg-slate-950 transition-colors">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Popular Categories</h2>
                <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
                    <div
                        onClick={() => setSelectedCategory('All')}
                        className={`flex-shrink-0 text-center cursor-pointer hover:scale-110 transition group`}
                    >
                        <div className={`w-24 h-24 rounded-full shadow-lg flex items-center justify-center text-xl font-bold mb-3 border transition-colors ${selectedCategory === 'All'
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 border-gray-100 dark:border-slate-800'
                            }`}>
                            ALL
                        </div>
                        <p className={`text-sm font-medium ${selectedCategory === 'All' ? 'text-blue-600' : 'text-gray-700 dark:text-gray-300'}`}>All</p>
                    </div>

                    {categoryIcons.map((cat) => (
                        <div
                            key={cat.value}
                            onClick={() => setSelectedCategory(cat.value)}
                            className="flex-shrink-0 text-center cursor-pointer hover:scale-110 transition group"
                        >
                            <div className={`w-24 h-24 rounded-full shadow-lg flex items-center justify-center text-4xl mb-3 border transition-colors ${selectedCategory === cat.value
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800'
                                }`}>
                                {cat.icon}
                            </div>
                            <p className={`text-sm font-medium ${selectedCategory === cat.value ? 'text-blue-600' : 'text-gray-700 dark:text-gray-300'}`}>
                                {cat.name}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PopularCategories;