// const CACHE_NAME = 'v1_cache_seguimiento',
// urlsToCache = [
//     './',
//     'https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css',
//     'https://code.jquery.com/jquery-3.5.1.slim.min.js',
//     'https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/js/bootstrap.bundle.min.js',
//     'https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.1/axios.min.js',
//     'https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js',
//     'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900',
//     'https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css',
//     'https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.min.css',
//     'https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.js',
//     'https://maxst.icons8.com/vue-static/landings/line-awesome/line-awesome/1.3.0/css/line-awesome.min.css',
//     'https://cdn.amcharts.com/lib/4/core.js',
//     'https://cdn.amcharts.com/lib/4/charts.js',
//     'https://cdn.amcharts.com/lib/4/themes/animated.js',
//     './css/style.css',
//     './js/index.js',
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