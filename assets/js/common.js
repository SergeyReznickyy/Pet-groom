// Shared by every page: contact links, toast hints, the burger menu.
// Fill these in once the real contacts are known; empty values show a hint instead of a dead link.
const LINKS = {
  telegram: "", // e.g. https://t.me/username
  whatsapp: "https://wa.me/380959097531?text=" + encodeURIComponent("Добрий день! Хочу записатися на грумінг."),
  phone: "tel:+380959097531",
  tiktok: "", // e.g. https://www.tiktok.com/@username
  threads: "", // e.g. https://www.threads.net/@username
};
const HINTS = {
  telegram: "Тут буде посилання на Telegram адміністратора",
  whatsapp:
    "Тут буде посилання на WhatsApp з готовим текстом повідомлення",
  phone: "Тут буде номер телефону адміністратора",
  tiktok: "Тут буде посилання на TikTok салону",
  threads: "Тут буде посилання на Threads салону",
};
const toast = document.getElementById("toast");
let toastTimer;
function showToast(text, ms = 3200) {
  toast.textContent = text;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.hidden = true;
  }, ms);
}
// For links rendered later (inside the price picker): open the contact or show the hint.
function showHint(e, key) {
  e.preventDefault();
  if (LINKS[key]) window.open(LINKS[key], key === "phone" ? "_self" : "_blank", "noopener");
  else showToast(HINTS[key], 2400);
}
document.querySelectorAll("[data-link]").forEach((a) => {
  const url = LINKS[a.dataset.link];
  if (url) {
    a.href = url;
    if (!url.startsWith("tel:")) {
      a.target = "_blank";
      a.rel = "noopener";
    }
  } else {
    a.addEventListener("click", (e) => showHint(e, a.dataset.link));
  }
});
const header = document.querySelector(".header");

// Burger: lines morph into a paw (CSS), the menu opens once the paw has formed.
const burger = document.getElementById("burger");
const menu = document.getElementById("menu");
const menuPanel = menu.querySelector(".menu-panel");
const PAW_MS = 380;
let menuTimer;
function openMenu() {
  burger.classList.add("is-open");
  burger.setAttribute("aria-expanded", "true");
  burger.setAttribute("aria-label", "Закрити меню");
  header.classList.add("menu-open");
  document.documentElement.classList.add("no-scroll");
  clearTimeout(menuTimer);
  menuTimer = setTimeout(() => {
    menuPanel.style.top = header.getBoundingClientRect().bottom + "px";
    menu.hidden = false;
  }, PAW_MS);
}
function closeMenu() {
  clearTimeout(menuTimer);
  menu.hidden = true;
  burger.classList.remove("is-open");
  burger.setAttribute("aria-expanded", "false");
  burger.setAttribute("aria-label", "Меню");
  header.classList.remove("menu-open");
  document.documentElement.classList.remove("no-scroll");
}
burger.addEventListener("click", () => (burger.classList.contains("is-open") ? closeMenu() : openMenu()));
menu.querySelector("[data-menu-close]").addEventListener("click", closeMenu);
// Any link in the menu closes it first; the browser then follows the anchor.
menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && burger.classList.contains("is-open")) closeMenu();
});

// Header "Зв'язатися з нами": CSS opens it on hover; a tap toggles it on touch screens. Outside tap or Esc closes.
const contact = document.getElementById("contact");
if (contact) {
  const contactBtn = contact.querySelector(".contact-btn");
  const setContact = (open) => {
    contact.classList.toggle("is-open", open);
    contactBtn.setAttribute("aria-expanded", String(open));
  };
  contactBtn.addEventListener("click", () => setContact(!contact.classList.contains("is-open")));
  contact.addEventListener("mouseleave", () => setContact(false));
  document.addEventListener("click", (e) => {
    if (!contact.contains(e.target)) setContact(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setContact(false);
  });
}
