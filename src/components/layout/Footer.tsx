import { Instagram, Facebook, Twitter, Lock } from 'lucide-react';
import { Link } from 'wouter';

export default function Footer() {
  return (
    <footer className="bg-background border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          <div className="md:col-span-1">
            <h2 className="text-2xl font-display font-bold tracking-widest gold-gradient-text uppercase mb-4">
              Luxe
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Artesanía exquisita y diseños atemporales. Joyería fina para momentos inolvidables, creada con pasión y precisión.
            </p>
            <div className="flex gap-5">
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={26} />
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook size={26} />
              </a>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={26} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-sans font-semibold tracking-wider text-foreground mb-6 uppercase text-sm">Colecciones</h3>
            <ul className="space-y-4">
              <li><Link href="/productos?category=anillos" className="text-sm text-muted-foreground hover:text-primary transition-colors">Anillos de Compromiso</Link></li>
              <li><Link href="/productos?category=collares" className="text-sm text-muted-foreground hover:text-primary transition-colors">Collares y Gargantillas</Link></li>
              <li><Link href="/productos?category=aretes" className="text-sm text-muted-foreground hover:text-primary transition-colors">Aretes de Diamante</Link></li>
              <li><Link href="/productos?category=pulseras" className="text-sm text-muted-foreground hover:text-primary transition-colors">Pulseras Finas</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-sans font-semibold tracking-wider text-foreground mb-6 uppercase text-sm">Servicios</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Diseño a Medida</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Cuidado de Joyas</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Guía de Tallas</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Envíos y Devoluciones</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-sans font-semibold tracking-wider text-foreground mb-6 uppercase text-sm">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Suscríbete para recibir noticias sobre nuevas colecciones y ofertas exclusivas.
            </p>
            <form className="flex mt-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="bg-card border border-border px-4 py-2 text-sm w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 text-foreground"
              />
              <button className="bg-primary text-primary-foreground px-4 py-2 text-sm font-medium uppercase tracking-wider hover:bg-primary/90 transition-colors">
                Unirse
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Luxe Joyería. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground">Términos de Servicio</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground">Política de Privacidad</a>
            <Link href="/first" className="text-muted-foreground/20 hover:text-muted-foreground/60 transition-colors" title="Acceso interno">
              <Lock size={12} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
