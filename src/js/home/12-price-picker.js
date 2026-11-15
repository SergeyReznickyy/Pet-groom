// Price picker: animal → size group → breed → services. Prices are placeholders (UAH); null = service not offered for that breed.
const SERVICES = {
  dog: [
    ["complex", "Комплексний грумінг", "Купання, сушіння, стрижка за стандартом породи або як вам подобається, гігієнічні зони, кігті, вуха"],
    ["hygiene", "Гігієнічний комплекс", "Купання, сушіння, вичісування, гігієнічні зони, обробка лап, кігті, вуха. Без стрижки корпусу"],
    ["shed", "Експрес-линька", "Видалення підшерстку, купання з маскою проти линьки, сушіння компресором, кігті, вуха"],
    ["trim", "Тримінг", "Вищипування відмерлої шерсті вручну, оформлення морди й лап, купання, кігті, вуха"],
  ],
  cat: [
    ["complex", "Комплекс зі стрижкою", "Купання, сушіння, стрижка «під лева» або гігієнічна, кігті, вуха"],
    ["hygiene", "Гігієнічний комплекс", "Купання, сушіння, вичісування, гігієнічні зони, кігті, вуха"],
    ["shed", "Вичісування", "Видалення підшерстку й дрібних ковтунів, без купання"],
  ],
};
const EXTRAS = {
  dog: [["Стрижка кігтів", 150], ["Чистка вух", 100], ["Ультразвукова чистка зубів", 500], ["SPA-маска для шерсті", 200], ["Віск для подушечок лап", 80]],
  cat: [["Стрижка кігтів", 150], ["Чистка вух", 100], ["SPA-маска для шерсті", 200]],
};
// Prices are set per size group and coat type; every breed of that coat gets the same row.
// Row order follows SERVICES: dog [complex, hygiene, shed, trim], cat [complex, hygiene, shed]; null = not offered.
const COAT_PRICES = {
  dog: {
    s: { long: [800, 550, null, null], double: [850, 600, 650, null], short: [null, 450, 500, null], wire: [900, 600, null, 1000], curly: [900, 600, null, null] },
    m: { long: [1100, 750, null, null], double: [1100, 800, 900, null], short: [null, 600, 650, null], wire: [1000, 700, null, 1200], curly: [1200, 800, null, null] },
    l: { long: [1500, 1100, null, null], double: [1600, 1150, 1300, null], short: [null, 900, 1050, null], wire: [1600, 1200, null, 2000], curly: [1800, 1300, null, null] },
    xl: { long: [2200, 1600, null, null], double: [2300, 1650, 1850, null], short: [null, 1300, 1500, null], wire: [2200, 1600, null, 2600], curly: [2400, 1800, null, null] },
  },
  cat: { short: [1100, 750, 800], long: [1400, 950, 1000], giant: [1700, 1200, 1300], hairless: [null, 700, null] },
};
// group: [id, title, subtitle, durations per service, breeds by coat (first names double as examples) or explicit rows]
const CATALOG = {
  dog: {
    title: "Собака",
    groups: [
      ["s", "Малі породи", "до 7 кг", { complex: "2 год", hygiene: "1 год", shed: "1,5 год", trim: "2 год" }, {
        long: ["Йоркширський тер'єр", "Ши-тцу", "Мальтійська болонка", "Мальтіпу", "Йоркіпу", "Бівер-йорк", "Пекінес", "Папійон", "Фален", "Лхаса апсо", "Тибетський спанієль", "Японський хін", "Кавалер-кінг-чарльз-спанієль", "Кінг-чарльз-спанієль", "Китайська чубата собака", "Російська кольорова болонка", "Гаванський бішон", "Болонський бішон", "Котон-де-тулеар", "Австралійський шовковистий тер'єр", "Чихуахуа довгошерста", "Такса мініатюрна довгошерста"],
        double: ["Померанський шпіц", "Німецький малий шпіц", "Німецький карликовий шпіц", "Скіпперке"],
        short: ["Чихуахуа гладкошерста", "Російський той-тер'єр", "Мопс", "Мініатюрний пінчер", "Італійська левретка", "Празький крисарик", "Англійський той-тер'єр", "Такса мініатюрна гладкошерста", "Такса кролича"],
        wire: ["Норвіч-тер'єр", "Норфолк-тер'єр", "Керн-тер'єр", "Брюссельський грифон", "Бельгійський грифон", "Аффенпінчер", "Такса мініатюрна жорсткошерста"],
        curly: ["Той-пудель", "Карликовий пудель", "Міні-кавапу"],
      }],
      ["m", "Середні породи", "7–15 кг", { complex: "2,5 год", hygiene: "1,5 год", shed: "2 год", trim: "2,5 год" }, {
        long: ["Англійський кокер-спанієль", "Американський кокер-спанієль", "Тибетський тер'єр", "Такса стандартна довгошерста", "Скай-тер'єр", "Польська низинна вівчарка", "Кокапу"],
        double: ["Вельш-коргі пемброк", "Вельш-коргі кардиган", "Шелті", "Японський шпіц", "Шиба-іну", "Німецький середній шпіц", "Американський ескімоський шпіц", "Фінський шпіц", "Ісландська вівчарка"],
        short: ["Французький бульдог", "Бігль", "Бостон-тер'єр", "Такса стандартна гладкошерста", "Басенджі", "Уіпет", "Стаффордширський бультер'єр", "Мініатюрний бультер'єр", "Німецький пінчер", "Бразильський тер'єр"],
        wire: ["Цвергшнауцер", "Вест-хайленд-вайт-тер'єр", "Джек-рассел-тер'єр", "Скотч-тер'єр", "Парсон-рассел-тер'єр", "Фокстер'єр жорсткошерстий", "Вельш-тер'єр", "Лейкленд-тер'єр", "Сілігем-тер'єр", "Бордер-тер'єр", "Денді-дінмонт-тер'єр", "Ягдтер'єр", "Мітельшнауцер", "Такса стандартна жорсткошерста"],
        curly: ["Бішон фрізе", "Малий пудель", "Кавапу", "Бедлінгтон-тер'єр", "Лагото-романьоло"],
      }],
      ["l", "Великі породи", "15–30 кг", { complex: "3 год", hygiene: "2 год", shed: "2,5 год", trim: "3,5 год" }, {
        long: ["Англійський сетер", "Ірландський сетер", "Гордон-сетер", "Бородатий коллі", "Англійський спрингер-спанієль", "Афганський хорт", "Салюкі", "Ірландський м'якошерстий пшеничний тер'єр", "Бріар"],
        double: ["Сибірський хаскі", "Самоїд", "Золотистий ретривер", "Австралійська вівчарка", "Бордер-коллі", "Коллі довгошерстий", "Німецька вівчарка", "Чау-чау", "Кеесхонд", "Бельгійська вівчарка грюнендаль", "Евразієр", "Акіта-іну"],
        short: ["Лабрадор-ретривер", "Боксер", "Далматин", "Веймаранер", "Курцхаар", "Віжла", "Родезійський ріджбек", "Англійський бульдог", "Шарпей", "Бассет-хаунд", "Американський стаффордширський тер'єр", "Американський пітбуль-тер'єр", "Бультер'єр", "Бельгійська вівчарка малінуа", "Грейхаунд"],
        wire: ["Ердельтер'єр", "Дратхаар", "Керрі-блю-тер'єр"],
        curly: ["Королівський пудель", "Лабрадудль", "Голдендудль", "Іспанська водяна собака"],
      }],
      ["xl", "Гіганти", "понад 30 кг", { complex: "4 год", hygiene: "2,5 год", shed: "3 год", trim: "4 год" }, {
        long: ["Староанглійська вівчарка (бобтейл)", "Південноросійська вівчарка"],
        double: ["Аляскинський маламут", "Бернський зенненхунд", "Ньюфаундленд", "Сенбернар", "Леонбергер", "Тибетський мастиф", "Кавказька вівчарка", "Середньоазіатська вівчарка (алабай)", "Великий піренейський собака", "Американська акіта", "Східноєвропейська вівчарка"],
        short: ["Кане-корсо", "Доберман", "Ротвейлер", "Німецький дог", "Англійський мастиф", "Бульмастиф", "Бордоський дог", "Неаполітанський мастиф", "Американський бульдог", "Бладхаунд", "Бурбуль", "Великий швейцарський зенненхунд", "Аргентинський дог", "Тоса-іну"],
        wire: ["Ризеншнауцер", "Чорний російський тер'єр", "Ірландський вовкодав", "Дірхаунд"],
      }],
      ["mix", "Метис або інша порода", "ціна за вагою", { complex: "2–4 год", hygiene: "1–2,5 год", shed: "1,5–3 год" }, [
        ["Метис до 10 кг", 900, 600, 650, null],
        ["Метис 10–25 кг", 1300, 900, 1000, null],
        ["Метис понад 25 кг", 1900, 1400, 1600, null],
      ]],
    ],
  },
  cat: {
    title: "Кіт",
    groups: [
      ["short", "Короткошерсті", "британці, шотландці, рекси", { complex: "2 год", hygiene: "1,5 год", shed: "1,5 год" }, {
        short: ["Британська короткошерста", "Шотландська висловуха", "Шотландська прямовуха", "Безпородний короткошерстий", "Російська блакитна", "Абіссинська", "Бенгальська", "Сіамська", "Орієнтальна", "Бурманська", "Європейська короткошерста", "Американська короткошерста", "Екзотична короткошерста", "Девон-рекс", "Корніш-рекс", "Єгипетська мау", "Оцикет", "Саванна", "Бомбейська", "Тонкінська", "Шартрез", "Корат", "Сноу-шу", "Манчкін короткошерстий", "Японський бобтейл", "Меконгський бобтейл", "Тайська", "Сінгапурська", "Тойгер"],
      }],
      ["long", "Довгошерсті", "перси, мейн-куни, сибірські", { complex: "2,5 год", hygiene: "2 год", shed: "2 год" }, {
        giant: ["Мейн-кун", "Норвезька лісова", "Регдол", "Рагамафін"],
        long: ["Перська", "Сибірська", "Невська маскарадна", "Британська довгошерста", "Хайленд-фолд", "Хайленд-страйт", "Турецька ангора", "Турецький ван", "Балінезійська", "Священна бірма", "Сомалійська", "Гімалайська", "Американський керл", "Лаперм", "Селкірк-рекс", "Курильський бобтейл", "Манчкін довгошерстий", "Нібелунг", "Шантильї-тіффані", "Безпородний довгошерстий"],
      }],
      ["hairless", "Безшерсті", "сфінкси, левкої", { hygiene: "1 год" }, {
        hairless: ["Канадський сфінкс", "Донський сфінкс", "Петерболд", "Український левкой", "Ельф", "Бамбіно"],
      }],
    ],
  },
};
// Expand coat lists into rows: [name, ...prices].
for (const [pet, c] of Object.entries(CATALOG)) {
  for (const g of c.groups) {
    if (Array.isArray(g[4])) continue;
    const table = pet === "dog" ? COAT_PRICES.dog[g[0]] : COAT_PRICES.cat;
    g[4] = Object.entries(g[4]).flatMap(([coat, names]) =>
      names.map((n) => [n, ...table[coat]]),
    );
  }
}
const byName = (a, b) => a[0].localeCompare(b[0], "uk");

