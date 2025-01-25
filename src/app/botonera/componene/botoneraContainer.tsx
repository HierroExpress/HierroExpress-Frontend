"use client";
import { useEffect, useState } from "react";
import { getAllCategories } from "@/utils/api/categoriesAndAttributes/getCategories";
import { getAtrtributesByCategory } from "@/utils/api/categoriesAndAttributes/getAtrtributesByCategory";
import { filterProductsByCategoryAndAttributes } from "@/utils/api/products/getProductsByCategoryAndAttributes";
import { getProducts } from "@/utils/api/products/getProducts"; // Assuming this method exists
import { CategoryResponse } from "@/app/shared/categories/types";
import { ProductsGrid } from "./ProductsGrid";

const BotoneraContainer = () => {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [subcategories, setSubcategories] = useState<CategoryResponse[]>([]);
  const [attributes, setAttributes] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [filters, setFilters] = useState({
    filter: "",
    search: "",
    min: 0,
    max: 9999,
    start: "",
    page: 1,
    limit: 20,
  });
  const fetchInitialData = async () => {
    try {
      console.log("Fetching categories and products...");
      const [categoriesResponse, allProducts] = await Promise.all([
        getAllCategories(),
        getProducts(filters),
      ]);

      console.log("Categories received:", categoriesResponse);
      console.log("Products received:", allProducts);

      setCategories(categoriesResponse);
      setProducts(allProducts);
      setLoading(false);
    } catch (error) {
      console.error("Full error details:", error);
      setError(`Error al cargar datos iniciales: ${error.message}`);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleCategoryChange = async (e) => {
    const categoryId = Number(e.target.value);

    if (!categoryId) {
      // If no category selected, fetch all products
      try {
        const allProducts = await getAllProducts();
        setProducts(allProducts);
        setSelectedCategory(null);
        setSubcategories([]);
        setAttributes([]);
        return;
      } catch (error) {
        setError("Error al cargar todos los productos");
        return;
      }
    }

    setSelectedCategory(categoryId);
    setLoading(true);

    try {
      const category = categories.find((c) => c.id === categoryId);
      setSubcategories(category?.subcategories || []);

      const attributesResponse = await getAtrtributesByCategory({ categoryId });
      setAttributes(attributesResponse);

      const productsResponse = await filterProductsByCategoryAndAttributes({
        categoryId,
        attributes: [],
      });
      setProducts(productsResponse);
    } catch (error) {
      setError("Error al cargar los datos de la categoría");
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleAttributeToggle = (attributeId, value) => {
    setSelectedAttributes((prev) => {
      const existing = prev.find((attr) => attr.attributeId === attributeId);
      if (existing) {
        return prev.filter((attr) => attr.attributeId !== attributeId);
      }
      return [...prev, { attributeId, value }];
    });
  };

  const applyFilters = async () => {
    if (!selectedCategory) return;

    setLoading(true);
    try {
      const filteredProducts = await filterProductsByCategoryAndAttributes({
        categoryId: selectedCategory,
        attributes: selectedAttributes,
        priceRange,
      });
      setProducts(filteredProducts);
    } catch (error) {
      setError("Error al filtrar productos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 p-4 bg-white shadow-md space-y-4">
        <div>
          <label
            htmlFor="category-select"
            className="block text-sm font-medium text-gray-700"
          >
            Categoría
          </label>
          <select
            id="category-select"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            onChange={handleCategoryChange}
          >
            <option value="">Todos los productos</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        {/* Price Range Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Rango de Precio
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              name="min"
              placeholder="Mín"
              className="w-full rounded-md border-gray-300 shadow-sm"
              value={priceRange.min}
              onChange={handlePriceChange}
            />
            <input
              type="number"
              name="max"
              placeholder="Máx"
              className="w-full rounded-md border-gray-300 shadow-sm"
              value={priceRange.max}
              onChange={handlePriceChange}
            />
          </div>
        </div>

        {/* Attributes Filter */}
        {attributes.map((attribute) => (
          <div key={attribute.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {attribute.name}
            </label>
            <div className="space-y-1">
              {attribute.values.map((value) => (
                <div key={value} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`${attribute.id}-${value}`}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    onChange={() => handleAttributeToggle(attribute.id, value)}
                  />
                  <label
                    htmlFor={`${attribute.id}-${value}`}
                    className="ml-2 block text-sm text-gray-900"
                  >
                    {value}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Apply Filters Button */}
        <button
          onClick={applyFilters}
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Aplicar Filtros
        </button>
      </div>

      {/* Products Grid */}
      <div className="flex-1 p-6 overflow-y-auto">
        <ProductsGrid products={products} />
      </div>
    </div>
  );
};

export default BotoneraContainer;
