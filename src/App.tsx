import { Grid, Layout } from 'antd';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import zeltyLogo from '../logo.svg';
import ProductDetailPage from './pages/ProductDetail/ProductDetailPage';
import ProductsListingPage from './pages/ProductsList/ProductsListingPage';

const { Header, Content } = Layout;
const { useBreakpoint } = Grid;

export default function App() {
  const screens = useBreakpoint();
  const sm = screens.sm !== false;

  return (
    <BrowserRouter>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ display: 'flex', alignItems: 'center' }}>
          <img src={zeltyLogo} alt="Zelty" style={{ height: 28 }} />
        </Header>
        <Content style={{ padding: sm ? '16px 24px' : 8, background: '#f5f5f5' }}>
          <div style={{ background: 'white', borderRadius: sm ? 8 : 0, padding: sm ? 24 : 16 }}>
            <Routes>
              <Route path="/" element={<Navigate to="/products" replace />} />
              <Route path="/products" element={<ProductsListingPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
            </Routes>
          </div>
        </Content>
      </Layout>
    </BrowserRouter>
  );
}
