"use client";
import Image from "next/image";
import Link from "next/link";
import { useAppContext } from "../context";
import { toast } from "react-toastify";
import { ShoppingCartIcon, HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { useState } from "react";

interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  price: number;
  sale: number;
  stock: boolean;
}

interface Props {
  product: Product;
  rest?: any;
}

// Utility function for consistent price formatting
const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export default function ProductCard({ product, rest }: Props) {
  const { addToCart } = useAppContext();
  const { title, id, thumbnail, price, stock } = product;
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = () => {
    if (stock) {
      addToCart({ ...product, quantity: 1 });
      toast.success("Producto agregado al carrito");
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#38513E]/10 border border-gray-100 w-full max-w-sm mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...rest}
    >
      {/* Stock Badge */}
      {!stock && (
        <div className="absolute top-4 left-4 z-10 bg-[#AC572E] text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
          Agotado
        </div>
      )}

      {/* Sale Badge */}
      {product.sale > 0 && stock && (
        <div className="absolute top-4 left-4 z-10 bg-[#AC572E] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
          OFERTA
        </div>
      )}

      {/* Like Button */}
      <button
        onClick={handleLike}
        className="absolute top-4 right-4 z-10 p-2.5 bg-white/90 backdrop-blur-sm rounded-full 
                   transition-all duration-200 hover:bg-white hover:scale-110 shadow-md"
      >
        {isLiked ? (
          <HeartIconSolid className="w-5 h-5 text-[#AC572E]" />
        ) : (
          <HeartIcon className="w-5 h-5 text-[#576D56]" />
        )}
      </button>

      <Link href={`/${title}/${id}`} className="block">
        {/* Image Container - Much Larger */}
        <div className="relative w-full h-96 sm:h-72 lg:h-80 overflow-hidden bg-[#F3D1AC]/20">
          <Image
            src={thumbnail}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover transition-all duration-500 group-hover:scale-105 ${
              !stock ? "grayscale opacity-70" : ""
            }`}
            priority={false}
          />

          {/* Overlay on hover */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-[#38513E]/30 via-transparent to-transparent 
                       transition-opacity duration-300 ${
                         isHovered ? "opacity-100" : "opacity-0"
                       }`}
          />

          {/* Quick view text on hover */}
          <div
            className={`absolute inset-x-0 bottom-4 text-center transition-all duration-300 ${
              isHovered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2"
            }`}
          >
            <span className="text-white text-sm font-medium bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full">
              Ver detalles
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          {/* Category */}
          <p className="text-[#576D56] text-xs uppercase tracking-wide font-light">
            {product.category}
          </p>

          {/* Title */}
          <h3
            className="text-[#252C24] font-semibold text-base leading-tight line-clamp-2 
                         group-hover:text-[#38513E] transition-colors duration-200 min-h-[2.5rem]"
          >
            {title}
          </h3>

          {/* Price */}
          <div className="flex items-center justify-between pt-1">
            <div className="space-y-1">
              <p className="text-[#38513E] font-bold text-xl">
                ${formatNumber(price)}
              </p>
              {product.sale > 0 && (
                <p className="text-[#AC572E] text-sm line-through opacity-60">
                  ${formatNumber(product.sale)}
                </p>
              )}
            </div>

            {/* Stock indicator */}
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  stock ? "bg-[#576D56]" : "bg-[#AC572E]"
                }`}
              />
              <span
                className={`text-xs font-medium ${
                  stock ? "text-[#576D56]" : "text-[#AC572E]"
                }`}
              >
                {stock ? "Disponible" : "Agotado"}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="p-5 pt-0">
        <button
          onClick={handleAddToCart}
          disabled={!stock}
          className={`w-full py-3.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 
                     flex items-center justify-center space-x-2 ${
                       stock
                         ? `bg-[#38513E] text-white hover:bg-[#252C24] hover:shadow-lg 
                 hover:shadow-[#38513E]/25 transform hover:-translate-y-0.5 
                 focus:outline-none focus:ring-4 focus:ring-[#38513E]/20 active:scale-95`
                         : `bg-gray-100 text-gray-400 cursor-not-allowed`
                     }`}
        >
          <ShoppingCartIcon className="w-5 h-5" />
          <span>{stock ? "Agregar al Carrito" : "No Disponible"}</span>
        </button>
      </div>
    </div>
  );
}
