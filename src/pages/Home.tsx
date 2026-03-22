// src/pages/Home.tsx
import { useListProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/ui/ProductCard";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

// WhatsApp número Argentina: 54 11 3190 4771
const WA_URL = "https://wa.me/541131904771?text=Hola%2C%20me%20interesa%20una%20pieza%20de%20Luxe%20Joyer%C3%ADa";

function WhatsAppButton() {
  return (
    <a
      href={WA_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      style={{ backgroundColor: "#25D366" }}
      aria-label="Contactar por WhatsApp"
    >
      {/* WhatsApp SVG oficial */}
      <svg viewBox="0 0 32 32" width="30" height="30" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.472 2.027 7.775L0 32l8.468-2.002A15.93 15.93 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 01-6.771-1.849l-.486-.29-5.026 1.188 1.21-4.898-.317-.503A13.24 13.24 0 012.667 16C2.667 8.637 8.637 2.667 16 2.667S29.333 8.637 29.333 16 23.363 29.333 16 29.333zm7.27-9.874c-.398-.199-2.354-1.162-2.719-1.294-.365-.133-.631-.199-.897.199-.266.398-1.031 1.294-1.264 1.56-.232.266-.465.299-.863.1-.398-.199-1.682-.62-3.204-1.977-1.184-1.057-1.983-2.362-2.216-2.76-.232-.398-.025-.613.175-.812.18-.179.398-.465.597-.698.199-.232.266-.398.398-.664.133-.266.066-.498-.033-.697-.1-.199-.897-2.162-1.23-2.96-.324-.778-.653-.673-.897-.686l-.764-.013c-.266 0-.698.1-1.064.498-.365.398-1.396 1.362-1.396 3.325s1.43 3.855 1.629 4.121c.199.266 2.814 4.297 6.818 6.027.953.411 1.697.657 2.277.841.957.305 1.829.262 2.518.159.768-.114 2.354-.962 2.686-1.892.332-.93.332-1.727.232-1.892-.099-.166-.365-.266-.763-.465z"/>
      </svg>
    </a>
  );
}

export default function Home() {
  const { data: featuredProducts, isLoading } = useListProducts({ featured: true });

  return (
    <div className="min-h-screen">

      {/* Hero — fondo oscuro sin imagen */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-zinc-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,162,39,0.05)_0%,transparent_60%)]" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
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
                <img src={img} alt={label} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
                  onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
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
      <section className="py-24 bg-gradient-to-b from-white via-zinc-100 to-zinc-200">
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
            alt="" role="presentation" className="w-full h-full object-cover"
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
          <div className="absolute inset-0 bg-white/15 z-10" />
        </div>
        <div className="relative z-20 max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-display text-white mb-6">El Regalo Perfecto</h2>
          <p className="text-white/80 mb-8 text-lg">Joyería creada para perdurar generaciones.</p>
          <Link href="/productos" className="inline-block bg-white text-black px-8 py-4 uppercase tracking-widest text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors">
            Comprar Ahora
          </Link>
        </div>
      </section>

      {/* Botón flotante de WhatsApp */}
      <WhatsAppButton />
    </div>
  );
}
