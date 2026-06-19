import { QueryClient } from '@tanstack/react-query';
import { Product } from '@src/types';

// Centralise la mise à jour du cache produit, partagée entre la liste et le détail.
// Les deux queryKeys représentent la même donnée métier — ce couplage est inhérent
// au domaine, mais on le rend explicite et unique ici plutôt que de le dupliquer
// dans chaque ViewModel.
export const syncProductInCache = (queryClient: QueryClient, updated: Product | Product[]) => {
  const updatedList = Array.isArray(updated) ? updated : [updated];

  updatedList.forEach((product) => {
    queryClient.setQueryData(['product', product.id], product);
  });

  queryClient.setQueryData<Product[]>(['products'], (prev = []) =>
    prev.map((p) => updatedList.find((u) => u.id === p.id) ?? p)
  );
};
