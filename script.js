// Title Screen
const titleScreen = document.getElementById("titleScreen");
const startBtn = document.getElementById("startBtn");

startBtn.addEventListener("click", () => {
  titleScreen.classList.add("fade-out");
  setTimeout(() => {
    titleScreen.style.display = "none";
    // Start the first video when entering the experience
    ticketsVideo.play().catch(() => {});
  }, 800);
});

// Mute Toggle
const muteToggle = document.getElementById("muteToggle");
const muteIcon = document.querySelector(".mute-icon");
const unmuteIcon = document.querySelector(".unmute-icon");
const magicalAudio = document.getElementById("magicalAudio");
let isMuted = true;

muteToggle.addEventListener("click", () => {
  isMuted = !isMuted;
  
  // Toggle all videos
  ticketsVideo.muted = isMuted;
  planeVideo.muted = isMuted;
  magicalAudio.muted = isMuted;
  
  // Toggle icons
  muteIcon.classList.toggle("hidden", !isMuted);
  unmuteIcon.classList.toggle("hidden", isMuted);
  
  // If unmuting, try to play current video
  if (!isMuted) {
    if (!scene1.classList.contains('hidden')) ticketsVideo.play();
    if (!scene2.classList.contains('hidden')) planeVideo.play();
  }
});

// Pause Button
const pauseBtn = document.getElementById("pauseBtn");
const pauseIcon = document.querySelector(".pause-icon");
const playIcon = document.querySelector(".play-icon");
let isPaused = false;

pauseBtn.addEventListener("click", () => {
  isPaused = !isPaused;
  
  if (isPaused) {
    // Pause all media
    ticketsVideo.pause();
    planeVideo.pause();
    magicalAudio.pause();
  } else {
    // Resume playing based on which scene is active
    if (!scene1.classList.contains('hidden')) ticketsVideo.play();
    if (!scene2.classList.contains('hidden')) planeVideo.play();
    if (!magicalAudio.paused || hasRevealed) magicalAudio.play().catch(() => {});
  }
  
  // Toggle icons
  pauseIcon.classList.toggle("hidden", isPaused);
  playIcon.classList.toggle("hidden", !isPaused);
});

// Replay Button
const replayBtn = document.getElementById("replayBtn");
replayBtn.addEventListener("click", () => {
  // Stop and reset magical audio
  magicalAudio.pause();
  magicalAudio.currentTime = 0;
  
  // Reset pause state
  isPaused = false;
  pauseIcon.classList.remove("hidden");
  playIcon.classList.add("hidden");
  
  // Hide all scenes
  scene1.classList.remove("hidden");
  scene2.classList.add("hidden");
  scene3.classList.add("hidden");
  scene4.classList.add("hidden");
  scene4.classList.remove("magical-reveal");
  scene4.classList.remove("zoom-in");
  
  // Show buttons again
  document.querySelector(".buttons").classList.remove("fade-out");
  
  // Hide magical effects
  setHidden("magical-effects", true);
  
  // Reset state
  Object.keys(state).forEach(key => state[key] = false);
  document.querySelectorAll(".person-btn").forEach(btn => btn.classList.remove("active"));
  hasRevealed = false;
  updateScene();
  
  // Reset and restart tickets video
  ticketsVideo.currentTime = 0;
  ticketsVideo.play().catch(() => {});
});

// Scene switching 
const scene1 = document.getElementById("scene1");
const scene2 = document.getElementById("scene2");
const scene3 = document.getElementById("scene3");
const scene4 = document.getElementById("scene4");

const ticketsVideo = document.getElementById("ticketsVideo");
const planeVideo = document.getElementById("planeVideo");
const windowseatImage = document.getElementById("windowseatImage");

let autoAdvanceTimer = null;

// After tickets video ends -> advance to scene2
ticketsVideo.addEventListener("ended", () => {
  advanceToScene(scene1, scene2);

  // Restart plane video cleanly
  planeVideo.currentTime = 0;
  planeVideo.play().catch(() => {
    // If autoplay fails, user can still press play
  });
});

// After plane video ends -> advance to scene 3
planeVideo.addEventListener("ended", () => {
  advanceToScene(scene2, scene3);
});

