import { Button, Flex, Typography } from 'antd';

interface ProductsListHeaderProps {
  onExport: () => void;
}

export const ProductsListHeader = ({ onExport }: ProductsListHeaderProps) => {
  return (
    <Flex justify="space-between" align="center" wrap="wrap" gap={12} style={{ marginBottom: 16 }}>
      <Typography.Title level={2} style={{ margin: 0 }}>
        Catalogue produits
      </Typography.Title>
      <Button type="primary" size="large" onClick={onExport}>
        Exporter CSV
      </Button>
    </Flex>
  );
};
