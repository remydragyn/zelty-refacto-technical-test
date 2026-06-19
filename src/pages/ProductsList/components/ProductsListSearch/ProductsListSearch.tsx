import { Flex, Grid, Input, Select } from 'antd';
import { Category } from '@src/types';
import { UseProductsFiltersReturn } from '@src/pages/ProductsList/hooks/useProductsFilters';

interface ProductsListSearchProps {
  filtersVM: UseProductsFiltersReturn;
  categories: Category[];
  isMobile?: boolean;
}

export const ProductsListSearch = ({
  filtersVM,
  categories,
  isMobile,
}: ProductsListSearchProps) => {
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
