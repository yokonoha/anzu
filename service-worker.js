
const ichjihozon = 'rev1';//更新時変更
const hozonfiles = [
  './1.png',
  './2.png',
  "./3.png",
  "./4.png",
  "./5.png",
  "./index.html",
  "./anzu_backpic.png",
  "./anzulovesanzu.png",
  "./back2themain.png",
  "./play1.html",
  "./bgm.mp3",
  "./eatsound.mp3",
  "./entranceofhinamode.png",
  "./favicon.ico",
  "./gsm.png",
  "./icon.png",
  "./orin.mp3",
  "./post.png",
  "./resetimg.png",
  "./retry.png",
  "./sm.png",
  "./start.png",
  "./system.js",
  './6.png',
  './8.png',
  './banner1.png',
  './banner2.png',
  './banner3.png',
  './tutorial.js',
  './7.png'
];//リソースファイル群


self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(ichjihozon)
      .then(function(cache) {
        return cache.addAll(hozonfiles);
      })
  );
});


self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener("activate",(event)=>
  {
const ntchange=[ichjihozon];
event.waitUntil(caches.keys().then((cachenamaeire)=>
  {
    return Promise.all(cachenamaeire.map((cachenamae)=>
      {
        if(ntchange.indexOf(cachenamae)===-1)//存在しないときに!
        {
return caches.delete(cachenamae);
        }
      }))
  }));
  });
