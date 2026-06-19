import { useMutation, UseMutationResult, useQuery, useQueryClient } from '@tanstack/react-query';
import { Product } from '@src/types';
import { getProduct, updateProduct } from '@src/helpers/api';
import { syncProductInCache } from '@src/helpers/queryCache';

export interface UseProductReturn {
  product: Product | undefined;
  loading: boolean;
  error: unknown;
  toggleActiveMutation: UseMutationResult<Product, Error, void, unknown>;
}

export const useProduct = (id: number): UseProductReturn => {
  const queryClient = useQueryClient();

  const {
    data: product,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: () => {
      if (!product) throw new Error('Produit introuvable.');
      return updateProduct(product.id, { isActive: !product.isActive });
    },
    onSuccess: (updated) => {
      syncProductInCache(queryClient, updated);
    },
  });

  return {
    product,
    loading,
    error,
    toggleActiveMutation,
  };
};
