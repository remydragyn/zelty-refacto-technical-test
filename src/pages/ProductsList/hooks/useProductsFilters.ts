import { useState } from 'react';

export type ProductState = 'active' | 'inactive';

export interface ProductFilters {
  searchTerm: string;
  selectedCategory: number | null;
  productState: ProductState;
}

export interface UseProductsFiltersReturn {
  filters: ProductFilters;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCategory: number | null;
  setSelectedCategory: (value: number | null) => void;
  productState: ProductState;
  setProductState: (value: ProductState) => void;
}

export const useProductsFilters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [productState, setProductState] = useState<ProductState>('active');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const filters: ProductFilters = {
    searchTerm,
    selectedCategory,
    productState,
  };

  return {
    filters,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    productState,
    setProductState,
  };
};
