// components/SearchFormHomePage.tsx
"use client";
import React, { useState } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

interface Props {
  onSearch?: (query: string) => void;
  rest?: any;
}

export default function SearchFormHomePage({ onSearch, rest }: Props) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (onSearch) {
      // If onSearch prop is provided, use it for filtering
      onSearch(query.trim());
    } else {
      // Otherwise, navigate to search page
      router.push(
        `/search-products/search?query=${encodeURIComponent(query.trim())}`
      );
    }
  };

  const handleClear = () => {
    setQuery("");
    if (onSearch) {
      onSearch(""); // Clear the filter
    }
  };

  return (
    <div className="w-full max-w-md mx-auto pt-32">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Buscar productos..."
            className={`w-full h-12 pl-12 pr-20 text-sm bg-white border-2 rounded-xl
                      transition-all duration-200 ease-in-out placeholder:text-gray-400
                      focus:outline-none focus:ring-0
                      ${
                        isFocused || query
                          ? "border-[#38513E] shadow-lg shadow-[#38513E]/10"
                          : "border-[#F3D1AC] hover:border-[#576D56]"
                      }`}
            {...rest}
          />

          {/* Search Icon */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <MagnifyingGlassIcon
              className={`w-5 h-5 transition-colors duration-200
                ${isFocused || query ? "text-[#38513E]" : "text-[#576D56]"}
              `}
            />
          </div>

          {/* Action Buttons */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
            {/* Clear Button */}
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="p-2 text-[#576D56] hover:text-[#AC572E] hover:bg-[#F3D1AC]/30 
                         rounded-lg transition-all duration-150 focus:outline-none 
                         focus:ring-2 focus:ring-[#38513E]/20"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            )}

            {/* Search Button */}
            <button
              type="submit"
              disabled={!query.trim()}
              className={`p-2 rounded-lg transition-all duration-200 focus:outline-none 
                        focus:ring-2 focus:ring-offset-1 focus:ring-[#38513E]/20
                        ${
                          query.trim()
                            ? "text-white bg-[#38513E] hover:bg-[#252C24] shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            : "text-gray-400 bg-gray-100 cursor-not-allowed"
                        }`}
            >
              <MagnifyingGlassIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
