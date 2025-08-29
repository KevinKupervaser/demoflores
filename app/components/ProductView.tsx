"use client";
import React, { useState } from "react";
import BuyingOptions from "@components/BuyingOptions";
import ProductImageGallery from "@components/ProductImageGallery";
import { StarIcon, HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";

interface Props {
  title: string;
  images: string[];
  points?: string[];
  price: number;
  quantity: number | boolean; // Updated to accept both types
  description: string;
  thumbnail: string;
  category?: string;
}

export default function ProductView({
  images,
  title,
  points,
  price,
  quantity,
  description,
  thumbnail,
  category,
}: Props) {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  // Handle both boolean and number stock values
  const availableQuantity =
    typeof quantity === "boolean" ? (quantity ? 999 : 0) : quantity;

  const isInStock = typeof quantity === "boolean" ? quantity : quantity > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#F3D1AC]/5 to-[#F3D1AC]/10 pt-32">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="relative">
            <ProductImageGallery images={images} />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Category & Like Button */}
            <div className="flex items-center justify-between">
              {category && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#F3D1AC]/30 text-[#576D56] border border-[#F3D1AC]/50">
                  {category}
                </span>
              )}
              <button
                onClick={handleLike}
                className="p-3 hover:bg-[#F3D1AC]/20 rounded-full transition-all duration-200"
              >
                {isLiked ? (
                  <HeartIconSolid className="w-6 h-6 text-[#AC572E]" />
                ) : (
                  <HeartIcon className="w-6 h-6 text-[#576D56]" />
                )}
              </button>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-[#252C24] leading-tight mb-2">
                {title}
              </h1>

              {/* Rating Stars (placeholder) */}
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline space-x-3">
                <span className="text-4xl font-bold text-[#38513E]">
                  ${price}
                </span>
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isInStock ? "bg-[#576D56]" : "bg-[#AC572E]"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    isInStock ? "text-[#576D56]" : "text-[#AC572E]"
                  }`}
                >
                  {isInStock
                    ? typeof quantity === "number" && quantity !== 999
                      ? `${quantity} disponibles`
                      : "Disponible"
                    : "Sin stock"}
                </span>
              </div>
            </div>

            {/* Rest of the component remains the same */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#252C24]">
                Descripción
              </h3>
              <p className="text-[#576D56] leading-relaxed text-base">
                {description}
              </p>
            </div>

            {points && points.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#252C24]">
                  Características
                </h3>
                <ul className="space-y-2">
                  {points.map((point, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full bg-[#38513E] mt-2 flex-shrink-0" />
                      <span className="text-[#576D56]">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-4">
              <BuyingOptions
                productQuantity={availableQuantity}
                price={price}
                thumbnail={thumbnail}
                description={description}
                selectedSize={null}
              />
            </div>

            <div className="border-t border-[#F3D1AC]/30 pt-6 space-y-3">
              <div className="flex items-center text-sm text-[#576D56]">
                <span>✓ Envío gratuito en compras superiores a $50000</span>
              </div>
              <div className="flex items-center text-sm text-[#576D56]">
                <span>✓ Garantía de frescura</span>
              </div>
              <div className="flex items-center text-sm text-[#576D56]">
                <span>✓ Atención personalizada</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
