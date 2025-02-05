// 'use client';

// import React, { useEffect, useState } from 'react';
// import { filterProductsByCategoryAndAttributes, getAllCategories, getAtrtributesByCategory } from '@/helpers/peticiones';
// import ProductCard from '@/app/components/Cards/ProductCard';
// import { Category, Product } from '@/types';
// import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
// import MenuFilters2 from '../components/MenuComponents/MenuFilter2';
// import { useSearchParams } from 'next/navigation';



// export default function Menu() {

//   const [products, setProducts] = useState<Product[]>([]);
 
//   const [isFilterOpen, setIsFilterOpen] = useState(false);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
//   const [subcategories, setSubcategories] = useState<Category[]>([]);
//   const [attributes, setAttributes] = useState([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [selectedSubcategory, setSelectedSubcategory] = useState<number | undefined>(undefined);
//   const [selectedAttributes, setSelectedAttributes] = useState<
//     { attributeId: number; value: string }[]
//     >([]);
  

//   const [categoryParam, setCategoryParam] = useState<string | null>(null);
//     const searchParams = useSearchParams();

//   useEffect(() => {
//     setCategoryParam(searchParams.get('category'));
//   }, [searchParams]);

//   const categorylist = async () => {
//     const response = await getAllCategories();
//     setCategories(response);
//   };
  
//   useEffect(() => {
//     const loadCategoriesAndSelect = async () => {
//       await categorylist();
//     };

//     loadCategoriesAndSelect();
//   }, []);

//   useEffect(() => {
//     if (categoryParam && categories.length > 0) {
//       setSelectedCategory(Number(categoryParam));
//       handleSelectCategory(Number(categoryParam), false);
//     }
//   }, [categoryParam, categories]);

    

//   const handleSelectCategory = async (
//     categoryId: number,
//     isSubcategory = false,
//   ) => {
//     console.log("se esta ejecutando handleSelectCategory");
    
    
//     if (isSubcategory) {
//       try {
//         setSelectedSubcategory(categoryId);
//         // Obtener productos de la subcategoría seleccionada
//         const productsResponse = await filterProductsByCategoryAndAttributes({
//           categoryId,
//           attributes: [],
//         });
//         setProducts(productsResponse);
//         const attributesResponse = await getAtrtributesByCategory({
//           categoryId,
//         });
//         setAttributes(attributesResponse);
//       } catch (error) {
//         setError('Error al cargar los productos de la subcategoría');
//       } finally {
//         setLoading(false);
//       }
//       return;
//     }

//     try {
//       setSelectedCategory(categoryId);
//       console.log("aca entro en categoryId",categoryId);
//       console.log(categories);

//       setSelectedSubcategory(undefined);
      
      

//       // Obtener subcategorías
//       const category = categories.find((c) => c.id === categoryId);
//       console.log(category);
      
//       setSubcategories(category?.subcategories || []);

      
//       const attributesResponse = await getAtrtributesByCategory({ categoryId });
//       console.log("atributos response by category",attributesResponse);
      
//       setAttributes(attributesResponse);
  

