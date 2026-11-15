const promoModal = document.getElementById("promo-modal");
const promoTeaser = document.querySelector(".promo-teaser");
const openPromo = () => {
  promoTeaser.hidden = true;
  if (!promoModal.open) promoModal.showModal();
};
document.querySelectorAll("[data-promo-open]").forEach((el) =>
  el.addEventListener("click", (e) => {
    e.preventDefault();
    openPromo();
  }),
);
// The badge on the floating button shows how many offers are in the modal.
document.querySelector(".promo-count").textContent = promoModal.querySelectorAll(".coupon").length;
// "Акції" in the header of other pages links to ../#promo: open the modal straight away.
if (location.hash === "#promo") openPromo();
// Once per visit, a bubble next to the floating button points at the offers a few seconds after it appears.
let teaserShown = false;
try {
  teaserShown = sessionStorage.getItem("promo-teaser") === "1";
} catch {}
const showTeaser = () => {
  if (teaserShown || promoModal.open) return;
  teaserShown = true;
  try {
    sessionStorage.setItem("promo-teaser", "1");
  } catch {}
  // desktop: no bubble over the content; the "Акції" link in the header lights up for a moment instead
  if (matchMedia("(min-width: 761px)").matches) {
    const link = document.querySelector(".nav .nav-promo");
    link?.classList.add("is-hint");
    setTimeout(() => link?.classList.remove("is-hint"), 4200);
    return;
  }
  promoTeaser.hidden = false;
  setTimeout(() => (promoTeaser.hidden = true), 7000);
};
promoModal.querySelector("[data-promo-close]").addEventListener("click", () => promoModal.close());
// Click on the backdrop (outside the card) closes the modal.
promoModal.addEventListener("click", (e) => {
  if (e.target === promoModal) promoModal.close();
});

// The floating booking button appears once the hero booking buttons have scrolled out of view.
new IntersectionObserver(([e]) => {
  document.documentElement.classList.toggle("show-float", !e.isIntersecting);
}).observe(document.querySelector(".hero-actions"));
// The promo button slides in from the left when "Чому обирають нас" comes into view
// (its top passes 85% of the screen height) and slides back out when the visitor scrolls above it.
let teaserTimer;
let promoShown = false;
const whySection = document.getElementById("why");
// shown once the top of "Чому обирають нас" passes 85% of the screen height (and while it is above the screen);
// an observer instead of a scroll handler, so nothing is measured while the page scrolls
const syncPromo = (show) => {
  if (show === promoShown) return;
  promoShown = show;
  document.documentElement.classList.toggle("show-promo", show);
  clearTimeout(teaserTimer);
  if (show) teaserTimer = setTimeout(showTeaser, 2500);
  else promoTeaser.hidden = true;
};
// The observed area reaches far above the screen, so "intersecting" means exactly "its top is above the 85% line",
// even after a jump from the very bottom of the page straight to the top.
new IntersectionObserver(([e]) => syncPromo(e.isIntersecting), {
  rootMargin: "1000000px 0px -15% 0px",
}).observe(whySection);