// Auto-advance scene 3 after 6 seconds (no click handler - auto only)
scene3.addEventListener("transitionend", (e) => {
  if (e.target === scene3 && !scene3.classList.contains("hidden") && scene4.classList.contains("hidden")) {
    clearTimeout(autoAdvanceTimer);
    autoAdvanceTimer = setTimeout(() => {
      advanceToScene(scene3, scene4);
    }, 6000);
  }
});

// Also start timer when scene3 becomes visible (in case transition event doesn't fire)
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName === "class") {
      if (!scene3.classList.contains("hidden") && scene4.classList.contains("hidden")) {
        clearTimeout(autoAdvanceTimer);
        autoAdvanceTimer = setTimeout(() => {
          advanceToScene(scene3, scene4);
        }, 6000);
      } else {
        clearTimeout(autoAdvanceTimer);
      }
    }
  });
});

observer.observe(scene3, { attributes: true });

function advanceToScene(fromScene, toScene) {
  clearTimeout(autoAdvanceTimer);
  fromScene.classList.add("hidden");
  toScene.classList.remove("hidden");
}


//Interactive overlays (toggle on/off) 
const layers = ["temple", "greens", "sky", "sun"];
const state = {
  temple: false,
  greens: false,
  sky: false,
  sun: false,
};

function setHidden(id, hidden) {
  document.getElementById(id).classList.toggle("hidden", hidden);
}

function updateScene() {
  const activeCount = layers.filter((l) => state[l]).length;
  const allActive = activeCount === layers.length;

  // Show/hide overlays according to toggles
  layers.forEach((id) => setHidden(id, !state[id]));

  // // Show full color only when all are active
  // if (allActive) {
  //   layers.forEach((id) => setHidden(id, true));
  //   setHidden("full", false);
  // } else {
  //   setHidden("full", true);
  // }

  // Show full color only when all are active
  if (allActive) {
    layers.forEach((id) => setHidden(id, true));
    setHidden("full", false);

    triggerMagicalReveal();
  } else {
    setHidden("full", true);
  }

}

document.querySelectorAll(".person-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const layerId = btn.dataset.layer;
    const personName = btn.dataset.name;
    if (!(layerId in state)) return;

    state[layerId] = !state[layerId];
    btn.classList.toggle("active", state[layerId]);
    updateScene();

    // Show only one description at a time
    const allPopups = document.querySelectorAll(".description-popup");
    const currentPopup = document.querySelector(`.description-popup[data-name="${personName}"]`);
    
    if (currentPopup) {
      const isActive = currentPopup.classList.contains("active");
      
      // Close all descriptions
      allPopups.forEach(popup => popup.classList.remove("active"));
      
      // If this description wasn't active, show it (otherwise it stays closed)
      if (!isActive) {
        currentPopup.classList.add("active");
      }
    }
  });
});

// Initialize interactive scene state (not visible until scene4)
updateScene();

let hasRevealed = false;

function triggerMagicalReveal() {
  if (hasRevealed) return;
  hasRevealed = true;

  // Close all description popups
  document.querySelectorAll(".description-popup").forEach(popup => {
    popup.classList.remove("active");
  });

  // Step 1: Hide buttons
  // document.querySelector(".buttons").classList.add("fade-out");

  // Step 2: After buttons fade, start zoom animation
  setTimeout(() => {
    scene4.classList.add("zoom-in");
  }, 500);

  // Step 3: After zoom completes, show magical effects
  setTimeout(() => {
    scene4.classList.add("magical-reveal");
    setHidden("magical-effects", false);

    // Play magical audio with fade-in
    magicalAudio.muted = isMuted;
    magicalAudio.volume = 0;
    magicalAudio.play().catch(err => console.log("Audio play prevented:", err));
    
    // Fade in audio over 3 seconds
    let volume = 0;
    const fadeIn = setInterval(() => {
      if (volume < 0.6) {
        volume += 0.02;
        magicalAudio.volume = Math.min(volume, 0.6);
      } else {
        clearInterval(fadeIn);
      }
    }, 100);
  }, 3500);
}