//       // Obtener productos de la categoría seleccionada
//       const productsResponse = await filterProductsByCategoryAndAttributes({
//         categoryId,
//         attributes: [],
//       });
//       setProducts(productsResponse);
//     } catch (error) {
//       setError('Error al cargar los datos de la categoría');
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   const handleToggleAttribute = async (attributeId: number, value: string) => {
//     // Verificar si el atributo ya está seleccionado
//     const exists = selectedAttributes.find(
//       (attr) => attr.attributeId === attributeId && attr.value === value,
//     );

//     let updatedAttributes;
//     if (exists) {
//       // Si ya está seleccionado, lo eliminamos del filtro
//       updatedAttributes = selectedAttributes.filter(
//         (attr) => !(attr.attributeId === attributeId && attr.value === value),
//       );
//     } else {
//       // Buscar si el atributo ya tiene un valor seleccionado
//       const existingAttribute = selectedAttributes.find(
//         (attr) => attr.attributeId === attributeId,
//       );

//       if (existingAttribute) {
//         // Si ya hay un valor seleccionado para este atributo, lo reemplazamos por el nuevo valor
//         updatedAttributes = selectedAttributes.map(
//           (attr) =>
//             attr.attributeId === attributeId
//               ? { attributeId, value } // Reemplazamos el valor
//               : attr, // Mantenemos los otros atributos sin cambios
//         );
//       } else {
//         // Si no existe valor seleccionado para este atributo, lo agregamos
//         updatedAttributes = [...selectedAttributes, { attributeId, value }];
//       }
//     }
    

//     // Actualizamos el estado con los atributos seleccionados actualizados
//     setSelectedAttributes(updatedAttributes);

//     const categoryId = selectedSubcategory
//       ? selectedSubcategory
//       : selectedCategory;

//     try {
//       const filteredProducts = await filterProductsByCategoryAndAttributes({
//         categoryId: categoryId!,
//         attributes: updatedAttributes,
//       });
//       console.log(selectedCategory, updatedAttributes);

//       console.log('filtrados', filteredProducts);

//       setProducts(filteredProducts);
//     } catch (error) {
//       setError('Error al filtrar productos');
//     }
//   };


//   const handleAddToCart = (product: Product) => {
//     console.log('Añadir al carrito:', product);
//   };

 
//   return (
    
//     <div className="p-4 md:p-6">
      
//       <div className="md:flex w-full h-full">
//         {/* Botón de filtros para móviles */}
//         <button
//           className="md:hidden w-full py-2 px-4 bg-gray-200 text-left flex justify-between items-center mb-4"
//           onClick={() => setIsFilterOpen(!isFilterOpen)}
//         >
//           Filtros
//           {isFilterOpen ? (
//             <ChevronUpIcon className="h-5 w-5" />
//           ) : (
//             <ChevronDownIcon className="h-5 w-5" />
//           )}
//         </button>

//         <div
//           className={`${isFilterOpen ? 'block' : 'hidden'} md:block md:w-1/2 md:p-4 border-b md:border-r border-gray-200 mb-4 md:mb-0`}
//         >
//           <MenuFilters2      
//             handleSelectCategory={handleSelectCategory}
//             subCategories={subcategories}
//             categories={categories}
//             selectedCategory={selectedCategory}
//             selectedSubcategory={selectedSubcategory}
//             attributes={attributes}
//             selectedAttributes={selectedAttributes}
//             handleToggleAttribute={handleToggleAttribute}
//           />
//         </div>

//         {/* Contenedor de productos */}
//         <div className="md:flex-grow md:w-1/2 md:p-4">
//           {products.length === 0 ? (
//             <div className="text-center text-gray-500 min-h-screen">
//               <p>No tenemos productos en esta categoría.</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 md:mt-0">
//               {products.map((product) => (
//                 <ProductCard
//                   key={product.id}
//                   product={product}
//                   onAddToCart={handleAddToCart}
//                 />
//               ))}
//             </div>
//           )}
//           {error && <div>{error}</div>}
//           {loading && <div>Cargando...</div>}
//           {/* <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={handlePageChange}
//             hasMore={hasMore}
//           /> */}
//         </div>
//       </div>
//     </div>
//   );
// }
'use client';

import React, { useEffect, useState } from 'react';
import {
  filterProductsByCategoryAndAttributes,
  getAllCategories,
  getAtrtributesByCategory,
} from '@/helpers/peticiones';
import ProductCard from '@/app/components/Cards/ProductCard';
import { Category, Product } from '@/types';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import MenuFilters2 from '../components/MenuComponents/MenuFilter2';
import { useSearchParams } from 'next/navigation';

export default function Menu() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
    undefined,
  );
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [attributes, setAttributes] = useState([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<
    number | undefined
  >(undefined);
  const [selectedAttributes, setSelectedAttributes] = useState<
    { attributeId: number; value: string }[]
  >([]);

  const searchParams = useSearchParams();
  const [categoryParam, setCategoryParam] = useState<string | null>(null);

  useEffect(() => {
    setCategoryParam(searchParams.get('category'));
  }, [searchParams]);

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
    if (categoryParam && categories.length > 0) {
      const categoryId = Number(categoryParam);
      if (!isNaN(categoryId)) {
        setSelectedCategory(categoryId);
        handleSelectCategory(categoryId, false);
      }
    }
  }, [categoryParam, categories]);

  const handleSelectCategory = async (
    categoryId: number,
    isSubcategory = false,
  ) => {
    setLoading(true);
    setError('');

    try {
      if (isSubcategory) {
        setSelectedSubcategory(categoryId);
      } else {
        setSelectedCategory(categoryId);
        setSelectedSubcategory(undefined);

        const category = categories.find((c) => c.id === categoryId);
        setSubcategories(category?.subcategories || []);
      }

      const attributesResponse = await getAtrtributesByCategory({ categoryId });
      setAttributes(attributesResponse);

      const productsResponse = await filterProductsByCategoryAndAttributes({
        categoryId,
        attributes: [],
      });
      setProducts(productsResponse);
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

    try {
      const categoryId = selectedSubcategory || selectedCategory;
      if (!categoryId) return;

      const filteredProducts = await filterProductsByCategoryAndAttributes({
        categoryId,
        attributes: updatedAttributes,
      });

      setProducts(filteredProducts);
    } catch (err) {
      setError('Error al filtrar productos');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    console.log('Añadir al carrito:', product);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="md:flex w-full h-full">
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
          className={`${isFilterOpen ? 'block' : 'hidden'} md:block md:w-1/2 md:p-4 border-b md:border-r border-gray-200 mb-4 md:mb-0`}
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

        <div className="md:flex-grow md:w-1/2 md:p-4">
          {loading && <div>Cargando...</div>}
          {error && <div className="text-red-500">{error}</div>}
          {products.length === 0 ? (
            <div className="text-center text-gray-500 min-h-screen">
              <p>No tenemos productos en esta categoría.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 md:mt-0">
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
  );
}
