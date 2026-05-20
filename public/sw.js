/**
 * Khmer Career Express - Service Worker
 * Cache-First strategy with network fallback
 * Version: 1.0.0
 */

const CACHE_NAME = 'khmer-career-v1';
const STATIC_CACHE = 'khmer-career-static-v1';
const IMAGE_CACHE = 'khmer-career-images-v1';
const OFFLINE_PAGE = '/offline.html';

// Resources to pre-cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
];

// Install event - pre-cache critical assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Pre-caching static assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        console.log('[SW] Skip waiting');
        return self.skipWaiting();
      })
      .catch((err) => {
        console.error('[SW] Pre-cache failed:', err);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            return name.startsWith('khmer-career-') && 
                   name !== STATIC_CACHE && 
                   name !== IMAGE_CACHE;
          })
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('[SW] Claiming clients');
      return self.clients.claim();
    })
  );
});

// Helper: check if request is for static asset
function isStaticAsset(url) {
  const staticExtensions = [
    '.js', '.css', '.json', '.woff2', '.woff', 
    '.ttf', '.eot', '.ico'
  ];
  return staticExtensions.some(ext => url.pathname.endsWith(ext));
}

// Helper: check if request is for image
function isImage(request) {
  return request.destination === 'image' || 
         /\.(png|jpg|jpeg|gif|svg|webp|avif)$/i.test(new URL(request.url).pathname);
}

// Helper: check if request is for API
function isAPI(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/') || 
         url.pathname.startsWith('/graphql');
}

// Helper: check if request is for HTML page
function isHTMLPage(request) {
  return request.mode === 'navigate' || 
         request.destination === 'document';
}

// Fetch event - cache strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip cross-origin requests (except for APIs)
  if (url.origin !== self.location.origin && !isAPI(request)) return;
  
  // Strategy 1: API requests - Network Only with timeout
  if (isAPI(request)) {
    event.respondWith(
      fetch(request)
        .catch(() => {
          return new Response(
            JSON.stringify({ 
              error: 'offline', 
              message: 'You are currently offline. Please check your connection.' 
            }),
            { 
              status: 503, 
              headers: { 'Content-Type': 'application/json' } 
            }
          );
        })
    );
    return;
  }
  
  // Strategy 2: Images - Cache First, then Network
  if (isImage(request)) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then((cache) => {
        return cache.match(request).then((cached) => {
          if (cached) {
            // Return cached and update in background
            fetch(request).then((response) => {
              if (response.ok) {
                cache.put(request, response);
              }
            }).catch(() => {});
            return cached;
          }
          
          // Fetch and cache
          return fetch(request).then((response) => {
            if (response.ok) {
              cache.put(request, response.clone());
            }
            return response;
          }).catch(() => {
            // Return placeholder for images
            return new Response(
              '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="#E8E0D0" width="200" height="200"/><text x="100" y="100" text-anchor="middle" fill="#9C9588" font-size="16">Image unavailable</text></svg>',
              { headers: { 'Content-Type': 'image/svg+xml' } }
            );
          });
        });
      })
    );
    return;
  }
  
  // Strategy 3: Static assets - Cache First, then Network
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.match(request).then((cached) => {
          const fetchPromise = fetch(request).then((response) => {
            if (response.ok) {
              cache.put(request, response.clone());
            }
            return response;
          }).catch(() => cached);
          
          return cached || fetchPromise;
        });
      })
    );
    return;
  }
  
  // Strategy 4: HTML pages - Network First, then Cache
  if (isHTMLPage(request)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, clone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            if (cached) return cached;
            // Return offline page
            return caches.match('/offline.html').then((offline) => {
              if (offline) return offline;
              return new Response(
                `<!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Offline - Khmer Career Express</title>
                  <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                      background: #FAF8F3; 
                      min-height: 100vh; 
                      display: flex; 
                      align-items: center; 
                      justify-content: center; 
                      padding: 20px;
                    }
                    .offline-container { text-align: center; max-width: 400px; }
                    .offline-icon { 
                      width: 80px; 
                      height: 80px; 
                      background: #D4AF37; 
                      border-radius: 50%; 
                      display: flex; 
                      align-items: center; 
                      justify-content: center; 
                      margin: 0 auto 24px; 
                      font-size: 36px; 
                    }
                    h1 { color: #2D2926; font-size: 1.5rem; margin-bottom: 12px; }
                    p { color: #9C9588; font-size: 1rem; line-height: 1.6; margin-bottom: 24px; }
                    .btn { 
                      display: inline-block; 
                      padding: 14px 32px; 
                      background: #D4AF37; 
                      color: #fff; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      font-weight: 600; 
                      border: none; 
                      cursor: pointer; 
                      font-size: 1rem;
                    }
                    .btn:active { transform: scale(0.98); }
                  </style>
                </head>
                <body>
                  <div class="offline-container">
                    <div class="offline-icon">📡</div>
                    <h1>You are offline</h1>
                    <p>Please check your internet connection and try again. Some content may be available from cache.</p>
                    <button class="btn" onclick="window.location.reload()">Retry</button>
                  </div>
                </body>
                </html>`,
                { headers: { 'Content-Type': 'text/html' } }
              );
            });
          });
        })
    );
    return;
  }
  
  // Default: Stale While Revalidate
  event.respondWith(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.match(request).then((cached) => {
        const fetchPromise = fetch(request).then((response) => {
          if (response.ok) {
            cache.put(request, response.clone());
          }
          return response;
        }).catch(() => {});
        
        return cached || fetchPromise;
      });
    })
  );
});

// Background Sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-submissions') {
    console.log('[SW] Background sync triggered');
    event.waitUntil(
      // Retry failed submissions
      new Promise((resolve) => {
        console.log('[SW] Retrying queued submissions');
        resolve();
      })
    );
  }
});

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('[SW] Push received:', event);
  
  const options = {
    body: event.data?.text() || 'New update from Khmer Career Express!',
    icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192"%3E%3Crect width="192" height="192" fill="%23D4AF37" rx="36"/%3E%3Ctext x="96" y="108" font-family="Georgia,serif" font-size="64" font-weight="bold" fill="%23FFFFFF" text-anchor="middle"%3EKG%3C/text%3E%3C/svg%3E',
    badge: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 72 72"%3E%3Crect width="72" height="72" fill="%23D4AF37" rx="18"/%3E%3Ctext x="36" y="42" font-family="Georgia,serif" font-size="24" font-weight="bold" fill="%23FFFFFF" text-anchor="middle"%3EKG%3C/text%3E%3C/svg%3E',
    tag: 'khmer-career-notification',
    requireInteraction: false,
    data: {
      url: '/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('Khmer Career Express', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event);
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      // Focus existing window if open
      for (const client of clients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // Open new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});

// Message handling from main thread
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
  
  if (event.data === 'getVersion') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
  
  if (event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }
});

console.log('[SW] Service Worker loaded');
