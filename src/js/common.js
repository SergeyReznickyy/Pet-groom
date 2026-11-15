// Shared by every page: contact links, toast hints, the burger menu.
// Fill these in once the real contacts are known; empty values show a hint instead of a dead link.
const LINKS = {
  telegram: "https://t.me/serebaniy", // TEMPORARY for testing: replace with the salon administrator's Telegram before launch
  whatsapp: "https://wa.me/380959097531?text=" + encodeURIComponent("Добрий день! Хочу записатися на грумінг."),
  viber: "viber://chat?number=%2B380959097531", // assumed: Viber on the same number as WhatsApp
  phone: "tel:+380959097531",
  tiktok: "", // e.g. https://www.tiktok.com/@username
  threads: "", // e.g. https://www.threads.net/@username
};
const HINTS = {
  telegram: "Тут буде посилання на Telegram адміністратора",
  whatsapp:
    "Тут буде посилання на WhatsApp з готовим текстом повідомлення",
  viber: "Тут буде посилання на Viber адміністратора",
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
    if (url.startsWith("https:")) {
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

// Booking modal: every "Записатися" button ([data-book]) opens it, and the visitor picks a messenger.
// data-book="..." sets the modal title. openBooking({ title, text }) also takes a ready message:
// WhatsApp gets it prefilled; for Telegram and Viber (no prefill) it is copied to the clipboard.
// Below the chats the visitor can pick the online form instead (hidden for a ready message and for [data-book-chat], e.g. sending a photo).
const BOOK_CHANNELS = [
  ["telegram", "c-tg", "i-tg", "Telegram", "Відповідаємо за 5–10 хвилин"],
  ["viber", "c-vb", "i-viber", "Viber", "Написати в чат"],
  ["whatsapp", "c-wa", "i-wa", "WhatsApp", "Написати в чат"],
  ["phone", "c-ph", "i-phone", "Подзвонити", "+38 (095) 909-75-31"],
];
const FORM_ICON = '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="4" width="14" height="17" rx="2.5" /><path d="M9 4.5V3h6v1.5M8.5 10h7M8.5 13.5h7M8.5 17h4" /></svg>';
const bookModal = document.createElement("dialog");
bookModal.className = "book-modal";
bookModal.setAttribute("aria-labelledby", "book-title");
bookModal.innerHTML = `<div class="book-head"><button type="button" class="promo-close" data-book-close aria-label="Закрити">×</button><p class="eyebrow">Щодня з 9:00 до 20:00</p><h2 id="book-title"></h2><p class="book-sub"></p></div><ul class="book-list">${BOOK_CHANNELS.map(
  ([key, cls, ico, name, note]) =>
    `<li><a class="${cls}" data-ch="${key}" href="#"><span class="c-ico"><svg class="ico"><use href="#${ico}" /></svg></span><span><b>${name}</b><small>${note}</small></span></a></li>`,
).join("")}</ul><div class="book-alt"><p class="book-or"><span>або</span></p><a class="book-form-link" href="#book-form"><span class="c-ico">${FORM_ICON}</span><span><b>Заповнити онлайн-заявку</b><small>Кілька полів, і готове повідомлення для чату</small></span><svg class="book-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg></a></div><p class="book-note" hidden></p>`;
document.body.append(bookModal);
let bookText = "";
// On the home page the link scrolls to the form; elsewhere (blog) it goes to the home page's form.
const bookFormUrl = (document.querySelector(".logo")?.getAttribute("href") || "").replace(/#.*$/, "") + "#book-form";
bookModal.querySelector(".book-form-link").href = bookFormUrl;
// On the home page: scroll to the online form, make it glow for a moment and put the cursor in the name field.
// Returns false on pages without the form (the link then simply navigates to the home page's form).
function jumpToForm() {
  const form = document.getElementById("book-form");
  if (!form) return false;
  // aim at the form's real place: before its first entrance it is still shifted by the animation,
  // so getBoundingClientRect()/scrollIntoView would overshoot once the entrance ends
  let y = 0;
  for (let el = form; el; el = el.offsetParent) y += el.offsetTop;
  const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  scrollTo({ top: y - pad - 16, behavior: "smooth" });
  form.classList.remove("is-called");
  void form.offsetWidth; // restart the highlight animation
  form.classList.add("is-called");
  setTimeout(() => form.elements.name.focus({ preventScroll: true }), 600);
  return true;
}
function openBooking({ title = "Записатися на грумінг", text = "", form = !text } = {}) {
  bookText = text;
  bookModal.querySelector("#book-title").textContent = title;
  bookModal.querySelector(".book-alt").hidden = !form;
  bookModal.querySelector(".book-sub").textContent = form
    ? "Напишіть адміністратору в зручний месенджер або заповніть заявку"
    : "Оберіть, де вам зручніше написати";
  const note = bookModal.querySelector(".book-note");
  note.hidden = !text;
  // a ready request goes to a chat, so the call option is hidden then
  bookModal.querySelector('[data-ch="phone"]').parentElement.hidden = !!text;
  note.textContent = "Текст заявки вже готовий: у WhatsApp він підставиться сам, для Telegram і Viber ми скопіюємо його, просто вставте в чат.";
  bookModal.querySelectorAll("[data-ch]").forEach((a) => {
    const key = a.dataset.ch;
    let url = LINKS[key] || "#";
    if (key === "whatsapp" && text && url !== "#") url = url.split("?")[0] + "?text=" + encodeURIComponent(text);
    a.href = url;
    if (url.startsWith("https:")) {
      a.target = "_blank";
      a.rel = "noopener";
    } else a.removeAttribute("target");
  });
  closeMenu();
  document.querySelectorAll("dialog[open]").forEach((d) => d !== bookModal && d.close());
  if (!bookModal.open) bookModal.showModal();
}
bookModal.addEventListener("click", (e) => {
  if (e.target === bookModal || e.target.closest("[data-book-close]")) return bookModal.close();
  if (e.target.closest(".book-form-link") && jumpToForm()) {
    e.preventDefault();
    bookModal.close();
    return;
  }
  const a = e.target.closest("[data-ch]");
  if (!a) return;
  const key = a.dataset.ch;
  if (!LINKS[key]) {
    e.preventDefault();
    return showToast(HINTS[key], 2400);
  }
  if (bookText && (key === "telegram" || key === "viber")) {
    navigator.clipboard?.writeText(bookText).then(
      () => showToast("Текст заявки скопійовано. Вставте його в чат", 4000),
      () => {},
    );
  }
  setTimeout(() => bookModal.close(), 150);
});
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-book]");
  if (!el) return;
  e.preventDefault();
  openBooking({ title: el.dataset.book || undefined, form: !el.hasAttribute("data-book-chat") });
});

