import { Flex, Grid, Statistic } from 'antd';
import { formatPrice } from '@src/helpers/format';

const { useBreakpoint } = Grid;

interface ProductsStatsProps {
  stats: {
    active: number;
    avgPrice: number;
    expensive: number;
  };
  isMobile: boolean;
}

export const ProductsListStats = ({ stats, isMobile }: ProductsStatsProps) => {
  return (
    <Flex gap={24} wrap="wrap" align="center" style={isMobile ? { marginTop: 16 } : undefined}>
      <Statistic title="Actifs" value={stats.active} />
      <Statistic title="Prix moyen" value={formatPrice(stats.avgPrice)} />
      <Statistic title="Au-dessus de 10 €" value={stats.expensive} />
    </Flex>
  );
};
