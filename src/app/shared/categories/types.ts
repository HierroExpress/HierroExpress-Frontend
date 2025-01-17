export interface Category {
  id: number;
  name: string;
  description: string;
  image: React.FC<React.SVGProps<SVGSVGElement>>;
}
export interface CategoryResponse {
  id: number;
  name: string;
  icon: string;
  subcategories?: [];
}
