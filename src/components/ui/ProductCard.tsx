// src/components/ui/ProductCard.tsx
// FIX #12: cantidad máxima limitada a Math.min(stock, 99) en el quick-add
// FIX #13: imagen con fallback placeholder si la URL falla

import { useState } from "react";
import { Link } from "wouter";
import { ShoppingBag, Star, ImageOff } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/api";

interface Props {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: Props) {
  const { addItem, openCart } = useCart();
  const [imgError, setImgError] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
    openCart();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group relative"
    >
      <Link href={`/producto/${product.id}`} className="block">
        {/* Image */}
        <div className="relative aspect-[4/5] bg-zinc-900 border border-zinc-800 overflow-hidden">
          {imgError || !product.image ? (
            /* FIX #13: placeholder cuando la imagen no carga */
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground bg-muted">
              <ImageOff size={32} strokeWidth={1} />
              <span className="text-xs uppercase tracking-widest">Sin imagen</span>
            </div>
          ) : (
            <img
              src={product.image}
              alt={product.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          )}

          {product.featured && (
            <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] uppercase tracking-widest px-2 py-1 font-medium">
              Destacado
            </span>
          )}

          {product.stock === 0 && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <span className="text-sm uppercase tracking-widest text-muted-foreground border border-border px-4 py-2 bg-background/80">
                Sin Stock
              </span>
            </div>
          )}

          {/* Quick add */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAdd}
              disabled={product.stock === 0}
              className="w-full bg-primary text-primary-foreground py-3 text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={14} />
              Añadir al carrito
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="mt-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">{product.category}</p>
          <h3 className="font-display text-lg leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center justify-between pt-1">
            <span className="text-primary font-medium">{formatPrice(product.price)}</span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star size={12} className="fill-primary text-primary" />
              <span>{product.rating}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
