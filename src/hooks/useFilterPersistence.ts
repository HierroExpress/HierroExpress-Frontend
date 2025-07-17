'use client';

import { useCallback } from 'react';

interface FilterState {
  selectedCategory?: number;
  selectedSubcategory?: number;
  selectedAttributes: { attributeId: number; value: string }[];
}

const FILTER_STORAGE_KEY = 'menu2_filter_state';

export const useFilterPersistence = () => {
  
  const saveFilterState = useCallback((filterState: FilterState) => {
    try {
      localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filterState));
    } catch (error) {
      console.warn('Failed to save filter state to localStorage:', error);
    }
  }, []);

  const loadFilterState = useCallback((): FilterState | null => {
    try {
      const stored = localStorage.getItem(FILTER_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load filter state from localStorage:', error);
    }
    return null;
  }, []);

  const clearFilterState = useCallback(() => {
    try {
      localStorage.removeItem(FILTER_STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear filter state from localStorage:', error);
    }
  }, []);

  return {
    saveFilterState,
    loadFilterState,
    clearFilterState,
  };
};