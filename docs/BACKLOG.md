# Backlog d'entraînement

Chaque ticket est rattaché à une exigence de l'appel d'offre (colonne **AO**).
Traite-les comme en Feature Team : une branche par ticket, une PR, la CI au vert, et
une auto-revue avec la *Definition of Done* en bas de page.

Difficulté : 🟢 facile · 🟡 moyen · 🔴 avancé

---

## Sprint 1 : fonctionnalités et composants

### EXP-1 🟢 Favoris commerçants
**AO :** composants React réutilisables, state management (Zustand)

En tant qu'utilisatrice, je veux mettre un commerçant en favori pour le retrouver vite.

- [ ] Créer `favoritesStore` (Zustand + `persist`) : `toggle(id)`, `isFavorite(id)`
- [ ] Ajouter dans `MerchantCard` un bouton cœur avec `aria-pressed` et un libellé explicite
      (« Ajouter Le Petit Bistrot aux favoris »)
- [ ] Ajouter un filtre « Favoris uniquement » dans Explorer
- [ ] Tests : le store (test unitaire) + le clic sur le bouton (RTL)

### EXP-2 🟡 Page détail commerçant
**AO :** intégration d'API REST, routing

- [ ] Route `/explorer/:id` + `merchantQuery(id)` dans `features/explorer/api.ts`
      (l'endpoint `GET /api/merchants/:id` existe déjà dans les mocks)
- [ ] Gérer la 404 avec un écran dédié
- [ ] **Prefetch** au survol de la carte (`queryClient.prefetchQuery`)
- [ ] Remonter le focus sur le `<h1>` à l'arrivée sur la page (accessibilité)

### EXP-3 🟡 Infinite scroll des opérations
**AO :** React Query, performance

- [ ] Remplacer la pagination par `useInfiniteQuery` + `IntersectionObserver`
- [ ] Conserver les filtres dans l'URL
- [ ] Test : simuler l'intersection (mock d'`IntersectionObserver`)

### WAL-1 🟡 Transfert entre soldes (mutation)
**AO :** API REST, React Query (mutations)

- [ ] Ajouter `POST /api/wallets/transfer` dans `mocks/handlers.ts`
      (refuser si solde insuffisant → 422 + message)
- [ ] Formulaire accessible : labels, message d'erreur lié avec `aria-describedby`
- [ ] `useMutation` avec **mise à jour optimiste** + rollback en cas d'erreur
- [ ] Invalider `walletKeys.all` et `transactionKeys.all` au succès

### UI-1 🟢 Design system minimal
**AO :** composants modulaires, Sass

