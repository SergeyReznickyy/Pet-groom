// Before/after sliders: drag anywhere on the photo (mouse or finger) or use the arrow keys on the focused slider.
// Phones: the works drift in a swipeable row, so only the round handle drags (a wide invisible grip around it);
// a tap elsewhere on the photo jumps the cut there, and a swipe on the photo scrolls the row.
const worksOnPhone = matchMedia("(max-width: 640px)").matches;
function initBA(frame) {
  const range = frame.querySelector(".ba-range");
  const set = (v) => {
    v = Math.min(100, Math.max(0, v));
    range.value = v;
    frame.style.setProperty("--pos", v + "%");
  };
  const fromPointer = (e) => {
    const r = frame.getBoundingClientRect();
    set(((e.clientX - r.left) / r.width) * 100);
  };
  let grip = frame;
  if (worksOnPhone) {
    grip = frame.querySelector(".ba-grip") || document.createElement("span");
    grip.className = "ba-grip";
    frame.append(grip);
    frame.addEventListener("click", (e) => e.target !== grip && fromPointer(e));
  }
  let dragging = false;
  grip.addEventListener("pointerdown", (e) => {
    dragging = true;
    try {
      grip.setPointerCapture(e.pointerId);
    } catch {}
    frame.classList.add("is-dragging");
    fromPointer(e);
  });
  grip.addEventListener("pointermove", (e) => dragging && fromPointer(e));
  const stop = () => {
    dragging = false;
    frame.classList.remove("is-dragging");
  };
  grip.addEventListener("pointerup", stop);
  grip.addEventListener("pointercancel", stop);
  range.addEventListener("input", () => set(+range.value));
}
document.querySelectorAll(".gallery .ba-frame").forEach(initBA);
