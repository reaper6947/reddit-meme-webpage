const cacheName = 'meme911-v1';
const staticAssets = [
  "/manifest.json",
  "/images/brand.svg",
  "/images/favicon.ico",
  "/index.ejs",
  "/observers.js"
];

self.addEventListener('install', async e => {
  console.log("Install Event processing");
//  const cache = await caches.open(cacheName);
//  await cache.addAll(staticAssets);
  return self.skipWaiting();
});

self.addEventListener('activate', e => {
  console.log("Claiming clients for current page");
  var cacheKeeplist = [cacheName];
    event.waitUntil(
        caches.keys().then( keyList => {
            return Promise.all(keyList.map( key => {
                if (cacheKeeplist.indexOf(key) === -1) {return caches.delete(key);}
            }));
        })
.then(self.clients.claim())); //this line is important in some contexts
});

/*
self.addEventListener('fetch', async e => {
  const req = e.request;
  const url = new URL(req.url);


  if (url.origin === location.origin) {
    e.respondWith(cacheFirst(req));
  } else {
    e.respondWith(networkAndCache(req));
  }

});
*/

/*
async function cacheFirst(req) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  return cached || fetch(req);
}

async function networkAndCache(req) {
  const cache = await caches.open(cacheName);
  try {
    const fresh = await fetch(req);
    await cache.put(req, fresh.clone());
    return fresh;
  } catch (e) {
    const cached = await cache.match(req);
    return cached;
  }
}
*/



/*
const staticAssets = [

    '../views/index.html',
    '../views/images/brand.svg',
    '../views/images/favicon.ico'
];

self.addEventListener('install', async event => {
    const cache = await caches.open('static-meme');
    cache.addAll(staticAssets);
});

self.addEventListener('fetch', event => {
    const {
        request
    } = event;
    const url = new URL(request.url);
    if (url.origin === location.origin) {
        event.respondWith(cacheData(request));
    } else {
        event.respondWith(networkFirst(request));
    }
});
async function cacheData(request) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || fetch(request);
}
async function networkFirst(request) {
    const cache = await caches.open('dynamic-meme');
    try {
        const response = await fetch(request);
        cache.put(request, response.clone());
        return response;
    } catch (error) {
        return await cache.match(request);
    }
}
*/




