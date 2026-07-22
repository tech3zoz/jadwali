// جدول عزيز — offline service worker
//
// IMPORTANT: the app shell (HTML/CSS/JS) is served NETWORK-FIRST.
// It used to be cache-first, which meant an installed device kept running old
// code indefinitely — every update sat behind the cache and never appeared.
// Now: online => always the newest code; offline => the cached copy.
const CACHE_VERSION = 'jadwali-v14';
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

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Is this a file whose freshness matters (page, styles, script, manifest)?
function isAppShell(req, url){
  if(url.origin !== self.location.origin) return false;
  if(req.mode === 'navigate') return true;
  return /\.(?:html|css|js|json)$/i.test(url.pathname) || url.pathname.endsWith('/');
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if(req.method !== 'GET') return;
  const url = new URL(req.url);

  if(isAppShell(req, url)){
    // Network-first: newest code wins, cache is only the offline fallback.
    event.respondWith(
      fetch(req).then(res => {
        if(res && res.ok){
          const copy = res.clone();
          caches.open(CACHE_VERSION).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() =>
        caches.match(req).then(cached => cached || caches.match('index.html'))
      )
    );
    return;
  }

  // Everything else (icons, fonts) is immutable enough for cache-first.
  event.respondWith(
    caches.match(req).then(cached => {
      if(cached) return cached;
      return fetch(req).then(res => {
        const cacheable = url.origin === self.location.origin
          || url.host === 'fonts.googleapis.com'
          || url.host === 'fonts.gstatic.com';
        if(cacheable && (res.ok || res.type === 'opaque')){
          const copy = res.clone();
          caches.open(CACHE_VERSION).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => undefined);
    })
  );
});
