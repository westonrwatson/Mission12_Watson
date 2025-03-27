// Weston Watson, Team 3, Section

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Book } from "../models/Book";

// Define CartItem type
interface CartItem extends Book {
  quantity: number;
}

// Define context properties
interface CartContextType {
  cart: CartItem[];
  addToCart: (book: Book, quantity: number) => void;
  clearCart: () => void;
  removeFromCart: (bookID: number) => void;
  getCartTotal: () => number;
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Load cart from localStorage if it exists
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    // Save cart to localStorage when it updates
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Add to cart function
  const addToCart = (book: Book, quantity: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.bookID === book.bookID);
      if (existingItem) {
        return prevCart.map((item) =>
          item.bookID === book.bookID ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...book, quantity }];
    });
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Get total price
  const getCartTotal = () => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  //remove From Cart
  const removeFromCart = (bookID: number) => {
    setCart((prev) => prev.filter((item) => item.bookID !== bookID));
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        getCartTotal,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook to use CartContext
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
