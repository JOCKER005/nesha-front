import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useRouter } from 'wouter';
import { ShoppingBag, Menu, X, Search } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { useListProducts } from '@/hooks/useProducts';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [location] = useLocation();
  const router = useRouter();
  const { toggleCart, itemsCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: allProducts } = useListProducts();

  // Filtrar productos según la búsqueda
  const searchResults = searchQuery.trim().length >= 2
    ? (allProducts ?? []).filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar búsqueda al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus al input cuando se abre
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  // Cerrar búsqueda al cambiar de página
  useEffect(() => {
    setSearchOpen(false);
    setSearchQuery('');
  }, [location]);

  const handleSelectProduct = (id: number) => {
    setSearchOpen(false);
    setSearchQuery('');
    window.location.href = `/producto/${id}`;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      setSearchQuery('');
      window.location.href = `/productos?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Catálogo', href: '/productos' },
    { name: 'Anillos', href: '/productos?category=anillos' },
    { name: 'Collares', href: '/productos?category=collares' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 w-full z-40 transition-all duration-500',
        isScrolled || location !== '/'
          ? 'bg-background/90 backdrop-blur-md border-b border-white/5 py-4'
          : 'bg-transparent py-6'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">

          {/* Mobile Menu Button */}
          <div className="flex-1 flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-foreground/80 hover:text-primary transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-1 gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-sm font-medium tracking-widest uppercase transition-colors hover:text-primary",
                  location === link.href ? "text-primary" : "text-foreground/80"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Logo */}
          <div className="flex-shrink-0 text-center">
            <Link href="/" className="group inline-block">
              <h1 className="text-3xl font-display font-bold tracking-widest gold-gradient-text uppercase">
                Luxe
              </h1>
              <span className="text-[10px] tracking-[0.3em] text-foreground/60 uppercase block -mt-1 group-hover:text-primary/80 transition-colors">
                Joyería
              </span>
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex-1 flex justify-end items-center gap-6">

            {/* Search */}
            <div ref={searchRef} className="relative hidden sm:block">
              <button
                onClick={() => setSearchOpen(v => !v)}
                className="text-foreground/80 hover:text-primary transition-colors"
              >
                <Search size={20} strokeWidth={1.5} />
              </button>

              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-10 w-80 bg-card border border-border shadow-2xl z-50"
                  >
                    <form onSubmit={handleSearchSubmit}>
                      <div className="flex items-center border-b border-border px-4">
                        <Search size={16} className="text-muted-foreground flex-shrink-0" />
                        <input
                          ref={inputRef}
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          placeholder="Buscar joyas..."
                          className="w-full bg-transparent px-3 py-3 text-sm focus:outline-none text-foreground placeholder:text-muted-foreground"
                        />
                        {searchQuery && (
                          <button type="button" onClick={() => setSearchQuery('')}
                            className="text-muted-foreground hover:text-foreground">
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    </form>

                    {/* Resultados */}
                    {searchQuery.trim().length >= 2 && (
                      <div>
                        {searchResults.length === 0 ? (
                          <p className="text-center text-muted-foreground text-sm py-6">
                            Sin resultados para "{searchQuery}"
                          </p>
                        ) : (
                          <div>
                            {searchResults.map(product => (
                              <button
                                key={product.id}
                                onClick={() => handleSelectProduct(product.id)}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-background/60 transition-colors text-left border-b border-border/50 last:border-0"
                              >
                                <div className="w-10 h-10 bg-muted border border-border flex-shrink-0 overflow-hidden">
                                  {product.image && (
                                    <img src={product.image} alt={product.name}
                                      className="w-full h-full object-cover"
                                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                                  <p className="text-xs text-muted-foreground capitalize">{product.category}</p>
                                </div>
                                <span className="text-primary text-sm font-medium flex-shrink-0">
                                  {formatPrice(product.price)}
                                </span>
                              </button>
                            ))}
                            {searchResults.length === 6 && (
                              <button
                                onClick={handleSearchSubmit as any}
                                className="w-full text-center text-xs text-primary py-3 hover:bg-background/40 transition-colors uppercase tracking-widest"
                              >
                                Ver todos los resultados
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {searchQuery.trim().length < 2 && searchQuery.trim().length > 0 && (
                      <p className="text-center text-muted-foreground text-xs py-4">
                        Escribí al menos 2 caracteres
                      </p>
                    )}

                    {searchQuery.trim().length === 0 && (
                      <p className="text-center text-muted-foreground text-xs py-4">
                        Buscá por nombre, categoría o descripción
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative text-foreground/80 hover:text-primary transition-colors group"
            >
              <ShoppingBag size={22} strokeWidth={1.5} />
              {itemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  {itemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[80%] max-w-sm bg-zinc-950 border-r border-zinc-800 z-50 flex flex-col p-6 md:hidden shadow-2xl"
            >
              <button onClick={() => setIsMobileMenuOpen(false)}
                className="self-end mb-6 text-foreground/60 hover:text-foreground">
                <X size={24} />
              </button>

              {/* Búsqueda mobile */}
              <form onSubmit={handleSearchSubmit} className="mb-6">
                <div className="flex items-center border border-border bg-card px-3">
                  <Search size={15} className="text-muted-foreground" />
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Buscar joyas..."
                    className="w-full bg-transparent px-3 py-2.5 text-sm focus:outline-none"
                  />
                </div>
                {searchResults.length > 0 && (
                  <div className="border border-border border-t-0 bg-card">
                    {searchResults.map(product => (
                      <button key={product.id} onClick={() => { handleSelectProduct(product.id); setIsMobileMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-background/60 text-left border-b border-border/50 last:border-0">
                        <p className="text-sm line-clamp-1 flex-1">{product.name}</p>
                        <span className="text-primary text-xs">{formatPrice(product.price)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </form>

              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link key={link.name} href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-display tracking-widest uppercase hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
