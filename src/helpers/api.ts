// idealement généré par le back
// puis gestions des variables en front

// Secret Environment Variable
const BASE = 'http://localhost:3001';

export const API_ROUTES = {
  products: {
    list: () => `${BASE}/products`,
    detail: (id: number | string) => `${BASE}/products/${id}`,
    update: (id: number | string) => `${BASE}/products/${id}`,
  },
  categories: {
    list: () => `${BASE}/categories`,
  },
} as const;
