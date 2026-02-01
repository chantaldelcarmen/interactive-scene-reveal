// Scene switching 
const scene1 = document.getElementById("scene1");
const scene2 = document.getElementById("scene2");
const scene3 = document.getElementById("scene3");

const ticketsVideo = document.getElementById("ticketsVideo");
const planeVideo = document.getElementById("planeVideo");

const next1 = document.getElementById("next1");
const next2 = document.getElementById("next2");

// After tickets video ends -> show Next
ticketsVideo.addEventListener("ended", () => {
  next1.classList.remove("hidden");
});

// Next from scene1 -> scene2
next1.addEventListener("click", () => {
  scene1.classList.add("hidden");
  scene2.classList.remove("hidden");

  // Restart plane video cleanly
  planeVideo.currentTime = 0;
  planeVideo.play().catch(() => {
    // If autoplay fails, user can still press play
  });
});

// After plane video ends -> show Next
planeVideo.addEventListener("ended", () => {
  next2.classList.remove("hidden");
});

// Next from scene2 -> scene3 (interactive)
next2.addEventListener("click", () => {
  scene2.classList.add("hidden");
  scene3.classList.remove("hidden");
});


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

  // Show full color only when all are active
  if (allActive) {
    layers.forEach((id) => setHidden(id, true));
    setHidden("full", false);
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

// Initialize interactive scene state (not visible until scene3)
updateScene();
