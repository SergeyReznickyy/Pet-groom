// Phones: the works ("До і після") drift right-to-left in an endless loop (masters, certificates and reviews have
// their own phone layouts). The cards are duplicated once so the row can wrap around seamlessly. Any touch, drag
// or wheel pauses it so the visitor can browse; it resumes RESUME_MS after they stop.
if (matchMedia("(max-width: 640px)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const SPEED = 28; // px per second
  const RESUME_MS = 2000;
  document.querySelectorAll(".gallery").forEach((track) => {
    const items = [...track.children];
    items.forEach((el) => {
      const copy = el.cloneNode(true);
      copy.classList.remove("reveal", "is-in");
      copy.setAttribute("aria-hidden", "true");
      copy.querySelectorAll("a, input").forEach((a) => (a.tabIndex = -1));
      track.append(copy);
      copy.querySelectorAll(".ba-frame").forEach(initBA);
    });
    track.classList.add("is-auto");
    let pos = 0;
    let paused = false;
    let visible = false;
    let resumeTimer;
    let last;
    const period = () => track.children[items.length].offsetLeft - items[0].offsetLeft;
    const tick = (now) => {
      if (last !== undefined && !paused && visible) {
        pos += (SPEED * (now - last)) / 1000;
        if (pos >= period()) pos -= period();
        track.scrollLeft = pos;
      }
      last = now;
      requestAnimationFrame(tick);
    };
    const pause = () => {
      paused = true;
      clearTimeout(resumeTimer);
    };
    const resume = () => {
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        pos = track.scrollLeft % period();
        paused = false;
      }, RESUME_MS);
    };
    track.addEventListener("pointerdown", pause);
    track.addEventListener("pointerup", resume);
    track.addEventListener("pointercancel", resume);
    track.addEventListener("touchstart", pause, { passive: true });
    track.addEventListener("touchend", resume);
    track.addEventListener("wheel", () => {
      pause();
      resume();
    }, { passive: true });
    // starts drifting only when the row is half on screen, after a moment to see the first card whole
    let started = false;
    new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible && !started) {
          started = true;
          paused = true;
          setTimeout(() => (paused = false), 1500);
        }
      },
      { threshold: 0.5 },
    ).observe(track);
    requestAnimationFrame(tick);
  });
}
