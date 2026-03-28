import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { ShoppingBag, Menu, X, Search } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { useListProducts } from '@/hooks/useProducts';
import { formatPrice, cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [location] = useLocation();
  const { toggleCart, itemsCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: allProducts } = useListProducts();

  const searchResults = searchQuery.trim().length >= 2
    ? (allProducts ?? []).filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false); setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [searchOpen]);

  useEffect(() => { setSearchOpen(false); setSearchQuery(''); }, [location]);

  const handleSelectProduct = (id: number) => {
    setSearchOpen(false); setSearchQuery('');
    window.location.href = `/producto/${id}`;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false); setSearchQuery('');
      window.location.href = `/productos?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Catálogo', href: '/productos' },
    { name: 'Clip', href: '/productos?category=clip' },
    { name: 'Keratina', href: '/productos?category=keratina' },
  ];

  const isHome = location === '/';

  return (
    <header className={cn(
      'fixed top-0 w-full z-40 transition-all duration-500',
      isScrolled || !isHome
        ? 'py-3 border-b border-[#D4AF37]/15'
        : 'py-5 bg-transparent',
      isScrolled || !isHome ? 'bg-[#1a0a12]/92 backdrop-blur-xl' : ''
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Mobile menu button */}
          <div className="flex-1 flex md:hidden">
            <button onClick={() => setIsMobileMenuOpen(true)}
              className="text-[#A69CB0] hover:text-[#D4AF37] transition-colors">
              <Menu size={22} />
            </button>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex flex-1 items-center gap-8">
            {navLinks.map(link => (
              <Link key={link.name} href={link.href}
                className={cn(
                  "text-xs font-sans font-medium tracking-[0.18em] uppercase transition-colors duration-200",
                  location === link.href ? "text-[#D4AF37]" : "text-[#A69CB0] hover:text-[#D4AF37]"
                )}>
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Logo NESHA */}
          <div className="flex-shrink-0 text-center">
            <Link href="/" className="group inline-block">
              <div className="relative">
                <h1 className="text-4xl font-display font-light tracking-[0.35em] gold-gradient-text uppercase">
                  NESHA
                </h1>
                <span className="text-[9px] font-sans tracking-[0.5em] text-[#A69CB0] uppercase block text-center -mt-1 group-hover:text-[#D4AF37] transition-colors">
                  Hair Extensions
                </span>
                {/* Línea dorada debajo del logo */}
                <div className="gold-line mt-1 opacity-60" />
              </div>
            </Link>
          </div>

          {/* Right actions */}
          <div className="flex-1 flex justify-end items-center gap-5">

            {/* Search */}
            <div ref={searchRef} className="relative hidden sm:block">
              <button onClick={() => setSearchOpen(v => !v)}
                className="text-[#A69CB0] hover:text-[#D4AF37] transition-colors">
                <Search size={18} strokeWidth={1.5} />
              </button>

              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-10 w-80 shadow-2xl z-50"
                    style={{ background: '#1f0a18', border: '1px solid rgba(212,175,55,0.2)' }}
                  >
                    <form onSubmit={handleSearchSubmit}>
                      <div className="flex items-center px-4 py-3 border-b border-[#D4AF37]/15">
                        <Search size={14} className="text-[#A69CB0] flex-shrink-0" />
                        <input ref={inputRef} value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          placeholder="Buscar extensiones..."
                          className="w-full bg-transparent px-3 text-sm focus:outline-none text-white placeholder:text-[#A69CB0]/60 font-body"
                        />
                        {searchQuery && (
                          <button type="button" onClick={() => setSearchQuery('')}
                            className="text-[#A69CB0] hover:text-[#D4AF37]">
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    </form>

                    {searchQuery.trim().length >= 2 && (
                      <div>
                        {searchResults.length === 0 ? (
                          <p className="text-center text-[#A69CB0] text-sm py-6 font-body">
                            Sin resultados para "{searchQuery}"
                          </p>
                        ) : (
                          searchResults.map(product => (
                            <button key={product.id} onClick={() => handleSelectProduct(product.id)}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#D4AF37]/8 transition-colors text-left border-b border-[#D4AF37]/10 last:border-0">
                              <div className="w-10 h-10 flex-shrink-0 overflow-hidden border border-[#D4AF37]/20">
                                {product.image && (
                                  <img src={product.image} alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-sans font-medium line-clamp-1 text-white">{product.name}</p>
                                <p className="text-xs text-[#A69CB0] capitalize">{product.category}</p>
                              </div>
                              <span className="text-[#D4AF37] text-sm font-sans font-semibold flex-shrink-0">
                                {formatPrice(product.price)}
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                    )}

                    {searchQuery.trim().length === 0 && (
                      <p className="text-center text-[#A69CB0]/60 text-xs py-4 font-body">
                        Buscá por tipo, largo o textura
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart */}
            <button onClick={toggleCart}
              className="relative text-[#A69CB0] hover:text-[#D4AF37] transition-colors group">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {itemsCount > 0 && (
                <span className="absolute -top-2 -right-2 text-[#1a0a12] text-[9px] font-sans font-bold w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#D4AF37,#C5A059)' }}>
                  {itemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)} />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[80%] max-w-sm z-50 flex flex-col p-8 md:hidden"
              style={{ background: '#1a0a12', borderRight: '1px solid rgba(212,175,55,0.2)' }}>
              <button onClick={() => setIsMobileMenuOpen(false)}
                className="self-end mb-8 text-[#A69CB0] hover:text-[#D4AF37]">
                <X size={22} />
              </button>

              <div className="mb-8">
                <h2 className="text-3xl font-display gold-gradient-text tracking-[0.3em] uppercase">NESHA</h2>
                <div className="gold-line mt-2 opacity-40" />
              </div>

              {/* Búsqueda mobile */}
              <form onSubmit={handleSearchSubmit} className="mb-8">
                <div className="flex items-center border border-[#D4AF37]/30 px-3 py-2"
                  style={{ background: 'rgba(212,175,55,0.05)' }}>
                  <Search size={14} className="text-[#A69CB0]" />
                  <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Buscar extensiones..."
                    className="w-full bg-transparent px-3 text-sm focus:outline-none text-white placeholder:text-[#A69CB0]/60 font-body" />
                </div>
                {searchResults.length > 0 && (
                  <div className="border border-[#D4AF37]/20 border-t-0">
                    {searchResults.map(product => (
                      <button key={product.id}
                        onClick={() => { handleSelectProduct(product.id); setIsMobileMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#D4AF37]/8 text-left border-b border-[#D4AF37]/10 last:border-0">
                        <p className="text-sm font-sans flex-1 line-clamp-1 text-white">{product.name}</p>
                        <span className="text-[#D4AF37] text-xs font-sans">{formatPrice(product.price)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </form>

              <div className="flex flex-col gap-6">
                {navLinks.map(link => (
                  <Link key={link.name} href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-xl font-display tracking-[0.2em] uppercase text-[#A69CB0] hover:text-[#D4AF37] transition-colors">
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
