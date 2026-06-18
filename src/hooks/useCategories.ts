import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@src/helpers/api';
import { CAT_COLORS } from '@src/helpers/constant';
import { Category } from '@src/types';

// Ne pas faire ca permet d'etre certain du return.
// export type UseCategoriesReturn = ReturnType<typeof useCategories>;

export interface UseCategoriesReturn {
  categories: Category[];
  isLoading: boolean;
  error: unknown;
  getCatName: (categoryId: number) => string;
  getCatColor: (categoryId: number) => string;
}

export const useCategories = () => {
  const {
    data: categories = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const getCatName = (categoryId: number): string =>
    categories.find((c) => c.id === categoryId)?.name ?? '—';

  const getCatColor = (categoryId: number): string => CAT_COLORS[categoryId % CAT_COLORS.length];

  return { categories, isLoading, error, getCatName, getCatColor };
};
