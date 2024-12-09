export interface Product {
  id: number; // Identificador único del producto
  name: string; // Nombre del producto
  description: string; // Descripción del producto
  price: number; // Precio del producto
  imgName: string | null; // Nombre de la imagen (puede ser null)
  img: string; // URL de la imagen del producto
  isPopular: boolean; // Indica si el producto es popular
  stock: number | null; // Cantidad de productos en stock
  date: string; // Fecha de creación del producto (ISO 8601)
  deletedAt: string | null; // Fecha de eliminación (puede ser null si no ha sido eliminado)
}

// Define la respuesta de la API como un arreglo de productos
export type ProductList = Product[];
