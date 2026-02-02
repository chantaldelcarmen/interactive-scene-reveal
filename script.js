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

// Make scene 2 clickable to advance to scene 3
document.querySelector("#scene2 .videoWrap").addEventListener("click", () => {
  advanceToScene(scene2, scene3);
});

// Make scene 3 clickable to advance to scene 4
document.querySelector("#scene3 .videoWrap").addEventListener("click", () => {
  advanceToScene(scene3, scene4);
});

// Auto-advance scene 3 after 15 seconds
scene3.addEventListener("transitionend", () => {
  if (!scene3.classList.contains("hidden")) {
    clearTimeout(autoAdvanceTimer);
    autoAdvanceTimer = setTimeout(() => {
      advanceToScene(scene3, scene4);
    }, 15000);
  }
});

// Also start timer when scene3 becomes visible (in case transition event doesn't fire)
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName === "class") {
      if (!scene3.classList.contains("hidden")) {
        clearTimeout(autoAdvanceTimer);
        autoAdvanceTimer = setTimeout(() => {
          advanceToScene(scene3, scene4);
        }, 15000);
      } else {
        clearTimeout(autoAdvanceTimer);
      }
    }
  });
});

observer.observe(scene3, { attributes: true });

function advanceToScene(fromScene, toScene) {
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
    const id = btn.dataset.layer;
    if (!(id in state)) return;

    state[id] = !state[id];
    btn.classList.toggle("active", state[id]);
    updateScene();
  });
});

// Initialize interactive scene state (not visible until scene4)
updateScene();

let hasRevealed = false;

function triggerMagicalReveal() {
  if (hasRevealed) return;
  hasRevealed = true;

  setTimeout(() => {
    // Make it fullscreen
    scene4.classList.add("magical-reveal");

    // Show magical effects
    setHidden("magical-effects", false);
  }, 500);
}