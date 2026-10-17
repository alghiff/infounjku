/* INFOUNJKU Service Worker v5 */
const CACHE_NAME = 'infounjku-v5'; // Naikin versi biar cache lama kehapus
const OFFLINE_URL = '/';
const ASSETS = [
  '/', '/index.html', '/admin.html', '/manifest.json',
  '/css/style.css', '/js/script.js',
  '/icons/icon-192.png', '/icons/icon-512.png'
];

// 1. Install: Simpan file dasar ke cache
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS).catch(()=>{})));
  self.skipWaiting();
});

// 2. Activate: Hapus cache versi lama
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => 
    Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

// 3. Fetch: Strategi loading
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  
  const url = new URL(e.request.url);

  // 🛑 BYPASS (JANGAN DI-CACHE):
  // - Domain luar (Google reCAPTCHA, Picsum, dll)
  // - Supabase (biar data IG tetep realtime)
  // - Halaman admin
  if (
    url.origin !== self.location.origin || 
    url.hostname.includes('supabase.co') || 
    url.pathname.includes('admin')
  ) {
    return; // Biarin browser yang handle langsung
  }

  // 📦 CACHE LOKAL (HTML, CSS, JS, Gambar)
  e.respondWith(
    caches.match(e.request).then(cached => {
      // Kalau ada di cache, pakai itu
      if (cached) return cached;

      // Kalau gak ada, ambil dari internet
      return fetch(e.request).then(res => {
        // Kalau sukses, simpan salinannya ke cache
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, copy));
        }
        return res;
      }).catch(() => {
        // 🛡️ PENGAMAN: Kalau internet mati & gak ada cache
        // Wajib return Response, jangan dibiarin undefined
        if (e.request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
        return new Response('Offline', { status: 503, statusText: 'Offline' });
      });
    })
  );
});