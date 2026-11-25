---
name: ticket
description: Démarre un ticket du backlog (ex. /ticket EXP-1) - branche git, plan, tests d'abord, implémentation, vérification.
argument-hint: "[ID du ticket, ex. EXP-1]"
disable-model-invocation: true
---

# Démarrer le ticket $ARGUMENTS

## Contexte
- Branche actuelle : !`git branch --show-current || true`
- Fichiers modifiés : !`git status --short || true`

## Étapes

1. **Lire le ticket.** Trouve la section `### $ARGUMENTS` dans `docs/BACKLOG.md`. S'il n'existe pas, arrête-toi et dis-le.
   Si des fichiers sont modifiés et non commités, demande-moi quoi en faire avant de continuer.

2. **Créer la branche** `feat/<id en minuscules>-<slug court>` depuis la branche courante (`git switch -c ...`).

3. **Explorer** le code concerné (features, composants, handlers MSW, tests existants), puis présente-moi
   **un plan court** : fichiers à créer ou modifier, choix techniques et leurs alternatives, tests prévus.
   **Attends ma validation** avant d'écrire du code. Si le ticket a une question de design ouverte,
   pose-la-moi plutôt que de trancher seul.

4. **Tests d'abord.** Écris les tests qui décrivent le comportement attendu, lance-les, montre-moi qu'ils échouent
   pour la bonne raison.

5. **Implémenter** par petites étapes jusqu'à ce que les tests passent, en respectant les conventions de `CLAUDE.md`.
   Pour toute API de librairie dont tu n'es pas sûr (React Query, Zustand, RTK, Playwright…), consulte la
   documentation à jour via le serveur MCP `context7` plutôt que de t'appuyer sur ta mémoire.

6. **Vérifier.** Lance `/dod`. Si l'interface change, vérifie-la dans le navigateur avec le serveur MCP `playwright`
   (app lancée avec `npm run dev`) en 390 px et 1280 px.

7. **Clôturer.** Coche les cases faites dans `docs/BACKLOG.md`, propose un message de commit Conventional Commits,
   et résume en 5 lignes max : ce qui a été fait, ce qui reste, et **une question d'entretien** que ce ticket prépare.
