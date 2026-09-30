# Le Zénith Hôtel & Spa — Extraction Design

Extraction du site pour adaptation avec d'autres inspirations design.

## Contenu de ce dossier

### `images/` (8,1 Mo, 55 photos)
Les vraies photos du site (pas les images de démo du thème), triées par section :
- `chambres/` — suite-senior, suite-junior, chambre-triple, chambre-double, chambre-single
- `restaurant-bar/`
- `spa-bien-etre/`
- `seminaires-evenements/`
- `accueil-general/` — bannières, icônes de service, navette aéroport
- `logo/`

### `design-assets/` (9,1 Mo)
Les fichiers techniques du thème utilisé (thème "Sailing") :
- `css/` — feuilles de style compilées
- `sass/` — code source Sass (variables, mixins) — utile pour repérer la structure, mais attention : `sass/_variables.scss` ne contient que les couleurs génériques des réseaux sociaux, **pas** la vraie palette du site (rouge bordeaux, etc.). Cette vraie palette est un "Custom CSS" stocké dans la base de données du site — voir ci-dessous.
- `fonts/` — polices utilisées (Font Awesome, icônes)
- `theme-images/` — images décoratives du thème (motifs, séparateurs)

### `pages-html/` (~22 Mo)
Copie statique de chaque page du site, telle qu'affichée dans le navigateur (HTML + CSS final + JS + images). **Ouvrir directement les fichiers .html dans un navigateur — pas besoin de serveur, ni de Docker, ni d'internet** :
- `index.html` — Accueil
- `hebergements.html` — Chambres et Suites
- `restaurants.html` — Les Restaurants
- `spa-bien-etre.html` — SPA & Bien-Être
- `seminaires-evenements.html` — Séminaires & Événements
- `reservation.html` — Réservation
- `conditions-generales-de-ventes.html` — CGV

Toutes les couleurs, polices et mises en page réelles du site sont visibles directement dans ces fichiers (le CSS est déjà calculé/fusionné — pas besoin d'aller chercher dans `design-assets/sass`, qui ne contient que les couleurs génériques du thème, pas celles utilisées sur ce site).

## Contenu texte des pages

Pour le texte de chaque page (accueil, chambres, restaurants, spa, événements, CGV, coordonnées), voir le fichier déjà préparé :
`C:\Users\user\Downloads\Zenith-Hotel-Analyse\ZENITH_HOTEL_CONTENU.md`
