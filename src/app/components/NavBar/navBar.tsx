'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  AiOutlineShoppingCart,
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineSearch,
  AiOutlineUser,
  AiOutlineDashboard,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineLogout,
  AiOutlineGift,
  AiOutlineBarChart,
  AiOutlineTeam,
} from 'react-icons/ai';
import { 
  FiChevronDown, 
  FiChevronUp,
  FiPackage,
  FiShoppingBag,
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { useAuth } from '@/app/contexts/AuthContext';
import { useDebounce } from '@/lib/debounce';

// Tipos para la búsqueda
interface SearchResult {
  id: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
}

interface SearchProps {
  onSearch?: (query: string) => Promise<SearchResult[]>;
  onSelectProduct?: (product: SearchResult) => void;
}

export const Navbar: React.FC<SearchProps> = ({ onSelectProduct }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const debouncedQuery = useDebounce(searchQuery, 300);

  // Función de búsqueda API integrada
  const searchProducts = async (query: string): Promise<SearchResult[]> => {
    // Corregido: usar el parámetro query en lugar de debouncedQuery
    if (!query.trim()) {
      return [];
    }
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        console.error('NEXT_PUBLIC_API_URL no está definida');
        return [];
      }

      const response = await fetch(`${apiUrl}/products/filter?search=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error en la búsqueda: ${response.status}`);
      }

      const data = await response.json();
      
      if (Array.isArray(data)) {
        return data.map((product: any) => ({
          id: product.id || product._id,
          name: product.name || product.title,
          price: product.price || 0,
          image: product.image || product.imageUrl || product.thumbnail,
          category: product.category || product.categoryName
        }));
      } else if (data.products && Array.isArray(data.products)) {
        return data.products.map((product: any) => ({
          id: product.id || product._id,
          name: product.name || product.title,
          price: product.price || 0,
          image: product.image || product.imageUrl || product.thumbnail,
          category: product.category || product.categoryName
        }));
      }

      return [];
    } catch (error) {
      console.error('Error en la búsqueda de productos:', error);
      return [];
    }
  };

  // Un solo useEffect para manejar la búsqueda con debounce
  useEffect(() => {
    const fetchProducts = async () => {
      if (!debouncedQuery.trim() || debouncedQuery.length < 3) {
        setSearchResults([]);
        setSearchLoading(false);
        return;
      }

      setSearchLoading(true);
      try {
        const results = await searchProducts(debouncedQuery);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching products:', error);
        setSearchResults([]);
        toast.error('Error al buscar productos');
      } finally {
        setSearchLoading(false);
      }
    };

    fetchProducts();
  }, [debouncedQuery]);

 

  const handleLogout = () => {
    logout();
    router.push('/');
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  const handleCartClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isAuthenticated) {
      e.preventDefault();
      toast.warn('Debes iniciar sesión para acceder al carrito.', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleMenuLinkClick = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      //router.push(`/menu2?q=${encodeURIComponent(searchQuery)}`);
      setSearchFocused(false);
      setSearchResults([]);
    }
  };

  // Función corregida para manejar la selección de producto
  const handleProductSelect = (product: SearchResult) => {
    console.log('Producto seleccionado:', product); // Debug log
    
    // Ejecutar callback si existe
    if (onSelectProduct) {
      onSelectProduct(product);
    }
    
    // Limpiar estado de búsqueda ANTES de navegar
    setSearchFocused(false);
    setSearchResults([]);
    setSearchQuery('');
    
    // Navegar al producto
    router.push(`/product/${product.id}`);
  };

  return (
    <>
      <nav className="sticky top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center gap-4">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="block">
                <Image
                  src="/banner.png"
                  alt="HierroExpress"
                  className="h-10 w-auto rounded-lg hover:scale-105 transition-transform duration-200"
                  width={150}
                  height={40}
                  priority
                />
              </Link>
            </div>

            {/* Barra de búsqueda - Solo visible en desktop */}
            <div className="hidden md:flex flex-1 max-w-xl mx-4" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    className="w-full px-4 py-2 pl-10 pr-4 text-gray-900 bg-white rounded-full border-2 border-transparent focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                  <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                  {searchLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                    </div>
                  )}
                </div>

                {/* Resultados de búsqueda */}
                {searchFocused && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border max-h-96 overflow-y-auto z-50">
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleProductSelect(product)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b last:border-b-0 flex items-center gap-3 transition-colors duration-150 cursor-pointer"
                      >
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-900 font-medium truncate" dangerouslySetInnerHTML={{
                            __html: product.name.replace(/\(([^)]+)\)/g, '<span class="font-bold text-blue-900">($1)</span>')
                          }}></p>
                          <p className="text-blue-600 font-bold">${product.price.toLocaleString()}</p>
                          {product.category && (
                            <p className="text-xs text-gray-500">{product.category}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* No results */}
                {searchFocused && searchQuery.length > 2 && searchResults.length === 0 && !searchLoading && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border p-4 z-50">
                    <p className="text-gray-500 text-center">No se encontraron productos</p>
                  </div>
                )}
              </form>
            </div>

            {/* Navigation Links - Desktop */}
            <div className="hidden xl:flex items-center space-x-1">
              {isAuthenticated ? (
                <>
                  <Link 
                    href="/profile" 
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-500 transition-colors duration-200"
                  >
                    <AiOutlineUser className="text-lg" />
                    <span className="font-medium">Mi perfil</span>
                  </Link>

                  {(user?.role === 'admin' || user?.role === 'superadmin') ? (
                    <div className="relative" ref={dropdownRef}>
                      <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-500 transition-colors duration-200"
                      >
                        <AiOutlineDashboard className="text-lg" />
                        <span className="font-medium">Panel</span>
                        {dropdownOpen ? <FiChevronUp /> : <FiChevronDown />}
                      </button>
                      {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white text-gray-700 rounded-lg shadow-xl border border-gray-200 py-2 z-20">
                          <Link
                            href="/admin-history"
                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors duration-150"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <FiShoppingBag className="text-lg text-blue-600" />
                            <span>Panel Ordenes</span>
                          </Link>
                          <Link
                            href="/superadmin/products"
                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors duration-150"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <FiPackage className="text-lg text-green-600" />
                            <span>Menu Products</span>
                          </Link>
                          {user?.role === 'superadmin' && (
                            <>
                              <Link
                                href="/cupons"
                                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors duration-150"
                                onClick={() => setDropdownOpen(false)}
                              >
                                <AiOutlineGift className="text-lg text-purple-600" />
                                <span>Cupones descuento</span>
                              </Link>
                              <Link
                                href="/superadmin/categories"
                                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors duration-150"
                                onClick={() => setDropdownOpen(false)}
                              >
                                <span>Categorias</span>
                              </Link>
                              <Link
                                href="/superadmin/dashboard"
                                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors duration-150"
                                onClick={() => setDropdownOpen(false)}
                              >
                                <AiOutlineBarChart className="text-lg text-indigo-600" />
                                <span>Dashboard</span>
                              </Link>
                              <Link
                                href="/adminaccounts"
                                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors duration-150"
                                onClick={() => setDropdownOpen(false)}
                              >
                                <AiOutlineTeam className="text-lg text-teal-600" />
                                <span>Accounts</span>
                              </Link>
                            </>
                          )}
                          <hr className="my-2" />
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-150 text-red-600"
                          >
                            <AiOutlineLogout className="text-lg" />
                            <span>Cerrar sesión</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-500 transition-colors duration-200 text-red-200 hover:text-white"
                      >
                        <AiOutlineLogout className="text-lg" />
                        <span className="font-medium">Cerrar sesión</span>
                      </button>
                      <Link
                        href="/cart"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-500 transition-colors duration-200 relative"
                        onClick={handleCartClick}
                      >
                        <AiOutlineShoppingCart className="text-xl" />
                        <span className="font-medium">Carrito</span>
                      </Link>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-500 transition-colors duration-200"
                  >
                    <AiOutlineLogin className="text-lg" />
                    <span className="font-medium">Iniciar sesión</span>
                  </Link>
                  <Link 
                    href="/register" 
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 transition-colors duration-200"
                  >
                    <AiOutlineUserAdd className="text-lg" />
                    <span className="font-medium">Registrarme</span>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="xl:hidden flex items-center gap-2">
              {/* Mobile search button */}
              <button
                onClick={() => router.push('/search')}
                className="p-2 rounded-lg hover:bg-blue-500 transition-colors duration-200"
              >
                <AiOutlineSearch className="text-xl" />
              </button>
              
              <button 
                onClick={() => setMenuOpen(!menuOpen)} 
                className="p-2 rounded-lg hover:bg-blue-500 transition-colors duration-200"
              >
                {menuOpen ? (
                  <AiOutlineClose className="text-xl" />
                ) : (
                  <AiOutlineMenu className="text-xl" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden mt-3" ref={searchRef}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  className="w-full px-4 py-2 pl-10 pr-4 text-gray-900 bg-white rounded-full border-2 border-transparent focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
                <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                {searchLoading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                  </div>
                )}
              </div>

              {/* Mobile Search Results */}
             {searchFocused && searchResults.length > 0 && (
  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border max-h-96 overflow-y-auto z-50 flex flex-col">
    {/* Header con X */}
    <div className="flex justify-end p-2 border-b">
      <button
        onClick={() => {
          setSearchFocused(false);
          setSearchResults([]);
        }}
        className="text-gray-500 hover:text-red-500 text-xl font-bold"
        aria-label="Cerrar resultados"
      >
        ✕
      </button>
    </div>

    {/* Resultados */}
        {searchResults.map((product) => (
          <div
            key={product.id}
            onClick={() => handleProductSelect(product)}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b last:border-b-0 flex items-center gap-3 transition-colors duration-150 cursor-pointer"
          >
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="w-10 h-10 object-cover rounded"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <div className="flex-1 min-w-0">
              <p
                className="text-gray-900 font-medium truncate"
                dangerouslySetInnerHTML={{
                  __html: product.name.replace(/\(([^)]+)\)/g, '<span class="font-bold text-blue-900">($1)</span>'),
                }}
              ></p>
              <p className="text-blue-600 font-bold">
                ${product.price.toLocaleString()}
              </p>
              {product.category && (
                <p className="text-xs text-gray-500">{product.category}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    )}


              {/* No results mobile */}
              {searchFocused && searchQuery.length > 2 && searchResults.length === 0 && !searchLoading && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border p-4 z-50">
                  <p className="text-gray-500 text-center text-sm">No se encontraron productos</p>
                </div>
              )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="fixed inset-x-4 top-20 bg-white text-gray-800 rounded-xl shadow-2xl border z-40 max-h-[calc(100vh-6rem)] overflow-y-auto"
          ref={menuRef}
        >
          <div className="p-4">
            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                  onClick={handleMenuLinkClick}
                >
                  <AiOutlineUser className="text-xl text-blue-600" />
                  <span className="font-medium">Mi perfil</span>
                </Link>

                {(user?.role === 'admin' || user?.role === 'superadmin') && (
                  <div className="border-t pt-2 mt-2">
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center justify-between w-full p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                    >
                      <div className="flex items-center gap-3">
                        <AiOutlineDashboard className="text-xl text-purple-600" />
                        <span className="font-medium">Panel</span>
                      </div>
                      {dropdownOpen ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                    {dropdownOpen && (
                      <div className="pl-4 mt-2 space-y-1" ref={panelRef}>
                        <Link
                          href="/admin-history"
                          className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                          onClick={handleMenuLinkClick}
                        >
                          <FiShoppingBag className="text-lg text-blue-600" />
                          <span>Panel Ordenes</span>
                        </Link>
                        <Link
                          href="/superadmin/products"
                          className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                          onClick={handleMenuLinkClick}
                        >
                          <FiPackage className="text-lg text-green-600" />
                          <span>Menu Products</span>
                        </Link>
                        {user?.role === 'superadmin' && (
                          <>
                            <Link
                              href="/superadmin/dashboard"
                              className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                              onClick={handleMenuLinkClick}
                            >
                              <AiOutlineBarChart className="text-lg text-indigo-600" />
                              <span>Dashboard</span>
                            </Link>
                            <Link
                              href="/superadmin/categories"
                              className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                              onClick={handleMenuLinkClick}
                            >
                              <span>Categorias</span>
                            </Link>
                            <Link
                              href="/cupons"
                              className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                              onClick={handleMenuLinkClick}
                            >
                              <AiOutlineGift className="text-lg text-purple-600" />
                              <span>Cupones</span>
                            </Link>
                            <Link
                              href="/adminaccounts"
                              className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                              onClick={handleMenuLinkClick}
                            >
                              <AiOutlineTeam className="text-lg text-teal-600" />
                              <span>Accounts</span>
                            </Link>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {!(user?.role === 'admin' || user?.role === 'superadmin') && (
                  <Link
                    href="/cart"
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                    onClick={(e) => {
                      handleCartClick(e);
                      handleMenuLinkClick();
                    }}
                  >
                    <AiOutlineShoppingCart className="text-xl text-green-600" />
                    <span className="font-medium">Carrito</span>
                  </Link>
                )}

                <div className="border-t pt-2 mt-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full p-3 hover:bg-red-50 rounded-lg transition-colors duration-150 text-red-600"
                  >
                    <AiOutlineLogout className="text-xl" />
                    <span className="font-medium">Cerrar sesión</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                  onClick={handleMenuLinkClick}
                >
                  <AiOutlineLogin className="text-xl text-blue-600" />
                  <span className="font-medium">Iniciar sesión</span>
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-lg transition-colors duration-150 text-blue-600"
                  onClick={handleMenuLinkClick}
                >
                  <AiOutlineUserAdd className="text-xl" />
                  <span className="font-medium">Registrarme</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};