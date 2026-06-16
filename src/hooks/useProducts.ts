import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { Product } from '@src/types';
import { API_ROUTES } from '@src/helpers/api';

const getProducts = async (): Promise<Product[]> => {
  const res = await fetch(API_ROUTES.products.list());
  if (!res.ok) throw new Error('Impossible de charger les produits.');
  return res.json();
};

const updateProduct = async (id: number, body: Partial<Product>): Promise<Product> => {
  const res = await fetch(API_ROUTES.products.update(id), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Impossible de mettre à jour le produit.');
  return res.json();
};

export const useProducts = () => {
  const queryClient = useQueryClient();

  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
  const [q, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [tab, setTab] = useState<'active' | 'inactive'>('active');

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
    .filter((p) => (tab === 'active' ? p.isActive : !p.isActive))
    .filter(
      (p) =>
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.description.toLowerCase().includes(q.toLowerCase())
    )
    .filter((p) => (selectedCategory ? p.categoryId === selectedCategory : true));

  // — Stats
  const stats = {
    active: products.filter((p) => p.isActive).length,
    avg: products.length > 0 ? products.reduce((sum, p) => sum + p.price, 0) / products.length : 0,
    expensive: products.filter((p) => p.price > 10).length,
  };

  // — Mutations
  const toggleActive = useMutation({
    mutationFn: (product: Product) => updateProduct(product.id, { isActive: !product.isActive }),
    onSuccess: (updated) => {
      queryClient.setQueryData<Product[]>(['products'], (prev = []) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      message.success(updated.isActive ? 'Produit activé' : 'Produit désactivé');
    },
  });

  const savePrice = useMutation({
    mutationFn: ({ id, price }: { id: number; price: number }) => updateProduct(id, { price }),
    onSuccess: (updated) => {
      queryClient.setQueryData<Product[]>(['products'], (prev = []) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
    },
  });

  const bulk = useMutation({
    mutationFn: async (activate: boolean) => {
      const targets = selectedKeys.filter((id) => {
        const product = products.find((p) => p.id === id);
        return product && product.isActive !== activate;
      });
      return Promise.all(targets.map((id) => updateProduct(id, { isActive: activate })));
    },
    onSuccess: (updated: Product[], activate: boolean) => {
      queryClient.setQueryData<Product[]>(['products'], (prev = []) =>
        prev.map((p) => {
          const match = updated.find((u) => u.id === p.id);
          return match ?? p;
        })
      );
      message.success(`${updated.length} produit(s) ${activate ? 'activé(s)' : 'désactivé(s)'}`);
      setSelectedKeys([]);
    },
  });

  return {
    // Liste & état
    items,
    products,
    isLoading,
    error,
    stats,
    // Filtres
    q,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    tab,
    setTab,
    // Selection
    selectedKeys,
    setSelectedKeys,
    // Mutations
    toggleActive,
    savePrice,
    bulk,
  };
};
