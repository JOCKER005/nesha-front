// src/pages/Catalog.tsx
// FIX: window.location.search no se actualiza de forma reactiva con wouter.
// Usar useSearch() de wouter para leer query params correctamente.

import { useState, useMemo, useEffect } from "react";
import { useSearch } from "wouter";
import { useListProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/ui/ProductCard";
import { Filter, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

type Category = "anillos" | "collares" | "aretes" | "pulseras";
type SortOrder = "featured" | "price-asc" | "price-desc";

const CATEGORIES = [
  { id: "all", label: "Ver Todo" },
  { id: "anillos", label: "Anillos" },
  { id: "collares", label: "Collares" },
  { id: "aretes", label: "Aretes" },
  { id: "pulseras", label: "Pulseras" },
];

export default function Catalog() {
  // useSearch() de wouter devuelve la query string reactiva (ej: "?category=anillos")
  const search = useSearch();
  const params = new URLSearchParams(search);
  const categoryFromUrl = params.get("category") as Category | null;

  const [activeCategory, setActiveCategory] = useState<Category | "all">(categoryFromUrl || "all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("featured");

  // Sincronizar cuando cambia la URL (ej: browser back/forward, links del navbar)
  useEffect(() => {
    const p = new URLSearchParams(search);
    setActiveCategory((p.get("category") as Category) || "all");
  }, [search]);

  const { data: products, isLoading } = useListProducts();

  const filteredProducts = useMemo(() => {
    let result = products ?? [];
    if (activeCategory !== "all") result = result.filter(p => p.category === activeCategory);
    if (sortOrder === "price-asc") return [...result].sort((a, b) => a.price - b.price);
    if (sortOrder === "price-desc") return [...result].sort((a, b) => b.price - a.price);
    return [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }, [products, activeCategory, sortOrder]);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="bg-card border-b border-border py-12 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-display mb-4">Catálogo Completo</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explora nuestra colección. Cada pieza diseñada con atención meticulosa al detalle.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={16} className="text-muted-foreground" />
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as Category | "all")}
                className={`text-sm uppercase tracking-widest px-4 py-2 transition-colors ${
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground border border-border hover:border-foreground/30"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{filteredProducts.length} piezas</span>
            <div className="relative">
              <select
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value as SortOrder)}
                className="appearance-none bg-card border border-border text-foreground text-sm uppercase tracking-widest pl-4 pr-10 py-2 cursor-pointer focus:outline-none focus:border-primary"
              >
                <option value="featured">Destacados</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-card border border-white/5 animate-pulse rounded" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <p className="text-xl font-display mb-2">No hay piezas en esta categoría</p>
            <button onClick={() => setActiveCategory("all")} className="text-primary underline text-sm mt-2">
              Ver todo
            </button>
          </div>
        ) : (
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {filteredProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
