// idealement généré par le back
// puis gestions des variables en front

import { Category, Product } from '../types';

// Secret Environment Variable
const BASE = 'http://localhost:3001';

export const API_ROUTES = {
  products: {
    list: () => `${BASE}/products`,
    detail: (id: number | string) => `${BASE}/products/${id}`,
    update: (id: number | string) => `${BASE}/products/${id}`,
  },
  categories: {
    list: () => `${BASE}/categories`,
  },
} as const;

// CATEGORIES
export const getCategories = async (): Promise<Category[]> => {
  const res = await fetch(API_ROUTES.categories.list());
  if (!res.ok) throw new Error('Impossible de charger les catégories.');
  return res.json();
};

// PRODUCTS
export const getProducts = async (): Promise<Product[]> => {
  const res = await fetch(API_ROUTES.products.list());
  if (!res.ok) throw new Error('Impossible de charger les produits.');
  return res.json();
};

export const updateProduct = async (id: number, body: Partial<Product>): Promise<Product> => {
  const res = await fetch(API_ROUTES.products.update(id), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Impossible de mettre à jour le produit.');
  return res.json();
};
