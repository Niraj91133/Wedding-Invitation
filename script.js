// ==========================================================================
// NAMEET WEDS MAHEK — ROYAL BURGUNDY & GOLD INTERACTIVE EXPERIENCE
// Envelope Opening, Falling Petals Engine, & Mobile Swipable Deck
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  // 1. Interactive Royal Envelope Opening
  const envelopeOverlay = document.getElementById('envelope-overlay');
  const envelopeBox = document.getElementById('envelope-box');
  const envelopeSeal = document.getElementById('envelope-seal');
  const envelopeSkipBtn = document.getElementById('envelope-skip-btn');
  const audio = document.getElementById('wedding-music');
  const musicDock = document.getElementById('music-dock');
  const musicIcon = document.getElementById('music-icon-state');

  let hasOpened = false;

  const openEnvelope = (e) => {
    if (hasOpened) {
      // If user taps again while animating, dismiss immediately
      if (envelopeOverlay) {
        envelopeOverlay.classList.add('hidden-completely');
      }
      return;
    }
    hasOpened = true;

    if (envelopeOverlay) {
      envelopeOverlay.classList.add('opening');
    }

    // Start background music automatically on this direct user tap
    if (audio) {
      audio.muted = false;
      audio.play().then(() => {
        if (musicDock) musicDock.classList.add('is-playing');
        if (musicIcon) musicIcon.textContent = '⏸';
      }).catch(() => {});
    }

    // Trigger celebratory petal burst
    triggerPetalBurst();

    // Fade out overlay after the card reveals
    setTimeout(() => {
      if (envelopeOverlay) {
        envelopeOverlay.classList.add('fade-out');
      }
    }, 1000);

    // Completely remove overlay from DOM
    setTimeout(() => {
      if (envelopeOverlay) {
        envelopeOverlay.classList.add('hidden-completely');
      }
    }, 1700);
  };

  if (envelopeSeal) envelopeSeal.addEventListener('click', openEnvelope);
  if (envelopeBox) envelopeBox.addEventListener('click', openEnvelope);
  if (envelopeSkipBtn) envelopeSkipBtn.addEventListener('click', openEnvelope);
  if (envelopeOverlay) {
    envelopeOverlay.addEventListener('click', openEnvelope);
    envelopeOverlay.addEventListener('touchend', openEnvelope, { passive: true });
  }

  // 2. Continuous Falling Rose & Gold Petals Engine (Canvas)
  const canvas = document.getElementById('petals-canvas');
  let ctx = null;
  let petals = [];
  const petalColors = [
    { r: 212, g: 175, b: 55, a: 0.8 },  // Gold
    { r: 245, g: 180, b: 190, a: 0.85 }, // Rose Pink
    { r: 180, g: 30, b: 55, a: 0.75 },  // Royal Crimson
    { r: 250, g: 215, b: 220, a: 0.9 }, // Soft Blush
    { r: 232, g: 200, b: 114, a: 0.75 } // Soft Gold
  ];

  if (canvas) {
    ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Petal {
      constructor(isBurst = false) {
        this.reset(isBurst);
      }

      reset(isBurst = false) {
        if (isBurst) {
          this.x = canvas.width / 2 + (Math.random() - 0.5) * 150;
          this.y = canvas.height / 2 + (Math.random() - 0.5) * 150;
          this.speedY = -(Math.random() * 6 + 2);
          this.speedX = (Math.random() - 0.5) * 8;
        } else {
          this.x = Math.random() * canvas.width;
          this.y = -20 - Math.random() * 50;
          this.speedY = Math.random() * 1.5 + 1.2;
          this.speedX = Math.sin(Math.random() * Math.PI) * 1.2;
        }

        this.size = Math.random() * 12 + 10;
        this.angle = Math.random() * Math.PI * 2;
        this.angularSpeed = (Math.random() - 0.5) * 0.04;
        this.swaySpeed = Math.random() * 0.02 + 0.01;
        this.swayOffset = Math.random() * Math.PI * 2;
        this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
        this.opacity = Math.random() * 0.4 + 0.6;
      }

      update() {
        this.y += this.speedY;
        this.x += Math.sin(this.y * this.swaySpeed + this.swayOffset) * 1.5 + this.speedX * 0.2;
        this.angle += this.angularSpeed;

        if (this.speedY < 1.2) {
          this.speedY += 0.15; // Gravity pull after burst
        }

        // Recycle petal when it falls below screen
        if (this.y > canvas.height + 25 || this.x < -30 || this.x > canvas.width + 30) {
          this.reset(false);
        }
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();

        // Organic rose petal curve
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, this.size / 3, 0, this.size);
        ctx.bezierCurveTo(this.size, this.size / 3, this.size / 2, -this.size / 2, 0, 0);

        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`;
        ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.3)`;
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.restore();
      }
    }

    // Populate initial petals
    const petalCount = window.innerWidth < 600 ? 25 : 45;
    for (let i = 0; i < petalCount; i++) {
      const p = new Petal(false);
      p.y = Math.random() * canvas.height; // Distribute across screen initially
      petals.push(p);
    }

    function animatePetals() {
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        petals.forEach((petal) => {
          petal.update();
          petal.draw();
        });
      }
      requestAnimationFrame(animatePetals);
    }
    requestAnimationFrame(animatePetals);
  }

  function triggerPetalBurst() {
    if (!ctx) return;
    for (let i = 0; i < 30; i++) {
      petals.push(new Petal(true));
    }
  }

  // 3. Live Countdown Timer
  const weddingDate = new Date('2027-01-23T09:30:00+05:30');

  function updateCountdown() {
    const diff = Math.max(0, weddingDate - Date.now());
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const elDays = document.getElementById('count-days');
    const elHours = document.getElementById('count-hours');
    const elMinutes = document.getElementById('count-minutes');
    const elSeconds = document.getElementById('count-seconds');

    if (elDays) elDays.textContent = String(days).padStart(2, '0');
    if (elHours) elHours.textContent = String(hours).padStart(2, '0');
    if (elMinutes) elMinutes.textContent = String(minutes).padStart(2, '0');
    if (elSeconds) elSeconds.textContent = String(seconds).padStart(2, '0');
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // 4. Horizontal Swipe Track Dots Indicator & Filter Tabs
  const track = document.getElementById('events-track');
  const dotsContainer = document.getElementById('itinerary-dots');
  const cards = document.querySelectorAll('.event-palace-card');
  const filterTabs = document.querySelectorAll('.filter-tab-btn');

  if (track && dotsContainer && cards.length > 0) {
    // Generate dots
    dotsContainer.innerHTML = '';
    cards.forEach((card, index) => {
      const dot = document.createElement('div');
      dot.className = `itinerary-dot ${index === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to card ${index + 1}`);
      dot.addEventListener('click', () => {
        card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      });
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.itinerary-dot');

    // Deck Navigation Arrows (Prev / Next)
    const prevEventBtn = document.getElementById('prev-event-btn');
    const nextEventBtn = document.getElementById('next-event-btn');
    if (prevEventBtn && nextEventBtn) {
      prevEventBtn.addEventListener('click', () => {
        track.scrollBy({ left: -320, behavior: 'smooth' });
      });
      nextEventBtn.addEventListener('click', () => {
        track.scrollBy({ left: 320, behavior: 'smooth' });
      });
    }

    // Update active dot on scroll
    track.addEventListener('scroll', () => {
      const trackCenter = track.scrollLeft + track.offsetWidth / 2;
      cards.forEach((card, i) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        if (Math.abs(trackCenter - cardCenter) < card.offsetWidth / 2) {
          dots.forEach((d) => d.classList.remove('active'));
          if (dots[i]) dots[i].classList.add('active');
        }
      });
    }, { passive: true });

    // Filter Tabs handling
    filterTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        filterTabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        const filterDay = tab.getAttribute('data-day');
        if (filterDay === 'all') {
          cards[0].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
        } else {
          const targetCard = Array.from(cards).find((c) => c.getAttribute('data-day') === filterDay);
          if (targetCard) {
            targetCard.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
          }
        }
      });
    });
  }

  // 5. Scroll Reveal Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in-up').forEach((el) => observer.observe(el));

  // 6. Floating Music Player Dock
  if (audio && musicDock) {
    const updatePlayerUI = () => {
      const isPlaying = !audio.paused && !audio.ended;
      musicDock.classList.toggle('is-playing', isPlaying);
      if (musicIcon) {
        musicIcon.textContent = isPlaying ? '⏸' : '♫';
      }
    };

    musicDock.addEventListener('click', (e) => {
      e.preventDefault();
      if (audio.paused || audio.ended) {
        audio.play().then(updatePlayerUI).catch(() => {});
      } else {
        audio.pause();
        updatePlayerUI();
      }
    });

    audio.addEventListener('play', updatePlayerUI);
    audio.addEventListener('pause', updatePlayerUI);
    audio.addEventListener('ended', updatePlayerUI);
  }
});
