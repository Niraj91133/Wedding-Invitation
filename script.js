// ==========================================================================
// NAMEET WEDS MAHEK — ROYAL WEDDING EXPERIENCE SCRIPT
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Live Wedding Countdown Timer
  const weddingDate = new Date('2027-01-23T09:30:00+05:30');

  function updateCountdown() {
    const now = Date.now();
    const diff = Math.max(0, weddingDate - now);

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

  // 2. Intersection Observer for Scroll Animations
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in-up').forEach((el) => {
    observer.observe(el);
  });

  // 3. Background Music Player with Equalizer
  const audio = document.getElementById('wedding-music');
  const musicDock = document.getElementById('music-dock');
  const musicIcon = document.getElementById('music-icon-state');

  if (audio && musicDock) {
    const updatePlayerUI = () => {
      const isPlaying = !audio.paused && !audio.ended;
      musicDock.classList.toggle('is-playing', isPlaying);
      if (musicIcon) {
        musicIcon.textContent = isPlaying ? '⏸' : '♫';
      }
    };

    const tryStartMusic = () => {
      audio.muted = false;
      audio.play().then(updatePlayerUI).catch(() => {
        // Autoplay policy might block until explicit user interaction
      });
    };

    musicDock.addEventListener('click', (e) => {
      e.preventDefault();
      if (audio.paused || audio.ended) {
        tryStartMusic();
      } else {
        audio.pause();
        updatePlayerUI();
      }
    });

    audio.addEventListener('play', updatePlayerUI);
    audio.addEventListener('pause', updatePlayerUI);
    audio.addEventListener('ended', updatePlayerUI);

    // Start playback on first user touch/scroll gesture
    const startOnGesture = () => {
      tryStartMusic();
    };

    window.addEventListener('scroll', startOnGesture, { once: true, passive: true });
    window.addEventListener('touchstart', startOnGesture, { once: true, passive: true });
    window.addEventListener('pointerdown', startOnGesture, { once: true, passive: true });
  }
});
