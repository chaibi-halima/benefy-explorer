---
name: dod
description: Vérifie la Definition of Done du projet (lint, types, tests, build, accessibilité, responsive) sur les changements en cours.
disable-model-invocation: true
allowed-tools: Bash(npm run lint) Bash(npm run typecheck) Bash(npm test *) Bash(npm run build) Bash(git diff *) Bash(git status *)
---

# Definition of Done

## Changements en cours
!`git status --short || true`

## À faire
1. Lance dans l'ordre : `npm run lint`, `npm run typecheck`, `npm test -- --silent`, `npm run build`.
   Arrête-toi au premier échec et explique-le.
2. Relis le diff (`git diff`) et vérifie :
   - chaque nouveau comportement a un test ;
   - pas de `any`, de `console.log`, de TODO sans ID de ticket, de couleur en dur hors des tokens ;
   - `shared/` n'importe rien depuis `features/` ;
   - chaque élément interactif ajouté a un nom accessible.
3. Délègue une relecture d'accessibilité au sous-agent `a11y-reviewer` si des composants d'interface ont changé.
4. Rends un tableau : critère | ✅ / ❌ | détail. Ne corrige rien sans me le demander.
