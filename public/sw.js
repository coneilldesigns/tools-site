const CACHE_NAME = 'everyday-tools-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/apple-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Skip non-GET requests, chrome-extension URLs, and non-HTTP(S) URLs
  if (
    event.request.method !== 'GET' || 
    event.request.url.startsWith('chrome-extension://') ||
    !event.request.url.startsWith('http')
  ) {
    return;
  }

  // Don't cache API routes or dynamic content
  if (event.request.url.includes('/api/') || event.request.url.includes('?v=')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        // Only cache static assets, not HTML pages
        if (event.request.url.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache).catch(() => {
              // Ignore cache errors
            });
          });
        }

        return response;
      })
      .catch(() => {
        // If fetch fails, try to serve from cache
        return caches.match(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
}); 