import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@src/helpers/api';
import { CAT_COLORS } from '@src/helpers/constant';
import { Category } from '@src/types';

// A voir la maniere de gerer l'interface de return.
// export type UseCategoriesReturn = ReturnType<typeof useCategories>;
export interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: unknown;
  getCatName: (categoryId: number) => string;
  getCatColor: (categoryId: number) => string;
}

export const useCategories = (): UseCategoriesReturn => {
  const {
    data: categories = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const getCatName = (categoryId: number): string =>
    categories.find((c) => c.id === categoryId)?.name ?? '—';

  const getCatColor = (categoryId: number): string => CAT_COLORS[categoryId % CAT_COLORS.length];

  return { categories, loading, error, getCatName, getCatColor };
};
