/* Service worker Amber Kossy : site consultable hors-ligne une fois installé */
const CACHE = 'amber-kossy-v19';
const CORE = ['./', './index.html', './manifest.webmanifest',
  './assets/logo-ak-blanc.png', './assets/logo-ak-noir.png', './assets/texture/gris-ak.jpg', './assets/texture/gris-ak-fonce.jpg',
  './assets/studio/hero-poster.jpg', './assets/favicon-192.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin || req.headers.has('range')) return;
  // Pages : réseau d'abord, cache en secours
  const isCode = /\.(css|js|webmanifest)(\?|$)/.test(new URL(req.url).pathname + new URL(req.url).search);
  if (req.mode === 'navigate' || isCode) {
    e.respondWith(
      fetch(req)
        .then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return r; })
        .catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('./index.html')))
    );
    return;
  }
  // Fichiers : cache d'abord (sauf vidéos)
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(r => {
      if (r.ok && !req.url.endsWith('.mp4')) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return r;
    }))
  );
});
