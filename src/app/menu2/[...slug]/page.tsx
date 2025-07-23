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

// Allow dynamic params that weren't generated at build time
export const dynamicParams = true;

// Disable static generation to allow fully dynamic routing
export const dynamic = 'force-dynamic';

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
          },
          robots: {
            index: true,
            follow: true,
            googleBot: {
              index: true,
              follow: true,
              'max-video-preview': -1,
              'max-image-preview': 'large',
              'max-snippet': -1,
            },
          },
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
          },
          robots: {
            index: true,
            follow: true,
            googleBot: {
              index: true,
              follow: true,
              'max-video-preview': -1,
              'max-image-preview': 'large',
              'max-snippet': -1,
            },
          },
        };
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
    // Fallback metadata when API fails - create a reasonable title from the slug
    const categoryName = slug[0].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return {
      title: `${categoryName} - Hierro Express`,
      description: `Explora nuestra selección de productos en ${categoryName}. Hierro Express tiene todo lo que necesitas.`,
    };
  }

  // Default metadata - create a reasonable title from the slug
  const categoryName = slug[0].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return {
    title: `${categoryName} - Hierro Express`,
    description: `Explora nuestra selección de productos en ${categoryName}. Hierro Express tiene todo lo que necesitas.`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = params;
  
  // Ensure we have valid slug parameters
  if (!slug || slug.length === 0 || !slug[0]) {
    notFound();
  }
  
  let categories: any[] = [];
  
  try {
    categories = await getAllCategories();
  } catch (error) {
    console.error('Error loading categories from API:', error);
    // When API fails, pass undefined categoryId to let Menu2 handle the error gracefully
    // This prevents showing "Category not found" when it's actually a connectivity issue
    if (slug.length === 1) {
      return <Menu2 categoryId={undefined} />;
    } else if (slug.length === 2 && slug[1]) {
      return <Menu2 categoryId={undefined} subcategoryId={undefined} />;
    } else {
      notFound();
    }
  }
  
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
}