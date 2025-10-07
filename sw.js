const CACHE_NAME = 'holyrics-remote-v1';
// Lista de arquivos para armazenar em cache.
const urlsToCache = [
  '/',
  '/controle.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Evento de instalação: abre o cache e adiciona os arquivos principais.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento de fetch: serve os arquivos do cache se estiverem disponíveis.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se encontrar no cache, retorna do cache.
        if (response) {
          return response;
        }
        // Senão, busca na rede.
        return fetch(event.request);
      }
    )
  );
});