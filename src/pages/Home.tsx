// src/pages/Home.tsx
import { useListProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/ui/ProductCard";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { data: featuredProducts, isLoading } = useListProducts({ featured: true });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1599643477874-c4ea90b50369?auto=format&fit=crop&w=1920&q=80"
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background z-10" />
        </div>

        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto mt-20">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="text-primary text-xs uppercase tracking-[0.4em] mb-6 block font-medium">
            Colección Exclusiva
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-display text-foreground leading-tight mb-6">
            Elegancia en <br /><span className="gold-gradient-text italic">Cada Detalle</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}
            className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
            Descubre nuestra colección de piezas finamente elaboradas. Arte, precisión y belleza atemporal.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}>
            <Link href="/productos"
              className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 uppercase tracking-widest text-sm font-medium hover:bg-primary/90 transition-all hover:gap-5">
              Explorar Catálogo <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-background border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display mb-4">Nuestras Colecciones</h2>
            <div className="w-16 h-[1px] bg-primary mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { cat: "anillos", label: "Anillos", img: "https://images.unsplash.com/photo-1605100804763-247f67b2548e?auto=format&fit=crop&w=800&q=80" },
              { cat: "collares", label: "Collares", img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=80" },
            ].map(({ cat, label, img }) => (
              <Link key={cat} href={`/productos?category=${cat}`} className="group relative h-96 overflow-hidden bg-card block">
                <img src={img} alt={label} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700" />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
                  <h3 className="text-3xl font-display text-white mb-2">{label}</h3>
                  <span className="text-primary text-sm uppercase tracking-widest border-b border-transparent group-hover:border-primary transition-colors">Ver Piezas</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-display mb-4">Piezas Destacadas</h2>
              <div className="w-16 h-[1px] bg-primary" />
            </div>
            <Link href="/productos" className="hidden sm:flex items-center gap-2 text-sm uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
              Ver Todo <ArrowRight size={16} />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-card border border-white/5 animate-pulse rounded" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {(featuredProducts ?? []).slice(0, 4).map((product, idx) => (
                <ProductCard key={product.id} product={product} index={idx} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=1920&q=80"
            alt="Promo" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60 z-10" />
        </div>
        <div className="relative z-20 max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-display text-white mb-6">El Regalo Perfecto</h2>
          <p className="text-white/80 mb-8 text-lg">Joyería creada para perdurar generaciones.</p>
          <Link href="/productos" className="inline-block bg-white text-black px-8 py-4 uppercase tracking-widest text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors">
            Comprar Ahora
          </Link>
        </div>
      </section>
    </div>
  );
}
