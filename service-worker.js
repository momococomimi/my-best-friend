const CACHE_NAME = 'my-best-friend-v3-0-0-living-friend';
const FILES = [
  './', './index.html?v=3.0.0', './manifest.json?v=3.0.0', './style.css?v=3.0.0', './script.js?v=3.0.0'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES).catch(() => undefined)));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request, { cache: 'no-store' }).catch(() => caches.match('./index.html?v=3.0.0').then(r => r || caches.match('./'))));
    return;
  }
  event.respondWith(fetch(event.request, { cache: 'no-store' }).catch(() => caches.match(event.request)));
});
