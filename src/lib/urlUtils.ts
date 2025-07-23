import { Category } from '@/types';

/**
 * Converts a category name to a URL-friendly slug
 * @param name - Category name to convert
 * @returns URL-friendly slug
 */
export const nameToSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize('NFD') // Decompose characters to handle accents
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Finds a category by its slug (name converted to URL format)
 * @param categories - Array of categories to search in
 * @param slug - URL slug to match
 * @returns Category object if found, undefined otherwise
 */
export const findCategoryBySlug = (categories: Category[], slug: string): Category | undefined => {
  // First search in main categories
  const mainCategory = categories.find(category => nameToSlug(category.name) === slug);
  if (mainCategory) return mainCategory;
  
  // Then search in subcategories
  for (const category of categories) {
    if (category.subcategories) {
      const subcategory = category.subcategories.find(sub => nameToSlug(sub.name) === slug);
      if (subcategory) return subcategory;
    }
  }
  
  return undefined;
};

/**
 * Finds a category by its ID
 * @param categories - Array of categories to search in
 * @param id - Category ID to match
 * @returns Category object if found, undefined otherwise
 */
export const findCategoryById = (categories: Category[], id: number): Category | undefined => {
  // Search in main categories
  const category = categories.find(cat => cat.id === id);
  if (category) return category;
  
  // Search in subcategories
  for (const cat of categories) {
    if (cat.subcategories) {
      const subcategory = cat.subcategories.find(sub => sub.id === id);
      if (subcategory) return subcategory;
    }
  }
  
  return undefined;
};

/**
 * Generates a category URL path using the category name as slug
 * @param category - Category object
 * @returns URL path
 */
export const getCategoryUrlPath = (category: Category): string => {
  return `/menu2/${nameToSlug(category.name)}`;
};

/**
 * Generates a category URL path with subcategory using both names as slugs
 * @param category - Main category object
 * @param subcategory - Subcategory object
 * @returns URL path with both category and subcategory
 */
export const getCategoryWithSubcategoryUrlPath = (category: Category, subcategory: Category): string => {
  return `/menu2/${nameToSlug(category.name)}/${nameToSlug(subcategory.name)}`;
};

/**
 * Gets all categories flattened (includes both main categories and subcategories)
 * @param categories - Array of categories
 * @returns Flattened array of all categories
 */
export const getAllCategoriesFlattened = (categories: Category[]): Category[] => {
  const flattened: Category[] = [];
  
  for (const category of categories) {
    flattened.push(category);
    if (category.subcategories) {
      flattened.push(...category.subcategories);
    }
  }
  
  return flattened;
};

/**
 * Finds parent category of a subcategory
 * @param categories - Array of categories
 * @param subcategoryId - ID of the subcategory
 * @returns Parent category if found, undefined otherwise
 */
export const findParentCategory = (categories: Category[], subcategoryId: number): Category | undefined => {
  for (const category of categories) {
    if (category.subcategories?.some(sub => sub.id === subcategoryId)) {
      return category;
    }
  }
  return undefined;
};