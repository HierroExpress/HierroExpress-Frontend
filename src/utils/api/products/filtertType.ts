export interface FilterType {
  filter?: string; // Tipo de filtro (string)
  search?: string; // Palabra clave de búsqueda (string)
  min?: number; // Precio mínimo (número)
  max?: number; // Precio máximo (número)
  start?: string; // Fecha de inicio 
  page?: number; // Página de resultados (número)
  limit?: number; // Límite de resultados por página (número)
}
