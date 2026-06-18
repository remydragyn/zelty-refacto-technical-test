import { Flex, Grid, Input, Select } from 'antd';
import { Category } from '@src/types';
import { UseProductsFiltersReturn } from '@src/hooks/useProductsFilters';

const { useBreakpoint } = Grid;

interface ProductsListSearchProps {
  filtersVM: UseProductsFiltersReturn;
  categories: Category[];
}

export const ProductsListSearch = ({ filtersVM, categories }: ProductsListSearchProps) => {
  const screens = useBreakpoint();
  const isMobile = !screens.sm;

  return (
    <Flex gap={8} wrap="wrap" align="center" style={{ marginBottom: 16 }}>
      <Input
        placeholder="Rechercher un produit..."
        value={filtersVM.searchTerm}
        onChange={(e) => filtersVM.setSearchTerm(e.target.value)}
        size="large"
        style={{ width: isMobile ? '100%' : 260 }}
        allowClear
      />
      <Select
        placeholder="Toutes les catégories"
        value={filtersVM.selectedCategory}
        onChange={filtersVM.setSelectedCategory}
        allowClear
        size="large"
        style={{ width: isMobile ? '100%' : 200 }}
        options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
      />
    </Flex>
  );
};
