"use client";
import React, { useState, useTransition } from "react";
import {
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useAppContext } from "../context";

interface Props {
  productQuantity: number;
  price: number;
  thumbnail: string;
  description: string;
  selectedSize: number | null;
}

// Utility function for consistent price formatting
const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export default function BuyingOptions({
  productQuantity,
  price,
  thumbnail,
  description,
}: Props) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();
  const { product } = useParams();
  const productId = product[1];
  const { addToCart } = useAppContext();

  let array = product[0].split("%20");
  const singleProduct = array.join(" ");

  const handleAddToCart = () => {
    if (productQuantity === 0) {
      toast.error("Producto sin stock");
      return;
    }

    startTransition(() => {
      const newProduct = {
        id: productId,
        title: singleProduct,
        category: "",
        thumbnail: thumbnail,
        price: price,
        sale: 0,
        description: description,
        quantity: quantity, // Use the actual selected quantity
        stock: true,
      };

      addToCart(newProduct);
      toast.success(
        `${quantity} producto${quantity > 1 ? "s" : ""} agregado${
          quantity > 1 ? "s" : ""
        } al carrito`
      );

      // Reset quantity to 1 after adding to cart
      setQuantity(1);
    });
  };

  const handleIncrement = () => {
    if (quantity < productQuantity) {
      setQuantity((prevCount) => prevCount + 1);
    } else {
      toast.error(`Stock máximo: ${productQuantity} unidades`);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prevCount) => prevCount - 1);
    }
  };

  const totalPrice = price * quantity;

  return (
    <div className="space-y-6">
      {/* Quantity Selector */}
      {productQuantity > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-[#252C24]">Cantidad</h4>

          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-white border-2 border-[#F3D1AC] rounded-xl">
              <button
                onClick={handleDecrement}
                disabled={quantity <= 1}
                className="p-3 text-[#576D56] hover:text-[#38513E] hover:bg-[#F3D1AC]/20 rounded-l-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MinusIcon className="w-5 h-5" />
              </button>

              <div className="px-6 py-3 text-lg font-semibold text-[#252C24] min-w-[4rem] text-center">
                {quantity}
              </div>

              <button
                onClick={handleIncrement}
                disabled={quantity >= productQuantity}
                className="p-3 text-[#576D56] hover:text-[#38513E] hover:bg-[#F3D1AC]/20 rounded-r-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="text-sm text-[#576D56]">
              {productQuantity === 999
                ? "Disponible"
                : `${productQuantity} disponibles`}
            </div>
          </div>
        </div>
      )}

      {/* Price Summary */}
      {quantity > 1 && (
        <div className="bg-[#F3D1AC]/10 rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-[#576D56]">
            <span>Precio unitario:</span>
            <span>${formatPrice(price)}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold text-[#252C24]">
            <span>Total ({quantity} productos):</span>
            <span>${formatPrice(totalPrice)}</span>
          </div>
        </div>
      )}

      {/* Add to Cart Button */}
      <div className="space-y-3">
        <button
          onClick={handleAddToCart}
          disabled={isPending || productQuantity === 0}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 
                     flex items-center justify-center space-x-3 ${
                       productQuantity === 0
                         ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                         : isPending
                         ? "bg-[#576D56] text-white cursor-wait"
                         : "bg-[#38513E] text-white hover:bg-[#252C24] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95"
                     }`}
        >
          <ShoppingCartIcon className="w-6 h-6" />
          <span>
            {productQuantity === 0
              ? "Sin Stock"
              : isPending
              ? "Agregando..."
              : `Agregar ${
                  quantity > 1 ? `${quantity} productos` : "al Carrito"
                }`}
          </span>
        </button>

        {quantity > 1 && (
          <p className="text-center text-sm text-[#576D56]">
            Total: ${formatPrice(totalPrice)}
          </p>
        )}
      </div>

      {/* Additional Actions */}
      <div className="flex space-x-3">
        <button className="flex-1 py-3 px-4 border-2 border-[#38513E] text-[#38513E] rounded-xl hover:bg-[#38513E] hover:text-white transition-all duration-200 font-medium">
          Contactar Vendedor
        </button>
      </div>
    </div>
  );
}
