# Benefy Explorer

Projet d'entraînement front-end : super-app d'avantages salariés (soldes, opérations, recherche de commerçants).
Je (le développeur) m'entraîne pour une mission Senior React. **Le but est que j'apprenne** : explique
tes choix, propose avant d'implémenter quand il y a plusieurs options, et ne fais pas les tickets à ma place
si je te demande seulement de m'aider ou de relire.

## Commandes
- `npm run dev` : app sur http://localhost:5173 (compte `camille@demo.fr` / `demo1234`)
- `npm test` / `npx jest <chemin>` / `npx jest -t "<nom du test>"`
- `npm run typecheck`, `npm run lint`, `npm run build`
- `npm run e2e` : Playwright (build + preview sur le port 4173)

## Stack
React 19, TypeScript strict, Vite, Sass (modules + tokens), React Router 7, React Query 5, Zustand 5,
Redux Toolkit (installé, pas encore utilisé), Jest + React Testing Library, Playwright, MSW 2.7 (API mockée).

## Architecture
- `src/features/<domaine>/` : écrans, `api.ts` (query keys + `queryOptions`), stores et tests d'un domaine
- `src/shared/` : UI et utilitaires transverses. **Ne doit jamais importer depuis `features/`.**
- `src/api/types.ts` : contrat de l'API, partagé par le front et les mocks
- `src/mocks/handlers.ts` : faux backend MSW, utilisé en dev ET dans les tests
- Détails et justifications : @docs/ARCHITECTURE.md ; tickets : @docs/BACKLOG.md

## Conventions
- Données serveur → React Query. État UI partagé → Zustand. Filtres partageables → URL (`useSearchParams`).
- Tout appel réseau passe par `apiFetch` (`src/api/client.ts`), avec `signal` transmis.
- Chaque feature expose une factory de query keys (`xxxKeys`) ; on invalide via ces clés.
- Styles : un `.module.scss` par composant, valeurs issues de `@/styles/tokens` (pas de couleur en dur).
- Pas de `any`, pas de `console.log`, pas d'export par défaut, imports via l'alias `@/`.
- Textes de l'interface en français.

## Tests
- Tests d'intégration au niveau page avec `renderApp('/route')` de `src/test/render.tsx` (vraies routes).
- Requêtes par rôle accessible (`getByRole`, `getByLabelText`) ; `getByTestId` en dernier recours.
- Simuler une erreur API : `server.use(http.get('/api/...', () => HttpResponse.json(..., { status: 500 })))`.
- Données de mock déterministes : ne pas utiliser `Math.random()` dans `src/mocks/`.
- Nouveau comportement = nouveau test, écrit de préférence **avant** le code.

## Accessibilité
Chaque contrôle a un nom accessible ; boutons bascules avec `aria-pressed` ; erreurs en `role="alert"` ;
cibles de 44 px minimum ; vérifier le parcours au clavier.

## Automatismes (hooks dans `.claude/settings.json`)
- Après chaque édition d'un fichier TS/JS : ESLint `--fix`, et les erreurs restantes te sont renvoyées.
- Avant la fin de ton tour : typecheck + tests Jest liés aux fichiers modifiés ; en cas d'échec tu dois corriger.
- `package-lock.json`, `public/mockServiceWorker.js` et les `.env*` sont protégés en écriture.

## Git
Une branche par ticket : `feat/<id-en-minuscules>-<slug>` (ex. `feat/exp-1-favoris`).
Messages de commit au format Conventional Commits, en français : `feat(explorer): ajoute les favoris (EXP-1)`.
Cocher les cases du ticket dans `docs/BACKLOG.md` au fur et à mesure.