const picker = document.getElementById("picker");
const body = picker.querySelector(".picker-body");
const quickInput = picker.querySelector(".quick input");
const quickList = picker.querySelector(".quick-results");
const pick = { step: 0, pet: null, group: null, breed: null, service: null, extras: new Set() };
const STEP_TITLES = ["Кого будемо доглядати?", "Який розмір?", "Оберіть породу", ""];
const minPrice = (row) => Math.min(...row.slice(1).filter((v) => v != null));
const prices = (row) =>
  SERVICES[pick.pet]
    .map(([id, title, incl], i) => ({ id, title, incl, price: row[i + 1] }))
    .filter((s) => s.price != null);
const chevron = '<svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>';

function tile(attrs, title, sub, aside = "") {
  return `<button type="button" class="tile" ${attrs}><span class="tile-text"><b>${title}</b>${sub ? `<small>${sub}</small>` : ""}</span>${aside}${chevron}</button>`;
}

function render() {
  const { step, pet, group, breed } = pick;
  picker.querySelectorAll(".stepper li").forEach((li, i) => {
    li.classList.toggle("is-active", i === step);
    li.classList.toggle("is-done", i < step);
    li.querySelector("button").disabled = i > step;
  });
  const crumbs = [pet && CATALOG[pet].title, group && `${group[1]} · ${group[2]}`, breed && breed[0]]
    .slice(0, step)
    .filter(Boolean);
  let html = `<div class="picker-head">${step ? '<button type="button" class="back" data-goto="' + (step - 1) + '">← Назад</button>' : ""}${crumbs.length ? `<p class="crumbs">${crumbs.join(" › ")}</p>` : ""}</div>`;

  if (step === 0) {
    html += `<h3>${STEP_TITLES[0]}</h3><div class="tiles tiles-lg">`;
    for (const [key, c] of Object.entries(CATALOG)) {
      const rows = c.groups.flatMap((g) => g[4]);
      html += tile(`data-pet="${key}"`, key === "dog" ? "Собаки" : "Коти", `${rows.length} порід · від ${Math.min(...rows.map(minPrice))} ₴`, `<svg class="tile-ico"><use href="#i-${key}" /></svg>`);
    }
    html += "</div>";
  } else if (step === 1) {
    html += `<h3>${STEP_TITLES[1]}</h3><div class="tiles tiles-size">`;
    CATALOG[pet].groups.forEach((g, i) => {
      const names = [...new Set(g[4].map((r) => r[0].replace(/ (до|понад|\d).*$/, "")))];
      const examples = names.length > 1 ? names.slice(0, 3).join(", ") + "…" : "Вагу оберете на наступному кроці";
      html += tile(`data-group="${i}"`, `${g[1]} <em>${g[2]}</em>`, examples, `<span class="from">від ${Math.min(...g[4].map(minPrice))} ₴</span>`);
    });
    html += "</div>";
  } else if (step === 2) {
    html += `<div class="step-title"><h3>${STEP_TITLES[2]}</h3>${group[4].length > 8 ? `<label class="breed breed-filter"><svg class="ico"><use href="#i-search" /></svg><input type="search" placeholder="Фільтр: ${group[4].length} порід" aria-label="Фільтр порід" autocomplete="off" /></label>` : ""}</div><div class="tiles tiles-sm">`;
    group[4].map((row, i) => [row, i]).sort((a, b) => byName(a[0], b[0])).forEach(([row, i]) => {
      html += tile(`data-breed="${i}"`, row[0], `<span class="from">від ${minPrice(row)} ₴</span>`);
    });
    html += `<a class="tile tile-ghost" data-book="Куди надіслати фото?" data-book-chat href="#"><span class="tile-text"><b>Немає вашої породи?</b><small>Надішліть фото, порахуємо за 5 хвилин</small></span>${chevron}</a></div>`;
  } else {
    const list = prices(breed);
    if (!list.some((s) => s.id === pick.service)) pick.service = list[0].id;
    const chosen = list.find((s) => s.id === pick.service);
    const extras = EXTRAS[pet].filter(([n]) => pick.extras.has(n));
    const total = chosen.price + extras.reduce((sum, [, p]) => sum + p, 0);
    html += `<div class="svc-layout"><div><h3>${breed[0]}: оберіть послугу</h3><div class="svc-list" role="radiogroup" aria-label="Послуга">`;
    for (const s of list) {
      html += `<label class="svc-opt${s.id === pick.service ? " is-on" : ""}"><input type="radio" name="svc" value="${s.id}"${s.id === pick.service ? " checked" : ""} /><span class="svc-main"><b>${s.title}</b><small>${s.incl}</small><em>≈ ${group[3][s.id] || ""}</em></span><span class="svc-price">${s.price} ₴</span></label>`;
    }
    html += `</div><h4>Додати до візиту</h4><div class="extra-list">`;
    for (const [n, p] of EXTRAS[pet]) {
      html += `<label class="extra${pick.extras.has(n) ? " is-on" : ""}"><input type="checkbox" value="${n}"${pick.extras.has(n) ? " checked" : ""} /><span>${n}</span><b>+${p} ₴</b></label>`;
    }
    html += `</div></div><aside class="summary"><p class="eyebrow">Ваш візит</p><h4>${breed[0]}</h4><ul><li><span>${chosen.title}</span><b>${chosen.price} ₴</b></li>${extras.map(([n, p]) => `<li><span>${n}</span><b>${p} ₴</b></li>`).join("")}</ul><p class="total"><span>Разом</span><b><small>від</small> ${total} ₴</b></p><button type="button" class="btn btn-tg btn-lg book"><svg class="ico"><use href="#i-chat" /></svg>Записатися</button><p class="summary-note">Точну ціну підтвердимо по фото. Оплата після процедури.</p></aside></div>`;
  }
  body.innerHTML = `<div class="step-view">${html}</div>`;
}

