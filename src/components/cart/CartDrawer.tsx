// src/components/cart/CartDrawer.tsx
// FIX: El botón + en el drawer no tenía cap de cantidad máxima.
//      Ahora usa updateQuantity del context que ya aplica el límite de 99.

import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import { X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

export default function CartDrawer() {
  const { isOpen, closeCart, items, removeItem, updateQuantity, cartTotal, itemsCount } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={closeCart}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-background border-l border-border z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-primary" />
                <h2 className="font-display text-xl tracking-wide">Tu Carrito</h2>
                {itemsCount > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {itemsCount}
                  </span>
                )}
              </div>
              <button onClick={closeCart} className="text-muted-foreground hover:text-foreground transition-colors p-1">
                <X size={22} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <ShoppingBag size={48} className="text-muted-foreground/30" />
                  <p className="text-muted-foreground font-display text-xl">Tu carrito está vacío</p>
                  <button onClick={closeCart} className="text-sm text-primary underline underline-offset-4">
                    Seguir explorando
                  </button>
                </div>
              ) : (
                <AnimatePresence>
                  {items.map(item => (
                    <motion.div
                      key={item.product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      className="flex gap-4 pb-4 border-b border-border/50 last:border-0"
                    >
                      {/* Imagen con fallback */}
                      <div className="w-20 h-20 bg-muted border border-border flex-shrink-0 overflow-hidden flex items-center justify-center">
                        {item.product.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                          />
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium line-clamp-2 leading-snug">{item.product.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1 capitalize">{item.product.category}</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-border">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
                              aria-label="Reducir cantidad"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-card transition-colors disabled:opacity-40"
                              // El cap de 99 lo aplica updateQuantity en cart-context
                              disabled={item.quantity >= 99}
                              aria-label="Aumentar cantidad"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <p className="text-primary text-sm font-medium">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors self-start mt-1"
                        aria-label="Eliminar producto"
                      >
                        <Trash2 size={15} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-border space-y-4 bg-card/50">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Subtotal</span>
                  <span className="font-display text-lg text-primary">{formatPrice(cartTotal)}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="block w-full bg-primary text-primary-foreground text-center py-4 uppercase tracking-widest text-sm font-medium hover:bg-primary/90 transition-colors shadow-[0_4px_20px_rgba(204,153,51,0.25)]"
                >
                  Finalizar Compra
                </Link>
                <button
                  onClick={closeCart}
                  className="block w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                >
                  Seguir comprando
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
