import { useState } from 'react';
import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { Product } from '@src/types';
import { updateProduct } from '@src/helpers/api';
import { syncProductInCache } from '@src/helpers/queryCache';

export interface UseProductsBulkReturn {
  selectedKeys: number[];
  setSelectedKeys: (keys: number[]) => void;
  bulkMutation: UseMutationResult<Product[], Error, boolean, unknown>;
}

export const useProductsBulk = (items: Product[]) => {
  const queryClient = useQueryClient();
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);

  const bulkMutation = useMutation({
    mutationFn: async (activate: boolean) => {
      const targets = selectedKeys.filter((id) => {
        const product = items.find((p) => p.id === id);
        return product && product.isActive !== activate;
      });
      if (targets.length === 0) return [];
      return Promise.all(targets.map((id) => updateProduct(id, { isActive: activate })));
    },
    onSuccess: (updated) => {
      syncProductInCache(queryClient, updated);
      setSelectedKeys([]);
    },
  });

  return {
    selectedKeys,
    setSelectedKeys,
    bulkMutation,
  };
};
