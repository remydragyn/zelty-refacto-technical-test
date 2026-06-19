// idealement généré par le back
// puis gestions des variables en front

import { Category, Product } from '../types';

// Secret Environment Variable
const BASE = 'http://localhost:3001';

export const API_ROUTES = {
  products: () => `${BASE}/products`,
  product: (id: number | string) => `${BASE}/products/${id}`,
  categories: () => `${BASE}/categories`,
} as const;

// CATEGORIES
export const getCategories = async (): Promise<Category[]> => {
  const res = await fetch(API_ROUTES.categories());
  if (!res.ok) throw new Error('Impossible de charger les catégories.');
  return res.json();
};

// PRODUCTS
export const getProducts = async (): Promise<Product[]> => {
  const res = await fetch(API_ROUTES.products());
  if (!res.ok) throw new Error('Impossible de charger les produits.');
  return res.json();
};

export const getProduct = async (id: number | string): Promise<Product> => {
  const res = await fetch(API_ROUTES.product(id));
  if (!res.ok) throw new Error('Impossible de charger le produit.');
  return res.json();
};

export const updateProduct = async (id: number, body: Partial<Product>): Promise<Product> => {
  const res = await fetch(API_ROUTES.product(id), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Impossible de mettre à jour le produit.');
  return res.json();
};
