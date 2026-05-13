/* ── EMBER PARTICLES ──*/
const canvas=document.getElementById('canvas');
const ctx=canvas.getContext('2d');
let W,H,particles=[];
function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight}
resize();window.addEventListener('resize',resize);

class Particle{
  constructor(){this.reset()}
  reset(){
    this.x=Math.random()*W;
    this.y=H+10;
    this.vx=(Math.random()-.5)*.6;
    this.vy=-(Math.random()*1.2+.4);
    this.life=1;
    this.decay=Math.random()*.006+.003;
    this.size=Math.random()*2.5+.5;
    this.type=Math.random();
  }
  update(){
    this.x+=this.vx+(Math.sin(Date.now()*.001+this.x*.01)*.3);
    this.y+=this.vy;
    this.life-=this.decay;
    if(this.life<=0||this.y<-20)this.reset();
  }
  draw(){
    ctx.save();ctx.globalAlpha=this.life*.85;
    if(this.type<.5){
      ctx.fillStyle=`hsl(${10+Math.random()*30},100%,${60+this.life*30}%)`;
    } else {
      ctx.fillStyle=`hsl(${45+Math.random()*15},100%,${70+this.life*20}%)`;
    }
    ctx.shadowBlur=6;ctx.shadowColor=ctx.fillStyle;
    ctx.beginPath();ctx.arc(this.x,this.y,this.size,0,Math.PI*2);ctx.fill();
    ctx.restore();
  }
}

for(let i=0;i<80;i++){
  const p=new Particle();p.y=Math.random()*H;p.life=Math.random();particles.push(p);
}
function loop(){
  ctx.clearRect(0,0,W,H);
  particles.forEach(p=>{p.update();p.draw()});
  requestAnimationFrame(loop);
}
loop();

/* ── SCROLL REVEAL ──*/
const reveals=document.querySelectorAll('.reveal');
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')});
},{threshold:.12});
reveals.forEach(el=>obs.observe(el));

/* ── NAV ACTIVE ──*/
const sections=document.querySelectorAll('section[id]');
const links=document.querySelectorAll('.nav-links a');
window.addEventListener('scroll',()=>{
  let cur='';
  sections.forEach(s=>{
    if(window.scrollY>=s.offsetTop-120)cur=s.id;
  });
  links.forEach(a=>{
    a.style.color=a.getAttribute('href')==='#'+cur?'var(--gold)':'';
  });
},{passive:true});

/* ── PROJECT SLIDERS ──*/
document.querySelectorAll('.proj-slider').forEach(slider => {
  const slides = slider.querySelector('.slides');
  const prev = slider.querySelector('.prev');
  const next = slider.querySelector('.next');
  let index = 0;
  const totalSlides = slides.children.length;
  next.addEventListener('click', () => {
    index = (index + 1) % totalSlides;
    slides.style.transform = `translateX(-${index * 100}%)`;
  });
  prev.addEventListener('click', () => {
    index = (index - 1 + totalSlides) % totalSlides;
    slides.style.transform = `translateX(-${index * 100}%)`;
  });
});

/* ── LIGHTBOX ──*/
const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
lightbox.className = 'lightbox';
lightbox.innerHTML = `
  <button class="lightbox-close">&times;</button>
  <button class="lightbox-nav lightbox-prev">&#10094;</button>
  <div class="lightbox-content"></div>
  <button class="lightbox-nav lightbox-next">&#10095;</button>
  <div class="lightbox-counter"></div>
`;
document.body.appendChild(lightbox);

const lbContent = lightbox.querySelector('.lightbox-content');
const lbClose = lightbox.querySelector('.lightbox-close');
const lbPrev = lightbox.querySelector('.lightbox-prev');
const lbNext = lightbox.querySelector('.lightbox-next');
const lbCounter = lightbox.querySelector('.lightbox-counter');

let allMedia = [];
let currentMediaIndex = 0;

document.querySelectorAll('.slides img, .slides video').forEach((media, idx) => {
  media.style.cursor = 'zoom-in';
  media.addEventListener('click', (e) => {
    e.stopPropagation();
    const slider = media.closest('.proj-slider');
    const allMediaInSlider = Array.from(slider.querySelectorAll('img, video'));
    allMedia = allMediaInSlider;
    currentMediaIndex = allMedia.indexOf(media);
    showLightbox(media);
  });
});

function showLightbox(media) {
  lbContent.innerHTML = '';
  if (media.tagName === 'VIDEO') {
    const video = document.createElement('video');
    video.src = media.src;
    video.controls = true;
    video.autoplay = true;
    video.muted = false;
    lbContent.appendChild(video);
  } else {
    const img = document.createElement('img');
    img.src = media.src;
    img.alt = media.alt || '';
    lbContent.appendChild(img);
  }
  lbCounter.textContent = `${currentMediaIndex + 1} / ${allMedia.length}`;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  lbContent.innerHTML = '';
}

lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

lbPrev.addEventListener('click', (e) => {
  e.stopPropagation();
  currentMediaIndex = (currentMediaIndex - 1 + allMedia.length) % allMedia.length;
  showLightbox(allMedia[currentMediaIndex]);
});

lbNext.addEventListener('click', (e) => {
  e.stopPropagation();
  currentMediaIndex = (currentMediaIndex + 1) % allMedia.length;
  showLightbox(allMedia[currentMediaIndex]);
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') currentMediaIndex = (currentMediaIndex - 1 + allMedia.length) % allMedia.length;
  if (e.key === 'ArrowRight') currentMediaIndex = (currentMediaIndex + 1) % allMedia.length;
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') showLightbox(allMedia[currentMediaIndex]);
});