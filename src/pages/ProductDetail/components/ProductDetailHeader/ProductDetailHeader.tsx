import { Button, Flex, Tag, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Product } from '@src/types';
import { ROUTES } from '@src/helpers/routes';

interface ProductDetailHeaderProps {
  product: Product;
}

export const ProductDetailHeader = ({ product }: ProductDetailHeaderProps) => {
  const navigate = useNavigate();

  return (
    <Flex align="center" wrap="wrap" gap={8} style={{ marginBottom: 24 }}>
      <Button onClick={() => navigate(ROUTES.products())}>← Retour</Button>
      <Typography.Title level={4} style={{ margin: 0 }}>
        {product.name}
      </Typography.Title>
      <Tag color={product.isActive ? 'success' : 'error'}>
        {product.isActive ? 'Actif' : 'Inactif'}
      </Tag>
    </Flex>
  );
};
