/* this function makes everything that follows inside of it happen after the DOM content loads*/
document.addEventListener("DOMContentLoaded", () => {
  /*these describe the id's in the HTML so the JS knows that to act on later*/
  const overlay = document.getElementById("activate-overlay");
  const introSound = document.getElementById("introSound");
  const music = document.getElementById("audio");
  const glitchScreen = document.getElementById("intro-screen");
  const playPauseBtn = document.getElementById("play-pause");
  const seekBar = document.getElementById("seek-bar");
  const currentTimeDisplay = document.getElementById("current-time");
  const durationDisplay = document.getElementById("duration");
  const searchInput = document.getElementById("searchbar");
  const searchButton = document.getElementById("search-button");
  const resetButton = document.getElementById("reset-button");
  const spinner = document.getElementById("loading-spinner");
  const characterContainer = document.getElementById("character-container");
  const suggestions = document.getElementById("suggestions");

  let introCompleted = false;
  let musicStarted = false;
  let isSeeking = false;

  // === Format Time ===
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // === Music Setup ===
  music.addEventListener("canplaythrough", () => {
    durationDisplay.textContent = formatTime(music.duration);
    seekBar.max = music.duration;
    seekBar.step = 0.1;
  }, { once: true });

  seekBar.addEventListener("mousedown", () => (isSeeking = true));
  seekBar.addEventListener("mouseup", () => (isSeeking = false));
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
    introSound.play().catch((err) => console.warn("Intro sound failed:", err));

    setTimeout(() => {
      glitchScreen.style.animation = "fadeOut 1s ease forwards";
    }, 4000);

    setTimeout(() => {
      glitchScreen.style.display = "none";
    }, 5000);

    introSound.addEventListener("ended", () => {
      setTimeout(() => {
        music.currentTime = 0;
        music.play().catch((err) => console.warn("Music playback failed:", err));
        playPauseBtn.textContent = "Pause";
        introCompleted = true;
        setTimeout(() => {
          musicStarted = true;
        }, 1500);
      }, 1000);
    }, { once: true });
  }, { once: true });

  // === Music Controls ===
  playPauseBtn.addEventListener("click", () => {
    if (music.paused) {
      music.play();
      playPauseBtn.textContent = "Pause";
    } else {
      music.pause();
      playPauseBtn.textContent = "Play";
    }
  });

  // === Character Cards ===
  const renderCharacters = (characters) => {
    characterContainer.innerHTML = "";
    characters.forEach((character) => {
      const card = document.createElement("div");
      card.className = "character-card";

      const cardInner = document.createElement("div");
      cardInner.className = "character-card-inner";

      const cardFront = document.createElement("div");
      cardFront.className = "character-card-front";
      cardFront.innerHTML = `
        <img src="${character.thumbnail.path}.${character.thumbnail.extension}" alt="${character.name}">
        <h3>${character.name}</h3>
      `;

      const cardBack = document.createElement("div");
      cardBack.className = "character-card-back";
      cardBack.innerHTML = `
        <p><strong>${character.name}</strong></p>
        <p>${character.description || "No description available."}</p>
        <p>Appears in ${character.comics.available} comics</p>
      `;

      cardInner.appendChild(cardFront);
      cardInner.appendChild(cardBack);
      card.appendChild(cardInner);

      card.addEventListener("click", () => {
        card.classList.toggle("flipped");
      });

      characterContainer.appendChild(card);
    });
  };

  // === Autocomplete Suggestions Only ===
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.trim().toLowerCase();
    if (!introCompleted || !musicStarted || !query) return;

    fetch(`http://localhost:3000/characters?nameStartsWith=${query}`)
      .then((res) => res.json())
      .then((data) => {
        const results = data?.data?.results || [];
        suggestions.innerHTML = "";
        results.slice(0, 5).forEach((char) => {
          const li = document.createElement("li");
          li.textContent = char.name;
          li.addEventListener("click", () => {
            searchInput.value = char.name;
            suggestions.innerHTML = "";
          });
          suggestions.appendChild(li);
        });
      })
      .catch((err) => console.warn("Autocomplete fetch failed:", err));
  });

  // === Search Button Triggers Results ===
  const handleSearch = async (query) => {
    if (!introCompleted || !musicStarted || !query) return;
    spinner.classList.remove("hidden");

    try {
      const response = await fetch(
        `http://localhost:3000/characters?nameStartsWith=${query}`
      );
      const data = await response.json();
      const results = data?.data?.results || [];

      if (results.length > 0) {
        renderCharacters(results);
        suggestions.innerHTML = "";
      } else {
        characterContainer.innerHTML = "<p>No match found.</p>";
      }
    } catch (err) {
      console.warn("Search failed:", err);
      characterContainer.innerHTML = "<p>Search error. Try again later.</p>";
    } finally {
      spinner.classList.add("hidden");
    }
  };

  searchButton.addEventListener("click", (e) => {
    e.preventDefault();
    const query = searchInput.value.trim().toLowerCase();
    handleSearch(query);
  });

  // === Reset ===
  resetButton.addEventListener("click", () => {
    searchInput.value = "";
    characterContainer.innerHTML = "";
    suggestions.innerHTML = "";
  });
});
