// src/components/HeroSlider.jsx
import { useState, useEffect } from 'react';

const slides = [
  {
    url: "https://img.freepik.com/premium-photo/happy-asian-pretty-girl-holding-shopping-bags-while-using-smartphone_35721-211.jpg?w=1380",
    title: "Big Sale Up to 70% Off!",
    subtitle: "Grab the best deals on electronics & gadgets",
  },
  {
    url: "https://img.freepik.com/free-vector/gradient-shopping-discount-horizontal-sale-banner_23-2150321996.jpg?w=1380",
    title: "New Arrivals!",
    subtitle: "Latest gadgets just landed",
  },
  {
    url: "https://img.freepik.com/free-psd/futuristic-cyber-monday-banner-template_23-2149117343.jpg?w=1380",
    title: "Cyber Monday Deals",
    subtitle: "Exclusive offers for you",
  },
  {
    url: "https://graphicsfamily.com/wp-content/uploads/edd/2022/10/Gadget-Promotion-Sale-Banner-for-Social-Media-Instagram-Post.png",
    title: "Flash Sale!",
    subtitle: "Limited time offers",
  },
  {
    url: "https://t4.ftcdn.net/jpg/05/12/31/31/360_F_512313150_SXjoxQrERJnZZeMzLQPjEYCQS67qdJFs.jpg",
    title: "Free Shipping",
    subtitle: "On orders over $100",
  },
];

const HeroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // অটো স্লাইড – খুব স্লো (৮ সেকেন্ড)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 2000); // ৮ সেকেন্ডে চেঞ্জ

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-96 md:h-screen overflow-hidden">
      {/* Slides with very slow & smooth fade */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-3000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.url}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
        <div className="max-w-4xl animate-fade-in">
          <h1 className="text-4xl md:text-7xl font-bold mb-6 drop-shadow-2xl">
            {slides[currentIndex].title}
          </h1>
          <p className="text-xl md:text-3xl mb-10 drop-shadow-lg">
            {slides[currentIndex].subtitle}
          </p>
          <button className="bg-white text-blue-600 px-10 py-5 rounded-full text-xl md:text-2xl font-bold hover:bg-gray-100 transition shadow-2xl">
            Shop Now
          </button>
        </div>
      </div>

      {/* Dots Indicator - smooth & slow */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-1000 ease-in-out ${
              index === currentIndex
                ? 'w-12 h-4 bg-white rounded-full'
                : 'w-4 h-4 bg-white/50 rounded-full hover:bg-white'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;