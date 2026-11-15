// Reviews: handwritten notes pinned to a cork board with paw-shaped magnets, each a little askew. The first time
// the board scrolls into view the notes fly in one by one and stick with a bounce, then each magnet snaps on.
// Plays once; a hovered note straightens up. Phones swipe the notes sideways.
{
  const box = document.querySelector(".reviews");
  const notes = [...box.children];
  const TILT = [-3, 2.2, -1.4, 3, -2.4, 1.6, -2, 1.2];
  // how many notes the board shows before "Показати ще": two rows on desktop, two on tablet; phones swipe through all
  const phone = matchMedia("(max-width: 640px)").matches;
  const BATCH = phone ? Infinity : matchMedia("(max-width: 1100px)").matches ? 4 : 8;
  // a note's place in its batch drives the entrance stagger; capped so a long batch never drags
  const setOrder = (note, i) => note.style.setProperty("--k", Math.min(i, 7));
  box.classList.add("is-board");
  notes.forEach((note, k) => {
    setOrder(note, k);
    note.style.setProperty("--tilt", `${TILT[k % TILT.length]}deg`);
    note.dataset.tone = k % 4;
    note.insertAdjacentHTML("afterbegin", '<span class="note-pin" aria-hidden="true"><svg viewBox="0 0 24 24"><use href="#i-paw" /></svg></span>');
    note.querySelector("p").insertAdjacentHTML("afterend", '<button type="button" class="note-more" hidden>Читати повністю</button>');
    if (k >= BATCH) note.hidden = true;
  });
  // long reviews are clamped to a few lines (CSS); only the notes that actually got cut show the toggle
  const markLong = () =>
    notes.forEach((note) => {
      if (note.hidden || note.classList.contains("is-open")) return;
      const p = note.querySelector("p");
      note.querySelector(".note-more").hidden = p.scrollHeight <= p.clientHeight + 2;
    });
  document.fonts.ready.then(markLong); // the handwritten font changes line breaks once it loads
  let markTimer;
  addEventListener("resize", () => {
    clearTimeout(markTimer);
    markTimer = setTimeout(markLong, 200);
  });
  box.addEventListener("click", (e) => {
    const btn = e.target.closest(".note-more");
    if (!btn) return;
    if (phone) return openNote(btn.closest(".review"));
    const open = btn.closest(".review").classList.toggle("is-open");
    btn.textContent = open ? "Згорнути" : "Читати повністю";
  });
  // more reviews than one batch: a button under the board pins the next batch, which flies in like the first
  const hiddenNotes = () => notes.filter((n) => n.hidden);
  if (hiddenNotes().length) {
    const more = document.createElement("div");
    more.className = "board-more";
    more.innerHTML = '<button type="button" class="btn btn-line"></button>';
    const moreBtn = more.firstChild;
    const label = () => (moreBtn.textContent = `Показати ще відгуки (${hiddenNotes().length})`);
    label();
    box.after(more);
    moreBtn.addEventListener("click", () => {
      hiddenNotes()
        .slice(0, BATCH)
        .forEach((note, i) => {
          setOrder(note, i);
          note.hidden = false;
          note.classList.add("n-pop");
          note.addEventListener("animationend", () => note.classList.remove("n-pop"), { once: true });
        });
      markLong();
      if (hiddenNotes().length) label();
      else more.remove();
    });
  }
  if (document.documentElement.classList.contains("motion")) {
    box.classList.add("n-wait");
    const boardIO = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        boardIO.disconnect();
        box.classList.add("n-in");
        setTimeout(() => box.classList.remove("n-wait", "n-in"), 400 + 8 * 260 + 1200);
      },
      { threshold: 0.15 },
    );
    boardIO.observe(box);
  }
  // Phones: the full text of a long note opens in a sheet from the bottom (the board keeps its height),
  // dots under the board show the position, and the board turns to the second note and back once to show it swipes.
  function openNote(note) {
    let sheet = document.getElementById("note-sheet");
    if (!sheet) {
      sheet = document.createElement("dialog");
      sheet.id = "note-sheet";
      sheet.className = "note-sheet";
      sheet.innerHTML = '<button type="button" class="note-sheet-close" aria-label="Закрити">×</button><div class="is-board note-sheet-body"></div>';
      sheet.addEventListener("click", (e) => {
        if (e.target === sheet || e.target.closest(".note-sheet-close")) sheet.close();
      });
      document.body.append(sheet);
    }
    const copy = note.cloneNode(true);
    copy.classList.add("is-open");
    copy.removeAttribute("aria-hidden");
    copy.querySelectorAll(".note-pin, .note-more").forEach((el) => el.remove());
    sheet.querySelector(".note-sheet-body").replaceChildren(copy);
    sheet.showModal();
  }
  if (phone) {
    const dots = document.createElement("div");
    dots.className = "cert-dots";
    dots.setAttribute("aria-hidden", "true");
    dots.innerHTML = notes.map(() => "<i></i>").join("");
    box.after(dots);
    const centre = (note) => note.offsetLeft - (box.clientWidth - note.offsetWidth) / 2;
    let dotQueued = false;
    const syncDots = () => {
      dotQueued = false;
      let cur = 0;
      let best = Infinity;
      notes.forEach((n, k) => {
        const d = Math.abs(centre(n) - box.scrollLeft);
        if (d < best) {
          best = d;
          cur = k;
        }
      });
      [...dots.children].forEach((dot, k) => dot.classList.toggle("is-on", k === cur));
    };
    box.addEventListener("scroll", () => {
      if (!dotQueued) {
        dotQueued = true;
        requestAnimationFrame(syncDots);
      }
    }, { passive: true });
    syncDots();
    if (document.documentElement.classList.contains("motion") && notes.length > 1) {
      const hintIO = new IntersectionObserver(
        ([e]) => {
          if (!e.isIntersecting) return;
          hintIO.disconnect();
          // after the notes have stuck on (entrance), nudge to the second one and come back
          setTimeout(() => {
            box.scrollTo({ left: centre(notes[1]), behavior: "smooth" });
            setTimeout(() => box.scrollTo({ left: centre(notes[0]), behavior: "smooth" }), 900);
          }, 2200);
        },
        { threshold: 0.6 },
      );
      hintIO.observe(box);
    }
  }
}
