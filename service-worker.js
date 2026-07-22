// جدول عزيز — offline service worker
// Bump CACHE_VERSION whenever app-shell files change to force an update.
const CACHE_VERSION = 'jadwali-v9';
const APP_SHELL = [
  './',
  'index.html',
  'css/styles.css',
  'js/app.js',
  'manifest.json',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'icons/apple-touch-icon.png'
];

// Pre-cache the app shell on install.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

// Drop old caches on activate.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Cache-first for app shell + runtime caching for fonts; network fallback.
self.addEventListener('fetch', event => {
  const req = event.request;
  if(req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then(cached => {
      if(cached) return cached;
      return fetch(req).then(res => {
        // Runtime-cache successful GETs (same-origin + Google Fonts) so the
        // app keeps working offline after the first visit.
        const url = new URL(req.url);
        const cacheable = url.origin === self.location.origin
          || url.host === 'fonts.googleapis.com'
          || url.host === 'fonts.gstatic.com';
        if(cacheable && (res.ok || res.type === 'opaque')){
          const copy = res.clone();
          caches.open(CACHE_VERSION).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => {
        // Offline and not cached: fall back to the app shell for navigations.
        if(req.mode === 'navigate') return caches.match('index.html');
      });
    })
  );
});
