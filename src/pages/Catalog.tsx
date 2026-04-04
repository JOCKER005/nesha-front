// src/pages/Catalog.tsx — NESHA Hair Extensions
import { useState, useMemo, useEffect } from "react";
import { useSearch } from "wouter";
import { useListProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/ui/ProductCard";
import { Filter, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

type SortOrder = "featured" | "price-asc" | "price-desc";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface CategoryItem { id: number; name: string; }

function useCategories() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  useEffect(() => {
    fetch(`${BASE_URL}/api/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(e => console.error("Error cargando categorías", e));
  }, []);

  return categories;
}

export default function Catalog() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const categoryFromUrl = params.get("category");

  const [activeCategory, setActiveCategory] = useState<string>(categoryFromUrl || "all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("featured");

  useEffect(() => {
    const p = new URLSearchParams(search);
    setActiveCategory(p.get("category") || "all");
  }, [search]);

  const { data: products, isLoading } = useListProducts();
  const apiCategories = useCategories();

  const CATEGORIES = [
    { id: "all", label: "Ver Todo" },
    ...apiCategories.map(cat => ({
      id: cat.name,
      label: cat.name.charAt(0).toUpperCase() + cat.name.slice(1),
    })),
  ];

  const filteredProducts = useMemo(() => {
    let result = products ?? [];
    if (activeCategory !== "all") result = result.filter(p => p.category === activeCategory);
    if (sortOrder === "price-asc")  return [...result].sort((a, b) => a.price - b.price);
    if (sortOrder === "price-desc") return [...result].sort((a, b) => b.price - a.price);
    return [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }, [products, activeCategory, sortOrder]);

  return (
    <div className="min-h-screen pt-24 pb-20" style={{ background: '#0f0610' }}>

      {/* Header del catálogo */}
      <div className="py-14 mb-10 text-center relative"
        style={{ borderBottom: '1px solid rgba(212,175,55,0.12)' }}>
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center top, rgba(180,30,120,0.1) 0%, transparent 70%)' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <span className="text-xs font-sans tracking-[0.5em] uppercase text-[#D4AF37] block mb-4">
            NESHA Collection
          </span>
          <h1 className="font-display font-light text-5xl md:text-6xl text-white mb-4">
            Catálogo Completo
          </h1>
          <p className="font-body text-[#A69CB0] max-w-xl mx-auto">
            Extensiones 100% cabello humano. Cada pieza seleccionada para realzar tu belleza natural.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={14} className="text-[#A69CB0]" />
            {CATEGORIES.map(cat => (
              <button key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="text-xs font-sans tracking-[0.15em] uppercase px-4 py-2 transition-all duration-200"
                style={{
                  background: activeCategory === cat.id
                    ? 'linear-gradient(135deg,#D4AF37,#C5A059)'
                    : 'transparent',
                  color: activeCategory === cat.id ? '#1a0a12' : '#A69CB0',
                  border: activeCategory === cat.id
                    ? '1px solid transparent'
                    : '1px solid rgba(212,175,55,0.25)',
                  fontWeight: activeCategory === cat.id ? '700' : '400',
                }}>
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-sm text-[#A69CB0]">
            <span className="font-body text-xs">{filteredProducts.length} piezas</span>
            <div className="relative">
              <select value={sortOrder} onChange={e => setSortOrder(e.target.value as SortOrder)}
                className="appearance-none text-xs font-sans tracking-widest uppercase pl-4 pr-10 py-2 cursor-pointer focus:outline-none"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(212,175,55,0.25)',
                  color: '#A69CB0',
                }}>
                <option value="featured">Destacadas</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
              </select>
              <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#A69CB0]" />
            </div>
          </div>
        </div>

        {/* Productos */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[3/4] animate-pulse"
                style={{ background: '#1a0a12', border: '1px solid rgba(212,175,55,0.08)' }} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-2xl text-white mb-3">Sin productos en esta categoría</p>
            <button onClick={() => setActiveCategory("all")}
              className="text-xs font-sans tracking-widest uppercase text-[#D4AF37] hover:text-[#C5A059] transition-colors mt-2">
              Ver todo el catálogo
            </button>
          </div>
        ) : (
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
