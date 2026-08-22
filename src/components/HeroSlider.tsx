"use client";

import { useState, useEffect } from "react";

const images = [
  "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop", // airplane
  "https://images.unsplash.com/photo-1565031491910-e57fac031c41?q=80&w=2074&auto=format&fit=crop", // mecca
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2074&auto=format&fit=crop", // dubai
  "https://images.unsplash.com/photo-1539667468225-eebb663053e6?q=80&w=2074&auto=format&fit=crop", // general travel
];

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 z-0 bg-slate-900 overflow-hidden">
      {images.map((img, index) => (
        <div
          key={img}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url(${img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ))}
      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-brand-navy)]/90 to-[var(--color-brand-navy)]/40 mix-blend-multiply z-10" />
    </div>
  );
}
