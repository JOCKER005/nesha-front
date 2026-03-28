import { useState } from "react";
import { Link } from "wouter";
import { ShoppingBag, ImageOff } from "lucide-react";
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
  const [isHovered, setIsHovered] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
    openCart();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/producto/${product.id}`} className="block">
        {/* Imagen con glow dorado en hover */}
        <div
          className="relative aspect-[3/4] overflow-hidden transition-all duration-500"
          style={{
            background: '#24123D',
            border: isHovered
              ? '1px solid rgba(212,175,55,0.5)'
              : '1px solid rgba(212,175,55,0.12)',
            boxShadow: isHovered
              ? '0 0 35px rgba(212,175,55,0.25), 0 0 70px rgba(212,175,55,0.1)'
              : '0 4px 20px rgba(0,0,0,0.4)',
            transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
          }}
        >
          {imgError || !product.image ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-[#A69CB0]">
              <ImageOff size={32} strokeWidth={1} />
              <span className="text-xs font-sans uppercase tracking-widest">Sin imagen</span>
            </div>
          ) : (
            <img
              src={product.image}
              alt={product.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-700"
              style={{ transform: isHovered ? 'scale(1.06)' : 'scale(1)' }}
            />
          )}

          {/* Badge MÁS VENDIDO */}
          {product.featured && (
            <span className="absolute top-3 left-3 badge-gold">
              Más Vendido
            </span>
          )}

          {/* Sin stock overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center"
              style={{ background: 'rgba(15,6,16,0.7)' }}>
              <span className="text-xs font-sans uppercase tracking-[0.2em] text-[#A69CB0] border border-[#A69CB0]/40 px-4 py-2">
                Sin Stock
              </span>
            </div>
          )}

          {/* Quick add — aparece en hover */}
          <motion.div
            initial={false}
            animate={{ y: isHovered ? 0 : '100%' }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="absolute bottom-0 left-0 right-0"
          >
            <button
              onClick={handleAdd}
              disabled={product.stock === 0}
              className="w-full py-3.5 text-xs font-sans font-semibold tracking-[0.18em] uppercase flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              style={{ background: 'linear-gradient(135deg,#D4AF37,#C5A059)', color: '#1a0a12' }}
            >
              <ShoppingBag size={14} />
              Agregar al carrito
            </button>
          </motion.div>
        </div>

        {/* Info del producto */}
        <div className="mt-4 space-y-1.5 px-0.5">
          <p className="text-[10px] font-sans tracking-[0.2em] uppercase text-[#A69CB0]">
            {product.category}
          </p>
          <h3 className="font-display text-lg leading-snug text-white transition-colors duration-300"
            style={{ color: isHovered ? '#D4AF37' : 'white' }}>
            {product.name}
          </h3>
          <div className="flex items-center justify-between pt-1">
            <span className="font-sans font-semibold text-[#D4AF37] tabular-nums">
              {formatPrice(product.price)}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-[#D4AF37] text-xs">★</span>
              <span className="text-xs font-body text-[#A69CB0]">{product.rating}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
