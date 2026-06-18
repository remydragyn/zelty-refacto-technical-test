import { Flex, Grid } from 'antd';
import { exportProductsCsv } from '@src/helpers/export';
import { useCategories } from '@src/hooks/useCategories';
import { useProductsFilters } from '@src/hooks/useProductsFilters';
import { useProductsTable } from '@src/hooks/useProductsTable';
import { useProductsPriceEdit } from '@src/hooks/useProductEditPrice';
import { useProductsBulk } from '@src/hooks/useProductsBulk';
import { ProductsListHeader } from './components/ProductsListHeader/ProductsListHeader';
import { ProductsListSearch } from './components/ProductsListSearch/ProductsListSearch';
import { ProductsListStats } from './components/ProductListStats/ProductListStats';
import { ProductsListTable } from './components/ProductsListingPage/ProductsListTable';
import { ProductsListBulkActionBar } from './components/ProductsListBulkActionBar/ProductsListBulkActionBar';

const { useBreakpoint } = Grid;

export default function ProductsListingPage() {
  const screens = useBreakpoint();
  const isMobile = !screens.sm;

  const filtersVM = useProductsFilters();
  const tableVM = useProductsTable(filtersVM.filters);
  const priceEditVM = useProductsPriceEdit();
  const bulkVM = useProductsBulk(tableVM.items);
  const categoriesVM = useCategories();

  if (tableVM.error)
    return (
      <div style={{ padding: 48, textAlign: 'center', color: '#dc2626' }}>
        {tableVM.error.message}
      </div>
    );

  return (
    <div>
      <ProductsListHeader
        onExport={() => exportProductsCsv(tableVM.items, categoriesVM.getCatName)}
      />
      <Flex gap={8} wrap="wrap" align="center" justify="space-between" style={{ marginBottom: 16 }}>
        <ProductsListSearch filtersVM={filtersVM} categories={categoriesVM.categories} />
        <ProductsListStats stats={tableVM.stats} isMobile={isMobile} />
      </Flex>
      <ProductsListTable
        filtersVM={filtersVM}
        tableVM={tableVM}
        priceEditVM={priceEditVM}
        bulkVM={bulkVM}
        categoriesVM={categoriesVM}
      />
      <ProductsListBulkActionBar bulkVM={bulkVM} />
    </div>
  );
}
