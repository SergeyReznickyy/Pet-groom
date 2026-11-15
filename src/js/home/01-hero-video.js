// Hero video: short grooming clips play one after another, each for SCENE_MS, looping.
// Clips load lazily (current + next); phones get the 360p files. Pauses while the tab is hidden.
const SCENE_MS = 4500;
const isPhone = matchMedia("(max-width: 760px)").matches;
const CLIP_Q = innerWidth < 900 ? 360 : 720;
const scenes = document.querySelectorAll(".scene");
const loadClip = (sc) => {
  const v = sc.querySelector("video");
  if (!v.src) {
    v.preload = "auto";
    v.src = `assets/video/hero/${sc.dataset.clip}-${CLIP_Q}.mp4`;
  }
  return v;
};
let sceneIdx = 0;
let storyTimer;
function showScene(i) {
  sceneIdx = (i + scenes.length) % scenes.length;
  scenes.forEach((sc, k) => {
    sc.classList.toggle("is-on", k === sceneIdx);
    if (k !== sceneIdx) sc.querySelector("video").pause();
  });
  const video = loadClip(scenes[sceneIdx]);
  loadClip(scenes[(sceneIdx + 1) % scenes.length]);
  video.currentTime = 0;
  video.play().catch(() => {});
  clearTimeout(storyTimer);
  storyTimer = setTimeout(() => showScene(sceneIdx + 1), SCENE_MS);
}
document.addEventListener("visibilitychange", () => {
  if (isPhone) return;
  if (document.hidden) {
    clearTimeout(storyTimer);
    scenes[sceneIdx].querySelector("video").pause();
  } else {
    showScene(sceneIdx);
  }
});
// Phones show the still photo, so no clips are loaded at all.
// With reduced motion, show the first clip's opening frame without playing.
if (!isPhone) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) loadClip(scenes[0]);
  else showScene(0);
}
