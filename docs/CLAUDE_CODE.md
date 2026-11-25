# Travailler le backlog avec Claude Code

## 1. Mise en place (une fois)

```bash
cd benefy-explorer
npm install
git init && git add -A && git commit -m "chore: projet initial"   # les hooks s'appuient sur git
claude                                                          # lance Claude Code dans le projet
```

Au premier lancement, Claude Code te demande :
1. **de faire confiance au dossier** → oui (sinon les permissions et hooks du projet sont ignorés) ;
2. **d'approuver les serveurs MCP** de `.mcp.json` (`playwright`, `context7`) → oui.

Vérifie ensuite dans la session :

| Commande | Ce que tu dois voir |
|---|---|
| `/mcp` | `playwright` et `context7` connectés |
| `/hooks` | SessionStart, PreToolUse, PostToolUse, Stop |
| `/agents` | `test-writer`, `a11y-reviewer`, `code-reviewer` |
| `/` puis taper `ti` | la commande `/ticket` |
| `/memory` | `CLAUDE.md` chargé |

> La première utilisation du serveur `playwright` peut demander d'installer un navigateur :
> `npx playwright install chromium`.

## 2. Ce qui est configuré, et pourquoi

```
CLAUDE.md                     mémoire du projet : commandes, archi, conventions (lue à chaque session)
.mcp.json                     serveurs MCP partagés avec l'équipe
.claude/
  settings.json               permissions + hooks (commité, partagé)
  settings.local.json         tes réglages perso (ignoré par git, à créer si besoin)
  hooks/*.mjs                 scripts des hooks (Node : marchent sous Windows, macOS, Linux)
  skills/ticket/SKILL.md      /ticket EXP-1 : workflow complet d'un ticket
  skills/dod/SKILL.md         /dod : vérifie la Definition of Done
  skills/api-endpoint/        procédure chargée automatiquement quand un ticket touche l'API
  agents/*.md                 sous-agents spécialisés (contexte séparé)
```

### Hooks : les garde-fous automatiques
Un hook est un script que **Claude Code exécute lui-même** à un moment précis. Contrairement à une
consigne dans `CLAUDE.md`, Claude ne peut pas l'oublier.

| Événement | Script | Effet |
|---|---|---|
| `SessionStart` | `session-start.mjs` | Donne à Claude la branche, les fichiers modifiés et l'avancement de chaque ticket |
| `PreToolUse` (Edit, Write) | `protect-files.mjs` | Refuse les modifications de `package-lock.json`, du worker MSW, des `.env*` (exit 2) |
| `PostToolUse` (Edit, Write) | `lint-file.mjs` | ESLint `--fix` sur le fichier ; les erreurs restantes sont renvoyées à Claude |
| `Stop` | `verify-on-stop.mjs` | Typecheck + tests Jest liés aux fichiers modifiés ; si ça casse, Claude doit corriger avant de rendre la main |

Le hook `Stop` ne relance Claude qu'une fois d'affilée (`stop_hook_active`), pour éviter les boucles.

### Permissions
- **Autorisé sans demander** : lint, typecheck, tests, build, e2e, `git status/diff/log/branch/switch/add`.
- **Demande confirmation** : `git commit`, `npm install` (tu gardes la main sur l'historique et les dépendances).
- **Interdit** : lire les `.env`, `git push --force`, `git reset --hard`, `rm -rf`.

### MCP
- **context7** : documentation à jour des librairies (React Query 5, Zustand 5, RTK, Playwright…).
  Utile parce que l'API de ces librairies évolue plus vite que les connaissances du modèle.
  Tu peux le demander explicitement : « utilise context7 pour vérifier l'API de `useInfiniteQuery` ».
- **playwright** : Claude pilote un vrai navigateur. Il peut ouvrir l'app (`npm run dev` dans un autre terminal),
  cliquer, lire l'arbre d'accessibilité et vérifier le rendu mobile.

Pour ajouter **GitHub** plus tard (issues, PR) : `claude mcp add --transport http github --scope project https://api.githubcopilot.com/mcp/`
(nécessite une authentification GitHub), ou simplement utiliser la CLI `gh`.

### Sous-agents
Un sous-agent travaille dans **son propre contexte** et ne renvoie qu'un résumé : ta session principale reste légère.
- `test-writer` : écrit des tests RTL selon les conventions du projet.
- `a11y-reviewer` : audit WCAG/RGAA en lecture seule, peut tester au clavier via Playwright.
- `code-reviewer` : revue de PR exigeante (modèle Opus), termine par une question d'entretien.

Claude les choisit seul d'après leur description, ou tu les appelles : « demande au code-reviewer de relire ».

## 3. Premier ticket : EXP-1 (favoris), pas à pas

```text
> /ticket EXP-1
```
Claude lit le ticket, crée `feat/exp-1-favoris`, explore le code et **propose un plan**. Lis-le vraiment :
c'est là que tu apprends. Questions à te poser (et à lui poser) :
- Zustand `persist` : que se passe-t-il si le format stocké change ? (→ `version` + `migrate`)
- Le filtre « Favoris uniquement » : côté client ou paramètre d'API ? Pourquoi ?
- Le libellé du bouton doit-il changer selon l'état, ou seulement `aria-pressed` ?

```text
> OK pour le plan, mais le filtre favoris reste côté client. Écris d'abord les tests.
```
Tu vois les tests échouer, puis l'implémentation. À chaque fichier édité, le hook ESLint passe ;
à la fin du tour, le hook Stop lance typecheck et tests.

```text
> Lance npm run dev dans un autre terminal, puis vérifie avec playwright la page Explorer en 390 px.
> /dod
> Demande au code-reviewer de relire la branche.
```

Puis commit (Claude te demandera confirmation) :
```text
> Commite avec un message conventionnel.
```

## 4. Bonnes pratiques pour apprendre (et pas seulement livrer)

- **Mode plan** (`Shift+Tab` deux fois) : Claude explore et propose sans rien modifier. Idéal pour les tickets 🔴.
- **Écris toi-même une partie** : par exemple, laisse Claude écrire les tests et implémente le code toi-même
  (« écris seulement les tests, je fais l'implémentation »), puis demande une revue.
- **Demande le « pourquoi »** : « explique la différence entre `invalidateQueries` et `setQueryData` dans ce cas ».
- **Note ce qui marche** dans `docs/ai-log.md` (c'est le ticket AI-1) : prompts utiles, erreurs de Claude
  que tu as repérées. C'est exactement ce qu'un recruteur attend derrière « usage de l'IA dans le dev ».
- **`/clear` entre deux tickets** : un contexte propre donne de meilleurs résultats ; le hook SessionStart
  et `CLAUDE.md` redonnent l'essentiel.
- **`/rewind`** si Claude part dans une mauvaise direction : tu reviens à un point précédent (code et conversation).

## 5. Personnaliser
- Réglages perso non partagés : `.claude/settings.local.json` (ex. autoriser `git commit` sans confirmation).
- Désactiver temporairement un hook : `/hooks`.
- Nouvelle commande : crée `.claude/skills/<nom>/SKILL.md` (frontmatter `description`, `disable-model-invocation: true`
  si elle ne doit se lancer qu'à ta demande).
