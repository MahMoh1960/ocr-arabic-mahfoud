var C='ocr-arabe-v1';
var A=['./','index.html','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(C).then(function(c){return c.addAll(A)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==C}).map(function(x){return caches.delete(x)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){
 if(e.request.method!=='GET')return;
 var u=new URL(e.request.url);
 /* Bibliothèque et modèles de langue : mis en cache à la première utilisation pour le mode hors ligne */
 var dyn=/jsdelivr|tessdata|projectnaptha|unpkg/.test(u.host+u.pathname);
 if(u.origin!==location.origin&&!dyn)return;
 e.respondWith(caches.match(e.request).then(function(r){
  if(r)return r;
  return fetch(e.request).then(function(n){
   if(n&&(n.status===200||n.type==='opaque')){var cp=n.clone();caches.open(C).then(function(c){c.put(e.request,cp)})}
   return n;
  }).catch(function(){return caches.match('index.html')});
 }));
});
