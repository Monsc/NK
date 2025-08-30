const CACHE_NAME = 'noking-v1';
const urlsToCache = [
  '/',
  '/why',
  '/learn',
  '/education',
  '/act',
  '/support',
  '/community',
  '/transparency',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
