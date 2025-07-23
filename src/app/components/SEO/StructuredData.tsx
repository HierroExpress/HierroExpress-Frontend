import { Category } from '@/types';
import { nameToSlug } from '@/lib/urlUtils';

interface StructuredDataProps {
  category: Category;
  subcategory?: Category;
}

export default function StructuredData({ category, subcategory }: StructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": subcategory ? `${subcategory.name} - ${category.name}` : category.name,
    "description": subcategory 
      ? `Productos de ${subcategory.name} en la categoría ${category.name} - Hierro Express`
      : `Productos de ${category.name} - Hierro Express`,
    "url": subcategory 
      ? `https://hierroexpress.com.uy/menu2/${nameToSlug(category.name)}/${nameToSlug(subcategory.name)}`
      : `https://hierroexpress.com.uy/menu2/${nameToSlug(category.name)}`,
    "provider": {
      "@type": "Organization",
      "name": "Hierro Express",
      "url": "https://hierroexpress.com.uy",
      "logo": "https://hierroexpress.com.uy/logo.png"
    },
    "potentialAction": {
      "@type": "ViewAction",
      "target": subcategory 
        ? `https://hierroexpress.com.uy/menu2/${nameToSlug(category.name)}/${nameToSlug(subcategory.name)}`
        : `https://hierroexpress.com.uy/menu2/${nameToSlug(category.name)}`,
      "name": "Ver Productos"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}