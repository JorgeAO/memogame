const CACHE_NAME = 'memogame-v2';
const ASSETS = [
  '/memogame/',
  '/memogame/index.html',
  '/memogame/style.css',
  '/memogame/main.js',
  '/memogame/manifest.json',
  '/memogame/icon.png',
  '/memogame/icon-512.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching assets...');
      return cache.addAll(ASSETS).catch(err => console.log('Error caching assets:', err));
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
