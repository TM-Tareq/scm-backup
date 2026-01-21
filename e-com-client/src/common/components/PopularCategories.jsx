const categoryIcons = {
  "Air Conditioner": "❄️",
  "Headphone": "🎧",
  "Mobile": "📱",
  "Laptop": "💻",
  "Desktop": "🖥️",
  "Smartwatch": "⌚",
  "Televisions": "📺",
  "Robot Cleaner": "🤖",
  "Cameras": "📷",
  "Gaming": "🎮",
  "Sports": "⚽"
};

const PopularCategories = () => {
    return (
        <section className="py-12 bg-gray-50 dark:bg-slate-950 transition-colors">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Popular Categories</h2>
                <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
                    {Object.entries(categoryIcons).map(([cat, icon]) => (
                        <div
                            key={cat}
                            className="flex-shrink-0 text-center cursor-pointer hover:scale-110 transition"
                        >
                            <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-full shadow-lg flex items-center justify-center text-4xl mb-3 border border-gray-100 dark:border-slate-800 transition-colors">
                                {icon}
                            </div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{cat}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PopularCategories;