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
const syncPromo = () => {
  const show = whySection.getBoundingClientRect().top < innerHeight * 0.85;
  if (show === promoShown) return;
  promoShown = show;
  document.documentElement.classList.toggle("show-promo", show);
  clearTimeout(teaserTimer);
  if (show) teaserTimer = setTimeout(showTeaser, 2500);
  else promoTeaser.hidden = true;
};
syncPromo();
addEventListener("scroll", () => requestAnimationFrame(syncPromo), { passive: true });
addEventListener("resize", syncPromo);
