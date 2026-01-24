// src/components/HeroSlider.jsx
import { useState, useEffect } from 'react';

const slides = [
  {
    url: "https://img.freepik.com/free-photo/young-handsome-man-choosing-clothes-clothing-shop_1303-19720.jpg?w=1380",
    title: "Summer Collection 2026",
    subtitle: "Discover the latest trends in fashion",
    category: "clothing"
  },
  {
    url: "https://img.freepik.com/free-photo/workplace-business-modern-male-accessories-laptop-black-background_155003-3944.jpg?w=1380",
    title: "Premium Tech Gear",
    subtitle: "Upgrade your workspace with top-tier electronics",
    category: "electronics"
  },
  {
    url: "https://img.freepik.com/free-photo/pair-trainers_144627-3800.jpg?w=1380",
    title: "Step Into Comfort",
    subtitle: "Exclusive footwear collection now available",
    category: "footwear"
  },
  {
    url: "https://img.freepik.com/free-photo/modern-living-room-interior-design_23-2150165997.jpg?w=1380",
    title: "Home & Living",
    subtitle: "Transform your space with our new arrivals",
    category: "home"
  }
];

const HeroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[600px] overflow-hidden group">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${index === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
          <img
            src={slide.url}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 z-20 flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-2xl text-white">
            <span className="inline-block px-4 py-1.5 bg-blue-600/90 backdrop-blur-sm rounded-full text-sm font-bold tracking-wider uppercase mb-6 animate-fade-in-up">
              New Arrivals
            </span>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight drop-shadow-2xl animate-fade-in-up delay-100">
              {slides[currentIndex].title}
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-gray-200 font-light max-w-lg animate-fade-in-up delay-200">
              {slides[currentIndex].subtitle}
            </p>
            <div className="flex gap-4 animate-fade-in-up delay-300">
              <button
                onClick={() => window.location.href = `/?cat=${slides[currentIndex].category}`}
                className="bg-white text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition shadow-xl transform hover:-translate-y-1"
              >
                Shop Collection
              </button>
              <button className="px-8 py-4 rounded-xl font-bold border-2 border-white/30 hover:bg-white/10 transition text-white backdrop-blur-sm">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-8 left-0 right-0 z-30">
        <div className="max-w-7xl mx-auto px-4 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-500 ${index === currentIndex ? 'w-12 bg-blue-500' : 'w-6 bg-white/30 hover:bg-white/50'
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;