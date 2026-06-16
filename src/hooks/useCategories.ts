import { API_ROUTES } from '../helpers/api';
import { Category } from '../types';
import { useQuery } from '@tanstack/react-query';
import { CAT_COLORS } from '../helpers/constant';

interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  getCategorieName: (categoryId: number) => string;
  getCategorieColor: (categoryId: number) => string;
}

// Move to commun api call file
const getCategories = async (): Promise<Category[]> => {
  const res = await fetch(API_ROUTES.categories.list());
  // Replace With default error message to constant
  if (!res.ok) throw new Error('Impossible de charger les catégories.');
  const data: Category[] = await res.json();
  return data;
};

export const useCategories = (): UseCategoriesReturn => {
  const {
    data: categories = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const getCategorieName = (categoryId: number) => {
    return categories.find((c) => c.id === categoryId)?.name ?? '—';
  };

  // C'est Full Ui donc plutot dans le composant categorieLabel ?
  const getCategorieColor = (categoryId: number) => {
    return CAT_COLORS[categoryId % CAT_COLORS.length];
  };

  return {
    categories,
    getCategorieName,
    getCategorieColor,
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
  };
};
