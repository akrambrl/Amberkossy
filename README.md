# Amber Kossy — Pilates Studio

Site vitrine statique (HTML / CSS / JS, sans dépendance) inspiré de la structure de rougepilates.com.

## Pages / sections
- **Hero** + bandeau défilant
- **Prestations** (filtrables) : Mat Pilates, Reformer, Amber Sculpt, Prénatal & Postnatal, Stretch & Mobility, Cours privés, Duo & Trio, Formation instructeur, Entreprises & événements
- **L'approche** du studio
- **Le studio** : galerie photos + vidéo
- **Planning** de la semaine (onglets par jour + filtre par cours) — données dans `script.js` (`WEEK`)
- **Tarifs** par onglets (Mat & Stretch / Reformer & Sculpt / Privés)
- **Nouveau ?** (3 étapes), **Témoignages**, **FAQ**, **Contact**, infolettre
- **Modale de réservation** sur tous les boutons « Réserver »

## Lancer en local
Ouvrir `index.html` dans un navigateur, ou :

```bash
python3 -m http.server 8000
```

## À personnaliser
- Adresse, téléphone, email (`hello@amberkossy.fr`, aussi dans `STUDIO_EMAIL` de `script.js`), Instagram
- Prix, planning, noms des instructrices, témoignages (contenus d'exemple)
- Médias du studio : `assets/studio/` (photos), `assets/video/` (vidéo d'accueil + galerie), logo AK dans `assets/logo-ak-noir.png` / `logo-ak-blanc.png`
- Restent en photos libres de droits (Unsplash, `assets/img/`) : Prénatal, Stretch & Mobility, Entreprises — à remplacer par des photos du studio
- Les formulaires ouvrent un email pré-rempli ; pour une vraie réservation en ligne, brancher un outil (bsport, Momence, Mindbody…) ou un service de formulaire.
