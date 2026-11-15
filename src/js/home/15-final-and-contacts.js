// The closing call-to-action gets one "Записатися" button (the booking choices) with the channels under it as
// secondary buttons (round icons on phones); in Contacts the phone number carries the Viber / WhatsApp icons
// instead of repeating it on three lines; the floating buttons step aside while the closing block, the contacts
// or the footer are on screen (those already offer every way to get in touch).
{
  const channels = document.querySelector(".final .channels");
  channels.insertAdjacentHTML(
    "beforebegin",
    '<button type="button" class="btn btn-tg btn-lg final-book" data-book><svg class="ico"><use href="#i-chat" /></svg>Записатися</button><p class="final-or">або напишіть напряму</p>',
  );
  if (matchMedia("(max-width: 640px)").matches) channels.classList.add("is-icons");
  channels.querySelectorAll(".btn").forEach((b) => {
    b.setAttribute("aria-label", b.textContent.trim());
    b.classList.remove("btn-tg", "btn-lg");
    b.classList.add("btn-line");
  });
  const dl = document.querySelector(".contacts dl");
  const dts = [...dl.querySelectorAll("dt")];
  const row = (label) => dts.find((dt) => dt.textContent.trim() === label);
  const phoneDd = row("Телефон")?.nextElementSibling;
  if (phoneDd) {
    const apps = [
      ["viber", "c-vb", "i-viber", "Viber"],
      ["whatsapp", "c-wa", "i-wa", "WhatsApp"],
    ];
    phoneDd.insertAdjacentHTML(
      "beforeend",
      `<span class="ct-apps">${apps
        .map(([key, cls, ico, name]) => `<a class="ct-app ${cls}" data-link="${key}" href="${LINKS[key] || "#"}" aria-label="${name}"${(LINKS[key] || "").startsWith("https:") ? ' target="_blank" rel="noopener"' : ""}><svg class="ico"><use href="#${ico}" /></svg></a>`)
        .join("")}</span>`,
    );
    ["Viber", "WhatsApp"].forEach((label) => {
      const dt = row(label);
      if (!dt) return;
      dt.classList.add("m-merged");
      dt.nextElementSibling.classList.add("m-merged");
    });
  }
  const calm = new Set();
  const calmIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? calm.add(e.target) : calm.delete(e.target)));
    document.documentElement.classList.toggle("float-off", calm.size > 0);
  });
  document.querySelectorAll(".final, #contacts, .footer").forEach((el) => calmIO.observe(el));
}
