"use client";
import React, { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

interface Props {
  rest?: any;
}

export default function SearchForm({ rest }: Props) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/products/search?query=${encodeURIComponent(query.trim())}`);
  };

  const handleClear = () => {
    setQuery("");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative group">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Buscar productos..."
            className={`
              w-full
              h-12
              pl-12
              pr-20
              text-sm
              bg-white
              border-2
              rounded-xl
              transition-all
              duration-200
              ease-in-out
              placeholder:text-gray-400
              focus:outline-none
              focus:ring-0
              ${
                isFocused || query
                  ? "border-blue-500 shadow-lg shadow-blue-500/10"
                  : "border-gray-200 hover:border-gray-300"
              }
            `}
            {...rest}
          />

          {/* Search Icon */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <MagnifyingGlassIcon
              className={`
                w-5 h-5 
                transition-colors 
                duration-200
                ${isFocused || query ? "text-blue-500" : "text-gray-400"}
              `}
            />
          </div>

          {/* Action Buttons Container */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
            {/* Clear Button */}
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="
                  p-2
                  text-gray-400
                  hover:text-gray-600
                  hover:bg-gray-100
                  rounded-lg
                  transition-all
                  duration-150
                  focus:outline-none
                  focus:ring-2
                  focus:ring-gray-200
                "
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}

            {/* Search Button */}
            <button
              type="submit"
              disabled={!query.trim()}
              className={`
                p-2
                rounded-lg
                transition-all
                duration-200
                focus:outline-none
                focus:ring-2
                focus:ring-offset-1
                ${
                  query.trim()
                    ? "text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    : "text-gray-400 bg-gray-100 cursor-not-allowed"
                }
              `}
            >
              <MagnifyingGlassIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Floating Label (Optional Enhancement) */}
        <div
          className={`
            absolute
            left-12
            top-1/2
            -translate-y-1/2
            text-sm
            text-gray-500
            pointer-events-none
            transition-all
            duration-200
            transform
            ${
              isFocused || query
                ? "-translate-y-8 translate-x-0 text-xs text-blue-600 bg-white px-2"
                : ""
            }
          `}
        >
          {/* This creates a subtle floating label effect */}
        </div>
      </div>

      {/* Search Suggestions (Optional Enhancement) */}
      {isFocused && query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
          <div className="p-3">
            <div className="text-xs text-gray-500 mb-2">
              Presiona Enter para buscar
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-700 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
              <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />
              <span>
                Buscar `&quot<span className="font-semibold">{query}</span>
                `&quot
              </span>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
