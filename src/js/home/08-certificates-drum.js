// Certificates on phones:
// a 3D carousel: the certificates stand round a drum that turns with a swipe (native scrolling, so it has
//             momentum). The front one is big and straight, the side ones turn away and sink back; each has a soft
//             mirror reflection. A tap on a side one turns it to the front. The first time the strip comes into
//             view the drum gives one small turn to show it spins. Dots under it show the position.
if (matchMedia("(max-width: 640px)").matches) {
  const drum = document.querySelector(".certs");
  const faces = [...drum.children].map((sheet) => {
    // the face is the snap slot and never moves; the card inside it takes the 3D turn
    // (scroll snapping measures transformed boxes, so turning the slot itself would knock it off centre)
    const face = document.createElement("div");
    face.className = "drum-face";
    const card = document.createElement("div");
    card.className = "drum-card";
    sheet.replaceWith(face);
    card.append(sheet);
    face.append(card);
    return face;
  });
  drum.classList.add("is-drum");
  const dots = document.createElement("div");
  dots.className = "cert-dots";
  dots.setAttribute("aria-hidden", "true");
  dots.innerHTML = faces.map(() => "<i></i>").join("");
  drum.after(dots);
  let queued = false;
  const turn = () => {
    queued = false;
    const box = drum.getBoundingClientRect();
    const mid = box.left + drum.clientWidth / 2;
    let cur = 0;
    let best = Infinity;
    faces.forEach((face, k) => {
      const w = face.offsetWidth;
      // d: how many card-widths this face is from the centre (0 = front)
      const d = (face.offsetLeft - drum.scrollLeft + w / 2 - drum.clientWidth / 2) / w;
      const a = Math.max(-1.6, Math.min(1.6, d));
      // round a drum: side faces turn away, sink back and slide in towards the front one
      face.firstChild.style.transform = `perspective(900px) translateX(${-a * 18}%) translateZ(${-Math.abs(a) * 140}px) rotateY(${-a * 42}deg)`;
      face.style.zIndex = 100 - Math.round(Math.abs(d) * 10);
      face.style.opacity = Math.max(0, 1 - Math.max(0, Math.abs(d) - 1) * 0.8);
      face.classList.toggle("is-front", Math.abs(d) < 0.5);
      if (Math.abs(d) < best) {
        best = Math.abs(d);
        cur = k;
      }
    });
    [...dots.children].forEach((dot, k) => dot.classList.toggle("is-on", k === cur));
  };
  const queue = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(turn);
    }
  };
  const goTo = (k) => {
    const face = faces[k];
    drum.scrollTo({ left: face.offsetLeft - (drum.clientWidth - face.offsetWidth) / 2, behavior: "smooth" });
  };
  drum.addEventListener("scroll", queue, { passive: true });
  addEventListener("resize", queue);
  drum.addEventListener("click", (e) => {
    const face = e.target.closest(".drum-face");
    if (face && !face.classList.contains("is-front")) goTo(faces.indexOf(face));
  });
  turn();
  // one small turn the first time it shows up: start on the second face and roll back to the first
  if (document.documentElement.classList.contains("motion") && faces.length > 1) {
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        setTimeout(() => goTo(0), 500);
      },
      { threshold: 0.6 },
    );
    drum.scrollLeft = faces[1].offsetLeft - (drum.clientWidth - faces[1].offsetWidth) / 2;
    turn();
    io.observe(drum);
  }
}
