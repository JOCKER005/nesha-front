import { Instagram, Facebook, Lock } from 'lucide-react';
import { Link } from 'wouter';

// Ícono TikTok SVG
function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.05a8.16 8.16 0 004.77 1.52V7.12a4.85 4.85 0 01-1-.43z"/>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer style={{ background: '#fce8f4', borderTop: '1px solid rgba(212,175,55,0.35)' }}
      className="pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Logo central */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-display font-light tracking-[0.4em] gold-gradient-text uppercase mb-2">
            NESHA
          </h2>
          <p className="text-xs font-sans tracking-[0.4em] text-[#7a3060] uppercase mb-4">
            Hair Extensions Premium
          </p>
          <div className="gold-line max-w-xs mx-auto opacity-50" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Sobre NESHA */}
          <div>
            <p className="text-sm font-body text-[#7a3060] leading-relaxed mb-6">
              Extensiones de cabello 100% humano. Porque tu belleza natural merece lo mejor.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"
                className="text-[#7a3060] hover:text-[#D4AF37] transition-colors">
                <Instagram size={22} />
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"
                className="text-[#7a3060] hover:text-[#D4AF37] transition-colors">
                <Facebook size={22} />
              </a>
              <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer"
                className="text-[#7a3060] hover:text-[#D4AF37] transition-colors">
                <TikTokIcon size={22} />
              </a>
            </div>
          </div>

          {/* Nuestras Texturas */}
          <div>
            <h3 className="font-sans font-semibold text-xs tracking-[0.2em] uppercase text-[#D4AF37] mb-5">
              Nuestras Texturas
            </h3>
            <ul className="space-y-3">
              {["Liso Natural", "Ondulado Suave", "Rizado Definido", "Body Wave"].map(t => (
                <li key={t}>
                  <Link href="/productos" className="text-sm font-body text-[#7a3060] hover:text-[#D4AF37] transition-colors">
                    {t}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cuidado del Cabello */}
          <div>
            <h3 className="font-sans font-semibold text-xs tracking-[0.2em] uppercase text-[#D4AF37] mb-5">
              Cuidado del Cabello
            </h3>
            <ul className="space-y-3">
              {["Guía de Tonos", "Métodos de Aplicación", "Mantenimiento", "Envíos y Devoluciones"].map(t => (
                <li key={t}>
                  <a href="#" className="text-sm font-body text-[#7a3060] hover:text-[#D4AF37] transition-colors">
                    {t}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-sans font-semibold text-xs tracking-[0.2em] uppercase text-[#D4AF37] mb-5">
              Club NESHA
            </h3>
            <p className="text-sm font-body text-[#7a3060] mb-4">
              Recibí novedades, tips y ofertas exclusivas.
            </p>
            <form className="flex" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="Tu correo"
                className="flex-1 bg-white text-sm font-body text-[#3d1040] placeholder:text-[#7a3060]/50 px-3 py-2.5 focus:outline-none"
                style={{ border: '1px solid rgba(212,175,55,0.4)', borderRight: 'none' }} />
              <button
                className="btn-nesha px-4 py-2.5 text-xs font-sans font-semibold tracking-widest uppercase flex items-center">
                <span>Unirse</span>
              </button>
            </form>
          </div>
        </div>

        {/* Iconos diferenciales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 py-8"
          style={{ borderTop: '1px solid rgba(212,175,55,0.3)', borderBottom: '1px solid rgba(212,175,55,0.3)' }}>
          {[
            { icon: "✦", label: "Cabello 100% Humano" },
            { icon: "✦", label: "Envío Gratis" },
            { icon: "✦", label: "Garantía de Calidad" },
            { icon: "✦", label: "Asesoramiento Personalizado" },
          ].map(item => (
            <div key={item.label} className="flex flex-col items-center text-center gap-2">
              <span className="text-[#D4AF37] text-xl font-display">{item.icon}</span>
              <span className="text-xs font-sans tracking-widest uppercase text-[#7a3060]">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-body text-[#7a3060]/60">
            &copy; {new Date().getFullYear()} NESHA Hair Extensions. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs font-body text-[#7a3060]/60 hover:text-[#7a3060] transition-colors">
              Términos
            </a>
            <a href="#" className="text-xs font-body text-[#7a3060]/60 hover:text-[#7a3060] transition-colors">
              Privacidad
            </a>
            <Link href="/first"
              className="text-[#7a3060]/15 hover:text-[#7a3060]/40 transition-colors"
              title="Acceso interno">
              <Lock size={11} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
