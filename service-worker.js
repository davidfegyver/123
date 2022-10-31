const ASSETS = [
    "/index.html",
    "/style.css",
    "/themes.css",
    "/scripts/index.js",
    "/scripts/Board.js",
    "/scripts/Generator.js",
    "/scripts/DataStore.js",
    "/scripts/gamecontroller.min.js",
    "/scripts/swiped-events.min.js",
    "https://fonts.cdnfonts.com/css/roboto"
];

const CACHE_NAME = "123gameassets";

self.addEventListener('install', function (event) {
    console.log('[ServiceWorker] Install');

    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);

        await cache.addAll(ASSETS);

    })());

    self.skipWaiting();
});

self.addEventListener("fetch", event => {
    console.log("[ServiceWorker] Fetch", event.request.url);
    event.respondWith(
        fetch(event.request).catch(err =>
            caches.match(event.request).then(response => response)
        )
    );
});