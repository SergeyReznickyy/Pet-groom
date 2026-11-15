// Header is transparent over the hero photo only while the page is scrolled to the top.
// The class is touched only when the state actually changes, so scrolling doesn't restyle the header on every event.
let headerTop = null;
const syncHeader = () => {
  const top = window.scrollY < 8;
  if (top === headerTop) return;
  headerTop = top;
  header.classList.toggle("is-top", top);
};
syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });
