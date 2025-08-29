"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface Product {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  price: number;
  sale: number;
  quantity: number;
  description: string;
  stock: boolean;
}

interface AppContextProps {
  cart: Product[];
  addToCart: (product: Product) => void;
  openRight: boolean;
  openDrawerRight: () => void;
  closeDrawerRight: () => void;
  updateCartItemQuantity: (productId: string, amount: number) => void;
  removeFromCart: (productId: string) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export function AppWrapper({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Product[]>([]);
  const [openRight, setOpenRight] = React.useState(false);

  const openDrawerRight = () => setOpenRight(true);
  const closeDrawerRight = () => setOpenRight(false);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        // If product exists, add the new quantity to existing quantity
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      }
      // If product doesn't exist, add it with the specified quantity
      return [...prevCart, product];
    });
  };

  const updateCartItemQuantity = (productId: string, amount: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        addToCart,
        openRight,
        openDrawerRight,
        closeDrawerRight,
        updateCartItemQuantity,
        removeFromCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppWrapper");
  }
  return context;
}
