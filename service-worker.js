const CACHE_NAME = 'my-best-friend-v2-4-1-fit-fix';
const FILES = [
  './', './index.html?v=2.4.2', './manifest.json?v=2.4.2', './style.css?v=2.4.2', './script.js?v=2.4.2'
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
    event.respondWith(fetch(event.request, { cache: 'no-store' }).catch(() => caches.match('./index.html?v=2.4.2').then(r => r || caches.match('./'))));
    return;
  }
  event.respondWith(fetch(event.request, { cache: 'no-store' }).catch(() => caches.match(event.request)));
});
