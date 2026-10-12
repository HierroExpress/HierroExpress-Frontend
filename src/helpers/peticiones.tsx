import { Product, Category } from '../types';


// const API_URL = 'https://chilyapi.onrender.com';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
const serverApiOrigin = process.env.API_INTERNAL_URL ||
  (process.env.NODE_ENV === 'production' ? 'http://api:3002' : 'http://127.0.0.1:3002');
const absoluteApiUrl = (path: string) =>
  API_URL.startsWith('http')
    ? `${API_URL}${path}`
    : `${typeof window === 'undefined' ? serverApiOrigin : `${window.location.origin}${API_URL}`}${path}`;

// Helper function to filter out products with price 0
const filterProductsWithPrice = (products: Product[]): Product[] => {
  return products.filter(product => product.price > 0);
};


export async function getProducts(
  page: number,
  limit: number,
  options: {
    filter?: number;
    search?: string;
    min?: number;
    max?: number;
    price?: 'min' | 'max';
    appliedFilters?: string[];
  } = {},
): Promise<any[]> {
  try {
    let url = new URL(absoluteApiUrl('/products/filter'));

    url.searchParams.append('page', page.toString());
    url.searchParams.append('limit', limit.toString());

    if (options.filter !== undefined) {
      url.searchParams.append('filter', options.filter.toString());
    }
    if (options.search) {
      url.searchParams.append('search', options.search);
    }
    if (options.min !== undefined) {
      url.searchParams.append('min', options.min.toString());
    }
    if (options.max !== undefined) {
      url.searchParams.append('max', options.max.toString());
    }

    // Añadir price si existe
    if (options.price) {
      url.searchParams.append('price', options.price);
    }

    // Añadir filtros aplicados si existen
    if (options.appliedFilters && options.appliedFilters.length > 0) {
      const filtersToApply = options.appliedFilters.join(',');
      url.searchParams.append('filter', filtersToApply);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener productos');
    }

    const products: any[] = await response.json();
    return filterProductsWithPrice(products);
  } catch (error) {
    console.error('Error en getProducts:', error);
    throw error;
  }
}


export async function getProductById(id: number): Promise<Product> {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error('Error al obtener el producto');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error en getProductById para id ${id}:`, error);
    throw error;
  }
}


export async function getProductsByCategoryId(
  id: number,
  page: number,
  limit: number,
  appliedFilters?: string[],
): Promise<Product[]> {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (appliedFilters && appliedFilters.length > 0) {
      const filtersQueryParam = appliedFilters.join(',');
      queryParams.append('filter', filtersQueryParam);
    }
    const url = `${API_URL}/category/${id}?${queryParams}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error al obtener productos para la categoría ${id}`);
    }

    const categoryData: Category = await response.json();

    if (!categoryData || !categoryData.products) {
      throw new Error(`Datos de productos faltantes para la categoría ${id}`);
    }

    const products: Product[] = categoryData.products;
    
    return filterProductsWithPrice(products);
  } catch (error) {
    console.error(`Error en getProductsByCategoryId para id ${id}:`, error);
    throw error;
  }
}
export async function getAllCategories(): Promise<Category[]> {
  try {
    const res = await fetch(absoluteApiUrl('/category'), {
      method: 'GET',
      next: { revalidate: 3600 },
    })
    
    if (!res.ok) {
      throw new Error('Error al obtener las categorías');
    }
    const categories: Category[] = await res.json();
    return categories;
  } catch (error) {
    console.error('Error en getAllCategories:', error);
    throw error;
  }
}

export const filterProductsByCategoryAndAttributes = async ({
  categoryId,
  attributes,
}: {
  categoryId: number;
  attributes: { attributeId: number; value: string }[];
}) => {
  try {
    const url = new URL(absoluteApiUrl('/products/filterByCategoryIdAndAtributes'));
    url.searchParams.append('categoryId', categoryId.toString());

    if (attributes.length > 0) {
      const attributeParams = attributes.map((attribute) => {
        return `${attribute.attributeId}:${attribute.value}`;
      });
      url.searchParams.append('attributes', attributeParams.join(','));
    }

    console.log('Fetching:', url.toString());

    const response = await fetch(url.toString());
    console.log('Response3333333333333333333:', response);

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.statusText}`);
    }

    const data = await response.json();
    return filterProductsWithPrice(data);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw error;
  }
};


export const getAtrtributesByCategory = async ({
  categoryId,
}: {
  categoryId: number;
}) => {
  try {
    const response = await fetch(
      `${API_URL}/products/attributesByCategoryId/${categoryId}`,
    );

    // Verificamos si la respuesta fue exitosa
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener atributos:', error);
    throw error;
  }
};
