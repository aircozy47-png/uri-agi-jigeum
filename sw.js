const V="uriagi-v1";
const CORE=["/","/manifest.webmanifest","/icon-192.png","/icon-512.png","/apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  const r=e.request; if(r.method!=="GET") return;
  const u=new URL(r.url);
  if(r.mode==="navigate"){
    e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put("/",cp));return res;}).catch(()=>caches.match("/")));
    return;
  }
  if(u.origin===location.origin){
    e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp));}return res;})));
    return;
  }
  e.respondWith(caches.match(r).then(hit=>{const net=fetch(r).then(res=>{caches.open(V).then(c=>c.put(r,res.clone()));return res;}).catch(()=>hit);return hit||net;}));
});
