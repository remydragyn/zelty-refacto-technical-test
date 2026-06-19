import { Flex, Statistic } from 'antd';
import { formatPrice } from '@src/helpers/format';

interface ProductsListStatsProps {
  stats: {
    active: number;
    avgPrice: number;
    expensive: number;
  };
  isMobile: boolean;
}

export const ProductsListStats = ({ stats, isMobile }: ProductsListStatsProps) => {
  return (
    <Flex gap={24} wrap="wrap" align="center" style={isMobile ? { marginTop: 16 } : undefined}>
      <Statistic title="Actifs" value={stats.active} />
      <Statistic title="Prix moyen" value={formatPrice(stats.avgPrice)} />
      <Statistic title="Au-dessus de 10 €" value={stats.expensive} />
    </Flex>
  );
};
