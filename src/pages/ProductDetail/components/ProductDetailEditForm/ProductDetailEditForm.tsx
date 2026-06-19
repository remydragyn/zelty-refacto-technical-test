import { Button, Col, Form, Input, InputNumber, Row, Space, message } from 'antd';
import { Product } from '@src/types';
import {
  ProductEditValues,
  UseProductEditReturn,
} from '@src/pages/ProductDetail/hooks/useProductEdit';

interface ProductDetailEditFormProps {
  product: Product;
  editVM: UseProductEditReturn;
}

export const ProductDetailEditForm = ({ product, editVM }: ProductDetailEditFormProps) => {
  const handleFinish = (values: ProductEditValues) => {
    editVM.saveMutation.mutate(
      { id: product.id, values },
      {
        onError: (error) => {
          message.error(error.message);
        },
      }
    );
  };

  return (
    <Row>
      <Col xs={24} md={18} lg={12}>
        <Form
          layout="vertical"
          initialValues={{
            name: product.name,
            description: product.description,
            price: product.price,
          }}
          onFinish={handleFinish}
        >
          <Form.Item
            name="name"
            label="Nom"
            rules={[{ required: true, message: 'Le nom est requis.' }]}
          >
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
              <Button type="primary" htmlType="submit" loading={editVM.saveMutation.isPending}>
                Enregistrer
              </Button>
              <Button onClick={editVM.cancelEdit}>Annuler</Button>
            </Space>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};
