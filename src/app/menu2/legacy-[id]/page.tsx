
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
    // If it's not a number, this is likely a slug, not a legacy ID
    // Show not found since this route should only handle numeric IDs
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