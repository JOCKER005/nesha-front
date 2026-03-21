// src/context/cart-context.tsx
// FIX #12: Cantidad máxima por ítem es 99. Evita que alguien ponga 9999 unidades.

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Product } from "@/lib/api";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  itemsCount: number;
  cartTotal: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const MAX_QTY_PER_ITEM = 99;

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("luxe-cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("luxe-cart", JSON.stringify(items));
  }, [items]);

  const itemsCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const addItem = (product: Product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, MAX_QTY_PER_ITEM);
        return prev.map(i =>
          i.product.id === product.id ? { ...i, quantity: newQty } : i
        );
      }
      return [...prev, { product, quantity: Math.min(quantity, MAX_QTY_PER_ITEM) }];
    });
  };

  const removeItem = (productId: number) =>
    setItems(prev => prev.filter(i => i.product.id !== productId));

  const updateQuantity = (productId: number, quantity: number) => {
    const clamped = Math.max(0, Math.min(quantity, MAX_QTY_PER_ITEM));
    if (clamped === 0) return removeItem(productId);
    setItems(prev =>
      prev.map(i => (i.product.id === productId ? { ...i, quantity: clamped } : i))
    );
  };

  const clearCart = () => setItems([]);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen(v => !v);

  return (
    <CartContext.Provider value={{
      items, isOpen, itemsCount, cartTotal,
      addItem, removeItem, updateQuantity, clearCart,
      openCart, closeCart, toggleCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
