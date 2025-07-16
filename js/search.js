document.addEventListener("DOMContentLoaded", () => {
  // === Elements ===
  const overlay = document.getElementById("activate-overlay");
  const introSound = document.getElementById("introSound");
  const music = document.getElementById("audio");
  const glitchScreen = document.getElementById("intro-screen");
  const playPauseBtn = document.getElementById("play-pause");
  const seekBar = document.getElementById("seek-bar");
  const currentTimeDisplay = document.getElementById("current-time");
  const durationDisplay = document.getElementById("duration");
  const searchInput = document.getElementById("searchbar");
  const spinner = document.getElementById("loading-spinner");
  const characterContainer = document.getElementById("character-container");
  const hoverSound = document.getElementById("hover-sound");

  // === Format Time ===
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // === Music Metadata Loaded ===
  music.addEventListener("canplaythrough", () => {
    durationDisplay.textContent = formatTime(music.duration);
    seekBar.max = music.duration;
    seekBar.step = 0.1;
  }, { once: true });

  // === Sync Time Display ===
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
        music.play().catch(err => console.warn("Music playback failed:", err));
        playPauseBtn.textContent = "Pause";
      }, 1000);
    }, { once: true });
  }, { once: true });

  // === Music Player Controls ===
  playPauseBtn.addEventListener("click", () => {
    if (music.paused) {
      music.play();
      playPauseBtn.textContent = "Pause";
    } else {
      music.pause();
      playPauseBtn.textContent = "Play";
    }
  });

  // === Character Fetching ===
  let allCharacters = [];

  async function fetchCharacters() {
    spinner.classList.remove('hidden');
    try {
      const response = await fetch('http://localhost:3000/characters');
      const data = await response.json();
      allCharacters = data.data.results;
      renderCharacters(allCharacters);
    } catch (error) {
      console.error('❌ Failed to fetch characters:', error);
    } finally {
      spinner.classList.add('hidden');
    }
  }

  function renderCharacters(characters) {
    characterContainer.innerHTML = '';
    characters.forEach(character => {
      const card = document.createElement('div');
      card.className = 'character-card';

      const cardInner = document.createElement('div');
      cardInner.className = 'character-card-inner';

      const cardFront = document.createElement('div');
      cardFront.className = 'character-card-front';
      cardFront.innerHTML = `
        <img src="${character.thumbnail.path}.${character.thumbnail.extension}" alt="${character.name}">
        <h3>${character.name}</h3>
      `;

      const cardBack = document.createElement('div');
      cardBack.className = 'character-card-back';
      cardBack.textContent = `Bio: ${character.description || "No description available."}`;

      cardInner.appendChild(cardFront);
      cardInner.appendChild(cardBack);
      card.appendChild(cardInner);

      card.addEventListener('click', () => {
        card.classList.toggle('flipped');
      });

      card.addEventListener('mouseenter', () => {
        hoverSound.currentTime = 0;
        hoverSound.play();
      });

      characterContainer.appendChild(card);
    });
  }

  // === Search Filtering ===
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const filtered = allCharacters.filter(char =>
        char.name.toLowerCase().includes(query)
      );
      renderCharacters(filtered);
    });
  } else {
    console.warn("Search input not found.");
  }

  const resetButton = document.getElementById("reset-button");

resetButton.addEventListener("click", () => {
  searchInput.value = "";
  characterContainer.innerHTML = ""; // Clear the board
});




  // === Init Character Fetch ===
  fetchCharacters();
});
