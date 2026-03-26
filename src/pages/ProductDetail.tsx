// src/pages/ProductDetail.tsx
// Carrusel de imágenes tipo MercadoLibre:
// miniaturas verticales a la izquierda, imagen grande al centro.

import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { useGetProduct, useListProducts } from "@/hooks/useProducts";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import {
  ShoppingBag, Star, ArrowLeft, Shield, Truck,
  RotateCcw, ImageOff, ChevronUp, ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductDetail() {
  const { id } = useParams();
  const numericId = parseInt(id ?? "0", 10);
  const { data: product, isLoading, error } = useGetProduct(numericId);
  const { data: allProducts } = useListProducts();
  const { addItem, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [imgError, setImgError] = useState<Record<number, boolean>>({});
  const [thumbOffset, setThumbOffset] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedIdx(0);
    setImgError({});
    setThumbOffset(0);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-display mb-4">Producto no encontrado</h1>
        <Link href="/productos" className="text-primary hover:underline uppercase tracking-widest text-sm">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  // Construir lista completa de imágenes: imagen principal + adicionales
  const allImages = [
    ...(product.image ? [product.image] : []),
    ...(Array.isArray(product.images) ? product.images.filter(Boolean) : []),
  ];
  if (allImages.length === 0) allImages.push(""); // placeholder si no hay ninguna

  const currentImage = allImages[selectedIdx] || "";
  const maxQty = Math.min(product.stock, 99);
  const THUMB_VISIBLE = 5; // cuántas miniaturas mostrar a la vez
  const maxOffset = Math.max(0, allImages.length - THUMB_VISIBLE);

  const relatedProducts = (allProducts ?? [])
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const handleAddToCart = () => { addItem(product, quantity); openCart(); };

  const handleImgError = (idx: number) => setImgError(prev => ({ ...prev, [idx]: true }));

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/productos" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft size={16} />Volver al catálogo
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">

          {/* ── Carrusel de imágenes ── */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex gap-3">

              {/* Miniaturas verticales (solo desktop) */}
              {allImages.length > 1 && (
                <div className="hidden md:flex flex-col items-center gap-2 w-16 flex-shrink-0">
                  {/* Flecha arriba */}
                  <button
                    onClick={() => setThumbOffset(o => Math.max(0, o - 1))}
                    disabled={thumbOffset === 0}
                    className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors"
                  >
                    <ChevronUp size={18} />
                  </button>

                  {/* Miniaturas visibles */}
                  <div className="flex flex-col gap-2 overflow-hidden">
                    {allImages.slice(thumbOffset, thumbOffset + THUMB_VISIBLE).map((url, i) => {
                      const realIdx = i + thumbOffset;
                      const hasError = imgError[realIdx];
                      return (
                        <button
                          key={realIdx}
                          onClick={() => setSelectedIdx(realIdx)}
                          className={`w-16 h-16 border-2 flex-shrink-0 overflow-hidden transition-all ${
                            selectedIdx === realIdx
                              ? "border-primary"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          {hasError || !url ? (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <ImageOff size={14} className="text-muted-foreground" strokeWidth={1} />
                            </div>
                          ) : (
                            <img
                              src={url}
                              alt={`${product.name} ${realIdx + 1}`}
                              className="w-full h-full object-cover"
                              onError={() => handleImgError(realIdx)}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Flecha abajo */}
                  <button
                    onClick={() => setThumbOffset(o => Math.min(maxOffset, o + 1))}
                    disabled={thumbOffset >= maxOffset}
                    className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors"
                  >
                    <ChevronDown size={18} />
                  </button>
                </div>
              )}

              {/* Imagen principal grande */}
              <div className="flex-1 aspect-[4/5] bg-muted border border-border overflow-hidden flex items-center justify-center relative">
                <AnimatePresence mode="wait">
                  {imgError[selectedIdx] || !currentImage ? (
                    <motion.div key="placeholder"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-3 text-muted-foreground">
                      <ImageOff size={48} strokeWidth={1} />
                      <span className="text-sm uppercase tracking-widest">Sin imagen</span>
                    </motion.div>
                  ) : (
                    <motion.img
                      key={selectedIdx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      src={currentImage}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={() => handleImgError(selectedIdx)}
                    />
                  )}
                </AnimatePresence>

                {/* Indicador de imagen actual */}
                {allImages.length > 1 && (
                  <div className="absolute bottom-3 right-3 bg-background/70 backdrop-blur-sm px-2 py-1 text-xs text-muted-foreground rounded">
                    {selectedIdx + 1} / {allImages.length}
                  </div>
                )}
              </div>
            </div>

            {/* Miniaturas horizontales en mobile */}
            {allImages.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1 md:hidden">
                {allImages.map((url, idx) => {
                  const hasError = imgError[idx];
                  return (
                    <button key={idx} onClick={() => setSelectedIdx(idx)}
                      className={`w-14 h-14 flex-shrink-0 border-2 overflow-hidden transition-all ${
                        selectedIdx === idx ? "border-primary" : "border-border"
                      }`}>
                      {hasError || !url ? (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <ImageOff size={12} className="text-muted-foreground" strokeWidth={1} />
                        </div>
                      ) : (
                        <img src={url} alt={`${idx + 1}`} className="w-full h-full object-cover"
                          onError={() => handleImgError(idx)} />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* ── Info del producto ── */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col">
            <span className="text-primary text-xs uppercase tracking-[0.3em] font-medium mb-3">{product.category}</span>
            <h1 className="text-3xl md:text-5xl font-display mb-4">{product.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl font-medium">{formatPrice(product.price)}</span>
              <div className="h-4 w-[1px] bg-border" />
              <div className="flex items-center gap-1">
                <Star size={16} className="fill-primary text-primary" />
                <span className="text-sm font-medium">{product.rating}</span>
                <span className="text-sm text-muted-foreground">({product.reviews} reseñas)</span>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-8">{product.description}</p>

            {product.stock > 0
              ? <p className="text-sm text-green-400 mb-6">✓ En stock ({product.stock} disponibles)</p>
              : <p className="text-sm text-red-400 mb-6">✗ Sin stock</p>}

            <div className="space-y-6 mb-10">
              <div className="flex flex-col gap-2">
                <label className="text-sm uppercase tracking-wider font-medium">Cantidad</label>
                <div className="flex items-center w-32 border border-border">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:bg-card transition-colors">
                    -
                  </button>
                  <span className="flex-1 text-center text-sm font-medium">{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(maxQty, q + 1))}
                    disabled={product.stock === 0 || quantity >= maxQty}
                    className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:bg-card transition-colors disabled:opacity-40">
                    +
                  </button>
                </div>
              </div>
              <button onClick={handleAddToCart} disabled={product.stock === 0}
                className="w-full bg-primary text-primary-foreground py-4 uppercase tracking-widest text-sm font-medium flex items-center justify-center gap-3 hover:bg-primary/90 transition-all shadow-[0_4px_20px_rgba(204,153,51,0.2)] hover:shadow-[0_4px_25px_rgba(204,153,51,0.4)] disabled:opacity-50 disabled:cursor-not-allowed">
                <ShoppingBag size={18} />
                {product.stock === 0 ? "Sin Stock" : "Añadir al Carrito"}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 pt-8 border-t border-border mt-auto">
              {[
                { icon: Shield, title: "Certificado de Autenticidad", desc: "Todas las piezas incluyen certificado y garantía." },
                { icon: Truck, title: "Envío Seguro", desc: "Envío asegurado sin costo adicional en 2-4 días." },
                { icon: RotateCcw, title: "Devoluciones", desc: "30 días para cambios o devoluciones." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <Icon className="text-primary mt-1" size={20} />
                  <div>
                    <h4 className="text-sm font-medium uppercase tracking-wider">{title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Productos relacionados */}
        {relatedProducts.length > 0 && (
          <div className="mt-32 pt-16 border-t border-border">
            <h2 className="text-3xl font-display text-center mb-12">También podría gustarte</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProducts.map(p => (
                <Link key={p.id} href={`/producto/${p.id}`} className="group block text-center">
                  <div className="aspect-square bg-muted mb-4 overflow-hidden border border-border flex items-center justify-center">
                    {p.image ? (
                      <img src={p.image} alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    ) : (
                      <ImageOff size={24} className="text-muted-foreground" strokeWidth={1} />
                    )}
                  </div>
                  <h3 className="font-display text-lg mb-1 group-hover:text-primary transition-colors">{p.name}</h3>
                  <p className="text-muted-foreground">{formatPrice(p.price)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
