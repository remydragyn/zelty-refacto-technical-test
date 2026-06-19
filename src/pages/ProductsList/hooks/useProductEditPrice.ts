import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Product } from '@src/types';
import { updateProduct } from '@src/helpers/api';

export interface UseProductsPriceEditReturn {
  editingId: number | null;
  editPrice: string;
  setEditPrice: (value: string) => void;
  openEditPrice: (product: Product) => void;
  cancelEditPrice: () => void;
  savePrice: () => Promise<void>;
  isPending: boolean;
}

export const useProductsPriceEdit = () => {
  const queryClient = useQueryClient();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editPrice, setEditPrice] = useState('');

  const savePriceMutation = useMutation({
    mutationFn: ({ id, price }: { id: number; price: number }) => updateProduct(id, { price }),
    onSuccess: (updated) => {
      queryClient.setQueryData<Product[]>(['products'], (prev = []) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
    },
    onSettled: () => {
      setEditingId(null);
      setEditPrice('');
    },
  });

  const openEditPrice = (product: Product) => {
    setEditingId(product.id);
    setEditPrice(product.price.toString());
  };

  const cancelEditPrice = () => {
    setEditingId(null);
    setEditPrice('');
  };

  const savePrice = async (): Promise<void> => {
    if (editingId === null) return;
    const price = parseFloat(editPrice);
    if (isNaN(price) || price < 0) {
      throw new Error('Le prix doit être un nombre positif.');
    }
    await savePriceMutation.mutateAsync({ id: editingId!, price });
  };

  return {
    editingId,
    editPrice,
    setEditPrice,
    openEditPrice,
    cancelEditPrice,
    savePrice,
    isPending: savePriceMutation.isPending,
  };
};
