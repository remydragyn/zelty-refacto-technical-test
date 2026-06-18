import { UseProductsBulkReturn } from '@src/hooks/useProductsBulk';
import { Product } from '@src/types';
import { Affix, Button, Card, Space, Typography } from 'antd';
import { message } from 'antd';

interface ProductsListBulkActionBarProps {
  bulkVM: UseProductsBulkReturn;
}

export const ProductsListBulkActionBar = ({ bulkVM }: ProductsListBulkActionBarProps) => {
  if (bulkVM.selectedKeys.length === 0) return null;

  const handleBulk = (activate: boolean) => {
    bulkVM.bulkMutation.mutate(activate, {
      onSuccess: (updated: Product[]) => {
        message.success(`${updated.length} produit(s) ${activate ? 'activé(s)' : 'désactivé(s)'}`);
      },
      onError: (error: Error) => {
        message.error(`Erreur lors de la mise à jour des produits : ${error.message}`);
      },
    });
  };

  return (
    <Affix offsetBottom={24} style={{ textAlign: 'center' }}>
      <Card
        size="small"
        style={{ display: 'inline-block', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}
      >
        <Space>
          <Typography.Text type="secondary">
            {bulkVM.selectedKeys.length} sélectionné(s)
          </Typography.Text>
          <Button
            size="small"
            type="primary"
            loading={bulkVM.bulkMutation.isPending}
            onClick={() => handleBulk(true)}
          >
            Activer
          </Button>
          <Button
            size="small"
            danger
            loading={bulkVM.bulkMutation.isPending}
            onClick={() => handleBulk(false)}
          >
            Désactiver
          </Button>
          <Button size="small" onClick={() => bulkVM.setSelectedKeys([])}>
            ✕
          </Button>
        </Space>
      </Card>
    </Affix>
  );
};
