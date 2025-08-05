/* this function makes everything that follows inside of it happen after the DOM content loads*/
document.addEventListener("DOMContentLoaded", () => {
  /*these describe the id's in the HTML so the JS knows that to act on later*/
  const overlay = document.getElementById("activate-overlay");
  const introSound = document.getElementById("introSound");
  const music = document.getElementById("audio");
  const glitchScreen = document.getElementById("intro-screen");
  const playPauseBtn = document.getElementById("play-pause");

  // 🎨 Chart Setup (render immediately)
  const ctx = document.getElementById("myChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Crime", "Miles' School", "Miles' Entrance", "Proximity to Home", "Threats"],
      datasets: [{
        backgroundColor: ["white", "purple", "red", "orange", "black"],
        data: [42, 40, 48, 45, 37]
      }]
    },
    options: {
      legend: { display: false },
      title: {
        display: true,
        text: "Unmasking the Hero",
        fontColor: "white"
      },
      scales: {
        xAxes: [{
          ticks: { fontColor: "white" },
          gridLines: { color: "rgba(255,255,255,0.1)" }
        }],
        yAxes: [{
          ticks: { fontColor: "white" },
          gridLines: { color: "rgba(255,255,255,0.1)" }
        }]
      }
    }
  });

  // 🎬 Start Sequence on Overlay Click
  overlay.addEventListener("click", () => {
    // Step 1: Hide overlay
    overlay.style.display = "none";

    // Step 2: Show glitch screen
    glitchScreen.classList.add("active");

    // Step 3: Play prowler sound
    introSound.currentTime = 0;
    introSound.play().catch(err => console.warn("Intro sound failed:", err));

    // Step 4: Fade out glitch screen after 2s
    setTimeout(() => {
      glitchScreen.style.animation = "fadeOut 1s ease forwards";
    }, 2000);

    // Step 5: Hide glitch screen after fade
    setTimeout(() => {
      glitchScreen.style.display = "none";
    }, 3000);

    // Step 6: Play music after intro ends
    introSound.addEventListener("ended", () => {
      setTimeout(() => {
        music.currentTime = 0;
        music.play().catch(err => console.warn("Music playback failed:", err));
        playPauseBtn.textContent = "Pause";
      }, 3000);
    }, { once: true });
  }, { once: true });

  // 🎵 Music Player Controls
  playPauseBtn.addEventListener("click", () => {
    if (music.paused) {
      music.play();
      playPauseBtn.textContent = "Pause";
    } else {
      music.pause();
      playPauseBtn.textContent = "Play";
    }
  });
});
