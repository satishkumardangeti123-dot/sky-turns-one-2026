const scenes=[...document.querySelectorAll('.scene')];
const chapterLinks=[...document.querySelectorAll('.chapters a')];
const progress=document.querySelector('.progress i');
const scrubVideos=[...document.querySelectorAll('[data-scroll-video]')];

const observer=new IntersectionObserver(entries=>{
  for(const entry of entries){
    if(entry.isIntersecting){
      entry.target.classList.add('active');
      const index=Number(entry.target.dataset.scene);
      chapterLinks.forEach((link,i)=>link.classList.toggle('active',i===Math.min(Math.round(index*4/7),4)));
      if(index===1) entry.target.classList.add('is-active');
    }
  }
},{threshold:.48});
scenes.forEach(scene=>observer.observe(scene));

function updateProgress(){
  const max=document.documentElement.scrollHeight-innerHeight;
  progress.style.width=`${max>0?scrollY/max*100:0}%`;
  const flight=Math.min(1,Math.max(0,scrollY/innerHeight));
  document.documentElement.style.setProperty('--flight',flight.toFixed(3));
  const heroArt=document.querySelector('.hero-art');
  heroArt.style.backgroundPosition=`center ${45+flight*13}%`;
  for(const video of scrubVideos){
    if(video.readyState<1||!Number.isFinite(video.duration))continue;
    const rect=video.closest('.scene').getBoundingClientRect();
    const amount=Math.max(0,Math.min(1,-rect.top/rect.height));
    const time=amount*Math.max(0,video.duration-.04);
    if(Math.abs(video.currentTime-time)>.045)video.currentTime=time;
  }
}
addEventListener('scroll',updateProgress,{passive:true});updateProgress();
scrubVideos.forEach(video=>video.addEventListener('loadedmetadata',updateProgress,{once:true}));
addEventListener('resize',updateProgress,{passive:true});

const target=new Date('2026-10-10T18:00:00+01:00').getTime();
function countdown(){
  let left=Math.max(0,target-Date.now());
  const days=Math.floor(left/86400000);left%=86400000;
  const hours=Math.floor(left/3600000);left%=3600000;
  const minutes=Math.floor(left/60000);left%=60000;
  const seconds=Math.floor(left/1000);
  for(const [id,value] of Object.entries({days,hours,minutes,seconds}))document.getElementById(id).textContent=String(value).padStart(2,'0');
}
countdown();setInterval(countdown,1000);

const music=document.getElementById('birthday-music');
const musicToggle=document.getElementById('music-toggle');
const musicLabel=document.getElementById('music-label');
music.play().then(()=>{
  musicLabel.textContent='PAUSE MUSIC';
  musicToggle.setAttribute('aria-label','Pause birthday music');
}).catch(()=>{
  musicLabel.textContent='TAP TO PLAY';
});
musicToggle.addEventListener('click',async()=>{
  if(music.paused){
    try{await music.play();musicLabel.textContent='PAUSE MUSIC';musicToggle.setAttribute('aria-label','Pause birthday music');}
    catch{musicLabel.textContent='TAP TO PLAY';}
  }else{music.pause();musicLabel.textContent='PLAY MUSIC';musicToggle.setAttribute('aria-label','Play birthday music');}
});
