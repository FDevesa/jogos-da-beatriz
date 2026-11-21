// Os Jogos da Beatriz: guarda o menu e todos os jogos no tablet para funcionarem sem internet.
// Ao adicionar um jogo: acrescentar os ficheiros a FILES e subir a versão de CACHE.
const CACHE='jogos-v1';
const FILES=[
  './','index.html','manifest.webmanifest','games.json','icon-192.png','icon-512.png',
  'tabuada/','tabuada/index.html','tabuada/icon.png'
];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
// Com internet: versão mais recente (e atualiza a cópia). Sem internet: cópia guardada.
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(fetch(e.request).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}return r;})
    .catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('index.html'))));
});
