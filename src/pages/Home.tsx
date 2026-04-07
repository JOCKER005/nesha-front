// src/pages/Home.tsx — NESHA Hair Extensions
import { useListProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/ui/ProductCard";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const WA_URL = "https://wa.me/541131904771?text=Hola%2C%20quiero%20info%20sobre%20las%20extensiones%20NESHA";

// ── PALETA UNIFICADA ──────────────────────────────────────────────────────────
// bg-deep:    #0E0510  (fondo global — ciruela muy oscuro)
// bg-surface: #160B1C  (secciones secundarias)
// bg-panel:   #1E1128  (cards / paneles elevados)
// gold-pri:   #D4AF37  (dorado principal)
// gold-sec:   #C5A059  (dorado suave — hover)
// text-hi:    #F5ECD7  (texto primario — crema cálida)
// text-mid:   #C4AEC0  (texto secundario — lila pálido)
// text-lo:    #7A6685  (texto terciario)
// ─────────────────────────────────────────────────────────────────────────────

function WhatsAppButton() {
  return (
    <a href={WA_URL} target="_blank" rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110"
      style={{ background: 'linear-gradient(135deg,#25D366,#128C7E)', boxShadow: '0 4px 24px rgba(37,211,102,0.35)' }}
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
    <div className="min-h-screen" style={{ background: '#0E0510' }}>

      {/* ── HERO ── */}
      <section className="relative min-h-screen overflow-hidden flex">

        {/* Panel izquierdo */}
        <div className="relative z-10 flex flex-col justify-center w-full lg:w-[52%] px-8 sm:px-14 lg:px-20 pt-32 pb-20"
          style={{ background: 'linear-gradient(150deg, #160B1C 0%, #1A0D22 60%, #160B1C 100%)' }}>

          {/* N decorativa */}
          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-display text-[18rem] font-light leading-none select-none pointer-events-none"
            style={{ color: 'rgba(212,175,55,0.04)', letterSpacing: '-0.06em' }}>N</span>

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
            className="flex items-center gap-3 mb-10">
            <div className="w-10 h-px" style={{ background: 'linear-gradient(90deg, #D4AF37, transparent)' }} />
            <span className="text-[10px] font-sans font-medium tracking-[0.55em] uppercase" style={{ color: '#D4AF37' }}>
              Buenos Aires · Argentina
            </span>
          </motion.div>

          {/* Título */}
          <div className="mb-8">
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display font-light italic leading-none mb-1"
              style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)', color: '#C4AEC0', letterSpacing: '0.02em' }}>
              La colección que define tu
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }}
              className="font-display font-light leading-[0.92]"
              style={{ fontSize: 'clamp(4rem, 9vw, 7.5rem)', letterSpacing: '-0.01em', color: '#F5ECD7' }}>
              MEJOR
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.3 }}
              className="font-display font-light leading-[0.92] italic"
              style={{ fontSize: 'clamp(4rem, 9vw, 7.5rem)', letterSpacing: '-0.01em', color: '#D4AF37' }}>
              versión.
            </motion.h1>
          </div>

          {/* Descripción */}
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.45 }}
            className="font-body leading-relaxed mb-10 max-w-sm"
            style={{ color: '#C4AEC0', fontSize: '0.95rem' }}>
            Extensiones 100% cabello humano. Volumen, largo y movimiento que se funden con tu pelo.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.58 }}
            className="flex flex-wrap gap-4 items-center mb-16">
            <Link href="/productos" className="btn-nesha inline-flex items-center gap-3 px-8 py-4 text-xs">
              <span>Ver Colección</span><ArrowRight size={14} />
            </Link>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer"
              className="btn-nesha-outline inline-flex items-center gap-2 px-8 py-4 text-xs">
              <span>Asesoramiento</span>
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.72 }}
            className="flex gap-8"
            style={{ borderTop: '1px solid rgba(212,175,55,0.2)', paddingTop: '1.5rem' }}>
            {[
              { num: '+500', label: 'Clientas felices' },
              { num: '20+', label: 'Tonos disponibles' },
              { num: '100%', label: 'Cabello humano' },
            ].map((s, i) => (
              <div key={i}>
                <p className="font-display text-2xl font-light" style={{ color: '#D4AF37' }}>{s.num}</p>
                <p className="font-sans text-[10px] tracking-[0.18em] uppercase mt-0.5" style={{ color: '#7A6685' }}>{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Panel derecho — imagen sin difuminado excesivo */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.4, delay: 0.2 }}
          className="hidden lg:block absolute right-0 top-0 bottom-0 w-[52%]">
          <img
            src="https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=1000&q=85"
            alt="NESHA Hair Extensions"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: 'center top', opacity: 0.88 }}
          />
          {/* Solo fusiona el borde izquierdo con el panel oscuro */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(90deg, #1A0D22 0%, rgba(26,13,34,0.5) 22%, transparent 52%)',
          }} />
          {/* Sombra inferior mínima */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to top, #0E0510 0%, transparent 18%)',
          }} />

          {/* Badge flotante */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1 }}
            className="absolute bottom-12 right-10 px-6 py-5"
            style={{
              maxWidth: '220px',
              background: 'rgba(14,5,16,0.80)',
              border: '1px solid rgba(212,175,55,0.3)',
              backdropFilter: 'blur(12px)',
            }}>
            <p className="text-[10px] font-sans tracking-[0.3em] uppercase mb-2" style={{ color: '#D4AF37' }}>
              Nueva temporada
            </p>
            <p className="font-display text-xl font-light leading-tight" style={{ color: '#F5ECD7' }}>
              Colección Primavera 2026
            </p>
            <div className="gold-line mt-3 opacity-50" />
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-[26%] hidden lg:flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <div className="w-px h-10" style={{ background: 'linear-gradient(180deg, #D4AF37, transparent)' }} />
        </motion.div>
      </section>

      {/* ── MARQUEE STRIP ── */}
      <div className="overflow-hidden py-4" style={{ background: 'linear-gradient(90deg, #D4AF37, #C5A059)' }}>
        <motion.div
          className="flex gap-0 whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 18, ease: 'linear', repeat: Infinity }}>
          {[...Array(10)].map((_, i) => (
            <span key={i} className="inline-flex items-center gap-6 px-8 font-sans font-semibold text-xs tracking-[0.3em] uppercase"
              style={{ color: '#0E0510' }}>
              Extensiones Premium
              <span style={{ color: 'rgba(14,5,16,0.3)' }}>✦</span>
              Cabello Humano 100%
              <span style={{ color: 'rgba(14,5,16,0.3)' }}>✦</span>
              Buenos Aires
              <span style={{ color: 'rgba(14,5,16,0.3)' }}>✦</span>
              Envíos a Todo el País
              <span style={{ color: 'rgba(14,5,16,0.3)' }}>✦</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── POR QUÉ NESHA ── */}
      <section style={{ background: '#160B1C' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-24 pb-16 border-b"
            style={{ borderColor: 'rgba(212,175,55,0.12)' }}>
            <div>
              <motion.span
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                className="block text-[10px] font-sans tracking-[0.5em] uppercase mb-5"
                style={{ color: '#D4AF37' }}>
                Por qué elegirnos
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="font-display font-light leading-[1.05]"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#F5ECD7' }}>
                Cabello que habla<br />
                <span className="italic" style={{ color: '#D4AF37' }}>por vos.</span>
              </motion.h2>
            </div>
            <div className="flex items-end">
              <motion.p
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                className="font-body leading-relaxed"
                style={{ color: '#C4AEC0', fontSize: '0.95rem', maxWidth: '380px' }}>
                Cada mechón está seleccionado para garantizar suavidad, brillo y durabilidad.
                No vendemos pelo — transformamos cómo te sentís.
              </motion.p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 py-16 gap-0">
            {[
              { num: '01', title: 'Cabello 100% Humano', desc: 'Sin mezclas sintéticas. Podés teñirlo, plancharlo y tratarlo como tu propio cabello.', detail: 'Origen controlado' },
              { num: '02', title: 'Más de 20 Tonos', desc: 'Desde rubios ceniza hasta negros azabache. Te ayudamos a encontrar tu match perfecto.', detail: 'Asesoramiento incluido' },
              { num: '03', title: 'Duración Superior', desc: 'Con el cuidado adecuado, tus extensiones acompañan hasta 12 meses sin perder calidad.', detail: 'Garantía de calidad' },
            ].map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                className="px-8 py-10 group relative"
                style={{ borderLeft: i > 0 ? '1px solid rgba(212,175,55,0.1)' : 'none' }}>
                <span className="absolute top-6 right-6 font-display text-6xl font-light select-none"
                  style={{ color: 'rgba(212,175,55,0.07)', letterSpacing: '-0.04em' }}>{item.num}</span>
                <div className="w-8 h-px mb-8 transition-all duration-500 group-hover:w-16"
                  style={{ background: '#D4AF37' }} />
                <h3 className="font-sans font-semibold text-xs tracking-[0.2em] uppercase mb-4"
                  style={{ color: '#F5ECD7' }}>{item.title}</h3>
                <p className="font-body text-sm leading-relaxed mb-6" style={{ color: '#C4AEC0' }}>{item.desc}</p>
                <span className="text-[10px] font-sans tracking-[0.25em] uppercase" style={{ color: '#D4AF37' }}>{item.detail}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIPOS DE EXTENSIONES ── */}
      <section style={{ background: '#0E0510' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-24">
          <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
            <div>
              <motion.span
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                className="block text-[10px] font-sans tracking-[0.5em] uppercase mb-4"
                style={{ color: '#D4AF37' }}>
                Nuestras Líneas
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="font-display font-light"
                style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)', lineHeight: 1.05, color: '#F5ECD7' }}>
                Encontrá tu<br />
                <span className="italic" style={{ color: '#D4AF37' }}>extensión perfecta.</span>
              </motion.h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Clip — col-span-3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7 }}
              className="md:col-span-3 relative overflow-hidden group"
              style={{ height: '520px', border: '1px solid rgba(212,175,55,0.15)' }}>
              <Link href="/productos?category=clip" className="absolute inset-0">
                <img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80"
                  alt="Clip"
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                  style={{ objectPosition: 'center top', opacity: 0.80 }} />
                {/* Gradiente solo en zona inferior para leer el texto */}
                <div className="absolute inset-0" style={{
                  background: 'linear-gradient(to top, rgba(14,5,16,0.92) 0%, rgba(14,5,16,0.3) 45%, transparent 72%)',
                }} />
                <div className="absolute top-6 left-6">
                  <span className="badge-gold px-3 py-1 text-[9px]">Más vendido</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-10">
                  <p className="font-sans text-[10px] tracking-[0.4em] uppercase mb-3" style={{ color: '#D4AF37' }}>Aplicación en casa</p>
                  <h3 className="font-display font-light text-4xl md:text-5xl leading-tight mb-4" style={{ color: '#F5ECD7' }}>
                    Extensiones<br />de Clip
                  </h3>
                  <p className="font-body text-sm mb-6" style={{ color: '#C4AEC0' }}>Ponelas y sacatelas en minutos. Ideal para uso diario.</p>
                  <span className="inline-flex items-center gap-2 text-xs font-sans tracking-[0.2em] uppercase transition-all group-hover:gap-4" style={{ color: '#D4AF37' }}>
                    Ver colección <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            </motion.div>

            {/* Keratina — col-span-2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}
              className="md:col-span-2 relative overflow-hidden group"
              style={{ height: '520px', border: '1px solid rgba(212,175,55,0.15)' }}>
              <Link href="/productos?category=keratina" className="absolute inset-0">
                <img src="https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=600&q=80"
                  alt="Keratina"
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                  style={{ opacity: 0.80 }} />
                <div className="absolute inset-0" style={{
                  background: 'linear-gradient(to top, rgba(14,5,16,0.92) 0%, rgba(14,5,16,0.25) 45%, transparent 72%)',
                }} />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <p className="font-sans text-[10px] tracking-[0.4em] uppercase mb-3" style={{ color: '#D4AF37' }}>Profesional</p>
                  <h3 className="font-display font-light text-3xl leading-tight mb-4" style={{ color: '#F5ECD7' }}>
                    Keratina<br />&amp; Fusión
                  </h3>
                  <p className="font-body text-sm mb-6" style={{ color: '#C4AEC0' }}>Resultado natural y duradero.</p>
                  <span className="inline-flex items-center gap-2 text-xs font-sans tracking-[0.2em] uppercase transition-all group-hover:gap-4" style={{ color: '#D4AF37' }}>
                    Ver colección <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── PRODUCTOS DESTACADOS ── */}
      <section style={{ background: '#160B1C' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-24">
          <div className="flex justify-between items-end mb-14 flex-wrap gap-6">
            <div>
              <motion.span
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                className="block text-[10px] font-sans tracking-[0.5em] uppercase mb-4"
                style={{ color: '#D4AF37' }}>
                Las favoritas
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="font-display font-light"
                style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', lineHeight: 1.05, color: '#F5ECD7' }}>
                Más vendidas
              </motion.h2>
            </div>
            <Link href="/productos"
              className="inline-flex items-center gap-2 text-xs font-sans tracking-[0.2em] uppercase transition-colors"
              style={{ color: '#C4AEC0' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#D4AF37')}
              onMouseLeave={e => (e.currentTarget.style.color = '#C4AEC0')}>
              Ver todo <ArrowRight size={13} />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[3/4] animate-pulse"
                  style={{ background: '#1E1128', border: '1px solid rgba(212,175,55,0.08)' }} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(featuredProducts ?? []).slice(0, 4).map((product, idx) => (
                <ProductCard key={product.id} product={product} index={idx} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── BANNER CTA ── */}
      <section className="relative overflow-hidden py-36" style={{ background: '#0E0510' }}>
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1600&q=60"
            alt=""
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 30%', opacity: 0.20 }}
          />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(135deg, rgba(14,5,16,0.88) 0%, rgba(30,10,40,0.55) 50%, rgba(14,5,16,0.88) 100%)',
          }} />
        </div>
        <div className="gold-line absolute top-0 left-0 right-0 opacity-25" />
        <div className="gold-line absolute bottom-0 left-0 right-0 opacity-25" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="font-display font-light text-[18rem] leading-none tracking-tighter"
            style={{ color: 'rgba(212,175,55,0.04)' }}>NESHA</span>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <motion.span
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="block text-[10px] font-sans tracking-[0.55em] uppercase mb-6"
            style={{ color: '#D4AF37' }}>
            ¿No sabés cuál elegir?
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="font-display font-light leading-[1.0] mb-3"
            style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', color: '#F5ECD7' }}>
            Te asesoramos
          </motion.h2>
          <motion.h2
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display font-light italic leading-[1.0] mb-10"
            style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', color: '#D4AF37' }}>
            sin costo.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-body mb-12 leading-relaxed mx-auto"
            style={{ color: '#C4AEC0', fontSize: '0.95rem', maxWidth: '420px' }}>
            Contanos tu largo, color y estilo de vida. Te recomendamos la extensión perfecta para vos.
          </motion.p>
          <motion.a
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            href={WA_URL} target="_blank" rel="noopener noreferrer"
            className="btn-nesha inline-flex items-center gap-3 px-10 py-5 text-xs">
            <svg viewBox="0 0 32 32" width="16" height="16" fill="currentColor">
              <path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.472 2.027 7.775L0 32l8.468-2.002A15.93 15.93 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm7.27 21.459c-.398-.199-2.354-1.162-2.719-1.294-.365-.133-.631-.199-.897.199-.266.398-1.031 1.294-1.264 1.56-.232.266-.465.299-.863.1-.398-.199-1.682-.62-3.204-1.977-1.184-1.057-1.983-2.362-2.216-2.76-.232-.398-.025-.613.175-.812.18-.179.398-.465.597-.698.199-.232.266-.398.398-.664.133-.266.066-.498-.033-.697-.1-.199-.897-2.162-1.23-2.96-.324-.778-.653-.673-.897-.686l-.764-.013c-.266 0-.698.1-1.064.498-.365.398-1.396 1.362-1.396 3.325s1.43 3.855 1.629 4.121c.199.266 2.814 4.297 6.818 6.027.953.411 1.697.657 2.277.841.957.305 1.829.262 2.518.159.768-.114 2.354-.962 2.686-1.892.332-.93.332-1.727.232-1.892-.099-.166-.365-.266-.763-.465z"/>
            </svg>
            <span>Hablar con una asesora</span>
          </motion.a>
        </div>
      </section>

      {/* Botón flotante */}
      <WhatsAppButton />
    </div>
  );
}
