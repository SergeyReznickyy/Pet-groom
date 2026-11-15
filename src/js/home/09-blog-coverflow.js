// Blog (phones): cover flow. As the row is swiped, the card in the middle faces the reader and its
// neighbours turn away in 3D, shrink and dim. The first time the row comes into view it nudges, to show it swipes.
if (document.documentElement.classList.contains("motion") && matchMedia("(max-width: 640px)").matches) {
  const flow = document.querySelector("#blog .posts");
  const posts = [...flow.children];
  flow.classList.add("is-flow");
  let flowQueued = false;
  const turn = () => {
    flowQueued = false;
    const mid = flow.getBoundingClientRect().left + flow.clientWidth / 2;
    posts.forEach((post) => {
      const r = post.getBoundingClientRect();
      // -1 … 1: how far (in card widths) the card's centre is from the row's centre
      const d = Math.max(-1.5, Math.min(1.5, (r.left + r.width / 2 - mid) / r.width));
      const a = Math.min(1, Math.abs(d));
      // neighbours turn around their edge nearest the centre and slide in a little, so they peek in from the sides
      post.style.transformOrigin = d > 0 ? "0% 50%" : "100% 50%";
      post.style.transform = `translateX(${-d * 34}px) perspective(900px) rotateY(${-d * 34}deg) scale(${1 - a * 0.12})`;
      post.style.filter = `brightness(${1 - a * 0.06}) saturate(${1 - a * 0.4})`;
      post.style.zIndex = 10 - Math.round(a * 5); // the centred card stays on top of the peeking ones
    });
  };
  const queueTurn = () => {
    if (!flowQueued) {
      flowQueued = true;
      requestAnimationFrame(turn);
    }
  };
  flow.addEventListener("scroll", queueTurn, { passive: true });
  addEventListener("resize", queueTurn);
  turn();
  const nudge = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    nudge.disconnect();
    setTimeout(() => {
      flow.scrollBy({ left: 70, behavior: "smooth" });
      setTimeout(() => flow.scrollTo({ left: 0, behavior: "smooth" }), 650);
    }, 500);
  }, { threshold: 0.6 });
  nudge.observe(flow);
}
