const cacheName = "meme911-v1";
const staticAssets = [
  "/manifest.json",
  "/images/brand.svg",
  "/images/favicon.ico",
  "/js/galleria.min.js",
  "/js/themes/classic/galleria.classic.css",
  "/js/themes/classic/galleria.classic.min.js",
  "/js/bootstrap.min.js"
  
];

self.addEventListener("install", async (e) => {
  console.log("Install Event processing");
  const cache = await caches.open(cacheName);
  await cache.addAll(staticAssets);
  return self.skipWaiting();
});


self.addEventListener("activate", (e) => {
  console.log("Claiming clients for current page");
  var cacheKeeplist = [];
  event.waitUntil(self.clients.claim()
    
  ); //this line is important in some contexts
});

self.addEventListener("fetch", async (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    e.respondWith(cacheFirst(req));
  } else {
    e.respondWith(cacheFirst(req));
  }
});
async function cacheFirst(req) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  return cached || fetch(req);
}
