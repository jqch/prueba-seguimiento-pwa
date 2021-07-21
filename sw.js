// const CACHE_NAME = 'v1_cache_seguimiento',
// urlsToCache = [
//     './',
//     'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css',
//     './css/style.css',
//     './js/app.js',
//     './img/main.jpg',
//     './favicon.ico',
//     './img/icono.png'
// ]

// // durante la fase de instalacion, generalemten se almancena en cache los archivos estaticos
// self.addEventListener('install', e => {
//     e.waitUntil(
//         caches.open(CACHE_NAME)
//             .then(cache => {
//             return cache.addAll(urlsToCache)
//                         .then(() => self.skipWaiting())

//         })
//         .catch(err => console.log('Fallo el registro de cache', err))
//     )
// })

// // una vez que se inicia el sw, se activa y busca los recursos para hacer que funcione sin conexion a internet
// self.addEventListener('activate', e => {
//     const cacheWhiteList = [CACHE_NAME]

//     e.waitUntil(
//         caches.keys()
//             .then(cachesNames => {
//                 cachesNames.map(cacheName => {
//                     // eliminamos lo que ya no se necesita en cache
//                     if(cacheWhiteList.indexOf(cacheName) === -1) {
//                         return caches.delete(cacheName)
//                     }
//                 })
//             })
//             .then(() => self.clients.claim())
//     )
// })

// // cuando el navegador recupera la conexion a internet
// // tiene la capacidad de actualizar los archivos en cache si los datos cambiaron
// self.addEventListener('fetch', e => {
//     // responder con el objeto en cache o continuar con la url real
//     e.respondWith(
//         caches.match(e.request)
//             .then(res => {
//                 if(res) {
//                     // recuperar del cache
//                     return res
//                 }
//                 // Retorna la peticion de la url
//                 return fetch(e.request)
//             })
//     )

// })