// Online form in "Як записатися": builds a message and hands it to the booking modal.
const bookForm = document.getElementById("book-form");
// One-time entrance: the first time the form scrolls into view the card pops up with a 3D tilt,
// the fields drop in one by one, a light sweeps across and the button bounces. It never replays.
if (document.documentElement.classList.contains("motion")) {
  [...bookForm.children].forEach((el, k) => el.style.setProperty("--k", k));
  bookForm.classList.add("bf-wait");
  const formIO = new IntersectionObserver(
    ([e]) => {
      if (!e.isIntersecting) return;
      formIO.disconnect();
      bookForm.classList.add("bf-in");
      // once everything has landed, drop the entrance classes so the form is plain again
      setTimeout(() => bookForm.classList.remove("bf-wait", "bf-in"), 2600);
    },
    // phones: the form is tall, so waiting for 20% of it left an empty gap on screen; start almost at once
    { threshold: matchMedia("(max-width: 640px)").matches ? 0.02 : 0.2 },
  );
  formIO.observe(bookForm);
}
const dateInput = bookForm.elements.date;
dateInput.min = new Date(Date.now() - new Date().getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
bookForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const f = bookForm.elements;
  const date = f.date.value ? new Date(f.date.value + "T12:00").toLocaleDateString("uk-UA", { weekday: "long", day: "numeric", month: "long" }) : "";
  const lines = [
    `Добрий день! Мене звати ${f.name.value.trim()}, хочу записатися на грумінг.`,
    `${f.pet.value}: ${f.breed.value.trim()}`,
    `Послуга: ${f.service.value}`,
    `Коли: ${date ? date + ", " : ""}${f.time.value.toLowerCase()}`,
    f.note.value.trim() && `Коментар: ${f.note.value.trim()}`,
  ];
  openBooking({ title: "Куди надіслати заявку?", text: lines.filter(Boolean).join("\n") });
});
