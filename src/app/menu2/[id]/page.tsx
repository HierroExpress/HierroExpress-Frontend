
import { getAllCategories } from '@/helpers/peticiones';
import { findCategoryById, getCategoryUrlPath } from '@/lib/urlUtils';
import { redirect, notFound } from 'next/navigation';

export default async function LegacySelect({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  
  // Check if id is a number (legacy format)
  const categoryId = parseInt(id, 10);
  
  if (isNaN(categoryId)) {
    notFound();
  }
  
  try {
    const categories = await getAllCategories();
    const category = findCategoryById(categories, categoryId);
    
    if (!category) {
      notFound();
    }
    
    // Redirect to new URL format
    const newUrl = getCategoryUrlPath(category);
    redirect(newUrl);
    
  } catch (error) {
    console.error('Error redirecting legacy URL:', error);
    notFound();
  }
}