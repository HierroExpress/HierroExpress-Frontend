import { Category } from '@/types';
import { nameToSlug } from '@/lib/urlUtils';

interface BreadcrumbProps {
  category: Category;
  subcategory?: Category;
}

export default function BreadcrumbStructuredData({ category, subcategory }: BreadcrumbProps) {
  const breadcrumbItems = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Inicio",
      "item": "https://hierroexpress.com.uy"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Catálogo",
      "item": "https://hierroexpress.com.uy/menu2"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": category.name,
      "item": `https://hierroexpress.com.uy/menu2/${nameToSlug(category.name)}`
    }
  ];

  if (subcategory) {
    breadcrumbItems.push({
      "@type": "ListItem",
      "position": 4,
      "name": subcategory.name,
      "item": `https://hierroexpress.com.uy/menu2/${nameToSlug(category.name)}/${nameToSlug(subcategory.name)}`
    });
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}