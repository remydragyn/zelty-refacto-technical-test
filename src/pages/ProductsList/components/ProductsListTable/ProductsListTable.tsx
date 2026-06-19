import { Button, Input, Space, Table, Tabs, Tag } from 'antd';
import type { TableColumnsType } from 'antd';
import { message } from 'antd';
import { Link } from 'react-router-dom';
import { Product } from '@src/types';
import { formatPrice } from '@src/helpers/format';
import { UseProductsTableReturn } from '@src/pages/ProductsList/hooks/useProductsTable';
import { UseProductsPriceEditReturn } from '@src/pages/ProductsList/hooks/useProductEditPrice';
import { UseProductsBulkReturn } from '@src/pages/ProductsList/hooks/useProductsBulk';
import { UseCategoriesReturn } from '@src/hooks/useCategories';
import { UseProductsFiltersReturn } from '@src/pages/ProductsList/hooks/useProductsFilters';
import { EXPENSIVE_THRESHOLD } from '@src/helpers/constant';
import { ROUTES } from '@src/helpers/routes';

interface ProductsListTableProps {
  filtersVM: UseProductsFiltersReturn;
  tableVM: UseProductsTableReturn;
  priceEditVM: UseProductsPriceEditReturn;
  bulkVM: UseProductsBulkReturn;
  categoriesVM: UseCategoriesReturn;
}

export const ProductsListTable = ({
  filtersVM,
  tableVM,
  priceEditVM,
  bulkVM,
  categoriesVM,
}: ProductsListTableProps) => {
  const columns: TableColumnsType<Product> = [
    {
      title: 'Nom',
      dataIndex: 'name',
      render: (name: string, record: Product) => <Link to={ROUTES.product(record.id)}>{name}</Link>,
    },
    {
      title: 'Catégorie',
      dataIndex: 'categoryId',
      render: (categoryId: number) => (
        <Tag color={categoriesVM.getCatColor(categoryId)}>
          {categoriesVM.getCatName(categoryId)}
        </Tag>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      ellipsis: true,
    },
    {
      title: 'Prix',
      dataIndex: 'price',
      render: (price: number, record: Product) =>
        priceEditVM.editingId === record.id ? (
          <Space>
            <Input
              type="number"
              step={0.01}
              min={0}
              value={priceEditVM.editPrice}
              onChange={(e) => priceEditVM.setEditPrice(e.target.value)}
              style={{ width: 80 }}
              autoFocus
            />
            <Button
              size="small"
              type="primary"
              loading={priceEditVM.pending}
              onClick={async () => {
                try {
                  await priceEditVM.savePrice();
                } catch (err) {
                  message.error(
                    err instanceof Error ? err.message : 'Erreur lors de la sauvegarde.'
                  );
                }
              }}
            >
              ✓
            </Button>
            <Button size="small" onClick={priceEditVM.cancelEditPrice}>
              ✕
            </Button>
          </Space>
        ) : (
          <span
            style={{
              cursor: 'pointer',
              color: price > EXPENSIVE_THRESHOLD ? '#059669' : undefined,
              fontWeight: 500,
            }}
            onClick={() => priceEditVM.openEditPrice(record)}
            title="Cliquer pour modifier"
          >
            {formatPrice(price)}
          </span>
        ),
    },
    {
      title: 'Actions',
      fixed: 'right',
      width: 120,
      render: (_: unknown, record: Product) => (
        <Button
          size="small"
          danger={record.isActive}
          onClick={() =>
            tableVM.toggleActiveMutation.mutate(record, {
              onSuccess: (updated) => {
                message.success(updated.isActive ? 'Produit activé' : 'Produit désactivé');
              },
            })
          }
        >
          {record.isActive ? 'Désactiver' : 'Activer'}
        </Button>
      ),
    },
  ];

  return (
    <>
      <Tabs
        activeKey={filtersVM.productState}
        onChange={(key) => filtersVM.setProductState(key as 'active' | 'inactive')}
        items={[
          { key: 'active', label: 'Actifs' },
          { key: 'inactive', label: 'Inactifs' },
        ]}
        style={{ marginBottom: 0 }}
      />
      <Table
        dataSource={tableVM.items}
        columns={columns}
        rowKey="id"
        loading={tableVM.loading}
        pagination={false}
        scroll={{ x: 'max-content' }}
        rowClassName={(record) => (record.isActive ? '' : 'inactive-row')}
        locale={{ emptyText: 'Aucun produit ne correspond aux filtres.' }}
        rowSelection={{
          selectedRowKeys: bulkVM.selectedKeys,
          onChange: (keys) => bulkVM.setSelectedKeys(keys as number[]),
        }}
      />
    </>
  );
};
