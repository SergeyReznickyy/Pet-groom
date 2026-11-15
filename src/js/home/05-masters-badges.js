// Masters (tablet/desktop): staff badges on lanyards hanging from a rope across the block.
// The first time the row scrolls into view the rope draws itself, then the badges drop in one by one,
// spring on their straps and swing to rest. It plays once; afterwards a hover gives a badge a small swing.
// Phones get the stories instead.
if (matchMedia("(min-width: 641px)").matches) {
  const team = document.querySelector(".masters");
  const people = [...team.children];
  team.classList.add("is-badges");
  const rope = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  rope.classList.add("badge-rope");
  rope.setAttribute("aria-hidden", "true");
  rope.innerHTML = '<path class="rope-base" /><path class="rope-twist" /><circle class="rope-nail" r="6" /><circle class="rope-nail" r="6" />';
  team.prepend(rope);
  people.forEach((card, k) => {
    card.insertAdjacentHTML("afterbegin", '<span class="badge-strap" aria-hidden="true"><i class="badge-ring"></i><i class="badge-clip"></i></span><span class="badge-band" aria-hidden="true">Pet Groom · майстер</span>');
    card.style.setProperty("--k", k);
    card.style.setProperty("--dir", k % 2 ? -1 : 1); // neighbours swing opposite ways
  });
  const ROPE_Y = 14; // rope ends (nails), px from the top of the block
  const SAG = 26; // how far the rope dips in the middle
  const hang = () => {
    const w = team.clientWidth;
    rope.setAttribute("viewBox", `0 0 ${w} 60`);
    const d = `M0 ${ROPE_Y} Q ${w / 2} ${ROPE_Y + SAG * 2} ${w} ${ROPE_Y}`;
    rope.querySelectorAll("path").forEach((el) => el.setAttribute("d", d));
    const [n1, n2] = rope.querySelectorAll(".rope-nail");
    n1.setAttribute("cx", 0);
    n2.setAttribute("cx", w);
    n1.setAttribute("cy", ROPE_Y);
    n2.setAttribute("cy", ROPE_Y);
    rope.style.setProperty("--len", Math.ceil(rope.querySelector("path").getTotalLength()));
    // each strap runs from the rope (at the card's centre) down to the card's top edge
    people.forEach((card) => {
      const t = (card.offsetLeft + card.offsetWidth / 2) / w;
      const ropeAt = ROPE_Y + 4 * SAG * t * (1 - t);
      card.style.setProperty("--strap", `${card.offsetTop - ropeAt}px`);
    });
  };
  hang();
  addEventListener("resize", hang);
  if (document.documentElement.classList.contains("motion")) {
    team.classList.add("b-wait");
    const teamIO = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        teamIO.disconnect();
        team.classList.add("b-in");
        // after the last badge settles, drop the entrance classes so hover swings can play
        setTimeout(() => team.classList.remove("b-wait", "b-in"), 900 + people.length * 220 + 1900);
      },
      { threshold: 0.35 },
    );
    teamIO.observe(team);
  }
}
