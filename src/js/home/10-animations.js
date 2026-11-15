// Text and scroll animations. Headlines rise word by word from a mask; other blocks fade up with a soft blur, staggered by position.
function splitWords(el) {
  let i = 0;
  const walk = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 1) return walk(n);
      if (n.nodeType !== 3) return;
      const frag = document.createDocumentFragment();
      // split on ordinary whitespace only, so "у&nbsp;Telegram" stays one unit
      n.textContent.split(/([ \t\n\r]+)/).forEach((part) => {
        if (!part) return;
        if (/^[ \t\n\r]+$/.test(part)) return frag.append(" ");
        const mask = document.createElement("span");
        const word = document.createElement("span");
        mask.className = "w";
        word.textContent = part;
        word.style.setProperty("--i", i++);
        mask.append(word);
        frag.append(mask);
      });
      n.replaceWith(frag);
    });
  };
  walk(el);
  el.classList.add("words");
}
if (document.documentElement.classList.contains("motion")) {
  document.querySelectorAll(".hero h1, .sec-head h2, .final h2").forEach(splitWords);

  // Hero: timed entrance on load.
  const intro = [
    [".header", 0],
    [".hero .slogan", 80],
    [".hero h1", 160],
    [".hero .subtitle", 560],
    [".hero .lead", 700],
    [".hero-actions", 820],
  ];
  intro.forEach(([sel, ms]) => {
    const el = document.querySelector(sel);
    el.classList.add("reveal");
    el.style.setProperty("--delay", ms + "ms");
  });
  document.querySelectorAll(".perks li").forEach((li, k) => {
    li.classList.add("reveal");
    li.style.setProperty("--delay", 940 + k * 110 + "ms");
  });
  requestAnimationFrame(() =>
    requestAnimationFrame(() =>
      document.querySelectorAll(".header, .hero .reveal").forEach((el) => el.classList.add("is-in")),
    ),
  );

  // Everything below the hero: revealed as it scrolls into view.
  const SCROLL_TARGETS = [
    ".sec-head > *",
    ".picker",
    ".honest",
    ".photo-cta",
    ".steps li",
    ".how-grid .row-end",
    ".why > *",
    ".specs > *",
    ".masters > *",
    ".reviews > *",
    ".posts > *",
    ".faq details",
    ".row-end",
    ".final > *",
    ".channels > *",
    ".contacts dl",
    ".contacts .map",
    ".footer .wrap > *",
  ];
  const targets = new Set(document.querySelectorAll(SCROLL_TARGETS.join(",")));
  targets.forEach((el) => {
    // the hero has its own entrance; flipping master cards are driven by the scroll instead
    // (the pinned phone blocks keep their own heading reveal, which now lives inside the pinned stage)
    if (el.closest(".hero") || (el.closest(".is-badges, .is-stories, .is-drum, .is-flow, .is-board") && !el.closest(".sec-head"))) return targets.delete(el);
    // stagger siblings that share a parent (capped so long lists don't drag)
    const sibs = [...el.parentElement.children].filter((c) => targets.has(c));
    el.style.setProperty("--d", Math.min(sibs.indexOf(el), 6));
    el.classList.add("reveal");
  });
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
  );
  targets.forEach((el) => io.observe(el));
}
