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

// Limita la cantidad al stock real del producto (o 99 si no tiene stock definido)
function maxQty(product: Product): number {
  if (product.stock !== undefined && product.stock !== null && product.stock >= 0) {
    return Math.min(product.stock, MAX_QTY_PER_ITEM);
  }
  return MAX_QTY_PER_ITEM;
}

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
    if (product.stock === 0) return; // Sin stock, no agregar
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      const limit = maxQty(product);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, limit);
        return prev.map(i =>
          i.product.id === product.id ? { ...i, quantity: newQty } : i
        );
      }
      return [...prev, { product, quantity: Math.min(quantity, limit) }];
    });
  };

  const removeItem = (productId: number) =>
    setItems(prev => prev.filter(i => i.product.id !== productId));

  const updateQuantity = (productId: number, quantity: number) => {
    setItems(prev => {
      const item = prev.find(i => i.product.id === productId);
      const limit = item ? maxQty(item.product) : MAX_QTY_PER_ITEM;
      const clamped = Math.max(0, Math.min(quantity, limit));
      if (clamped === 0) return prev.filter(i => i.product.id !== productId);
      return prev.map(i => (i.product.id === productId ? { ...i, quantity: clamped } : i));
    });
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
