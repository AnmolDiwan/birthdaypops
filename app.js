document.addEventListener('DOMContentLoaded', () => {

  // =====================================================================
  // --- 0. BALLOON SPLASH SCREEN ---
  // =====================================================================
  const splashScreen = document.getElementById('splash-screen');
  const balloonContainer = document.getElementById('balloon-container');
  const balloonsRemainingDisplay = document.getElementById('balloons-remaining');

  if (splashScreen && balloonContainer) {
    // Prevent background scrolling while splash is active
    document.body.style.overflow = 'hidden';

    const TOTAL_BALLOONS = 25;
    let balloonsRemaining = TOTAL_BALLOONS;

    // Festive balloon colors
    const balloonColors = [
      '#e74c3c', // Red
      '#e67e22', // Orange
      '#f1c40f', // Yellow
      '#2ecc71', // Green
      '#3498db', // Blue
      '#9b59b6', // Purple
      '#e84393', // Pink
      '#00cec9', // Teal
      '#fd79a8', // Light pink
      '#ff6b6b', // Coral
      '#feca57', // Bright yellow
      '#48dbfb', // Sky blue
    ];

    // Generate balloons scattered across the screen
    for (let i = 0; i < TOTAL_BALLOONS; i++) {
      const balloon = document.createElement('div');
      balloon.className = 'balloon';

      // Random properties
      const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
      const size = Math.random() * 30 + 55; // 55-85px
      const left = Math.random() * 85 + 5; // 5-90% from left
      const top = Math.random() * 55 + 30; // 30-85% from top
      const floatDuration = Math.random() * 3 + 4; // 4-7s
      const floatDelay = Math.random() * 2; // 0-2s
      const rotateStart = Math.random() * 6 - 3; // -3 to 3 deg
      const rotateMid = Math.random() * 6 - 3;

      balloon.style.left = `${left}%`;
      balloon.style.top = `${top}%`;
      balloon.style.setProperty('--balloon-color', color);
      balloon.style.setProperty('--balloon-size', `${size}px`);
      balloon.style.setProperty('--float-duration', `${floatDuration}s`);
      balloon.style.setProperty('--float-delay', `${floatDelay}s`);
      balloon.style.setProperty('--rotate-start', `${rotateStart}deg`);
      balloon.style.setProperty('--rotate-mid', `${rotateMid}deg`);

      balloon.innerHTML = `
        <div class="balloon-body"></div>
        <div class="balloon-string"></div>
      `;

      // Pop handler
      balloon.addEventListener('click', (e) => {
        e.stopPropagation();
        if (balloon.classList.contains('popping')) return;

        balloon.classList.add('popping');

        // Create burst particles
        const rect = balloon.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        createPopParticles(cx, cy, color);

        // Play pop sound effect (subtle vibration on mobile)
        if (navigator.vibrate) navigator.vibrate(30);

        balloonsRemaining--;
        balloonsRemainingDisplay.textContent = balloonsRemaining;

        // Remove balloon after animation
        setTimeout(() => {
          balloon.remove();
        }, 600);

        // All balloons popped!
        if (balloonsRemaining <= 0) {
          setTimeout(() => {
            splashScreen.classList.add('exiting');
            document.body.style.overflow = '';
            setTimeout(() => {
              splashScreen.remove();
            }, 900);
          }, 400);
        }
      });

      balloonContainer.appendChild(balloon);
    }

    balloonsRemainingDisplay.textContent = balloonsRemaining;

    // Create pop burst particles
    function createPopParticles(x, y, color) {
      const numParticles = 10;
      for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.className = 'pop-particle';
        const angle = (Math.PI * 2 * i) / numParticles + (Math.random() * 0.5 - 0.25);
        const dist = Math.random() * 60 + 30;
        const px = Math.cos(angle) * dist;
        const py = Math.sin(angle) * dist;

        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.backgroundColor = color;
        particle.style.setProperty('--px', `${px}px`);
        particle.style.setProperty('--py', `${py}px`);
        particle.style.width = `${Math.random() * 8 + 4}px`;
        particle.style.height = particle.style.width;

        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 600);
      }
    }
  }

  // =====================================================================
  // --- MUSIC NOTES SPAWNER (for record player) ---
  // =====================================================================
  const musicNotesContainer = document.getElementById('music-notes');
  const noteSymbols = ['♪', '♫', '♬', '♩', '🎵', '🎶'];
  let noteInterval = null;

  function spawnMusicNote() {
    if (!musicNotesContainer) return;

    const note = document.createElement('span');
    note.className = 'music-note';
    note.textContent = noteSymbols[Math.floor(Math.random() * noteSymbols.length)];

    // Random position around the vinyl disc
    const startX = Math.random() * 60 + 20; // 20-80% of container
    const startY = Math.random() * 30 + 20; // 20-50% of container

    // Random drift directions
    const driftX1 = (Math.random() - 0.5) * 40;
    const driftX2 = (Math.random() - 0.5) * 80;
    const driftX3 = (Math.random() - 0.5) * 120;

    note.style.left = `${startX}%`;
    note.style.top = `${startY}%`;
    note.style.setProperty('--note-size', `${Math.random() * 1 + 1.2}rem`);
    note.style.setProperty('--note-duration', `${Math.random() * 1.5 + 2}s`);
    note.style.setProperty('--drift-x1', `${driftX1}px`);
    note.style.setProperty('--drift-x2', `${driftX2}px`);
    note.style.setProperty('--drift-x3', `${driftX3}px`);

    // Randomize color between gold and saffron
    const noteColors = ['#d4a848', '#f0d48a', '#e8833a', '#FFD700'];
    note.style.color = noteColors[Math.floor(Math.random() * noteColors.length)];

    musicNotesContainer.appendChild(note);

    // Clean up after animation
    const duration = parseFloat(note.style.getPropertyValue('--note-duration')) * 1000 || 3000;
    setTimeout(() => note.remove(), duration + 100);
  }

  function startMusicNotes() {
    if (noteInterval) return;
    noteInterval = setInterval(spawnMusicNote, 600);
  }

  function stopMusicNotes() {
    if (noteInterval) {
      clearInterval(noteInterval);
      noteInterval = null;
    }
  }

  // --- 1. Golden Confetti Particle System ---
  const canvas = document.getElementById('confetti-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const hero = document.getElementById('hero');

    let particles = [];
    const numParticles = 100;
    
    // Golden color palette
    const colors = [
      '#FFD700', // Gold
      '#DAA520', // Goldenrod
      '#B8860B', // Dark Goldenrod
      '#F4A460', // Sandy Brown (saffron hint)
      '#FFF8DC'  // Cornsilk (cream)
    ];

    const resizeCanvas = () => {
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
      constructor() {
        this.reset();
        this.y = Math.random() * canvas.height; // Initial random y position spread out
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = -10;
        this.size = Math.random() * 5 + 3; // 3-8px
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.speedY = Math.random() * 1.5 + 0.5;
        this.speedX = Math.random() * 1 - 0.5;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 2 - 1;
        this.oscillationSpeed = Math.random() * 0.05 + 0.01;
        this.oscillationOffset = Math.random() * Math.PI * 2;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y * this.oscillationSpeed + this.oscillationOffset) * 0.5;
        this.rotation += this.rotationSpeed;

        if (this.y > canvas.height + this.size) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        // Draw a diamond/confetti shape
        ctx.beginPath();
        ctx.moveTo(0, -this.size / 2);
        ctx.lineTo(this.size / 2, 0);
        ctx.lineTo(0, this.size / 2);
        ctx.lineTo(-this.size / 2, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < numParticles; i++) {
      particles.push(new Particle());
    }

    const animateConfetti = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateConfetti);
    };

    animateConfetti();
  }

  // --- 2. & 7. Music Player & Dynamic Playlist ---
  const playlist = [
    { title: 'Song No. 1', artist: 'Artist', file: 'songs/song1.mp3' },
    { title: 'Song No. 2', artist: 'Artist', file: 'songs/song2.mp3' },
    { title: 'Song No. 3', artist: 'Artist', file: 'songs/song3.mp3' },
    { title: 'Song No. 4', artist: 'Artist', file: 'songs/song4.mp3' },
    { title: 'Song No. 5', artist: 'Artist', file: 'songs/song5.mp3' },
    { title: 'Song No. 6', artist: 'Artist', file: 'songs/song6.mp3' },
    { title: 'Song No. 7', artist: 'Artist', file: 'songs/song7.mp3' },
    { title: 'Song No. 8', artist: 'Artist', file: 'songs/song8.mp3' },
    { title: 'Song No. 9', artist: 'Artist', file: 'songs/song9.mp3' },
    { title: 'Song No. 10', artist: 'Artist', file: 'songs/song10.mp3' },
  ];

  let currentSongIndex = 0;
  const audio = new Audio();
  let isPlaying = false;

  // DOM Elements
  const playBtn = document.getElementById('play-btn');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const songTitle = document.getElementById('song-title');
  const songArtist = document.getElementById('song-artist');
  const progressBar = document.getElementById('progress-bar');
  const progressFill = document.getElementById('progress-fill');
  const currentTimeDisplay = document.getElementById('current-time');
  const totalTimeDisplay = document.getElementById('total-time');
  const volumeSlider = document.getElementById('volume-slider');
  const vinylDisc = document.querySelector('.vinyl-disc');
  const tonearm = document.querySelector('.tonearm');
  const albumArt = document.querySelector('.album-art-container img');
  const playlistContainer = document.querySelector('.playlist-container');

  // Format time (seconds -> MM:SS)
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Generate Playlist DOM
  const playlistHeader = playlistContainer ? playlistContainer.querySelector('.playlist-header') : null;
  if (playlistContainer) {
    // Remove any existing playlist items but keep the header
    const existingItems = playlistContainer.querySelectorAll('.playlist-item');
    existingItems.forEach(item => item.remove());

    playlist.forEach((song, i) => {
      const item = document.createElement('div');
      item.className = 'playlist-item';
      item.setAttribute('data-index', i);
      item.innerHTML = `
        <span class="song-number">${i + 1}</span>
        <span class="song-name">${song.title}</span>
        <span class="song-duration">--:--</span>
      `;
      playlistContainer.appendChild(item);

      // --- 5. Playlist Item Click ---
      item.addEventListener('click', () => {
        currentSongIndex = i;
        loadSong(currentSongIndex);
        audio.play().then(() => {
          isPlaying = true;
          updatePlayState();
        }).catch(e => console.error('Audio play error:', e));
      });
    });
  }

  const updatePlaylistHighlight = () => {
    const items = document.querySelectorAll('.playlist-item');
    items.forEach((item, index) => {
      if (index === currentSongIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  };

  const loadSong = (index) => {
    if (index < 0 || index >= playlist.length) return;
    
    const song = playlist[index];
    audio.src = song.file;
    
    if (songTitle) songTitle.textContent = song.title;
    if (songArtist) songArtist.textContent = song.artist;
    
    // Update album art with fallback
    if (albumArt) {
      const imgSrc = `images/album${index + 1}.jpg`;
      albumArt.src = imgSrc;
      
      // --- 8. Album Art Fallback ---
      albumArt.onerror = () => {
        // Create a fallback visually or replace src with a placeholder
        // Using a basic embedded SVG data URI as fallback
        albumArt.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23DAA520"/><stop offset="100%" stop-color="%238B6508"/></linearGradient></defs><rect width="100" height="100" fill="url(%23g)"/><text x="50" y="55" font-size="40" text-anchor="middle" fill="white">🎵</text></svg>';
      };
    }

    updatePlaylistHighlight();
  };

  const updatePlayState = () => {
    if (playBtn) {
      const playIcon = playBtn.querySelector('.play-icon');
      const pauseIcon = playBtn.querySelector('.pause-icon');
      if (playIcon && pauseIcon) {
        playIcon.style.display = isPlaying ? 'none' : 'inline-block';
        pauseIcon.style.display = isPlaying ? 'inline-block' : 'none';
      }
    }
    if (vinylDisc) {
      if (isPlaying) vinylDisc.classList.add('spinning');
      else vinylDisc.classList.remove('spinning');
    }
    if (tonearm) {
      if (isPlaying) tonearm.classList.add('playing');
      else tonearm.classList.remove('playing');
    }
  };

  const togglePlay = () => {
    if (!audio.src) loadSong(currentSongIndex);
    
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(e => {
        console.error("Playback failed", e);
      });
    }
  };

  // Event Listeners for Player Controls
  if (playBtn) {
    playBtn.addEventListener('click', togglePlay);
  }

  audio.addEventListener('play', () => {
    isPlaying = true;
    updatePlayState();
    startMusicNotes();
  });

  audio.addEventListener('pause', () => {
    isPlaying = false;
    updatePlayState();
    stopMusicNotes();
  });

  const nextSong = () => {
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    loadSong(currentSongIndex);
    if (isPlaying) audio.play().catch(e => console.error(e));
  };

  const prevSong = () => {
    currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    loadSong(currentSongIndex);
    if (isPlaying) audio.play().catch(e => console.error(e));
  };

  if (nextBtn) nextBtn.addEventListener('click', nextSong);
  if (prevBtn) prevBtn.addEventListener('click', prevSong);

  // Auto-play next song
  audio.addEventListener('ended', nextSong);

  // Time update
  audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
      const progressPercent = (audio.currentTime / audio.duration) * 100;
      if (progressFill) progressFill.style.width = `${progressPercent}%`;
      if (currentTimeDisplay) currentTimeDisplay.textContent = formatTime(audio.currentTime);
    }
  });

  audio.addEventListener('loadedmetadata', () => {
    if (totalTimeDisplay) totalTimeDisplay.textContent = formatTime(audio.duration);
  });

  // Progress Bar Seek
  if (progressBar) {
    progressBar.addEventListener('click', (e) => {
      const rect = progressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const percent = clickX / width;
      audio.currentTime = percent * audio.duration;
    });
  }

  // Volume Slider
  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      audio.volume = e.target.value / 100;
    });
    // Set initial volume
    audio.volume = (volumeSlider.value || 80) / 100;
  }

  // Init load first song
  loadSong(currentSongIndex);


  // --- 3. Scroll Reveal Animations ---
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Optional: observer.unobserve(entry.target); // If you only want it to animate once
        }
      });
    }, {
      threshold: 0.15
    });

    revealElements.forEach(el => {
      // If element has data-delay, apply it via style
      const delay = el.getAttribute('data-delay');
      if (delay) {
        el.style.transitionDelay = `${delay}ms`;
      }
      revealObserver.observe(el);
    });
  }

  // --- 4. Smooth Scroll for internal links ---
  const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
  smoothScrollLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // --- 6. Hero Entrance Animation (Fallback/Trigger) ---
  // If there are specific elements in hero that need classes added on load
  const heroElements = document.querySelectorAll('.hero-animate');
  heroElements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, index * 200 + 100); // staggered delay
  });

  // --- 9. Image Error Handling ---
  // Handle broken images gracefully by hiding them to reveal fallback elements
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
      this.style.opacity = '0';
      this.style.position = 'absolute';
    });
    // If image is already broken (cached error)
    if (img.complete && img.naturalWidth === 0) {
      img.style.opacity = '0';
      img.style.position = 'absolute';
    }
  });

});
