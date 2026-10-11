'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  filterProductsByCategoryAndAttributes,
  getAllCategories,
  getProducts,
  getAtrtributesByCategory,
} from '@/helpers/peticiones';
import ProductCard from '@/app/components/Cards/ProductCard';
import { Category, Product } from '@/types';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import MenuFilters2 from '@/app/components/MenuComponents/MenuFilter2';
import { useFilterPersistence } from '@/hooks/useFilterPersistence';
import StructuredData from '@/app/components/SEO/StructuredData';
import BreadcrumbStructuredData from '@/app/components/SEO/BreadcrumbStructuredData';
import {
  findCategoryById,
  getCategoryUrlPath,
  getCategoryWithSubcategoryUrlPath,
} from '@/lib/urlUtils';

interface MenuProps {
  categoryId?: number; // Recibimos la categoría como prop
  subcategoryId?: number; // Subcategoría seleccionada
}

export default function Menu2({ categoryId, subcategoryId }: MenuProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
    categoryId,
  );
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [attributes, setAttributes] = useState([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<
    number | undefined
  >(subcategoryId);
  const [selectedAttributes, setSelectedAttributes] = useState<
    { attributeId: number; value: string }[]
  >([]);

  // Filter persistence hook
  const { saveFilterState, loadFilterState } = useFilterPersistence();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response);
      } catch (err) {
        setError('Error al cargar las categorías');
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categoryId && categories.length > 0) {
      setSelectedCategory(categoryId);

      // Set subcategories if this is a main category
      const category = categories.find((c) => c.id === categoryId);
      if (category?.subcategories) {
        setSubcategories(category.subcategories);
      }

      // If there's a subcategory from URL, set it
      if (subcategoryId) {
        setSelectedSubcategory(subcategoryId);
        handleSelectCategoryWithoutNavigation(subcategoryId);
      } else {
        handleSelectCategoryWithoutNavigation(categoryId);
      }
    }
  }, [categoryId, subcategoryId, categories]);

  // Load persisted filter state when categories are available
  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      const persistedState = loadFilterState();
      if (persistedState) {
        const {
          selectedCategory: persistedCategory,
          selectedSubcategory: persistedSubcategory,
          selectedAttributes: persistedAttributes,
        } = persistedState;

        if (persistedCategory) {
          setSelectedCategory(persistedCategory);
          setSelectedAttributes(persistedAttributes);

          // Set subcategories from the selected category
          const category = categories.find((c) => c.id === persistedCategory);
          if (category?.subcategories) {
            setSubcategories(category.subcategories);
          }

          if (persistedSubcategory) {
            setSelectedSubcategory(persistedSubcategory);
          }

          // Load data for the persisted category/subcategory with attributes
          const targetCategoryId = persistedSubcategory || persistedCategory;
          handleSelectCategoryWithoutSaving(
            targetCategoryId,
            persistedAttributes,
          );
        }
      }
    }
  }, [categories, categoryId, loadFilterState]);

  useEffect(() => {
    if (selectedCategory !== undefined) return;
    let active = true;
    setLoading(true);
    getProducts(1, 60)
      .then((data) => {
        if (active) setProducts(data);
      })
      .catch(() => {
        if (active)
          setError('No pudimos cargar el catálogo. Intentá nuevamente.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [selectedCategory]);

  // Helper function to save current filter state
  const saveCurrentFilterState = (
    category?: number,
    subcategory?: number,
    attributes?: { attributeId: number; value: string }[],
  ) => {
    saveFilterState({
      selectedCategory: category ?? selectedCategory,
      selectedSubcategory: subcategory ?? selectedSubcategory,
      selectedAttributes: attributes ?? selectedAttributes,
    });
  };

  // Handle category selection without saving state (used for restoration)
  const handleSelectCategoryWithoutSaving = async (
    categoryId: number,
    attributesToUse?: { attributeId: number; value: string }[],
  ) => {
    setLoading(true);
    setError('');

    try {
      const attributesResponse = await getAtrtributesByCategory({ categoryId });
      setAttributes(attributesResponse);

      const productsResponse = await filterProductsByCategoryAndAttributes({
        categoryId,
        attributes: attributesToUse || [],
      });
      // Sort products by price (lowest to highest)
      const sortedProducts = productsResponse.sort(
        (a: Product, b: Product) => a.price - b.price,
      );
      setProducts(sortedProducts);
    } catch (err) {
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  // Handle category selection without triggering navigation (used for initial load)
  const handleSelectCategoryWithoutNavigation = async (categoryId: number) => {
    setLoading(true);
    setError('');

    try {
      const attributesResponse = await getAtrtributesByCategory({ categoryId });
      setAttributes(attributesResponse);

      const productsResponse = await filterProductsByCategoryAndAttributes({
        categoryId,
        attributes: [],
      });
      // Sort products by price (lowest to highest)
      const sortedProducts = productsResponse.sort(
        (a: Product, b: Product) => a.price - b.price,
      );
      setProducts(sortedProducts);
    } catch (err) {
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCategory = async (
    categoryId: number,
    isSubcategory = false,
  ) => {
    setLoading(true);
    setError('');

    try {
      if (isSubcategory) {
        setSelectedSubcategory(categoryId);
        // Save state with updated subcategory
        saveCurrentFilterState(
          selectedCategory,
          categoryId,
          selectedAttributes,
        );

        // Navigate to category/subcategory URL
        const category = findCategoryById(categories, selectedCategory!);
        const subcategory = findCategoryById(categories, categoryId);
        if (category && subcategory) {
          const newUrl = getCategoryWithSubcategoryUrlPath(
            category,
            subcategory,
          );
          router.push(newUrl);
        }
      } else {
        setSelectedCategory(categoryId);
        setSelectedSubcategory(undefined);
        setSelectedAttributes([]); // Reset attributes when changing main category

        const category = categories.find((c) => c.id === categoryId);
        setSubcategories(category?.subcategories || []);

        // Save state with new category and reset subcategory/attributes
        saveCurrentFilterState(categoryId, undefined, []);

        // Navigate to category URL
        if (category) {
          const newUrl = getCategoryUrlPath(category);
          router.push(newUrl);
        }
      }

      const attributesResponse = await getAtrtributesByCategory({ categoryId });
      setAttributes(attributesResponse);

      const productsResponse = await filterProductsByCategoryAndAttributes({
        categoryId,
        attributes: isSubcategory ? selectedAttributes : [],
      });
      // Sort products by price (lowest to highest)
      const sortedProducts = productsResponse.sort(
        (a: Product, b: Product) => a.price - b.price,
      );
      setProducts(sortedProducts);
    } catch (err) {
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAttribute = async (attributeId: number, value: string) => {
    setLoading(true);
    setError('');

    let updatedAttributes = selectedAttributes.some(
      (attr) => attr.attributeId === attributeId && attr.value === value,
    )
      ? selectedAttributes.filter(
          (attr) => !(attr.attributeId === attributeId && attr.value === value),
        )
      : [
          ...selectedAttributes.filter(
            (attr) => attr.attributeId !== attributeId,
          ),
          { attributeId, value },
        ];

    setSelectedAttributes(updatedAttributes);

    // Save state with updated attributes
    saveCurrentFilterState(
      selectedCategory,
      selectedSubcategory,
      updatedAttributes,
    );

    try {
      const categoryId = selectedSubcategory || selectedCategory;
      if (!categoryId) return;

      const filteredProducts = await filterProductsByCategoryAndAttributes({
        categoryId,
        attributes: updatedAttributes,
      });
      // Sort products by price (lowest to highest)
      const sortedProducts = filteredProducts.sort(
        (a: Product, b: Product) => a.price - b.price,
      );
      setProducts(sortedProducts);
    } catch (err) {
      setError('Error al filtrar productos');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    console.log('Añadir al carrito:', product);
  };

  // Get current category and subcategory for structured data
  const currentCategory = findCategoryById(categories, selectedCategory!);
  const currentSubcategory = selectedSubcategory
    ? findCategoryById(categories, selectedSubcategory)
    : undefined;

  return (
    <main className="he-container he-catalog-page">
      <div className="he-catalog-title">
        <p className="he-eyebrow">EL MATERIAL PARA TU PRÓXIMO PROYECTO</p>
        <h1>
          {currentSubcategory?.name ||
            currentCategory?.name ||
            'Catálogo de productos'}
        </h1>
        <p>
          Elegí una categoría y encontrá el material y las medidas que
          necesitás.
        </p>
      </div>
      {/* Structured Data for SEO */}
      {currentCategory && (
        <>
          <StructuredData
            category={currentCategory}
            subcategory={currentSubcategory}
          />
          <BreadcrumbStructuredData
            category={currentCategory}
            subcategory={currentSubcategory}
          />
        </>
      )}

      <div className="he-catalog-layout">
        <div className="he-catalog-inner">
          <button
            className="md:hidden w-full py-2 px-4 bg-gray-200 text-left flex justify-between items-center mb-4"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            Filtros
            {isFilterOpen ? (
              <ChevronUpIcon className="h-5 w-5" />
            ) : (
              <ChevronDownIcon className="h-5 w-5" />
            )}
          </button>

          <div
            className={`${isFilterOpen ? 'block' : 'hidden'} md:block he-catalog-sidebar`}
          >
            <MenuFilters2
              handleSelectCategory={handleSelectCategory}
              subCategories={subcategories}
              categories={categories}
              selectedCategory={selectedCategory}
              selectedSubcategory={selectedSubcategory}
              attributes={attributes}
              selectedAttributes={selectedAttributes}
              handleToggleAttribute={handleToggleAttribute}
            />
          </div>

          <div className="he-catalog-results">
            {loading && <div>Cargando...</div>}
            {error && <div className="text-red-500">{error}</div>}
            {!loading && !error && products.length === 0 ? (
              <div className="he-empty-catalog">
                <p>Seleccioná un tipo de material para ver sus productos.</p>
              </div>
            ) : (
              <div className="he-products-grid">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
