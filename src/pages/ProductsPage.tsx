import {
  Affix,
  Button,
  Card,
  Flex,
  Grid,
  Input,
  Select,
  Space,
  Statistic,
  Table,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import type { TableColumnsType } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@src/types';
import { formatPrice } from '@src/helpers/format';
import { useCategories } from '@src/hooks/useCategories';
import { exportProductsCsv } from '@src/helpers/export';
import { useProducts } from '@src/hooks/useProducts';

const { useBreakpoint } = Grid;

export default function ProductsPage() {
  const screens = useBreakpoint();
  const isMobile = !screens.sm;

  const { getCategorieName, getCategorieColor, categories } = useCategories();
  const {
    items,
    loading,
    error,
    stats,
    q,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    productState,
    setProductState,
    useSavePriceMutation,
    useToggleActiveMutation,
    useBulkMutation,
    selectedKeys,
    setSelectedKeys,
  } = useProducts();

  // Je rate un truc ici. Je ne veux pas que le tab soit directement lié à productState.
  // ca devrait etre un params de l'url car ca modifie le call API aussi theoriquement
  const [tab, setTab] = useState<'active' | 'inactive'>(productState);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editPrice, setEditPrice] = useState('');

  const handleToggleActive = async (product: Product) => {
    useToggleActiveMutation.mutate(product);
  };

  const handleEditPrice = (product: Product) => {
    setEditingId(product.id);
    setEditPrice(product.price.toString());
  };

  const handleSavePrice = async () => {
    const price = parseFloat(editPrice);
    if (editingId === null) {
      alert('Aucun produit sélectionné pour la modification du prix.');
      return;
    }
    if (isNaN(price) || price < 0) {
      alert('Le prix doit être un nombre positif.');
      return;
    }
    useSavePriceMutation.mutate({ id: editingId, price });
    // Probleme si erreur de la mutation. l'Id ne sera pas reset.
    // Sera reglé avec le rework de la gestion de mutations
    setEditingId(null);
  };

  const handleExport = () => {
    exportProductsCsv(items, getCategorieName);
  };

  const columns: TableColumnsType<Product> = [
    {
      title: 'Nom',
      dataIndex: 'name',
      // mettre dans routes.ts pour centraliser les routes et eviter de hardcoder les urls
      render: (name: string, record: Product) => <Link to={`/products/${record.id}`}>{name}</Link>,
    },
    {
      title: 'Catégorie',
      dataIndex: 'categoryId',
      render: (categoryId: number) => (
        <Tag color={getCategorieColor(categoryId)}>{getCategorieName(categoryId)}</Tag>
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
        editingId === record.id ? (
          <Space>
            <input
              type="number"
              step="0.01"
              min="0"
              value={editPrice}
              onChange={(e) => setEditPrice(e.target.value)}
              style={{
                width: 80,
                padding: '2px 6px',
                border: '1px solid #d9d9d9',
                borderRadius: 6,
              }}
              autoFocus
            />
            <Button
              size="small"
              type="primary"
              onClick={handleSavePrice}
              loading={useSavePriceMutation.isPending}
            >
              ✓
            </Button>
            <Button size="small" onClick={() => setEditingId(null)}>
              ✕
            </Button>
          </Space>
        ) : (
          <span
            style={{
              cursor: 'pointer',
              color: price > 10 ? '#059669' : undefined,
              fontWeight: 500,
            }}
            onClick={() => handleEditPrice(record)}
            title="Cliquer pour modifier"
          >
            {formatPrice(price)}
          </span>
        ),
    },
    {
      title: 'Actions',
      fixed: 'right' as const,
      width: 120,
      render: (_: unknown, record: Product) => (
        <Button size="small" danger={record.isActive} onClick={() => handleToggleActive(record)}>
          {record.isActive ? 'Désactiver' : 'Activer'}
        </Button>
      ),
    },
  ];

  if (error)
    return (
      <div style={{ padding: 48, textAlign: 'center', color: '#dc2626' }}>{error.message}</div>
    );

  return (
    <div>
      <Flex
        justify="space-between"
        align="center"
        wrap="wrap"
        gap={12}
        style={{ marginBottom: 16 }}
      >
        <Typography.Title level={2} style={{ margin: 0 }}>
          Catalogue produits
        </Typography.Title>
        <Button type="primary" size="large" onClick={handleExport}>
          Exporter CSV
        </Button>
      </Flex>

      <Flex gap={8} wrap="wrap" align="center" justify="space-between" style={{ marginBottom: 16 }}>
        <Flex gap={8} wrap="wrap" align="center">
          <Input
            placeholder="Rechercher un produit..."
            value={q}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="large"
            style={{ width: isMobile ? '100%' : 260 }}
            allowClear
          />
          <Select
            placeholder="Toutes les catégories"
            value={selectedCategory}
            onChange={setSelectedCategory}
            allowClear
            size="large"
            style={{ width: isMobile ? '100%' : 200 }}
            options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
          />
        </Flex>
        <Flex gap={24} wrap="wrap" align="center" style={isMobile ? { marginTop: 16 } : undefined}>
          <Statistic title="Actifs" value={stats.active} />
          <Statistic title="Prix moyen" value={stats.avgPrice} />
          <Statistic title="Au-dessus de 10 €" value={stats.expensive} />
        </Flex>
      </Flex>

      <Tabs
        activeKey={tab}
        onChange={(key) => {
          setTab(key as 'active' | 'inactive');
          setProductState(key as 'active' | 'inactive');
        }}
        items={[
          { key: 'active', label: 'Actifs' },
          { key: 'inactive', label: 'Inactifs' },
        ]}
        style={{ marginBottom: 0 }}
      />

      <Table
        dataSource={items}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={false}
        scroll={{ x: 'max-content' }}
        rowClassName={(record) => (record.isActive ? '' : 'inactive-row')}
        locale={{ emptyText: 'Aucun produit ne correspond aux filtres.' }}
        rowSelection={{
          selectedRowKeys: selectedKeys,
          onChange: (keys) => setSelectedKeys(keys as number[]),
        }}
      />
      {selectedKeys.length > 0 && (
        <Affix offsetBottom={24} style={{ textAlign: 'center' }}>
          <Card
            size="small"
            style={{ display: 'inline-block', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}
          >
            <Space>
              <Typography.Text type="secondary">
                {selectedKeys.length} sélectionné(s)
              </Typography.Text>
              <Button
                size="small"
                type="primary"
                loading={useBulkMutation.isPending}
                onClick={() => useBulkMutation.mutate(true)}
              >
                Activer
              </Button>
              <Button
                size="small"
                danger
                loading={useBulkMutation.isPending}
                onClick={() => useBulkMutation.mutate(false)}
              >
                Désactiver
              </Button>
              <Button size="small" onClick={() => setSelectedKeys([])}>
                ✕
              </Button>
            </Space>
          </Card>
        </Affix>
      )}
    </div>
  );
}
