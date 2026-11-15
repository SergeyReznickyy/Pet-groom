// Header is transparent over the hero photo only while the page is scrolled to the top.
const syncHeader = () =>
  header.classList.toggle("is-top", window.scrollY < 8);
syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });
