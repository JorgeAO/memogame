self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('memogame-v1').then((cache) => {
      return cache.addAll([
        './',
        './index.html',
        './style.css',
        './main.js',
        './manifest.json',
        './icon.png',
        './icon-512.png'
      ]);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
