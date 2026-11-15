// Certificates (tablet/desktop): each diploma is a rolled-up scroll on violet rods that unrolls top to bottom,
// one after another, the first time the row scrolls into view. Without motion they are simply shown unrolled.
if (matchMedia("(min-width: 641px)").matches) {
  const desk = document.querySelector(".certs");
  const sheets = [...desk.children];
  sheets.forEach((sheet, k) => {
    const wrap = document.createElement("div");
    wrap.className = "cert";
    wrap.style.setProperty("--k", k);
    sheet.replaceWith(wrap);
    wrap.append(sheet);
    wrap.insertAdjacentHTML("beforeend", '<span class="rod rod-top" aria-hidden="true"><b>Pet Groom</b></span><span class="rod rod-bottom" aria-hidden="true"></span>');
  });
  desk.classList.add("is-scrolls");
  if (document.documentElement.classList.contains("motion")) {
    desk.classList.add("s-wait");
    const deskIO = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        deskIO.disconnect();
        desk.classList.add("s-in");
      },
      { threshold: 0.45 },
    );
    deskIO.observe(desk);
  }
}
