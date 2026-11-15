// Header is transparent over the hero photo only while the page is scrolled to the top.
// An observer watches an invisible 8px strip at the very top of the page instead of reading scrollY on every scroll
// event: that read forced the browser to re-lay out the page dozens of times a second while blocks were animating in,
// which was the main cause of the stutter on phones.
{
  const topMark = document.createElement("div");
  topMark.setAttribute("aria-hidden", "true");
  topMark.style.cssText = "position:absolute;top:0;left:0;width:1px;height:8px;pointer-events:none;visibility:hidden";
  document.body.prepend(topMark);
  header.classList.toggle("is-top", window.scrollY < 8);
  new IntersectionObserver(([e]) => header.classList.toggle("is-top", e.isIntersecting)).observe(topMark);
}
