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

    const TOTAL_BALLOONS = 10;
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
    { title: 'Happy Birthday To You',      artist: 'Special',                        file: 'songs/Happy Birthday To You.mp3' },
    { title: 'Chala Jata Hoon',            artist: 'Kishore Kumar',                  file: 'songs/Chala Jata Hoon (HD)  Mere Jeevan Saathi (1972)  Rajesh Khanna, Tanuja  Kishore Kumar  RD Burman.mp3' },
    { title: 'Chura Liya Hai Tumne',       artist: 'Asha Bhosle, Mohammed Rafi',     file: 'songs/Chura Liya Hai Tumne Jo Dil Ko -  Yaadon Ki Baaraat  Zeenat Aman, Vijay Arora.mp3' },
    { title: 'Hum Bane Tum Bane',          artist: 'Lata Mangeshkar, S.P. Balasubrahmanyam', file: 'songs/Hum Bane Tum Bane Ek Duje Ke Liye 4K Song ( हम बन तम बन ) Lata & SPB  Kamal Haasan, Rati.mp3' },
    { title: 'Itna Na Mujhse Tu Pyar Badha', artist: 'Lata Mangeshkar, Talat Mahmood', file: 'songs/Itna Na Mujhse Tu Pyar Badha  Lata Mangeshkar  Talat Mahmood  Asha P  Chhaya  Old Hindi Songs.mp3' },
    { title: 'Jaane Kya Dhoonta Hai',      artist: 'Lucky Ali',                      file: 'songs/Jaane Kya Dhoonta Hai 4K Video Song  Sur_ The Melody Of Life  Lucky Ali, Gauri Karnik  Musical.mp3' },
    { title: 'Kis Liye Maine Pyaar Kiya',  artist: 'Lata Mangeshkar',                file: 'songs/Kis Liye Maine Pyaar Kiya  The Train (1970)  Rajesh Khanna, Nanda  Lata Mangeshkar.mp3' },
    { title: 'Gulmohar Gar Tumhara Naam',  artist: 'Kishore Kumar, Lata Mangeshkar', file: 'songs/Kishore Kumar & Lata Mangeshkar - Gulmohar Gar Tumhara Naam Hota (HD)  Rakesh Roshan  Devta 1956.mp3' },
    { title: 'Lekar Hum Deewana Dil',      artist: 'Kishore Kumar',                  file: 'songs/Lekar Hum Deewana Dil.mp3' },
    { title: 'Meri Bheegi Bheegi Si',      artist: 'Kishore Kumar',                  file: 'songs/MERI BHEEGI BHEEGI SI (Anamika Tu Bhi Tarse) 4K - Kishore Kumar Sad Song - Sanjeev K, Jaya BAnamika.mp3' },
    { title: 'Neele Neele Ambar Par',      artist: 'Kishore Kumar',                  file: 'songs/Neele Neele Ambar Par - Male Version Lyric Video - KalaakaarSrideviKishore Kumar.mp3' },
    { title: 'O Mere Dil Ke Chain',        artist: 'Kishore Kumar',                  file: 'songs/O Mere Dil Ke Chain  Mere Jeevan Saathi (1972)  Rajesh Khanna, Tanuja  R.D Burman  Kishore Kumar.mp3' },
    { title: 'Panna Ki Tamanna Hai',       artist: 'Deepshikha Raina',               file: 'songs/Panna Ki Tamanna Hai  Recreation  Deepshikha Raina  Anurag-Abhishek  Heera Panna Songs.mp3' },
    { title: 'Tere Mere Milan Ki Yeh Raina', artist: 'Kishore Kumar, Lata Mangeshkar', file: 'songs/Tere Mere Milan Ki Yeh Rainaa  Kishore Kumar Hit Songs  Lata Mangeshkar  Amitabh  Abhimaan(1973).mp3' },
    { title: 'Yeh Shaam Mastani',          artist: 'Kishore Kumar',                  file: 'songs/Yeh Shaam Mastani 4K  Kishore Kumar  Rajesh Khanna  Kati Patang  Classic Bollywood 4K Video Song.mp3' },
  ];

  let currentSongIndex = 0;
  let isShuffled = false;
  let shuffleOrder = []; // holds shuffled indices when shuffle is on
  const audio = new Audio();
  audio.preload = 'auto';
  let isPlaying = false;

  // DOM Elements
  const playBtn      = document.getElementById('play-btn');
  const prevBtn      = document.getElementById('prev-btn');
  const nextBtn      = document.getElementById('next-btn');
  const shuffleBtn   = document.getElementById('shuffle-btn');
  const songTitle    = document.getElementById('song-title');
  const songArtist   = document.getElementById('song-artist');
  const progressBar  = document.getElementById('progress-bar');
  const progressFill = document.getElementById('progress-fill');
  const currentTimeDisplay = document.getElementById('current-time');
  const totalTimeDisplay   = document.getElementById('total-time');
  const volumeSlider = document.getElementById('volume-slider');
  const vinylDisc    = document.querySelector('.vinyl-disc');
  const tonearm      = document.querySelector('.tonearm');
  const albumArt     = document.querySelector('.album-art-container img');
  const playlistContainer = document.querySelector('.playlist-container');

  // Format time (seconds -> MM:SS)
  const formatTime = (seconds) => {
    if (isNaN(seconds) || !isFinite(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Build a fresh shuffle order excluding the current song
  const buildShuffleOrder = () => {
    const indices = playlist.map((_, i) => i).filter(i => i !== currentSongIndex);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    shuffleOrder = indices;
  };

  // Get the next song index based on shuffle state
  const getNextIndex = () => {
    if (isShuffled) {
      if (shuffleOrder.length === 0) buildShuffleOrder();
      return shuffleOrder.shift();
    }
    return (currentSongIndex + 1) % playlist.length;
  };

  const getPrevIndex = () => {
    if (isShuffled) {
      buildShuffleOrder(); // just go random on prev too
      return shuffleOrder.shift();
    }
    return (currentSongIndex - 1 + playlist.length) % playlist.length;
  };

  // Generate Playlist DOM
  if (playlistContainer) {
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

      item.addEventListener('click', () => {
        currentSongIndex = i;
        if (isShuffled) buildShuffleOrder();
        loadAndPlay(currentSongIndex);
      });
    });
  }

  const updatePlaylistHighlight = () => {
    document.querySelectorAll('.playlist-item').forEach((item, index) => {
      item.classList.toggle('active', index === currentSongIndex);
    });
    // Scroll active item into view
    const activeItem = document.querySelector('.playlist-item.active');
    if (activeItem) activeItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  };

  const loadSong = (index) => {
    if (index < 0 || index >= playlist.length) return;
    const song = playlist[index];
    audio.src = song.file;
    if (songTitle)  songTitle.textContent  = song.title;
    if (songArtist) songArtist.textContent = song.artist;

    // Album art fallback SVG
    if (albumArt) {
      const fallbackSVG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%25" stop-color="%23DAA520"/><stop offset="100%25" stop-color="%238B6508"/></linearGradient></defs><rect width="100" height="100" fill="url(%23g)"/><text x="50" y="60" font-size="40" text-anchor="middle" fill="white">♪</text></svg>';
      albumArt.src = fallbackSVG; // default to fallback
      albumArt.onerror = () => { albumArt.src = fallbackSVG; };
    }
    updatePlaylistHighlight();
  };

  // Load and immediately play
  const loadAndPlay = (index) => {
    loadSong(index);
    audio.play().catch(e => console.warn('Autoplay blocked:', e));
  };

  const updatePlayState = () => {
    if (playBtn) {
      const playIcon  = playBtn.querySelector('.play-icon');
      const pauseIcon = playBtn.querySelector('.pause-icon');
      if (playIcon && pauseIcon) {
        playIcon.style.display  = isPlaying ? 'none' : 'inline-block';
        pauseIcon.style.display = isPlaying ? 'inline-block' : 'none';
      }
    }
    if (vinylDisc) vinylDisc.classList.toggle('spinning', isPlaying);
    if (tonearm)   tonearm.classList.toggle('playing', isPlaying);
  };

  const togglePlay = () => {
    if (!audio.src || audio.src === window.location.href) loadSong(currentSongIndex);
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(e => console.error('Playback failed:', e));
    }
  };

  // Shuffle toggle
  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', () => {
      isShuffled = !isShuffled;
      shuffleBtn.style.color  = isShuffled ? 'var(--gold-light)' : '';
      shuffleBtn.style.borderColor = isShuffled ? 'var(--gold-light)' : '';
      shuffleBtn.title = isShuffled ? 'Shuffle: ON' : 'Shuffle: OFF';
      if (isShuffled) buildShuffleOrder();
    });
  }

  if (playBtn) playBtn.addEventListener('click', togglePlay);

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

  // Continuous autoplay — always move to next song on end
  audio.addEventListener('ended', () => {
    currentSongIndex = getNextIndex();
    loadAndPlay(currentSongIndex);
  });

  const nextSong = () => {
    currentSongIndex = getNextIndex();
    loadSong(currentSongIndex);
    if (isPlaying) audio.play().catch(e => console.error(e));
  };

  const prevSong = () => {
    // If more than 3s in, restart current song; else go to prev
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
    } else {
      currentSongIndex = getPrevIndex();
      loadSong(currentSongIndex);
      if (isPlaying) audio.play().catch(e => console.error(e));
    }
  };

  if (nextBtn) nextBtn.addEventListener('click', nextSong);
  if (prevBtn) prevBtn.addEventListener('click', prevSong);

  // Time update
  audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
      const pct = (audio.currentTime / audio.duration) * 100;
      if (progressFill) progressFill.style.width = `${pct}%`;
      if (currentTimeDisplay) currentTimeDisplay.textContent = formatTime(audio.currentTime);
    }
  });

  audio.addEventListener('loadedmetadata', () => {
    if (totalTimeDisplay) totalTimeDisplay.textContent = formatTime(audio.duration);
  });

  // Progress Bar Seek
  if (progressBar) {
    progressBar.addEventListener('click', (e) => {
      const rect    = progressBar.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      if (audio.duration) audio.currentTime = percent * audio.duration;
    });
  }

  // Volume Slider
  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      audio.volume = e.target.value / 100;
    });
    audio.volume = (volumeSlider.value || 80) / 100;
  }

  // Init: load first song (Happy Birthday) and autoplay
  loadSong(currentSongIndex);
  // Autoplay on hero — triggered as soon as splash is dismissed or page loads
  const tryAutoplay = () => {
    audio.play().catch(() => {
      // Autoplay blocked by browser — wait for first user interaction
      const startOnInteraction = () => {
        audio.play().catch(() => {});
        document.removeEventListener('click', startOnInteraction);
        document.removeEventListener('keydown', startOnInteraction);
      };
      document.addEventListener('click', startOnInteraction);
      document.addEventListener('keydown', startOnInteraction);
    });
  };

  // If splash screen exists, start after it's dismissed; else start immediately
  if (splashScreen) {
    // Watch for splash removal
    const splashObserver = new MutationObserver(() => {
      if (!document.getElementById('splash-screen')) {
        splashObserver.disconnect();
        setTimeout(tryAutoplay, 600);
      }
    });
    splashObserver.observe(document.body, { childList: true });
  } else {
    tryAutoplay();
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
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
      this.style.opacity = '0';
      this.style.position = 'absolute';
    });
    if (img.complete && img.naturalWidth === 0) {
      img.style.opacity = '0';
      img.style.position = 'absolute';
    }
  });

  // --- 10. Photo Lightbox ---
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  const openLightbox = (src, alt) => {
    if (!lightbox || !lightboxImg || !src) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || 'Photo';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  // Attach click handler to every polaroid — grab src directly from the img element
  document.querySelectorAll('.polaroid').forEach(polaroid => {
    const img = polaroid.querySelector('.photo-wrapper img');
    if (!img) return;

    // Store the original src as a data attribute right now (before any error handler touches it)
    const originalSrc = img.getAttribute('src');
    polaroid.setAttribute('data-lightbox-src', originalSrc);
    polaroid.setAttribute('data-lightbox-alt', img.getAttribute('alt') || '');
    polaroid.style.cursor = 'zoom-in';

    polaroid.addEventListener('click', () => {
      const src = polaroid.getAttribute('data-lightbox-src');
      const alt = polaroid.getAttribute('data-lightbox-alt');
      openLightbox(src, alt);
    });
  });

  // Close handlers
  if (lightboxClose) lightboxClose.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightbox();
  });

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

});
