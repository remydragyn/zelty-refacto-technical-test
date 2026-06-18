import { useMutation, UseMutationResult, useQuery, useQueryClient } from '@tanstack/react-query';
import { Product } from '@src/types';
import { ProductFilters } from '@src/hooks/useProductsFilters';
import { getProducts, updateProduct } from '@src/helpers/api';

export interface UseProductsTableReturn {
  items: Product[];
  products: Product[];
  isLoading: boolean;
  error: unknown;
  stats: {
    active: number;
    avgPrice: number;
    expensive: number;
  };
  toggleActiveMutation: UseMutationResult<Product, Error, Product, unknown>;
}

export const useProductsTable = (filters: ProductFilters) => {
  const queryClient = useQueryClient();

  const {
    data: products = [],
    isLoading,
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
    expensive: products.filter((p) => p.price > 10).length,
  };

  // — Mutations
  const toggleActiveMutation = useMutation({
    mutationFn: (product: Product) => updateProduct(product.id, { isActive: !product.isActive }),
    onSuccess: (updated) => {
      queryClient.setQueryData<Product[]>(['products'], (prev = []) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
    },
  });

  return {
    items,
    products,
    isLoading,
    error,
    stats,
    toggleActiveMutation,
  };
};
