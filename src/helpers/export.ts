import { Product } from '@src/types';
import { formatPrice } from '@src/helpers/format';

// — Export
export const exportProductsCsv = (
  items: Product[],
  getCategorieName: (categoryId: number) => string
) => {
  const rows = [
    // Mutialiser les noms de colonnes avec celle de la table pour éviter les erreurs
    ['Nom', 'Catégorie', 'Description', 'Prix', 'Statut'],
    ...items.map((p) => [
      p.name,
      getCategorieName(p.categoryId),
      p.description,
      formatPrice(p.price),
      p.isActive ? 'Actif' : 'Inactif',
    ]),
  ];
  const csv = rows.map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'catalogue-produits-remy.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
