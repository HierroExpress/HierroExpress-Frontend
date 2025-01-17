"use client";
import { getAllCategories } from "@/utils/api/categoriesAndAttributes/getCategories";
import { getAtrtributesByCategory } from "@/utils/api/categoriesAndAttributes/getAtrtributesByCategory";
import { filterProductsByCategoryAndAttributes } from "@/utils/api/products/getProductsByCategoryAndAttributes";
import { useEffect, useState } from "react";
import { CategoryResponse } from "@/app/shared/categories/types";
import { CategoriesButtons } from "./CategoriesButtons";
import { SubCategoriesButtons } from "./SupcategoryButton";
import { AttributesButtons } from "./AttributesButtons";
import { ProductsGrid } from "./ProductsGrid";

const BotoneraContainer = () => {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [subcategories, setSubcategories] = useState<CategoryResponse[]>([]);
  const [attributes, setAttributes] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Obtener categorías
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response);
        console.log("ejn el front", response);

        setLoading(false);
      } catch (error) {
        setError("Error al cargar categorías");
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Manejar selección de categoría
  const handleSelectCategory = async (categoryId: number) => {
    setLoading(true);
    setSelectedCategory(categoryId);
    try {
      // Obtener subcategorías de la categoría seleccionada
      const category = categories.find((c) => c.id === categoryId);
      setSubcategories(category?.subcategories || []);
      // Obtener atributos de la categoría seleccionada
      const attributesResponse = await getAtrtributesByCategory({ categoryId });
      setAttributes(attributesResponse);
      // Obtener productos de la categoría seleccionada
      const productsResponse = await filterProductsByCategoryAndAttributes({
        categoryId,
        attributes: [],
      });
      setProducts(productsResponse);
      setLoading(false);
    } catch (error) {
      setError("Error al cargar los datos de la categoría");
      setLoading(false);
    }
  };

  const handleToggleAttribute = async (attributeId: number, value: string) => {
    const selectedAttributes = [...attributes]; // Suponiendo que tienes el estado de los atributos seleccionados
    const newAttributes = selectedAttributes.filter(
      (attr) => attr.attributeId !== attributeId
    );
    newAttributes.push({ attributeId, value });
    try {
      const filteredProducts = await filterProductsByCategoryAndAttributes({
        categoryId: selectedCategory!,
        attributes: newAttributes,
      });
      setProducts(filteredProducts);
    } catch (error) {
      setError("Error al filtrar productos");
    }
  };

  return (
    <div>
      <CategoriesButtons
        categories={categories}
        onSelectCategory={handleSelectCategory}
      />
      {subcategories.length > 0 && (
        <SubCategoriesButtons
          categories={subcategories}
          onSelectCategory={handleSelectCategory}
        />
      )}
      {attributes.length > 0 && (
        <AttributesButtons
          attributes={attributes}
          onToggleAttribute={handleToggleAttribute}
        />
      )}
      <ProductsGrid products={products} />
    </div>
  );
};

export default BotoneraContainer;
