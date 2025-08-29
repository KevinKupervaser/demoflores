"use client";
import React from "react";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { useAppContext } from "../context";
import SideDrawer from "./SideDrawer";

const ShoppingCart = () => {
  const { cart, openDrawerRight } = useAppContext();
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="relative">
      <button
        onClick={openDrawerRight}
        className="relative p-2 group transition-all duration-200 hover:bg-[#F3D1AC]/20 rounded-xl"
        aria-label={`Carrito de compras - ${itemCount} productos`}
      >
        <ShoppingBagIcon className="w-6 h-6 text-[#576D56] group-hover:text-[#38513E] transition-colors duration-200" />

        {itemCount > 0 && (
          <div className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-[#AC572E] text-white rounded-full flex items-center justify-center text-xs font-semibold shadow-lg">
            {itemCount > 99 ? "99+" : itemCount}
          </div>
        )}
      </button>
      <SideDrawer />
    </div>
  );
};

export default ShoppingCart;
