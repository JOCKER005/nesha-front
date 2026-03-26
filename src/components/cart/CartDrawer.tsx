// src/components/cart/CartDrawer.tsx
// FIX: El botón + en el drawer no tenía cap de cantidad máxima.
//      Ahora usa updateQuantity del context que ya aplica el límite de 99.
// FEAT: Botones de WhatsApp — Finalizar por WA y Retiro en tienda.

import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import { X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

// ── WhatsApp config ──────────────────────────────────────────────────────────
const WA_NUMBER = "5492805062950";

function buildWhatsAppURL(
  items: { product: { name: string; price: number }; quantity: number }[],
  total: number
) {
  const lines = items.map(
    (i) => `• ${i.product.name} x${i.quantity} — ${formatPrice(i.product.price * i.quantity)}`
  );
  const message =
    `Hola! Quiero finalizar mi compra en Luxe Joyería 🛒\n\n` +
    `*Pedido:*\n${lines.join("\n")}\n\n` +
    `*Total: ${formatPrice(total)}*\n\n` +
    `Consulto disponibilidad y formas de pago. ¡Gracias!`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

function buildWhatsAppPickupURL(
  items: { product: { name: string; price: number }; quantity: number }[],
  total: number
) {
  const lines = items.map(
    (i) => `• ${i.product.name} x${i.quantity} — ${formatPrice(i.product.price * i.quantity)}`
  );
  const message =
    `Hola! Quiero retirar mi pedido en tienda 🏪\n\n` +
    `*Pedido:*\n${lines.join("\n")}\n\n` +
    `*Total: ${formatPrice(total)}*\n\n` +
    `¿Cuándo puedo pasar a buscarlo? ¡Gracias!`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

// ── WhatsApp SVG icon ────────────────────────────────────────────────────────
function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// ── Component ────────────────────────────────────────────────────────────────
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
                  {items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      className="flex gap-4 pb-4 border-b border-border/50 last:border-0"
                    >
                      <div className="w-20 h-20 bg-muted border border-border flex-shrink-0 overflow-hidden flex items-center justify-center">
                        {item.product.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
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
              <div className="px-6 py-5 border-t border-border space-y-3 bg-card/50">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-muted-foreground text-sm">Subtotal</span>
                  <span className="font-display text-lg text-primary">{formatPrice(cartTotal)}</span>
                </div>

                {/* Botón Mercado Pago */}
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="block w-full bg-primary text-primary-foreground text-center py-3.5 uppercase tracking-widest text-sm font-medium hover:bg-primary/90 transition-colors shadow-[0_4px_20px_rgba(204,153,51,0.25)]"
                >
                  Finalizar Compra
                </Link>

                {/* Divisor */}
                <div className="flex items-center gap-3 py-0.5">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground uppercase tracking-widest">o también</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* WhatsApp — compra online */}
                <a
                  href={buildWhatsAppURL(items, cartTotal)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-center py-3.5 uppercase tracking-widest text-sm font-medium transition-colors"
                >
                  <WhatsAppIcon size={17} />
                  Finalizar por WhatsApp
                </a>

                {/* WhatsApp — retiro en tienda */}
                <a
                  href={buildWhatsAppPickupURL(items, cartTotal)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full border border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10 text-center py-3 uppercase tracking-widest text-xs font-medium transition-colors"
                >
                  <WhatsAppIcon size={15} />
                  Retiro en Tienda
                </a>

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
