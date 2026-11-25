# Benefy Explorer

Projet d'entraînement pour une mission **Senior Frontend React** sur une plateforme d'avantages salariés
(type « super-app » : soldes repas / cadeaux / mobilité, historique, recherche de commerçants partenaires).
*Benefy* est une marque fictive.

> Compte de démo : `camille@demo.fr` / `demo1234`

## Démarrer

```bash
npm install
npm run dev          # http://localhost:5173
```

Aucun backend n'est nécessaire : l'API REST est simulée par **MSW** (Mock Service Worker), qui intercepte
les `fetch` dans le navigateur **et** dans les tests. Le même contrat sert donc partout (`src/api/types.ts`).

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de dev Vite |
| `npm test` / `npm run test:watch` | Tests unitaires et d'intégration (Jest + React Testing Library) |
| `npm run test:coverage` | Couverture |
| `npm run e2e` | Tests end-to-end Playwright (`npx playwright install chromium` la 1re fois) |
| `npm run lint` / `npm run typecheck` | ESLint (avec règles a11y) / TypeScript strict |
| `npm run build` | Build de production |
| `docker build -t benefy . && docker run -p 8080:80 benefy` | Image nginx de production |

## Ce qui est déjà fait (code de référence)

- **Connexion** : store Zustand persistant, routes protégées, redirection vers la page demandée,
  déconnexion automatique sur une 401 (gérée globalement dans le `QueryCache`)
- **Accueil** : soldes par avantage, total, 5 dernières opérations, états chargement / erreur / réessayer
- **Opérations** : filtres **synchronisés avec l'URL**, pagination serveur, `keepPreviousData`
- **Explorer** : recherche avec debounce, chips de catégorie (`aria-pressed`), filtre par avantage, tri
- **Qualité** : 17 tests Jest/RTL (dont des scénarios d'erreur via `server.use`), 3 tests E2E Playwright,
  ESLint + jsx-a11y, CI GitHub Actions (lint → types → tests → build → e2e → docker)

## Ce qu'il te reste à faire

👉 **[docs/BACKLOG.md](docs/BACKLOG.md)** : environ 20 tickets répartis en 4 sprints, chacun relié à une exigence de l'AO
(favoris, page détail, mutation optimiste, migration Redux Toolkit, Cypress, code splitting,
virtualisation, audit RGAA, Docker, et usage de l'IA dans le flux de dev).

👉 **[docs/CLAUDE_CODE.md](docs/CLAUDE_CODE.md)** : travailler le backlog avec Claude Code (hooks, MCP, sous-agents, `/ticket`).

👉 **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** : les choix techniques et les questions d'entretien associées.

## Structure

```
src/
  api/            client fetch typé + contrat de l'API
  app/            shell : routes, layout, QueryClient
  features/       une dossier par domaine métier (auth, wallet, transactions, explorer)
    <feature>/
      api.ts      query keys + queryOptions (React Query)
      *Page.tsx   écrans
      *.test.tsx  tests d'intégration au niveau de la page
  shared/         UI et utilitaires transverses (sans dépendance vers les features)
  mocks/          handlers MSW + données déterministes
  styles/         tokens Sass, mixins, styles globaux
e2e/              tests Playwright
```

## Note technique

MSW est épinglé en **2.7.x** : les versions plus récentes dépendent de paquets publiés uniquement en ESM,
que Jest (CommonJS) ne sait pas charger. C'est une vraie contrainte de projet, à connaître (bonus possible :
migrer vers Vitest et comparer).
