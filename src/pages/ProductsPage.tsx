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
  message,
} from 'antd';
import type { TableColumnsType } from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { API_ROUTES } from '../helpers/api';
import { formatPrice } from '../helpers/format';
import { useCategories } from '../hooks/useCategories';

const { useBreakpoint } = Grid;

export default function ProductsPage() {
  const screens = useBreakpoint();
  const isMobile = !screens.sm;

  const { getCategorieName, getCategorieColor, categories } = useCategories();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [tab, setTab] = useState<'active' | 'inactive'>('active');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [saving, setSaving] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(API_ROUTES.products.list())
      .then((res) => res.json())
      .then((data: Product[]) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Impossible de charger les produits.');
        setLoading(false);
      });
  }, []);

  const handleToggleActive = async (product: Product) => {
    const res = await fetch(API_ROUTES.products.update(product.id), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !product.isActive }),
    });
    const updated: Product = await res.json();
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    message.success(updated.isActive ? 'Produit activé' : 'Produit désactivé');
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
    setSaving(true);
    const res = await fetch(API_ROUTES.products.update(editingId), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price }),
    });
    const updated: Product = await res.json();
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setEditingId(null);
    setEditPrice('');
    setSaving(false);
  };

  const handleBulk = async (activate: boolean) => {
    setBulkLoading(true);
    const count = selectedKeys.length;
    for (const id of selectedKeys) {
      const product = products.find((p) => p.id === id);
      if (!product || product.isActive === activate) continue;
      const res = await fetch(API_ROUTES.products.update(id), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: activate }),
      });
      const updated: Product = await res.json();
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    }
    setSelectedKeys([]);
    setBulkLoading(false);
    message.success(`${count} produit(s) ${activate ? 'activé(s)' : 'désactivé(s)'}`);
  };

  const handleExport = () => {
    const rows = [
      ['Nom', 'Catégorie', 'Description', 'Prix', 'Statut'],
      ...items.map((p) => [
        p.name,
        getCategorieName(p.categoryId),
        p.description,
        formatPrice(p.price),
        p.isActive ? 'Actif' : 'Inactif',
      ]),
    ];
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'catalogue-produits.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const items = products
    .filter((p) => (tab === 'active' ? p.isActive : !p.isActive))
    .filter(
      (p) =>
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.description.toLowerCase().includes(q.toLowerCase())
    )
    .filter((p) => (selectedCategory ? p.categoryId === selectedCategory : true));

  const active = products.filter((p) => p.isActive).length;
  const avg =
    products.length > 0 ? products.reduce((sum, p) => sum + p.price, 0) / products.length : 0;
  const expensive = products.filter((p) => p.price > 10).length;

  const columns: TableColumnsType<Product> = [
    {
      title: 'Nom',
      dataIndex: 'name',
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
            <Button size="small" type="primary" onClick={handleSavePrice} loading={saving}>
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
    return <div style={{ padding: 48, textAlign: 'center', color: '#dc2626' }}>{error}</div>;

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
          <Statistic title="Actifs" value={active} />
          <Statistic title="Prix moyen" value={formatPrice(avg)} />
          <Statistic title="Au-dessus de 10 €" value={expensive} />
        </Flex>
      </Flex>

      <Tabs
        activeKey={tab}
        onChange={(key) => setTab(key as 'active' | 'inactive')}
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
                loading={bulkLoading}
                onClick={() => handleBulk(true)}
              >
                Activer
              </Button>
              <Button size="small" danger loading={bulkLoading} onClick={() => handleBulk(false)}>
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