// Burger menu: "Записатися" unfolds the same choices right under itself (messengers, a call, the online form)
// instead of opening the modal on top of the menu.
const menuBook = document.querySelector("[data-menu-book]");
if (menuBook) {
  const list = document.createElement("div");
  list.className = "menu-book";
  list.id = "menu-book";
  list.innerHTML = `<ul>${BOOK_CHANNELS.map(
    ([key, cls, ico, name, note], i) =>
      `<li style="--j: ${i}"><a class="${cls}" data-ch="${key}" href="${LINKS[key] || "#"}"${(LINKS[key] || "").startsWith("https:") ? ' target="_blank" rel="noopener"' : ""}><span class="c-ico"><svg class="ico"><use href="#${ico}" /></svg></span><span><b>${name}</b><small>${note}</small></span></a></li>`,
  ).join("")}<li style="--j: ${BOOK_CHANNELS.length}"><a class="c-form" href="${bookFormUrl}"><span class="c-ico">${FORM_ICON}</span><span><b>Онлайн-заявка</b><small>Кілька полів, і готове повідомлення</small></span></a></li></ul>`;
  menuBook.after(list);
  menuBook.setAttribute("aria-expanded", "false");
  menuBook.setAttribute("aria-controls", "menu-book");
  menuBook.insertAdjacentHTML("beforeend", '<svg class="menu-book-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>');
  const setOpen = (open) => {
    list.classList.toggle("is-open", open);
    menuBook.setAttribute("aria-expanded", String(open));
  };
  menuBook.addEventListener("click", () => {
    const open = !list.classList.contains("is-open");
    setOpen(open);
    // on short screens the unfolded list would end below the menu's edge: bring it into view once it has opened
    if (open) setTimeout(() => list.scrollIntoView({ behavior: "smooth", block: "nearest" }), 380);
  });
  list.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    if (a.dataset.ch && !LINKS[a.dataset.ch]) {
      e.preventDefault();
      return showToast(HINTS[a.dataset.ch], 2400);
    }
    if (a.classList.contains("c-form") && document.getElementById("book-form")) {
      e.preventDefault();
      closeMenu();
      jumpToForm();
      return;
    }
    closeMenu();
  });
  // the menu always opens with the choices folded
  burger.addEventListener("click", () => setOpen(false));
}
