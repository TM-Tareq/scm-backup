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
        <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Popular Categories</h2>
                <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
                    {Object.entries(categoryIcons).map(([cat, icon]) => (
                        <div
                            key={cat}
                            className="flex-shrink-0 text-center cursor-pointer hover:scale-110 transition"
                        >
                            <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center text-4xl mb-3">
                                {icon}
                            </div>
                            <p className="text-sm font-medium text-gray-700">{cat}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PopularCategories;