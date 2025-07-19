'use client';
import React, { useEffect, useState } from 'react';
import { fetchProducts, deleteProduct, updateProductPrice, updateBulkProductPrice } from '@/helpers/peticionesSuperAdmin';
import ConfirmModal from './confirmModal';
import { Product } from '@/types';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useAuth } from '@/app/contexts/AuthContext';
import { HiOutlineTrash } from 'react-icons/hi';
import { FiEdit } from 'react-icons/fi';
import BackButton from '../ProductIdComponents/BackButton';
import { AiOutlineSearch } from 'react-icons/ai';

const PAGE_SIZE = 10;

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState<'name' | 'price' | 'category'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [priceFilter, setPriceFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [bulkPriceModalOpen, setBulkPriceModalOpen] = useState(false);
  const [bulkPrice, setBulkPrice] = useState<string>('');
  const [bulkPriceMode, setBulkPriceMode] = useState<'selected' | 'category'>('selected');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const { accessToken, isSuperAdmin } = useAuth();
  const token = accessToken;

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  useEffect(() => {
    setTotalPages(Math.ceil(products.length / PAGE_SIZE));
  }, [products]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const productsData = await fetchProducts();
      setProducts(productsData);
      setTotalPages(Math.ceil(products.length / PAGE_SIZE));
    } catch (error) {
      console.error('Error al obtener los productos', error);
    } finally {
      setLoading(false);
      closeModal();
      setProductToDelete(null);
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const openDeleteModal = (id: string) => {
    setProductToDelete(id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setProductToDelete(null);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    closeModal();

    if (!token) {
      console.error('Token no disponible');
      toast.error('Token no disponible', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    try {
      await deleteProduct(productToDelete, token);
      setProducts(products.filter((product) => product.id !== productToDelete));
      closeModal();
    } catch (error) {
      console.error('Error al eliminar el producto', error);
      toast.error('Error al eliminar el producto', {
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

  const handleColumnSort = (field: 'name' | 'price' | 'category') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const startPriceEdit = (productId: string, currentPrice: number) => {
    setEditingPrice(productId);
    setTempPrice(currentPrice.toString());
  };

  const cancelPriceEdit = () => {
    setEditingPrice(null);
    setTempPrice('');
  };

  const savePriceEdit = async (productId: string) => {
    if (!token) {
      toast.error('Token no disponible', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    const newPrice = parseFloat(tempPrice);
    if (isNaN(newPrice) || newPrice <= 0) {
      toast.error('El precio debe ser un número válido mayor a 0', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    try {
      await updateProductPrice(productId, newPrice, token);
      
      // Update the local state
      setProducts(products.map(product => 
        product.id === productId 
          ? { ...product, price: newPrice }
          : product
      ));
      
      setEditingPrice(null);
      setTempPrice('');
      
      toast.success('Precio actualizado correctamente', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error('Error al actualizar el precio', error);
      toast.error('Error al actualizar el precio', {
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

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAllProducts = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  const openBulkPriceModal = () => {
    setBulkPriceModalOpen(true);
  };

  const closeBulkPriceModal = () => {
    setBulkPriceModalOpen(false);
    setBulkPrice('');
    setBulkPriceMode('selected');
    setSelectedCategory('');
  };

  const handleBulkPriceUpdate = async () => {
    if (!token) {
      toast.error('Token no disponible');
      return;
    }

    const price = parseFloat(bulkPrice);
    if (isNaN(price) || price <= 0) {
      toast.error('El precio debe ser un número válido mayor a 0');
      return;
    }

    try {
      let updateData: { productIds?: string[], categoryId?: number, price: number };
      
      if (bulkPriceMode === 'selected') {
        if (selectedProducts.length === 0) {
          toast.error('Selecciona al menos un producto');
          return;
        }
        updateData = { productIds: selectedProducts, price };
      } else {
        if (!selectedCategory) {
          toast.error('Selecciona una categoría');
          return;
        }
        updateData = { categoryId: parseInt(selectedCategory), price };
      }

      await updateBulkProductPrice(updateData, token);

      // Update local state
      if (bulkPriceMode === 'selected') {
        setProducts(products.map(product => 
          selectedProducts.includes(product.id)
            ? { ...product, price }
            : product
        ));
        setSelectedProducts([]);
      } else {
        // For category mode, refetch data to get updated prices
        await fetchData();
      }

      closeBulkPriceModal();
      toast.success('Precios actualizados correctamente');
    } catch (error) {
      console.error('Error al actualizar precios', error);
      toast.error('Error al actualizar precios');
    }
  };

  // Get unique categories for bulk update
  const uniqueCategories = Array.from(
    new Set(
      products.flatMap(product => {
        if (Array.isArray(product.category)) {
          return product.category.map(cat => ({ id: cat.id, name: cat.name }));
        } else if (product.category && typeof product.category === 'object' && 'id' in product.category) {
          return [{ id: product.category.id, name: product.category.name }];
        }
        return [];
      }).map(cat => JSON.stringify(cat))
    )
  ).map(catStr => JSON.parse(catStr));

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = priceFilter === '' || product.price.toString().includes(priceFilter);
    const categoryName = Array.isArray(product.category)
      ? product.category.map((cat: any) => cat.name).join(',')
      : product.category;
    const matchesCategory = categoryFilter === '' || categoryName.toLowerCase().includes(categoryFilter.toLowerCase());
    
    return matchesSearch && matchesPrice && matchesCategory;
  }).sort((a, b) => {
    let aValue: any;
    let bValue: any;
    
    if (sortField === 'name') {
      aValue = a.name.toLowerCase();
      bValue = b.name.toLowerCase();
    } else if (sortField === 'price') {
      aValue = a.price;
      bValue = b.price;
    } else if (sortField === 'category') {
      aValue = Array.isArray(a.category) ? a.category.map((cat: any) => cat.name).join(',') : a.category;
      bValue = Array.isArray(b.category) ? b.category.map((cat: any) => cat.name).join(',') : b.category;
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-gray-300 text-xl">Cargando...</div>
        </div>
      </div>
    );
  }
  if (products.length === 0) return <div>No hay productos disponibles.</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 w-full flex-1">
        <div className="flex justify-between items-center mb-4">
          <BackButton className="mr-4" />
          <h2 className="text-2xl font-bold text-red-500">Productos</h2>
          <div className="flex gap-2">
            {selectedProducts.length > 0 && (
              <button 
                onClick={openBulkPriceModal}
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
              >
                Modificar Precios ({selectedProducts.length})
              </button>
            )}
            <button 
              onClick={() => {
                setBulkPriceMode('category');
                openBulkPriceModal();
              }}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Precios por Familia
            </button>
            {isSuperAdmin() && (
              <Link href="/superadmin/products/create">
                <button className="bg-blue-600 text-white px-4 py-2 rounded">
                  Crear Producto
                </button>
              </Link>
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex items-center relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar productos..."
              className="border-gray-300 rounded-full border p-2 pl-10 focus:border-red-500 w-full"
            />
            <AiOutlineSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <div className="flex items-center relative">
            <input
              type="text"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              placeholder="Filtrar por precio..."
              className="border-gray-300 rounded-full border p-2 focus:border-red-500 w-full"
            />
          </div>
          <div className="flex items-center relative">
            <input
              type="text"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              placeholder="Filtrar por categoría..."
              className="border-gray-300 rounded-full border p-2 focus:border-red-500 w-full"
            />
          </div>
        </div>
        {filteredProducts.length === 0 && !loading && (
          <div className="text-center text-gray-500 my-4">
            {' '}
            No hay productos que coincidan con la búsqueda.{' '}
          </div>
        )}
        {filteredProducts.length > 0 && (
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="px-6 py-3 text-gray-600 font-light text-md uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={handleSelectAllProducts}
                    className="rounded"
                  />
                </th>
                <th 
                  className="px-6 py-3 text-gray-600 font-light text-md uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleColumnSort('name')}
                >
                  Producto {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-6 py-3 text-gray-600 font-light text-md uppercase tracking-wide cursor-pointer hover:bg-gray-100"
                  onClick={() => handleColumnSort('category')}
                >
                  Categoría {sortField === 'category' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-6 py-3 text-gray-600 font-light text-md uppercase tracking-wide cursor-pointer hover:bg-gray-100"
                  onClick={() => handleColumnSort('price')}
                >
                  Precio {sortField === 'price' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-gray-600 font-light text-md uppercase tracking-wide">
                  Gestión
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts
                .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
                .map((product, index) => (
                  <tr key={product.id}>
                    <td
                      className={`border-t ${index === 0 ? 'border-b' : ''} px-4 py-2`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                        className="rounded"
                      />
                    </td>
                    <td
                      className={`border-t ${index === 0 ? 'border-b' : ''} px-4 py-2 space-x-2`}
                    >
                      {product.name}
                    </td>
                    <td
                      className={`border-t ${index === 0 ? 'border-b' : ''} px-4 py-2 space-x-2`}
                    >
                      {Array.isArray(product.category)
                        ? product.category.map((cat: any) => cat.name).join(',')
                        : product.category}
                    </td>
                    <td
                      className={`border-t ${index === 0 ? 'border-b' : ''} px-4 py-2 space-x-2`}
                    >
                      {editingPrice === product.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={tempPrice}
                            onChange={(e) => setTempPrice(e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 w-20 text-sm"
                            step="0.01"
                            min="0"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                savePriceEdit(product.id);
                              } else if (e.key === 'Escape') {
                                cancelPriceEdit();
                              }
                            }}
                          />
                          <button
                            onClick={() => savePriceEdit(product.id)}
                            className="text-green-500 hover:text-green-700 text-sm"
                            title="Guardar"
                          >
                            ✓
                          </button>
                          <button
                            onClick={cancelPriceEdit}
                            className="text-red-500 hover:text-red-700 text-sm"
                            title="Cancelar"
                          >
                            ✗
                          </button>
                        </div>
                      ) : (
                        <div 
                          className="flex items-center justify-between cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                          onClick={() => startPriceEdit(product.id, product.price)}
                          title="Haz clic para editar el precio"
                        >
                          <span>${product.price}</span>
                          <span className="text-gray-400 text-xs ml-2">✏️</span>
                        </div>
                      )}
                    </td>
                    <td
                      className={`border-t ${index === 0 ? 'border-b' : ''} px-4 py-2 space-x-2`}
                    >
                      <button className="bg-white text-green-500 px-2 py-1 rounded mr-2">
                        <Link
                          href={`/superadmin/products/edit/${product.id.toString()}`}
                        >
                          <FiEdit className="text-4xl" />
                        </Link>
                      </button>
                      {isSuperAdmin() && (
                        <button
                          onClick={() => openDeleteModal(product.id)}
                          className="text-red-500 px-2 py-1 rounded"
                        >
                          <HiOutlineTrash className="text-4xl" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="mt-4 flex justify-center items-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-200 text-gray-600 px-3 py-1 rounded mr-2"
        >
          Anterior
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-gray-200 text-gray-600 px-3 py-1 rounded mr-2"
        >
          Siguiente
        </button>
      </div>
      <ConfirmModal
        isOpen={modalOpen}
        onConfirm={confirmDelete}
        onCancel={closeModal}
        title="Confirmar eliminación"
        message="¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer."
      />
      
      {/* Bulk Price Modal */}
      {bulkPriceModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-90vw">
            <h3 className="text-lg font-bold mb-4">
              {bulkPriceMode === 'selected' ? 'Modificar Precios Seleccionados' : 'Modificar Precios por Familia'}
            </h3>
            
            {bulkPriceMode === 'category' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccionar Familia/Categoría:
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Selecciona una categoría</option>
                  {uniqueCategories.map((category) => (
                    <option key={category.id} value={category.id.toString()}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {bulkPriceMode === 'selected' && (
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Se actualizarán {selectedProducts.length} productos seleccionados
                </p>
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nuevo Precio:
              </label>
              <input
                type="number"
                value={bulkPrice}
                onChange={(e) => setBulkPrice(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
            
            <div className="flex gap-2 justify-end">
              <button
                onClick={closeBulkPriceModal}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleBulkPriceUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Actualizar Precios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProductList;
