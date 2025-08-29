"use client";
import Image from "next/image";
import React, { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface Props {
  images: string[];
}

export default function ProductImageGallery({ images }: Props) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  if (images.length === 1) {
    return (
      <div className="relative group">
        <div className="aspect-square w-full max-w-lg mx-auto bg-[#F3D1AC]/10 rounded-2xl overflow-hidden shadow-lg">
          <Image
            src={images[0]}
            alt="Product image"
            fill
            className="object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
            onClick={() => setIsZoomed(!isZoomed)}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative group">
        <div className="aspect-square w-full max-w-lg mx-auto bg-[#F3D1AC]/10 rounded-2xl overflow-hidden shadow-lg">
          <Image
            src={images[currentImage]}
            alt={`Product image ${currentImage + 1}`}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
            onClick={() => setIsZoomed(!isZoomed)}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <ChevronLeftIcon className="w-5 h-5 text-[#576D56]" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <ChevronRightIcon className="w-5 h-5 text-[#576D56]" />
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentImage + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="flex space-x-3 justify-center overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200 ${
                index === currentImage
                  ? "ring-2 ring-[#38513E] ring-offset-2"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
