// Works gallery: while scrolling, each card slides into its place from its own side
// (left column from the left, right from the right, middle from below). Phones get the drifting row instead.
if (document.documentElement.classList.contains("motion") && !worksOnPhone) {
  const gallery = document.querySelector(".gallery");
  const cards = [...gallery.querySelectorAll(".ba")];
  let sides = [];
  // offsetLeft/offsetTop ignore the slide offsets, so the layout is measured as if every card were in place
  const measure = () => {
    const lefts = cards.map((c) => c.offsetLeft);
    const minL = Math.min(...lefts);
    const maxL = Math.max(...lefts);
    sides = cards.map((c, k) => {
      if (maxL === minL) return k % 2 ? [1, 0] : [-1, 0];
      const col = (c.offsetLeft - minL) / (maxL - minL);
      return col < 0.25 ? [-1, 0] : col > 0.75 ? [1, 0] : [0, 1];
    });
  };
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  let queued = false;
  const place = () => {
    queued = false;
    const dist = Math.min(innerWidth * 0.3, 280);
    const galleryTop = gallery.getBoundingClientRect().top;
    cards.forEach((c, k) => {
      // 0 when the card's top is at the bottom of the screen, 1 once it has risen 55% of the screen height
      const top = galleryTop + c.offsetTop - cards[0].offsetTop;
      const p = ease(Math.min(1, Math.max(0, (innerHeight - top) / (innerHeight * 0.55))));
      const [sx, sy] = sides[k];
      const off = 1 - p;
      c.style.translate = `${sx * dist * off}px ${sy * dist * 0.6 * off}px`;
      c.style.rotate = `${sx * 6 * off}deg`;
      c.style.opacity = 0.2 + 0.8 * p;
    });
  };
  const queue = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(place);
    }
  };
  measure();
  place();
  addEventListener("scroll", queue, { passive: true });
  addEventListener("resize", () => {
    measure();
    queue();
  });
}