function choose(updates) {
  Object.assign(pick, updates);
  render();
  if (picker.getBoundingClientRect().top < 0) {
    picker.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

picker.addEventListener("click", (e) => {
  const t = e.target.closest("[data-goto], [data-pet], [data-group], [data-breed], .book, [data-link]");
  if (!t) return;
  if (t.matches("[data-link]")) return showHint(e, t.dataset.link);
  if (t.dataset.goto) choose({ step: +t.dataset.goto });
  else if (t.dataset.pet) choose({ pet: t.dataset.pet, step: 1 });
  else if (t.dataset.group) choose({ group: CATALOG[pick.pet].groups[+t.dataset.group], step: 2 });
  else if (t.dataset.breed) choose({ breed: pick.group[4][+t.dataset.breed], step: 3, service: null, extras: new Set() });
  else if (t.matches(".book")) book();
});
picker.addEventListener("input", (e) => {
  if (!e.target.matches(".breed-filter input")) return;
  const q = e.target.value.trim().toLowerCase();
  picker.querySelectorAll("[data-breed]").forEach((t) => {
    t.hidden = !t.textContent.toLowerCase().includes(q);
  });
});
picker.addEventListener("change", (e) => {
  if (e.target.name === "svc") pick.service = e.target.value;
  else if (e.target.type === "checkbox") {
    pick.extras[e.target.checked ? "add" : "delete"](e.target.value);
  }
  render();
});

// Quick search jumps straight to the services step.
const ALL = Object.entries(CATALOG).flatMap(([pet, c]) =>
  c.groups.flatMap((g) => g[4].map((row) => ({ pet, group: g, row }))),
);
quickInput.addEventListener("input", () => {
  const q = quickInput.value.trim().toLowerCase();
  const hits = q ? ALL.filter((x) => x.row[0].toLowerCase().includes(q)).slice(0, 8) : [];
  quickList.hidden = !q;
  quickList.innerHTML = hits.length
    ? hits.map((x, i) => `<button type="button" data-hit="${i}"><span>${x.row[0]}</span><small>${x.pet === "dog" ? "собака" : "кіт"} · ${x.group[1].toLowerCase()}</small></button>`).join("")
    : '<p>Такої породи немає. Оберіть «Метис або інша порода» або надішліть нам фото.</p>';
  quickList.onclick = (e) => {
    const b = e.target.closest("[data-hit]");
    if (!b) return;
    const x = hits[+b.dataset.hit];
    quickInput.value = "";
    quickList.hidden = true;
    choose({ pet: x.pet, group: x.group, breed: x.row, step: 3, service: null, extras: new Set() });
  };
});

function book() {
  const chosen = prices(pick.breed).find((s) => s.id === pick.service);
  const extras = [...pick.extras];
  const total = picker.querySelector(".total b").textContent.replace(/\s+/g, " ").trim();
  const text = `Добрий день! Хочу записатися. Порода: ${pick.breed[0]}. Послуга: ${chosen.title}${extras.length ? " + " + extras.join(", ") : ""}. Разом ${total}. Коли є вільний час?`;
  openBooking({ title: "Куди надіслати заявку?", text });
}

render();
