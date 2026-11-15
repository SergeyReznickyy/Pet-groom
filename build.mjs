// Build: turns the readable source in src/ into the small files the pages load from assets/.
//   npm run build   – build once (run before publishing / committing)
//   npm run dev     – rebuild automatically on every change in src/
//
// CSS: src/css/main.css imports every file in cascade order; esbuild inlines them into one minified file.
// JS:  the files are plain scripts that share one global scope (common.js defines LINKS, openBooking…,
//      the home files use them), so they are joined in the order below and then minified — not wrapped as modules.
import { build, transform } from "esbuild";
import { readFileSync, writeFileSync, watch } from "node:fs";

const COMMON = ["src/js/common.js"];
const HOME = [
  "src/js/home/01-hero-video.js",
  "src/js/home/02-works-before-after.js",
  "src/js/home/03-works-gallery.js",
  "src/js/home/04-certificates-scrolls.js",
  "src/js/home/05-masters-badges.js",
  "src/js/home/06-reviews-board.js",
  "src/js/home/07-masters-stories.js",
  "src/js/home/08-certificates-drum.js",
  "src/js/home/09-blog-coverflow.js",
  "src/js/home/10-animations.js",
  "src/js/home/11-header.js",
  "src/js/home/12-price-picker.js",
  "src/js/home/13-booking-form.js",
  "src/js/home/14-promo.js",
  "src/js/home/15-final-and-contacts.js",
  "src/js/home/16-works-drift-phones.js",
];

// first line of every built file, so nobody edits it by mistake
const banner = (src) => `/* Зібраний файл — не редагувати. Джерело: ${src}. Зібрати: npm run build (див. README.md) */`;

async function buildJs(files, out, src) {
  const source = files.map((f) => readFileSync(f, "utf8")).join("\n");
  const { code } = await transform(source, { loader: "js", minify: true, target: "es2020", charset: "utf8", legalComments: "none", banner: banner(src) });
  writeFileSync(out, code);
  return code.length;
}

async function run() {
  const t = Date.now();
  await build({
    entryPoints: ["src/css/main.css"],
    bundle: true,
    minify: true,
    outfile: "assets/css/styles.min.css",
    charset: "utf8",
    banner: { css: banner("src/css/ (порядок у src/css/main.css)") },
    logLevel: "warning",
  });
  const common = await buildJs(COMMON, "assets/js/common.min.js", "src/js/common.js");
  const home = await buildJs(HOME, "assets/js/home.min.js", "src/js/home/");
  const css = readFileSync("assets/css/styles.min.css").length;
  console.log(`built in ${Date.now() - t} ms: styles.min.css ${(css / 1024).toFixed(1)} KB, common.min.js ${(common / 1024).toFixed(1)} KB, home.min.js ${(home / 1024).toFixed(1)} KB`);
}

await run();
if (process.argv.includes("--watch")) {
  let timer;
  watch("src", { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(() => run().catch((e) => console.error(e.message)), 100);
  });
  console.log("watching src/ …");
}
