import { Button, Col, Descriptions, Flex, Form, Input, InputNumber, Row, Space, Spin, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Category, Product } from '../types';

const API_URL = 'http://localhost:3001';

interface EditFormValues {
  name: string;
  description: string;
  price: number;
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [edit, setIsEditing] = useState(false);
  const [busy, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Produit introuvable.');
        return res.json();
      })
      .then((data: Product) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then((res) => res.json())
      .then((data: Category[]) => setCategories(data));
  }, []);

  const handleSave = async (values: EditFormValues) => {
    if (!product) return;
    setSaving(true);
    const res = await fetch(`${API_URL}/products/${product.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    const updated: Product = await res.json();
    setProduct(updated);
    setIsEditing(false);
    setSaving(false);
  };

  const handleToggleActive = async () => {
    if (!product) return;
    const res = await fetch(`${API_URL}/products/${product.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !product.isActive }),
    });
    const updated: Product = await res.json();
    setProduct(updated);
  };

  const fmtPrice = (price: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);

  const getCatName = (categoryId: number) =>
    categories.find((c) => c.id === categoryId)?.name ?? '—';

  if (loading) return <Spin style={{ display: 'block', padding: 48, textAlign: 'center' }} />;
  if (error || !product)
    return <div style={{ padding: 48, textAlign: 'center', color: '#dc2626' }}>{error ?? 'Produit introuvable.'}</div>;

  return (
    <div>
      <Flex align="center" wrap="wrap" gap={8} style={{ marginBottom: 24 }}>
        <Button onClick={() => navigate('/products')}>← Retour</Button>
        <Typography.Title level={4} style={{ margin: 0 }}>
          {product.name}
        </Typography.Title>
        <Tag color={product.isActive ? 'success' : 'error'}>
          {product.isActive ? 'Actif' : 'Inactif'}
        </Tag>
      </Flex>

      {!edit ? (
        <>
          <Row style={{ marginBottom: 20 }}>
            <Col xs={24} md={18} lg={12}>
              <Descriptions bordered column={1}>
            <Descriptions.Item label="Catégorie">{getCatName(product.categoryId)}</Descriptions.Item>
            <Descriptions.Item label="Description">{product.description}</Descriptions.Item>
            <Descriptions.Item label="Prix">
              <span style={{ color: product.price > 10 ? '#059669' : undefined, fontWeight: 500 }}>
                {fmtPrice(product.price)}
              </span>
            </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
          <Space>
            <Button type="primary" onClick={() => setIsEditing(true)}>
              Modifier
            </Button>
            <Button danger={product.isActive} onClick={handleToggleActive}>
              {product.isActive ? 'Désactiver' : 'Activer'}
            </Button>
          </Space>
        </>
      ) : (
        <Row>
          <Col xs={24} md={18} lg={12}>
        <Form
          layout="vertical"
          initialValues={{ name: product.name, description: product.description, price: product.price }}
          onFinish={handleSave}
        >
          <Form.Item name="name" label="Nom" rules={[{ required: true, message: 'Le nom est requis.' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="price"
            label="Prix"
            rules={[{ required: true, type: 'number', min: 0, message: 'Prix invalide.' }]}
          >
            <InputNumber min={0} step={0.01} style={{ width: 140 }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={busy}>
                Enregistrer
              </Button>
              <Button onClick={() => setIsEditing(false)}>Annuler</Button>
            </Space>
          </Form.Item>
        </Form>
          </Col>
        </Row>
      )}
    </div>
  );
}
