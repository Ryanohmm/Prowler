document.addEventListener("DOMContentLoaded", () => {

    const gifElements = document.querySelectorAll('img[data-static][data-animated]');

  gifElements.forEach(gif => {
    gif.addEventListener('click', () => {
      const isAnimated = gif.src.includes(gif.dataset.animated);
      gif.src = isAnimated ? gif.dataset.static : gif.dataset.animated;
    });
  });
  // ===
  // === Elements ===
  const overlay = document.getElementById("activate-overlay");
  const introSound = document.getElementById("introSound");
  const music = document.getElementById("hover-sound");
  const glitchScreen = document.getElementById("glitch-screen");
  const playPauseBtn = document.getElementById("play-pause");
  const seekBar = document.getElementById("seek-bar");
  const currentTimeDisplay = document.getElementById("current-time");
  const durationDisplay = document.getElementById("duration");
  const searchInput = document.getElementById("searchbar");
  const resetButton = document.getElementById("reset-button");
  const cardTitle = document.getElementById("cardTitle");
  const cardDescription = document.getElementById("cardDescription");

  // === Glitch Intro Sequence ===
  overlay.addEventListener("click", () => {
    overlay.style.display = "none";
    glitchScreen.classList.add("active");

    introSound.currentTime = 0;
    introSound.play().catch(err => console.warn("Intro sound failed:", err));

    setTimeout(() => {
      glitchScreen.style.animation = "fadeOut 1s ease forwards";
    }, 4000);

    setTimeout(() => {
      glitchScreen.style.display = "none";
    }, 5000);

    introSound.addEventListener("ended", () => {
      setTimeout(() => {
        music.currentTime = 0;
        music.play().then(() => {
          playPauseBtn.textContent = "Pause";
        }).catch(err => {
          console.warn("Music playback blocked:", err);
          playPauseBtn.textContent = "Play";
        });
      }, 1000);
    }, { once: true });
  }, { once: true });

  // === Music Player Controls ===
  music.addEventListener("canplaythrough", () => {
    durationDisplay.textContent = formatTime(music.duration);
    seekBar.max = music.duration;
    seekBar.step = 0.1;
  }, { once: true });

  let isSeeking = false;
  seekBar.addEventListener("mousedown", () => isSeeking = true);
  seekBar.addEventListener("mouseup", () => isSeeking = false);
  seekBar.addEventListener("input", () => {
    music.currentTime = seekBar.value;
  });

  music.addEventListener("timeupdate", () => {
    if (!isSeeking) {
      currentTimeDisplay.textContent = formatTime(music.currentTime);
      seekBar.value = music.currentTime;
      const percent = (music.currentTime / music.duration) * 100;
      seekBar.style.background = `linear-gradient(to right, #14c256 ${percent}%, #08500c ${percent}%)`;
    }
  });

  playPauseBtn.addEventListener("click", () => {
    if (music.paused) {
      music.play();
      playPauseBtn.textContent = "Pause";
    } else {
      music.pause();
      playPauseBtn.textContent = "Play";
    }
  });

  // === Format Time ===
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // === Search and Reset ===
  const abilitiesData = [
    { name: "Invisibility", description: "Ability to become unseen." },
    { name: "Flight", description: "Ability to soar through the skies." },
    { name: "Telepathy", description: "Ability to read and influence minds." }
  ];

  document.getElementById("search-button").addEventListener("click", () => {
    const query = searchInput.value.toLowerCase();
    const match = abilitiesData.find(item => item.name.toLowerCase().includes(query));
    if (match) {
      cardTitle.textContent = match.name;
      cardDescription.textContent = match.description;
    } else {
      cardTitle.textContent = "No Match Found";
      cardDescription.textContent = "Try a different ability.";
    }
  });

  resetButton.addEventListener("click", () => {
    searchInput.value = "";
    cardTitle.textContent = "";
    cardDescription.textContent = "";
  });
});

