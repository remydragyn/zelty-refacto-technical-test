import { Spin } from 'antd';
import { useParams } from 'react-router-dom';
import { useCategories } from '@src/hooks/useCategories';
import { useProduct } from './hooks/useProduct';
import { useProductEdit } from './hooks/useProductEdit';
import { ProductDetailHeader } from './components/ProductDetailHeader/ProductDetailHeader';
import { ProductDetailView } from './components/ProductDetailView/ProductDetailView';
import { ProductDetailEditForm } from './components/ProductDetailEditForm/ProductDetailEditForm';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);

  const productVM = useProduct(productId);
  const editVM = useProductEdit();
  const categoriesVM = useCategories();

  if (productVM.loading) {
    return <Spin style={{ display: 'block', padding: 48, textAlign: 'center' }} />;
  }

  if (productVM.error || !productVM.product) {
    return (
      <div style={{ padding: 48, textAlign: 'center', color: '#dc2626' }}>
        {productVM.error instanceof Error ? productVM.error.message : 'Produit introuvable.'}
      </div>
    );
  }

  return (
    <div>
      <ProductDetailHeader product={productVM.product} />

      {!editVM.isEditing ? (
        <ProductDetailView
          product={productVM.product}
          productVM={productVM}
          editVM={editVM}
          categoriesVM={categoriesVM}
        />
      ) : (
        <ProductDetailEditForm product={productVM.product} editVM={editVM} />
      )}
    </div>
  );
}
