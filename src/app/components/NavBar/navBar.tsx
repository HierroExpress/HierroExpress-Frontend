'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import { Menu, Search, ShoppingCart, UserRound, X } from 'lucide-react';

interface SearchResult {
  id: string;
  name: string;
  price: number;
}
interface SearchProps {
  onSearch?: (query: string) => Promise<SearchResult[]>;
  onSelectProduct?: (product: SearchResult) => void;
}
export function Navbar({ onSelectProduct }: SearchProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const pathname = usePathname();
  const searchRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [pathname]);
  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!searchRef.current?.contains(e.target as Node)) setSearchOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);
  useEffect(() => {
    if (query.trim().length < 3) {
      setResults([]);
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    setSearchError(false);
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/filter?search=${encodeURIComponent(query)}&limit=6`,
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error();
        const data = await response.json();
        setResults(Array.isArray(data) ? data : data.products || []);
      } catch (e) {
        if (!controller.signal.aborted) {
          setResults([]);
          setSearchError(true);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);
  const admin = user?.role === 'admin' || user?.role === 'superadmin';
  return (
    <header className="he-header">
      <div className="he-topbar">
        <div className="he-container he-topbar-content">
          <strong className="he-topbar-promo">15% OFF en contado y débito</strong>
          <span className="he-topbar-benefits">Cortes a medida <i /> Envíos rápidos en MVD <i /> Líderes en Mercado Libre</span>
          <span className="he-topbar-location">Montevideo, Uruguay <i /> 20 años funcionando</span>
        </div>
      </div>
      <div className="he-container he-nav-main">
        <Link href="/" className="he-brand" aria-label="Hierro Express — Inicio">
          <img src="/HierroExpressLogoOriginal.png" alt="Hierro Express" />
        </Link>
        <form
          className="he-search"
          ref={searchRef}
          onSubmit={(e) => {
            e.preventDefault();
            setSearchOpen(true);
          }}
        >
          <input
            aria-label="Buscar en el catálogo"
            placeholder="Busca por nombre, medida o tipo de material"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setSearchOpen(false);
            }}
          />
          <button type="submit" aria-label="Buscar en el catálogo"><Search size={20} aria-hidden="true" /><span>Buscar</span></button>
          {searchOpen && query.trim().length >= 3 && (
            <div className="he-search-results">
              {loading ? (
                <p>Buscando materiales…</p>
              ) : searchError ? (
                <p>No pudimos buscar. Intentá de nuevo.</p>
              ) : results.length ? (
                results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    onClick={() => {
                      setSearchOpen(false);
                      onSelectProduct?.(product);
                    }}
                  >
                    <span>{product.name}</span>
                  </Link>
                ))
              ) : (
                <p>No encontramos productos con ese nombre.</p>
              )}
            </div>
          )}
        </form>
        <div className="he-nav-actions">
          {isAuthenticated ? (
            <details className="he-account">
              <summary>
                <span>{user?.name?.split(' ')[0] || 'Mi cuenta'}</span>
              </summary>
              <div>
                <Link href="/profile">Mi perfil</Link>
                {admin && (
                  <Link href="/superadmin/dashboard">Panel de control</Link>
                )}
                <button onClick={logout}>Cerrar sesión</button>
              </div>
            </details>
          ) : (
            <Link href="/login" className="he-account-link">
              <UserRound size={20} aria-hidden="true" />
              <span>Mi cuenta</span>
            </Link>
          )}
          <button
            className="he-menu-toggle"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={23} aria-hidden="true" /> : <Menu size={23} aria-hidden="true" />}
            <span>{open ? 'Cerrar' : 'Menú'}</span>
          </button>
        </div>
      </div>
      <nav
        className={`he-nav-links ${open ? 'is-open' : ''}`}
        aria-label="Navegación principal"
      >
        <div className="he-container">
          <Link href="/" className={pathname === '/' ? 'active' : ''}>Inicio</Link>
          <Link
            href="/menu2"
            className={pathname.startsWith('/menu2') ? 'active' : ''}
          >
            Todos los productos
          </Link>
          <Link href="/menu2/canos">Barras y perfiles</Link>
          <Link href="/menu2/chapas">Chapas y mallas</Link>
          <Link href="/menu2/accesorios">Insumos y accesorios</Link>
          <Link href="/aboutUs">Quiénes somos</Link>
          <Link href="/contact" className="he-nav-contact">Contacto y consultas</Link>
          <Link href="/cart" className="he-cart he-nav-cart">
            <ShoppingCart size={21} aria-hidden="true" />
            <span>Ver mi carrito</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
