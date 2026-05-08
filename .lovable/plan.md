## Problème identifié

Le fichier `src/aia.html` pèse **32 Mo** (1521 lignes) parce qu'il contient **26 images encodées en base64** (5 PNG + 21 WebP) intégrées directement dans le HTML.

Conséquences :
- Vite doit servir ce fichier en `?raw` à chaque chargement → très lent
- Le module dynamique `index.tsx` finit par échouer (`Failed to fetch dynamically imported module`) → l'erreur "This page didn't load" que tu vois après quelques secondes
- À chaque édition, tout le fichier doit être re-parsé/re-transmis

## Plan de correction

1. **Script d'extraction** (one-shot, exécuté côté serveur)
   - Parcourir `src/aia.html`, trouver chaque `data:image/...;base64,...`
   - Décoder et écrire chaque image dans `public/aia-assets/img-XX.{png,webp}`
   - Remplacer le `src="data:..."` correspondant par `src="/aia-assets/img-XX.ext"`

2. **Vérification**
   - Confirmer que `src/aia.html` passe de ~32 Mo à quelques dizaines de Ko
   - Recharger la preview → la page doit s'afficher de façon stable
   - Vérifier que les 26 images s'affichent correctement (slider, sections hero, etc.)

3. **Aucune modification visuelle** — uniquement un changement de stockage des images (data URI → fichier servi par Vite). Le rendu reste identique.

## Détails techniques

- Les fichiers iront dans `public/aia-assets/` → servis tels quels par Vite à `/aia-assets/...`
- Les iframes (`srcDoc`) chargent les images via URL absolue, ce qui fonctionne car le srcDoc hérite de l'origine du parent
- Le slider, les sections hero/galerie continueront de fonctionner sans modification de logique JS