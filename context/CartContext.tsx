'use client';

import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';

export interface FoodItem {
  id: number;
  name: string;
  origin: string;
  price: number;
  rating: number;
  category: string;
  image: string;
  recipe: string;
  isFav: boolean;
}

interface CartItem {
  name: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (name: string) => void;
  totalCartItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (name: string) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.name === name);
      if (existingItem) {
        return prevItems.map((item) =>
          item.name === name ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { name, quantity: 1 }];
    });
  };

  const totalCartItems = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, totalCartItems }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart harus digunakan di dalam lingkungan CartProvider bos!');
  }
  return context;
}