// Service Worker for Ludo Nexus PWA
// Handles offline caching, background sync, and push notifications

const CACHE_NAME = 'ludo-nexus-v1';
const STATIC_CACHE = 'ludo-nexus-static-v1';
const DYNAMIC_CACHE = 'ludo-nexus-dynamic-v1';
const OFFLINE_URL = '/offline.html';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/offline.html',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
            .map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - network first for API, cache first for static
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http schemes
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // API requests - network first with cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Socket.io requests - network only
  if (url.pathname.startsWith('/socket.io/')) {
    return;
  }

  // Static assets - cache first
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Navigation requests - network first with offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstWithOffline(request));
    return;
  }

  // Default - network first
  event.respondWith(networkFirst(request));
});

// Cache-first strategy for static assets
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('[SW] Cache first failed:', error);
    throw error;
  }
}

// Network-first strategy
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    throw error;
  }
}

// Network-first with offline fallback for navigation
async function networkFirstWithOffline(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    // Return offline page
    return caches.match(OFFLINE_URL);
  }
}

// Check if URL is a static asset
function isStaticAsset(pathname) {
  const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.woff', '.woff2', '.ttf', '.ico', '.webp'];
  return staticExtensions.some(ext => pathname.endsWith(ext)) || 
         pathname.startsWith('/_next/static/') ||
         pathname.startsWith('/icons/') ||
         pathname.startsWith('/images/');
}

// Background sync for game moves
self.addEventListener('sync', (event) => {
  if (event.tag === 'game-move-sync') {
    event.waitUntil(syncGameMoves());
  }
});

// Sync pending game moves when online
async function syncGameMoves() {
  try {
    const db = await openDB();
    const pendingMoves = await getPendingMoves(db);
    
    for (const move of pendingMoves) {
      try {
        const response = await fetch('/api/game/move', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(move.data),
        });
        
        if (response.ok) {
          await deletePendingMove(db, move.id);
        }
      } catch (error) {
        console.error('[SW] Failed to sync move:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Sync failed:', error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body || 'New game invitation!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: data.data || {},
    actions: [
      { action: 'accept', title: 'Accept' },
      { action: 'decline', title: 'Decline' },
    ],
    tag: data.tag || 'game-invite',
    renotify: true,
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Ludo Nexus', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const action = event.action;
  const data = event.notification.data;
  
  if (action === 'accept' && data.matchId) {
    event.waitUntil(
      clients.openWindow(`/game/${data.matchId}`)
    );
  } else if (action === 'decline') {
    // Send decline to server
    if (data.matchId) {
      fetch('/api/game/invite/decline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId: data.matchId }),
      }).catch(console.error);
    }
  } else {
    // Default click - open app
    event.waitUntil(
      clients.matchAll({ type: 'window' })
        .then((clientList) => {
          for (const client of clientList) {
            if (client.url.includes(self.location.origin) && 'focus' in client) {
              return client.focus();
            }
          }
          return clients.openWindow('/');
        })
    );
  }
});

// Message handling from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_GAME_MOVE') {
    cacheGameMove(event.data.move);
  }
});

// Cache a game move for offline sync
async function cacheGameMove(move) {
  try {
    const db = await openDB();
    await addPendingMove(db, {
      id: Date.now().toString(),
      data: move,
      timestamp: Date.now(),
    });
    
    // Register background sync
    if ('serviceWorker' in navigator && 'sync' in self.registration) {
      await self.registration.sync.register('game-move-sync');
    }
  } catch (error) {
    console.error('[SW] Failed to cache game move:', error);
  }
}

// IndexedDB helpers for offline queue
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('LudoNexusOffline', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pendingMoves')) {
        db.createObjectStore('pendingMoves', { keyPath: 'id' });
      }
    };
  });
}

function addPendingMove(db, move) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pendingMoves'], 'readwrite');
    const store = transaction.objectStore('pendingMoves');
    const request = store.add(move);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getPendingMoves(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pendingMoves'], 'readonly');
    const store = transaction.objectStore('pendingMoves');
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function deletePendingMove(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pendingMoves'], 'readwrite');
    const store = transaction.objectStore('pendingMoves');
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}