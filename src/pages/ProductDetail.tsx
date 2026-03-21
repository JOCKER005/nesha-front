// src/pages/ProductDetail.tsx
// FIX: Imagen principal sin onError fallback — ahora muestra placeholder si falla.
// FIX: Cantidad máxima limitada a min(stock, 99).

import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { useGetProduct, useListProducts } from "@/hooks/useProducts";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag, Star, ArrowLeft, Shield, Truck, RotateCcw, ImageOff } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductDetail() {
  const { id } = useParams();
  const numericId = parseInt(id ?? "0", 10);
  const { data: product, isLoading, error } = useGetProduct(numericId);
  const { data: allProducts } = useListProducts();
  const { addItem, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); setImgError(false); }, [id]);

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

  const maxQty = Math.min(product.stock, 99);
  const relatedProducts = (allProducts ?? []).filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

  const handleAddToCart = () => { addItem(product, quantity); openCart(); };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/productos" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft size={16} />Volver al catálogo
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            {/* FIX: fallback cuando la imagen de Unsplash u otra URL falla */}
            <div className="aspect-[4/5] bg-muted border border-border overflow-hidden flex items-center justify-center">
              {imgError || !product.image ? (
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <ImageOff size={48} strokeWidth={1} />
                  <span className="text-sm uppercase tracking-widest">Sin imagen</span>
                </div>
              ) : (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex flex-col">
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
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:bg-card transition-colors"
                  >-</button>
                  <span className="flex-1 text-center text-sm font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(maxQty, q + 1))}
                    disabled={product.stock === 0 || quantity >= maxQty}
                    className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:bg-card transition-colors disabled:opacity-40"
                  >+</button>
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full bg-primary text-primary-foreground py-4 uppercase tracking-widest text-sm font-medium flex items-center justify-center gap-3 hover:bg-primary/90 transition-all shadow-[0_4px_20px_rgba(204,153,51,0.2)] hover:shadow-[0_4px_25px_rgba(204,153,51,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
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

        {relatedProducts.length > 0 && (
          <div className="mt-32 pt-16 border-t border-border">
            <h2 className="text-3xl font-display text-center mb-12">También podría gustarte</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProducts.map(p => (
                <Link key={p.id} href={`/producto/${p.id}`} className="group block text-center">
                  <div className="aspect-square bg-muted mb-4 overflow-hidden border border-border flex items-center justify-center">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
