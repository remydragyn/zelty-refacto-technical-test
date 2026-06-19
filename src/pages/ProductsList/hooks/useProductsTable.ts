import { useMutation, UseMutationResult, useQuery, useQueryClient } from '@tanstack/react-query';
import { Product } from '@src/types';
import { getProducts, updateProduct } from '@src/helpers/api';
import { ProductFilters } from './useProductsFilters';
import { EXPENSIVE_THRESHOLD } from '@src/helpers/constant';
import { syncProductInCache } from '@src/helpers/queryCache';

export interface UseProductsTableReturn {
  items: Product[];
  loading: boolean;
  error: Error | null;
  stats: {
    active: number;
    avgPrice: number;
    expensive: number;
  };
  toggleActiveMutation: UseMutationResult<Product, Error, Product, unknown>;
}

export const useProductsTable = (filters: ProductFilters): UseProductsTableReturn => {
  const queryClient = useQueryClient();

  const {
    data: products = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  // — Liste dérivée
  const items = products
    .filter((p) => (filters.productState === 'active' ? p.isActive : !p.isActive))
    .filter(
      (p) =>
        p.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(filters.searchTerm.toLowerCase())
    )
    .filter((p) => (filters.selectedCategory ? p.categoryId === filters.selectedCategory : true));

  // — Stats
  const stats = {
    active: products.filter((p) => p.isActive).length,
    avgPrice:
      products.length > 0 ? products.reduce((sum, p) => sum + p.price, 0) / products.length : 0,
    expensive: products.filter((p) => p.price > EXPENSIVE_THRESHOLD).length,
  };

  // — Mutations
  const toggleActiveMutation = useMutation({
    mutationFn: (product: Product) => updateProduct(product.id, { isActive: !product.isActive }),
    onSuccess: (updated) => {
      syncProductInCache(queryClient, updated);
    },
  });

  return {
    items,
    loading,
    error,
    stats,
    toggleActiveMutation,
  };
};
