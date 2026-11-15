// Masters on phones: like Instagram stories. One master fills the frame; progress bars on top fill up and move on every
//             STORY_MS. A tap on the right third goes forward, on the left back; a sideways swipe does the same;
//             press and hold pauses. Masters change with a cube turn. Plays only while the block is on screen.
if (matchMedia("(max-width: 640px)").matches) {
  const STORY_MS = 5000;
  const reel = document.querySelector(".masters");
  const slides = [...reel.children];
  const motion = document.documentElement.classList.contains("motion");
  reel.classList.add("is-stories");
  reel.style.setProperty("--story-ms", STORY_MS + "ms");
  const bars = document.createElement("div");
  bars.className = "st-bars";
  bars.innerHTML = slides.map(() => "<i><b></b></i>").join("");
  const stage = document.createElement("div");
  stage.className = "st-stage";
  slides.forEach((slide) => {
    slide.classList.add("st-slide");
    // story header: salon avatar + master's name, like an Instagram account
    slide.insertAdjacentHTML(
      "afterbegin",
      `<div class="st-top"><span class="st-ava"><img src="assets/images/logo/logo.png" alt="" width="524" height="546" /></span><span><b>${slide.querySelector("h3").textContent}</b><small>майстер Pet Groom</small></span></div>`,
    );
    stage.append(slide);
  });
  const hint = document.createElement("p");
  hint.className = "st-hint";
  hint.textContent = "Торкніться праворуч або ліворуч, щоб гортати";
  reel.append(bars, stage, hint);
  let cur = 0;
  let onScreen = false;
  let held = false;
  const barEls = [...bars.children];
  const sync = () => {
    barEls.forEach((bar, k) => {
      bar.className = k < cur ? "is-done" : k === cur ? "is-now" : "";
    });
    // restart the current bar's fill animation
    const fill = barEls[cur].firstChild;
    fill.style.animation = "none";
    void fill.offsetWidth;
    fill.style.animation = "";
    reel.classList.toggle("is-paused", !onScreen || held || !motion);
  };
  const show = (next, dir) => {
    next = (next + slides.length) % slides.length;
    if (next === cur) return;
    const from = slides[cur];
    const to = slides[next];
    slides.forEach((sl) => sl.classList.remove("is-on", "st-out-l", "st-out-r", "st-in-l", "st-in-r"));
    if (motion) from.classList.add(dir > 0 ? "st-out-l" : "st-out-r");
    to.classList.add("is-on");
    if (motion) to.classList.add(dir > 0 ? "st-in-r" : "st-in-l");
    cur = next;
    sync();
  };
  slides[0].classList.add("is-on");
  sync();
  // the current bar filling up is the timer: when it ends, move on
  bars.addEventListener("animationend", (e) => {
    if (e.target === barEls[cur].firstChild) show(cur + 1, 1);
  });
  // taps, swipes and press-and-hold on the frame
  let downX = 0;
  let downY = 0;
  let downT = 0;
  stage.addEventListener("pointerdown", (e) => {
    if (e.target.closest("a, button")) return;
    downX = e.clientX;
    downY = e.clientY;
    downT = performance.now();
    held = true;
    reel.classList.add("is-paused");
  });
  const release = (e) => {
    if (!held) return;
    held = false;
    reel.classList.toggle("is-paused", !onScreen || !motion);
    if (e.type !== "pointerup") return;
    const dx = e.clientX - downX;
    const dy = e.clientY - downY;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) return show(cur + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    // a long press was a pause, not a tap
    if (performance.now() - downT > 350 || Math.abs(dx) > 10 || Math.abs(dy) > 10) return;
    const box = stage.getBoundingClientRect();
    const forward = e.clientX - box.left > box.width / 3;
    show(cur + (forward ? 1 : -1), forward ? 1 : -1);
  };
  stage.addEventListener("pointerup", release);
  stage.addEventListener("pointercancel", release);
  stage.addEventListener("pointerleave", release);
  new IntersectionObserver(([e]) => {
    onScreen = e.isIntersecting;
    reel.classList.toggle("is-paused", !onScreen || held || !motion);
  }, { threshold: 0.6 }).observe(stage);
  document.addEventListener("visibilitychange", () => reel.classList.toggle("is-paused", document.hidden || !onScreen || !motion));
}