- [ ] Extraire `Select`, `TextField`, `Chip` dans `shared/ui` (aujourd'hui dupliqués)
- [ ] Chaque composant : props typées, `forwardRef` si besoin, styles via tokens Sass
- [ ] Bonus : Storybook avec un story par état (défaut, erreur, désactivé)

---

## Sprint 2 : architecture et qualité

### ARCH-1 🔴 Migrer un store vers Redux Toolkit
**AO :** Redux (listé dans l'environnement technique)

- [ ] Réécrire `explorerStore` avec `createSlice` + `configureStore` + `<Provider>`
- [ ] Comparer les deux implémentations dans un court ADR (`docs/adr/001-state.md`) :
      verbosité, devtools, testabilité, quand choisir l'une ou l'autre
- [ ] Bonus : RTK Query à la place de React Query pour **une** feature, puis comparer

### ARCH-2 🟡 Error Boundary et gestion d'erreurs globale
- [ ] `errorElement` de React Router + un `ErrorBoundary` par page
- [ ] Toast global sur les erreurs de mutation (`MutationCache.onError`)

### ARCH-3 🟡 Variables d'environnement et vrai backend
- [ ] `VITE_API_URL` et `VITE_USE_MOCKS` ; MSW activé seulement si `VITE_USE_MOCKS=true`
- [ ] Valider les réponses API avec **zod** (le contrat n'est plus « supposé »)

### TEST-1 🟢 Couverture
**AO :** tests automatisés (Jest, RTL)

- [ ] Atteindre 80 % de couverture (`npm run test:coverage`) et ajouter un seuil
      `coverageThreshold` dans `jest.config.cjs`
- [ ] Tester `apiFetch` : 204, corps d'erreur invalide, en-tête Authorization

### TEST-2 🟡 Cypress
**AO :** Cypress (en plus de Playwright)

- [ ] Installer Cypress, réécrire `e2e/parcours-utilisateur.spec.ts` en Cypress
- [ ] Ajouter un test de composant Cypress sur `MerchantCard`
- [ ] Noter les différences avec Playwright (API, parallélisme, traces, CI)

---

## Sprint 3 : performance, accessibilité, industrialisation

### PERF-1 🟡 Code splitting
**AO :** optimisation des performances

- [ ] `lazy()` + `Suspense` sur Explorer et Opérations (voir le TODO dans `app/routes.tsx`)
- [ ] Mesurer avant/après : `npx vite build` (taille des chunks) + Lighthouse
- [ ] Analyser le bundle (`rollup-plugin-visualizer`)

### PERF-2 🔴 Virtualisation
- [ ] Passer les mocks à 5 000 commerçants
- [ ] Profiler avec React DevTools Profiler, puis virtualiser la liste (`@tanstack/react-virtual`)
- [ ] Vérifier que `memo` / `useMemo` / `useCallback` ont un effet *mesuré*, pas supposé

### A11Y-1 🟡 Audit RGAA / WCAG
**AO :** accessibilité

- [ ] Ajouter `jest-axe` et un test `toHaveNoViolations` par page
- [ ] Ajouter `@axe-core/playwright` dans les tests E2E
- [ ] Parcours complet au clavier et au lecteur d'écran (NVDA ou VoiceOver)
- [ ] Annoncer les changements de page (titre du document + focus)

### OPS-1 🟢 Docker et CI
**AO :** Git, Docker, CI/CD

- [ ] `docker build -t benefy . && docker run -p 8080:80 benefy`, puis ouvrir `/explorer` et
      rafraîchir (le fallback SPA de nginx doit fonctionner)
- [ ] Ajouter Husky + lint-staged (lint et tests au pre-commit)
- [ ] Ajouter un job qui publie l'image sur GHCR quand on pousse sur `main`

---

## Sprint 4 : l'IA dans le flux de dev
**AO :** « amélioration continue des pratiques de développement, notamment à travers l'utilisation de l'IA »

### AI-1 🟢 Tests assistés par IA
- [ ] Faire générer par un assistant IA les tests d'un composant, puis les **relire de façon critique** :
      trouver au moins un test inutile, fragile ou faux
- [ ] Documenter le prompt utilisé et les corrections dans `docs/ai-log.md`

### AI-2 🟡 Recherche en langage naturel dans Explorer
- [ ] Champ « Que cherchez-vous ? » → l'intention est convertie en filtres
      (`"une boulangerie à Lyon qui prend les titres repas"` → `{category, q, benefit}`)
- [ ] Commencer par un parseur à règles **mocké**, avec une interface prévue pour brancher un LLM
      derrière une route backend (jamais de clé API dans le front)

### AI-3 🟢 Revue de code assistée
- [ ] Faire relire une de tes PR par un assistant IA, puis trier les remarques : pertinentes, discutables, fausses
- [ ] Préparer une réponse d'entretien : « Comment utilisez-vous l'IA au quotidien, et quelles en sont les limites ? »

---

## Definition of Done
- Typecheck, lint et tests passent (`npm run typecheck && npm run lint && npm test`)
- Nouveau code testé (comportement utilisateur, pas détails d'implémentation)
- Accessible au clavier, libellés explicites, contraste AA
- Responsive : 390 px et 1280 px vérifiés
- Pas de `any`, pas de `console.log`, pas de TODO laissé sans ticket
