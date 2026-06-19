import { useState } from 'react';
import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { Product } from '@src/types';
import { updateProduct } from '@src/helpers/api';
import { syncProductInCache } from '@src/helpers/queryCache';

export interface ProductEditValues {
  name: string;
  description: string;
  price: number;
}

export interface UseProductEditReturn {
  isEditing: boolean;
  startEdit: () => void;
  cancelEdit: () => void;
  saveMutation: UseMutationResult<
    Product,
    Error,
    { id: number; values: ProductEditValues },
    unknown
  >;
}

export const useProductEdit = (): UseProductEditReturn => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const saveMutation = useMutation({
    mutationFn: ({ id, values }: { id: number; values: ProductEditValues }) => {
      if (!values.name.trim()) {
        throw new Error('Le nom est requis.');
      }
      if (isNaN(values.price) || values.price < 0) {
        throw new Error('Le prix doit être un nombre positif.');
      }
      return updateProduct(id, values);
    },
    onSuccess: (updated) => {
      syncProductInCache(queryClient, updated);
      setIsEditing(false);
    },
  });

  const startEdit = () => setIsEditing(true);
  const cancelEdit = () => setIsEditing(false);

  return {
    isEditing,
    startEdit,
    cancelEdit,
    saveMutation,
  };
};
