// components/HorizontalMenu.tsx
"use client";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import React, { useRef, useState, useEffect } from "react";
import categories from "../utils/categories";
import Link from "next/link";

interface Props {
  activeCategory?: string;
  onCategorySelect?: (category: string) => void;
  showAllOption?: boolean;
}

export default function HorizontalMenu({
  activeCategory = "all",
  onCategorySelect,
  showAllOption = true,
}: Props) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const allCategories = showAllOption ? ["Todos", ...categories] : categories;

  const updateScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    }
  };

  useEffect(() => {
    updateScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      return () => container.removeEventListener("scroll", updateScrollButtons);
    }
  }, []);

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };

  const handleCategoryClick = (category: string) => {
    const normalizedCategory = category === "Todos" ? "all" : category;
    onCategorySelect?.(normalizedCategory);
  };

  return (
    <div className="relative py-6 bg-gradient-to-r from-[#F3D1AC]/10 via-[#F3D1AC/10] to-[#F3D1AC]/10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          disabled={!canScrollLeft}
          className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full 
                     transition-all duration-200 shadow-lg backdrop-blur-sm ${
                       canScrollLeft
                         ? "bg-white/90 hover:bg-white text-[#38513E] hover:shadow-xl hover:scale-110"
                         : "bg-gray-100 text-gray-300 cursor-not-allowed opacity-50"
                     }`}
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>

        {/* Categories Container */}
        <div
          ref={scrollContainerRef}
          className="flex space-x-3 overflow-x-auto scrollbar-hide px-12 py-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {allCategories.map((category) => {
            const isActive =
              category === "Todos"
                ? activeCategory === "all"
                : activeCategory === category;

            if (onCategorySelect) {
              // Interactive button for filtering
              return (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`flex-shrink-0 px-6 py-3 rounded-full text-sm font-medium 
                             transition-all duration-200 transform hover:scale-105 
                             focus:outline-none focus:ring-4 whitespace-nowrap ${
                               isActive
                                 ? "bg-[#38513E] text-white shadow-lg shadow-[#38513E]/25 ring-4 ring-[#38513E]/20"
                                 : "bg-white text-[#576D56] hover:bg-[#F3D1AC]/30 hover:text-[#38513E] shadow-md border border-[#F3D1AC]/50"
                             }`}
                >
                  {category}
                </button>
              );
            } else {
              // Link for navigation
              return (
                <Link
                  key={category}
                  href={
                    category === "Todos" ? "/" : `/browse-products/${category}`
                  }
                  className="flex-shrink-0 px-6 py-3 rounded-full text-sm font-medium 
                           bg-white text-[#576D56] hover:bg-[#F3D1AC]/30 hover:text-[#38513E] 
                           shadow-md border border-[#F3D1AC]/50 transition-all duration-200 
                           transform hover:scale-105 focus:outline-none focus:ring-4 
                           focus:ring-[#38513E]/20 whitespace-nowrap"
                >
                  {category}
                </Link>
              );
            }
          })}
        </div>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          disabled={!canScrollRight}
          className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full 
                     transition-all duration-200 shadow-lg backdrop-blur-sm ${
                       canScrollRight
                         ? "bg-white/90 hover:bg-white text-[#38513E] hover:shadow-xl hover:scale-110"
                         : "bg-gray-100 text-gray-300 cursor-not-allowed opacity-50"
                     }`}
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
