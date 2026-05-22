# Test technique — Zelty Back-Office

## Contexte

Ce projet simule un module de gestion de catalogue produits pour une application B2B destinée aux restaurateurs. Un premier développeur a livré une fonctionnalité de base : la page **Catalogue produits** est fonctionnelle, mais le code mérite d'être repris.

Ta mission : **refactoriser ce code** pour le rendre maintenable, testable, et bien structuré.

---

## Installation & démarrage

```bash
yarn
```

**Terminal 1 — API REST locale :**
```bash
yarn api
# → http://localhost:3001
```

**Terminal 2 — Application :**
```bash
yarn dev
# → http://localhost:5173
```

---

## La fonctionnalité

Les pages `src/pages/ProductsPage.tsx` et `src/pages/ProductDetailPage.tsx` permettent de :

- Lister les produits du catalogue
- Filtrer par nom, catégorie, et statut actif/inactif
- Activer ou désactiver un produit
- Modifier le prix d'un produit (clic sur le prix)
- Consulter et éditer le détail d'un produit

Elles sont fonctionnelles. Le résultat final de ta refactorisation doit l'être également.

---

## Ta mission

Refactorise `ProductsPage.tsx` et `ProductDetailPage.tsx` en isolant chaque responsabilité dans la bonne couche. Le code doit être couvert par des **tests unitaires**.

Tu es libre d'organiser les fichiers comme tu le juges approprié.

> Si tu estimes qu'une partie de l'exercice est trop longue à implémenter dans le temps imparti, tu peux choisir de l'expliquer à l'oral plutôt que de la coder — ce qui compte, c'est que tu saches *pourquoi* et *comment* tu l'aurais fait. Les outils à ta disposition sont les tiens : utilise ce qui te rend efficace.

---

## Règles

- **TypeScript strict** — pas de `any`
- Tu peux ajouter des dépendances si nécessaire

---

## Livrable

Un lien vers un dépôt Git (GitHub, GitLab…) ou une archive ZIP du projet.

