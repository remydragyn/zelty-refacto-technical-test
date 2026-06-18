import { useState } from 'react';
import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { Product } from '@src/types';
import { updateProduct } from '@src/helpers/api';

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
      return Promise.all(targets.map((id) => updateProduct(id, { isActive: activate })));
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<Product[]>(['products'], (prev = []) =>
        prev.map((p) => {
          const match = updated.find((u) => u.id === p.id);
          return match ?? p;
        })
      );
      setSelectedKeys([]);
    },
  });

  return {
    selectedKeys,
    setSelectedKeys,
    bulkMutation,
  };
};
