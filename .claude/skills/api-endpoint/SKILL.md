---
name: api-endpoint
description: Procédure pour ajouter ou modifier un endpoint de l'API mockée (types, handler MSW, queryOptions/mutation, tests). À utiliser dès qu'un ticket demande un nouvel appel réseau.
---

# Ajouter un endpoint à l'API

Respecte cet ordre, c'est ce qui garde le front et le faux backend synchronisés :

1. **Contrat** : ajoute ou modifie les types dans `src/api/types.ts`.
2. **Faux backend** : ajoute le handler dans `src/mocks/handlers.ts`.
   - Vérifie l'authentification avec `isAuthed(request)` et renvoie `unauthorized()` sinon.
   - Appelle `await latency()` en premier.
   - Erreurs métier : `HttpResponse.json({ code: 'XXX', message: '…en français…' }, { status: 4xx })`.
   - Données : dans `src/mocks/data.ts`, déterministes (pas de `Math.random()`).
   - Pour une mutation, modifie les données en mémoire pour que les GET suivants reflètent le changement.
3. **Client** : dans `src/features/<domaine>/api.ts`
   - lecture : une clé dans la factory `xxxKeys` + une fonction `queryOptions(...)` qui passe `signal` à `apiFetch` ;
   - écriture : une fonction de mutation + l'invalidation des clés concernées dans `onSuccess` (ou `onSettled`).
4. **Tests** : un test d'intégration de page qui couvre le cas nominal **et** au moins un cas d'erreur
   via `server.use(...)`.
