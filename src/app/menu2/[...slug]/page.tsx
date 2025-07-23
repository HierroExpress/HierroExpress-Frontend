import Menu2 from "../components/menu2";
import { getAllCategories } from '@/helpers/peticiones';
import { 
  findCategoryBySlug, 
  nameToSlug 
} from '@/lib/urlUtils';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface PageProps {
  params: { slug: string[] };
}

// Generate static params for better SEO and performance
export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
  try {
    const categories = await getAllCategories();
    const params: { slug: string[] }[] = [];
    
    // Generate params for main categories
    for (const category of categories.filter(c => c.parentCategory === null)) {
      params.push({ slug: [nameToSlug(category.name)] });
      
      // Generate params for subcategories
      if (category.subcategories) {
        for (const subcategory of category.subcategories) {
          params.push({ 
            slug: [nameToSlug(category.name), nameToSlug(subcategory.name)] 
          });
        }
      }
    }
    
    return params;
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = params;
  
  // Ensure we have valid slug parameters
  if (!slug || slug.length === 0 || !slug[0]) {
    return {
      title: 'Catálogo de Productos - Hierro Express',
      description: 'Explora nuestro catálogo completo de productos. Hierro Express tiene todo lo que necesitas.',
    };
  }
  
  try {
    const categories = await getAllCategories();
    
    if (slug.length === 1) {
      // Single category
      const category = findCategoryBySlug(categories, slug[0]);
      if (category) {
        return {
          title: `${category.name} - Hierro Express`,
          description: `Explora nuestra amplia selección de productos en ${category.name}. Encuentra todo lo que necesitas en Hierro Express.`,
          openGraph: {
            title: `${category.name} - Hierro Express`,
            description: `Explora nuestra amplia selección de productos en ${category.name}. Encuentra todo lo que necesitas en Hierro Express.`,
            url: `https://hierroexpress.com.uy/menu2/${slug[0]}`,
            siteName: 'Hierro Express',
            type: 'website',
          },
          twitter: {
            card: 'summary_large_image',
            title: `${category.name} - Hierro Express`,
            description: `Explora nuestra amplia selección de productos en ${category.name}. Encuentra todo lo que necesitas en Hierro Express.`,
          },
          alternates: {
            canonical: `https://hierroexpress.com.uy/menu2/${slug[0]}`,
          }
        };
      }
    } else if (slug.length === 2 && slug[1]) {
      // Category + Subcategory
      const category = findCategoryBySlug(categories, slug[0]);
      const subcategory = category?.subcategories?.find(sub => nameToSlug(sub.name) === slug[1]);
      
      if (category && subcategory) {
        return {
          title: `${subcategory.name} - ${category.name} - Hierro Express`,
          description: `Descubre productos específicos en ${subcategory.name} dentro de ${category.name}. Hierro Express tiene todo lo que buscas.`,
          openGraph: {
            title: `${subcategory.name} - ${category.name} - Hierro Express`,
            description: `Descubre productos específicos en ${subcategory.name} dentro de ${category.name}. Hierro Express tiene todo lo que buscas.`,
            url: `https://hierroexpress.com.uy/menu2/${slug[0]}/${slug[1]}`,
            siteName: 'Hierro Express',
            type: 'website',
          },
          twitter: {
            card: 'summary_large_image',
            title: `${subcategory.name} - ${category.name} - Hierro Express`,
            description: `Descubre productos específicos en ${subcategory.name} dentro de ${category.name}. Hierro Express tiene todo lo que buscas.`,
          },
          alternates: {
            canonical: `https://hierroexpress.com.uy/menu2/${slug[0]}/${slug[1]}`,
          }
        };
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }

  // Default metadata
  return {
    title: 'Catálogo de Productos - Hierro Express',
    description: 'Explora nuestro catálogo completo de productos. Hierro Express tiene todo lo que necesitas.',
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = params;
  
  // Ensure we have valid slug parameters
  if (!slug || slug.length === 0 || !slug[0]) {
    notFound();
  }
  
  try {
    const categories = await getAllCategories();
    
    if (slug.length === 1) {
      // Single category by name
      const category = findCategoryBySlug(categories, slug[0]);
      
      if (!category) {
        notFound();
      }
      
      return <Menu2 categoryId={category.id} />;
      
    } else if (slug.length === 2 && slug[1]) {
      // Category + Subcategory
      const category = findCategoryBySlug(categories, slug[0]);
      const subcategory = category?.subcategories?.find(sub => nameToSlug(sub.name) === slug[1]);
      
      if (!category || !subcategory) {
        notFound();
      }
      
      return (
        <Menu2 
          categoryId={category.id} 
          subcategoryId={subcategory.id}
        />
      );
      
    } else {
      // Invalid URL format
      notFound();
    }
    
  } catch (error) {
    console.error('Error loading category page:', error);
    notFound();
  }
}