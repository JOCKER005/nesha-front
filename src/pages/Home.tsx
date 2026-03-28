// src/pages/Home.tsx — NESHA Hair Extensions
import { useListProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/ui/ProductCard";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const WA_URL = "https://wa.me/541131904771?text=Hola%2C%20quiero%20info%20sobre%20las%20extensiones%20NESHA";

function WhatsAppButton() {
  return (
    <a href={WA_URL} target="_blank" rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110"
      style={{
        background: 'linear-gradient(135deg,#25D366,#128C7E)',
        boxShadow: '0 4px 20px rgba(37,211,102,0.4)',
      }}
      aria-label="WhatsApp NESHA">
      <svg viewBox="0 0 32 32" width="28" height="28" fill="white">
        <path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.472 2.027 7.775L0 32l8.468-2.002A15.93 15.93 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm7.27 21.459c-.398-.199-2.354-1.162-2.719-1.294-.365-.133-.631-.199-.897.199-.266.398-1.031 1.294-1.264 1.56-.232.266-.465.299-.863.1-.398-.199-1.682-.62-3.204-1.977-1.184-1.057-1.983-2.362-2.216-2.76-.232-.398-.025-.613.175-.812.18-.179.398-.465.597-.698.199-.232.266-.398.398-.664.133-.266.066-.498-.033-.697-.1-.199-.897-2.162-1.23-2.96-.324-.778-.653-.673-.897-.686l-.764-.013c-.266 0-.698.1-1.064.498-.365.398-1.396 1.362-1.396 3.325s1.43 3.855 1.629 4.121c.199.266 2.814 4.297 6.818 6.027.953.411 1.697.657 2.277.841.957.305 1.829.262 2.518.159.768-.114 2.354-.962 2.686-1.892.332-.93.332-1.727.232-1.892-.099-.166-.365-.266-.763-.465z"/>
      </svg>
    </a>
  );
}

export default function Home() {
  const { data: featuredProducts, isLoading } = useListProducts({ featured: true });

  return (
    <div className="min-h-screen">

      {/* ── Hero ── */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Fondo: costados púrpura, centro oscuro */}
        <div className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, #0a0308 0%, #0f0610 30%, #2a0a35 65%, #3a0a40 100%)',
          }} />
        {/* Oscuridad extra en el centro */}
        <div className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.55) 0%, transparent 55%)',
          }} />
        {/* Partículas decorativas */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 3 + 1,
                height: Math.random() * 3 + 1,
                background: '#D4AF37',
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
                opacity: 0.3,
              }}
              animate={{ y: [-10, 10, -10], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>
        {/* Líneas decorativas diagonales */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-5">
          <div className="absolute top-1/4 left-0 w-full h-px"
            style={{ background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)' }} />
          <div className="absolute top-3/4 left-0 w-full h-px"
            style={{ background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)' }} />
        </div>

        {/* Contenido hero */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}
            className="block text-xs font-sans font-medium tracking-[0.5em] uppercase mb-6"
            style={{ color: '#D4AF37' }}>
            Colección Premium
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }}
            className="font-display font-light text-white leading-[1.05] mb-6"
            style={{ fontSize: 'clamp(3rem, 8vw, 6.5rem)' }}>
            La Esencia de tu<br />
            <span className="italic gold-gradient-text">Belleza Natural</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.4 }}
            className="font-body text-lg mb-10 max-w-lg mx-auto"
            style={{ color: '#A69CB0' }}>
            Extensiones 100% cabello humano. Diseñadas para transformar, pensadas para durar.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.6 }}>
            <Link href="/productos"
              className="btn-nesha inline-flex items-center gap-3 px-10 py-4 text-sm">
              <span>Explorar Catálogo</span>
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <div className="w-px h-12 mx-auto"
            style={{ background: 'linear-gradient(180deg, #D4AF37, transparent)' }} />
        </motion.div>
      </section>

      {/* ── Por qué NESHA ── */}
      <section className="py-24" style={{ background: '#0f0610' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: "✦", title: "Cabello 100% Humano", desc: "Sin mezclas sintéticas. Solo cabello humano de la más alta calidad." },
              { icon: "✦", title: "Tonos Naturales", desc: "Más de 20 tonos disponibles para combinar perfecto con tu color natural." },
              { icon: "✦", title: "Duración Superior", desc: "Con el cuidado adecuado, tus extensiones duran hasta 12 meses." },
            ].map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="p-8 group"
                style={{ border: '1px solid rgba(212,175,55,0.12)', background: 'rgba(212,175,55,0.03)' }}>
                <span className="block text-3xl text-[#D4AF37] mb-4 font-display">{item.icon}</span>
                <h3 className="font-sans font-semibold text-sm tracking-[0.15em] uppercase text-white mb-3">
                  {item.title}
                </h3>
                <p className="font-body text-sm leading-relaxed text-[#A69CB0]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tipos de extensiones ── */}
      <section className="py-24" style={{ background: '#12060f' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-sans tracking-[0.4em] uppercase text-[#D4AF37] block mb-4">
              Nuestras Líneas
            </span>
            <h2 className="font-display font-light text-4xl md:text-5xl text-white mb-4">
              Encontrá Tu Extensión Perfecta
            </h2>
            <div className="gold-line max-w-[120px] mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                cat: "clip",
                label: "Extensiones de Clip",
                desc: "Aplicación y remoción sin salón. Ideales para uso diario.",
                img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
              },
              {
                cat: "keratina",
                label: "Keratina & Fusion",
                desc: "Resultado natural y duradero. Aplicación profesional.",
                img: "https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=800&q=80",
              },
            ].map(({ cat, label, desc, img }) => (
              <Link key={cat} href={`/productos?category=${cat}`}
                className="group relative h-80 overflow-hidden block"
                style={{ border: '1px solid rgba(212,175,55,0.15)' }}>
                <img src={img} alt={label}
                  className="w-full h-full object-cover opacity-50 transition-all duration-700 group-hover:opacity-70 group-hover:scale-105"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                {/* Overlay magenta */}
                <div className="absolute inset-0 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(to top, rgba(26,8,18,0.9) 0%, rgba(26,8,18,0.3) 100%)' }} />
                {/* Glow dorado en hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ boxShadow: 'inset 0 0 40px rgba(212,175,55,0.1)' }} />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="font-display text-2xl md:text-3xl text-white mb-2">{label}</h3>
                  <p className="font-body text-sm text-[#A69CB0] mb-4">{desc}</p>
                  <span className="text-xs font-sans tracking-[0.2em] uppercase text-[#D4AF37] flex items-center gap-2 group-hover:gap-4 transition-all">
                    Ver colección <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Productos Destacados ── */}
      <section className="py-24" style={{ background: '#0f0610' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-14">
            <div>
              <span className="text-xs font-sans tracking-[0.4em] uppercase text-[#D4AF37] block mb-3">
                Más Vendidos
              </span>
              <h2 className="font-display font-light text-4xl md:text-5xl text-white">
                Las Favoritas de NESHA
              </h2>
            </div>
            <Link href="/productos"
              className="hidden sm:flex items-center gap-2 text-xs font-sans tracking-[0.18em] uppercase text-[#A69CB0] hover:text-[#D4AF37] transition-colors">
              Ver Todo <ArrowRight size={14} />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[3/4] animate-pulse"
                  style={{ background: '#1a0a12', border: '1px solid rgba(212,175,55,0.1)' }} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(featuredProducts ?? []).slice(0, 4).map((product, idx) => (
                <ProductCard key={product.id} product={product} index={idx} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Banner CTA ── */}
      <section className="py-28 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a0820 0%, #2d0535 50%, #1a0820 100%)' }}>
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.08) 0%, transparent 70%)' }} />
        <div className="gold-line absolute top-0 left-0 right-0" />
        <div className="gold-line absolute bottom-0 left-0 right-0" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <span className="text-xs font-sans tracking-[0.5em] uppercase text-[#D4AF37] block mb-6">
            ¿No sabés cuál elegir?
          </span>
          <h2 className="font-display font-light text-4xl md:text-6xl text-white mb-6 leading-tight">
            Te Asesoramos<br />
            <span className="italic gold-gradient-text">Sin Costo</span>
          </h2>
          <p className="font-body text-[#A69CB0] mb-10 text-lg">
            Contanos tu largo, color y estilo de vida. Te recomendamos la extensión perfecta.
          </p>
          <a href={WA_URL} target="_blank" rel="noopener noreferrer"
            className="btn-nesha inline-flex items-center gap-3 px-10 py-4 text-sm">
            <svg viewBox="0 0 32 32" width="18" height="18" fill="currentColor">
              <path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.472 2.027 7.775L0 32l8.468-2.002A15.93 15.93 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm7.27 21.459c-.398-.199-2.354-1.162-2.719-1.294-.365-.133-.631-.199-.897.199-.266.398-1.031 1.294-1.264 1.56-.232.266-.465.299-.863.1-.398-.199-1.682-.62-3.204-1.977-1.184-1.057-1.983-2.362-2.216-2.76-.232-.398-.025-.613.175-.812.18-.179.398-.465.597-.698.199-.232.266-.398.398-.664.133-.266.066-.498-.033-.697-.1-.199-.897-2.162-1.23-2.96-.324-.778-.653-.673-.897-.686l-.764-.013c-.266 0-.698.1-1.064.498-.365.398-1.396 1.362-1.396 3.325s1.43 3.855 1.629 4.121c.199.266 2.814 4.297 6.818 6.027.953.411 1.697.657 2.277.841.957.305 1.829.262 2.518.159.768-.114 2.354-.962 2.686-1.892.332-.93.332-1.727.232-1.892-.099-.166-.365-.266-.763-.465z"/>
            </svg>
            <span>Asesoramiento por WhatsApp</span>
          </a>
        </div>
      </section>

      {/* Botón flotante */}
      <WhatsAppButton />
    </div>
  );
}
