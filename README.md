# Amber Kossy — Pilates Reformer Studio

Site vitrine statique (HTML / CSS / JS, sans dépendance) inspiré de la structure de rougepilates.com.

## Pages / sections
- **Hero** + bandeau défilant
- **Prestations** : Pilates Reformer (tous niveaux), Mama Flow, Événements
- **L'approche** du studio
- **Le studio** : galerie de 7 photos du studio
- **Planning** de la semaine (horaires réels, onglets par jour) — données dans `script.js` (`WEEK`)
- **Tarifs** par onglets (Découverte / Offre d'ouverture / Tarifs permanents)
- **Nouveau ?** (3 étapes), **Témoignages**, **FAQ**, **Contact**, infolettre
- Tous les boutons « Réserver » ouvrent la page de réservation **bsport** (`BOOKING_URL` dans `script.js`)

## Lancer en local
Ouvrir `index.html` dans un navigateur, ou :

```bash
python3 -m http.server 8000
```

## À personnaliser
- Adresse, téléphone, email (`contact@amberkossy.fr`, aussi dans `STUDIO_EMAIL` de `script.js`), Instagram
- Témoignages (contenus d'exemple)
- Médias du studio : `assets/studio/` (photos), `assets/video/` (vidéo d'accueil + galerie), logo AK dans `assets/logo-ak-noir.png` / `logo-ak-blanc.png`
- Reste une photo libre de droits (Unsplash, `assets/img/`) : carte Mama Flow — à remplacer par une photo du studio
- Le formulaire de contact ouvre un email pré-rempli vers `contact@amberkossy.fr`.
