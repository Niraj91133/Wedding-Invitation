const weddingDate = new Date('2027-01-23T09:30:00+05:30');
function updateCountdown(){
  const diff=Math.max(0,weddingDate-Date.now());
  const d=Math.floor(diff/86400000),
        h=Math.floor(diff%86400000/3600000),
        m=Math.floor(diff%3600000/60000),
        s=Math.floor(diff%60000/1000);
  [['days',d],['hours',h],['minutes',m],['seconds',s]].forEach(([id,v])=>{
    const el = document.getElementById(id);
    if(el) el.textContent=String(v).padStart(2,'0');
  });
}
updateCountdown();
setInterval(updateCountdown,1000);

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{
  if(e.isIntersecting){
    e.target.classList.add('visible');
    observer.unobserve(e.target);
  }
}),{threshold:.08});

document.querySelectorAll('.event-medallion,.route-card,.things-title,.things-grid,.countdown,.gallery').forEach(el=>{
  el.classList.add('reveal');
  observer.observe(el);
});

const track = document.getElementById('gallery-track');
const prevBtn = document.getElementById('prev-photo');
const nextBtn = document.getElementById('next-photo');
if (track && prevBtn && nextBtn) {
  prevBtn.addEventListener('click', () => track.scrollBy({ left: -320, behavior: 'smooth' }));
  nextBtn.addEventListener('click', () => track.scrollBy({ left: 320, behavior: 'smooth' }));
}
