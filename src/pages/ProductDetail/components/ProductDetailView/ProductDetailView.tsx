import { Button, Col, Descriptions, Row, Space, message } from 'antd';
import { Product } from '@src/types';
import { formatPrice } from '@src/helpers/format';
import { UseCategoriesReturn } from '@src/hooks/useCategories';
import { UseProductReturn } from '@src/pages/ProductDetail/hooks/useProduct';
import { UseProductEditReturn } from '@src/pages/ProductDetail/hooks/useProductEdit';

interface ProductDetailViewProps {
  product: Product;
  productVM: UseProductReturn;
  editVM: UseProductEditReturn;
  categoriesVM: UseCategoriesReturn;
}

export const ProductDetailView = ({
  product,
  productVM,
  editVM,
  categoriesVM,
}: ProductDetailViewProps) => {
  return (
    <>
      <Row style={{ marginBottom: 20 }}>
        <Col xs={24} md={18} lg={12}>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Catégorie">
              {categoriesVM.getCatName(product.categoryId)}
            </Descriptions.Item>
            <Descriptions.Item label="Description">{product.description}</Descriptions.Item>
            <Descriptions.Item label="Prix">
              <span style={{ color: product.price > 10 ? '#059669' : undefined, fontWeight: 500 }}>
                {formatPrice(product.price)}
              </span>
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
      <Space>
        <Button type="primary" onClick={editVM.startEdit}>
          Modifier
        </Button>
        <Button
          danger={product.isActive}
          onClick={() =>
            productVM.toggleActiveMutation.mutate(undefined, {
              onSuccess: (updated) => {
                message.success(updated.isActive ? 'Produit activé' : 'Produit désactivé');
              },
              onError: (error) => {
                message.error(error.message);
              },
            })
          }
        >
          {product.isActive ? 'Désactiver' : 'Activer'}
        </Button>
      </Space>
    </>
  );
};
