var dataCacheName = 'weatherData-v1';
var cacheName = 'weatherPWA-step-6-1';
var filesToCache = [];

self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                console.log('[ServiceWorker] Removing old cache', key);
                if (key !== cacheName) {
                    return caches.delete(key);
                }
            }));
        })
    );
});
var filesToCache = [
  'progressivewebapp/',
  'progressivewebapp/index.html',
  'progressivewebapp/favicon.ico',
  'progressivewebapp/scripts/app.js',
  'progressivewebapp/styles/inline.css',
  'progressivewebapp/images/clear.png',
  'progressivewebapp/images/cloudy-scattered-showers.png',
  'progressivewebapp/images/cloudy.png',
  'progressivewebapp/images/fog.png',
  'progressivewebapp/images/ic_add_white_24px.svg',
  'progressivewebapp/images/ic_refresh_white_24px.svg',
  'progressivewebapp/images/partly-cloudy.png',
  'progressivewebapp/images/rain.png',
  'progressivewebapp/images/scattered-showers.png',
  'progressivewebapp/images/sleet.png',
  'progressivewebapp/images/snow.png',
  'progressivewebapp/images/thunderstorm.png',
  'progressivewebapp/images/wind.png'
];

self.addEventListener('fetch', function (e) {
    console.log('[ServiceWorker] Fetch', e.request.url);
    var dataUrl = 'https://henriquetgoncalves.github.io/progressivewebapp/'//'https://publicdata-weather.firebaseio.com/';
    
    if (e.request.url.indexOf(dataUrl) === 0) {
        e.respondWith(fetch(e.request)
            .then(function (response) {
                return caches.open(dataCacheName).then(function (cache) {
                    cache.put(e.request.url, response.clone());
                    console.log('[ServiceWorker] Fetched&Cached Data');                    
                    return response;                    
                });                
            })
        );
    } else {
        e.respondWith(
            caches.match(e.request).then(function (response) {
                return response || fetch(e.request);
            })
        );
    }
});