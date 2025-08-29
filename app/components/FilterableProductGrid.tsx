// components/FilterableProductGrid.tsx
"use client";
import { useState, useMemo } from "react";
import HorizontalMenu from "./HorizontalMenu";
import GridView from "./GridView";
import ProductCard from "./ProductCard";
import SearchFormHomePage from "./SearchFormHomePage";

interface Product {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  price: number;
  sale: number;
  description: string;
  stock: boolean;
}

interface Props {
  products: Product[];
}

export default function FilterableProductGrid({ products }: Props) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by category
    if (activeCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === activeCategory
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [products, activeCategory, searchQuery]);

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    setSearchQuery(""); // Clear search when changing category
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setActiveCategory("all"); // Reset category when searching
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="px-4">
        <SearchFormHomePage onSearch={handleSearch} />
      </div>

      {/* Category Filter */}
      <HorizontalMenu
        activeCategory={activeCategory}
        onCategorySelect={handleCategorySelect}
        showAllOption={true}
      />

      {/* Results Header */}
      <div className="px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#252C24]">
            {activeCategory === "all" ? "Todos los Productos" : activeCategory}
          </h2>
          <p className="text-[#576D56]">
            {filteredProducts.length} producto
            {filteredProducts.length !== 1 ? "s" : ""} encontrado
            {filteredProducts.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <GridView>
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </GridView>

      {/* No Results */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🌸</div>
          <h3 className="text-xl font-semibold text-[#252C24] mb-2">
            No se encontraron productos
          </h3>
          <p className="text-[#576D56] mb-6">
            {searchQuery
              ? `No hay productos que coincidan con "${searchQuery}"`
              : `No hay productos en la categoría "${activeCategory}"`}
          </p>
          <button
            onClick={() => {
              setActiveCategory("all");
              setSearchQuery("");
            }}
            className="px-6 py-3 bg-[#38513E] text-white rounded-full hover:bg-[#252C24] transition-colors duration-200"
          >
            Ver todos los productos
          </button>
        </div>
      )}
    </div>
  );
}
