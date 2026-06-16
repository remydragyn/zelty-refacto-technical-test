import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { Product } from '@src/types';
import { API_ROUTES } from '@src/helpers/api';

// A extraire du hook et mettre dans un fichier de call dedié.
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
  // Gerer l'erreur avec la muation
  if (!res.ok) throw new Error('Impossible de mettre à jour le produit.');
  return res.json();
};

export const useProducts = () => {
  const queryClient = useQueryClient();

  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);

  // Should be queries in API call + query params
  const [q, setSearchTerm] = useState('');
  const [productState, setProductState] = useState<'active' | 'inactive'>('active');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  // Pour l'instant dans le front mais changer avec des params de query pour laisser le call gerer
  const items = products
    .filter((p) => (productState === 'active' ? p.isActive : !p.isActive))
    .filter(
      (p) =>
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.description.toLowerCase().includes(q.toLowerCase())
    )
    .filter((p) => (selectedCategory ? p.categoryId === selectedCategory : true));

  // Demander au back de me renvoyer les stats plutot que de les calculer ici.
  // Ca fonctionne uniquement car on récupere tous les produits.
  const stats = {
    active: products.filter((p) => p.isActive).length,
    avgPrice:
      products.length > 0 ? products.reduce((sum, p) => sum + p.price, 0) / products.length : 0,
    expensive: products.filter((p) => p.price > 10).length,
  };

  const useToggleActiveMutation = useMutation({
    mutationFn: (product: Product) => updateProduct(product.id, { isActive: !product.isActive }),
    onSuccess: (updated) => {
      // Si les query params avec été en params, j'aurais plutot invalidate le call avec la query key ['products', { q, productState, selectedCategory }]
      // pour etre sur que les data soient iso avec le serveur
      queryClient.setQueryData<Product[]>(['products'], (prev = []) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      message.success(updated.isActive ? 'Produit activé' : 'Produit désactivé');
    },
  });

  const useSavePriceMutation = useMutation({
    mutationFn: ({ id, price }: { id: number; price: number }) => updateProduct(id, { price }),
    onSuccess: (updated) => {
      queryClient.setQueryData<Product[]>(['products'], (prev = []) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
    },
  });

  const useBulkMutation = useMutation({
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
    items,
    products,
    loading: isLoading,
    error,
    stats,
    q,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    productState,
    setProductState,
    selectedKeys,
    setSelectedKeys,
    useToggleActiveMutation,
    useSavePriceMutation,
    useBulkMutation,
  };
};
