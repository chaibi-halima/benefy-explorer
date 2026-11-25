# Architecture et questions d'entretien

Pour chaque choix : **ce qui est fait**, **pourquoi**, et **la question qu'on peut te poser**.

## 1. Organisation par feature
`src/features/<domaine>` regroupe écrans, appels API, état et tests d'un même domaine.
`shared/` ne dépend jamais de `features/`.

- *Pourquoi* : en Feature Team, chaque équipe possède un domaine ; les fichiers qui changent ensemble restent
  ensemble ; on peut supprimer une feature en supprimant un dossier.
- *Question* : « Comment éviter que `shared/` devienne un fourre-tout ? Quand faut-il passer à un monorepo
  ou à des micro-frontends ? »

## 2. État serveur et état client
| Type d'état | Outil | Exemple |
|---|---|---|
| Données serveur (cache, synchronisation, refetch) | **React Query** | soldes, opérations, commerçants |
| État UI partagé | **Zustand** | filtres d'Explorer, session |
| État dans l'URL | **useSearchParams** | filtres des opérations (partageables) |
| État local | `useState` | champs du formulaire de login |

- *Pourquoi* : mettre des données serveur dans Redux ou Zustand oblige à réécrire à la main le cache,
  l'invalidation, la déduplication et les états loading/error.
- *Question* : « Redux, Zustand ou React Query : lequel, quand ? » (ticket ARCH-1 pour pratiquer)

## 3. Query keys et `queryOptions`
Chaque feature expose une *factory* de clés (`transactionKeys.list(filters)`) et des `queryOptions`.
- *Pourquoi* : invalidation ciblée (`invalidateQueries({ queryKey: transactionKeys.all })`), typage de bout
  en bout, réutilisation pour `prefetchQuery` et `useSuspenseQuery`.

## 4. Client API
`apiFetch` centralise : base URL, token, sérialisation JSON, `AbortSignal` (annulation quand un composant
se démonte ou qu'une requête est remplacée), et conversion des erreurs HTTP en `ApiError` typée.
Les 401 sont traitées **une seule fois**, dans `QueryCache.onError`.
- *Question* : « Où gérez-vous le refresh token ? Que se passe-t-il si 5 requêtes reçoivent une 401 en même temps ? »

## 5. Tests
- **Pyramide** : quelques tests unitaires (format, Button), surtout des tests d'**intégration par page**
  (vraies routes, vrai QueryClient, API mockée par MSW), et quelques tests E2E sur les parcours critiques.
- Requêtes par **rôle accessible** (`getByRole('article', { name: 'Repas' })`) : un test qui passe prouve
  aussi que l'élément est accessible.
- MSW plutôt que `jest.mock(fetch)` : on teste le vrai code réseau, et `server.use()` permet de
  simuler une 500 ou une 401 pour un seul test.
- *Question* : « Comment rendez-vous vos tests E2E stables en CI ? » (données déterministes, pas de `sleep`,
  attentes auto de Playwright, retries en CI uniquement, traces au premier retry)

## 6. Accessibilité (déjà en place)
Lien d'évitement, `nav` / `main` / `header`, `aria-pressed` sur les chips, `role="alert"` sur les erreurs,
`aria-live` sur le nombre de résultats, libellés masqués visuellement (`.visually-hidden`), cibles tactiles
de 44 px, `prefers-reduced-motion`, focus visible, contraste AA sur les gris.
- *Question* : « Différence entre `aria-label`, `aria-labelledby` et `aria-describedby` ? »

## 7. Performance (à faire, cf. PERF-1 et PERF-2)
Pistes : code splitting par route, virtualisation des longues listes, `staleTime` adapté à chaque donnée,
prefetch au survol, images responsives, et la mesure avant toute optimisation (Profiler, Lighthouse, Web Vitals).

## 8. Industrialisation
- **Docker** multi-stage : build Node, puis image nginx (environ 25 Mo) avec fallback SPA et cache long sur `/assets`.
- **CI** : lint → typecheck → tests + couverture → build → e2e (rapport uploadé en cas d'échec) → build Docker.
- *Question* : « Comment injecter une config différente par environnement dans une image front déjà buildée ? »
  (indice : `VITE_*` est figé au build ; solution classique : un `config.json` servi au runtime)

## 9. Thème visuel et design tokens
Toutes les valeurs visuelles (couleurs, rayons, ombres, police, graisses) sont dans `src/styles/_tokens.scss`.
Les composants n'utilisent que ces tokens, jamais de valeur en dur. Le thème actuel s'inspire du *langage
visuel* des sites d'avantages salariés (boutons pleins sombres, cartes arrondies, titres très marqués) sans
reprendre l'identité d'une marque réelle : Benefy garde son nom et son rouge.

| Rôle | Token | Usage |
|---|---|---|
| Action | `$color-primary-700` (bleu nuit) | bouton principal, chip et navigation actives, liens |
| Marque | `$color-brand-500` (rouge) | logo, favoris, accents ponctuels |
| Focus | `$color-focus` (bleu vif) | anneau de focus, visible sur fond clair comme sur bleu nuit |
| Contour de champ | `$color-border-strong` | contraste ≥ 3:1 exigé pour les bordures de contrôles (WCAG 1.4.11) |
| Formes | `$radius-sm` 8 px · `$radius-md` 12 px · `$radius-lg` 16 px | boutons et champs · vignettes · cartes |

Variantes de `Button` : `primary` (plein bleu nuit), `secondary` (contour 2 px), `ghost` (texte seul).

**Police** : Ubuntu, **auto-hébergée** via `@fontsource/ubuntu` et importée dans `src/main.tsx` :
seulement le sous-ensemble `latin` (suffisant pour le français) et les graisses 400 et 700
(`$font-weight-bold`), soit environ 65 Ko en woff2. Pour ajouter une graisse, ajouter l'import
`@fontsource/ubuntu/latin-<graisse>.css` correspondant, sinon le navigateur la simule.

- *Pourquoi* : changer de thème revient à modifier un seul fichier, et les tests ne cassent pas puisqu'ils
  interrogent les rôles accessibles et pas les classes CSS. Police auto-hébergée plutôt que Google Fonts :
  pas de requête vers un tiers (l'IP du visiteur transmise à Google pose une question RGPD), pas de
  dépendance réseau externe, et mise en cache avec le reste de `/assets`.
- *Limite* : les tokens Sass sont figés à la compilation. Pour un thème modifiable au runtime (mode sombre,
  marque blanche par client), il faudrait les exposer en variables CSS (`--color-primary`).
- *Question* : « Comment feriez-vous un rebranding complet, ou une marque blanche par client, sans toucher
  aux composants ? »
