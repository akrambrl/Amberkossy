# Amber Kossy — Pilates Studio

Site vitrine statique (HTML / CSS / JS, sans dépendance) inspiré de la structure de rougepilates.com.

## Pages / sections
- **Hero** + bandeau défilant
- **Prestations** (filtrables) : Mat Pilates, Reformer, Amber Sculpt, Prénatal & Postnatal, Stretch & Mobility, Cours privés, Duo & Trio, Formation instructeur, Entreprises & événements
- **L'approche** du studio
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
- Photos : `assets/img/` (photos Unsplash libres de droits) — à remplacer par les photos du studio
- Les formulaires ouvrent un email pré-rempli ; pour une vraie réservation en ligne, brancher un outil (bsport, Momence, Mindbody…) ou un service de formulaire.
