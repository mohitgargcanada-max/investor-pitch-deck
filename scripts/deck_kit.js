// deck_kit.js — reusable building blocks for a branded investor deck in pptxgenjs.
// Part of the investor-pitch-deck skill, created by Mohit Garg.
//
// Usage (see example_deck.js):
//   const kit = require("./deck_kit.js");
//   const { pres, h } = kit.createDeck({ brand: {...}, title: "Acme Investor Deck" });
//   let s = h.slide("light", "Problem", "The problem", "Owners are experts in their craft, not in growth", "speaker notes");
//   h.card(s, h.X, h.TOP, 3, 2); h.text(s, "...", {...}); h.caption(s, "Source: ...");
//   await kit.save(pres, "Acme_Full.pptx");
//
// Canvas is LAYOUT_WIDE: 13.333 x 7.5 in. Content area: x 0.75..12.58, y 2.1..6.7; footer row at y 6.95.
// Colours are plain hex (no scheme colours), so the file needs no post-processing and opens anywhere.

let pptxgen;
try { pptxgen = require("pptxgenjs"); } catch (e) {
  throw new Error("pptxgenjs not found. Run `npm install pptxgenjs` in this folder, or set NODE_PATH to a node_modules that has it.");
}

const DEFAULT_BRAND = {
  name: "Company",
  headFont: "Arial",     // safe fonts render true-to-width in PowerPoint AND in LibreOffice QA
  bodyFont: "Calibri",
  dark: "2C2A63",        // headings, dark slides
  primary: "403D88",     // cover, emphasis, big numbers
  accent: "D4AF37",      // the ONE accent: eyebrows on dark, arrows, statement slide
  soft: "5A56A7",        // eyebrows on light, secondary labels
  ink: "25243A",         // table text
  muted: "4A4868",       // body text
  caption: "6B6A85",     // footers, sources
  line: "E4E3F2",        // borders, pills, table header
  tint: "F1F1F8",        // alternate table rows, appendix background
  canvas: "F8F9FC",      // light slide background
  white: "FFFFFF",
  logo: null,            // absolute path to a PNG/JPG logo (used on cover + closing only)
};

function createDeck({ brand = {}, title = "Investor Deck", author = "" } = {}) {
  const B = { ...DEFAULT_BRAND, ...brand };
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.title = title;
  pres.author = author || B.name;
  pres.company = B.name.replace(/&/g, "&amp;"); // written unescaped by pptxgenjs
  pres.theme = { headFontFace: B.headFont, bodyFontFace: B.bodyFont };

  const X = 0.75, W = 11.83, TOP = 2.1;
  const ph = (kicker, titleColor, num) => ({
    objects: [
      { placeholder: { options: { name: "kicker", type: "body", x: X, y: 0.45, w: W, h: 0.35, fontFace: B.headFont, fontSize: 12, bold: true, color: kicker, charSpacing: 2, margin: 0, valign: "top" }, text: "" } },
      { placeholder: { options: { name: "title", type: "title", x: X, y: 0.85, w: W, h: 1.05, fontFace: B.headFont, fontSize: 32, bold: true, color: titleColor, margin: 0, valign: "top", align: "left" }, text: "" } },
    ],
    slideNumber: { x: 12.0, y: 6.95, w: 0.58, h: 0.3, fontFace: B.bodyFont, fontSize: 10, color: num, align: "right" },
  });
  // Layout names are what h.slide() takes as `kind`.
  pres.defineSlideMaster({ title: "light", background: { color: B.canvas }, ...ph(B.soft, B.dark, B.caption) });
  pres.defineSlideMaster({ title: "dark", background: { color: B.dark }, ...ph(B.accent, B.white, B.line) });
  pres.defineSlideMaster({ title: "statement", background: { color: B.accent }, ...ph(B.dark, B.dark, B.dark) });
  pres.defineSlideMaster({ title: "appendix", background: { color: B.tint }, ...ph(B.soft, B.dark, B.caption) });
  pres.defineSlideMaster({ title: "cover", background: { color: B.primary } });
  pres.defineSlideMaster({ title: "closing", background: { color: B.dark } });

  const sections = new Set();
  const h = {
    B, X, W, TOP,
    cw2: (W - 0.3) / 2,
    cw3: (W - 0.6) / 3,
    cw4: (W - 0.9) / 4,
    // A new slide. kind: light | dark | statement | appendix | cover | closing.
    slide(kind, section, kicker, titleText, notes) {
      if (!sections.has(section)) { pres.addSection({ title: section }); sections.add(section); }
      const s = pres.addSlide({ masterName: kind, sectionTitle: section });
      if (kicker) s.addText(kicker.toUpperCase(), { placeholder: "kicker" });
      if (titleText) s.addText(titleText, { placeholder: "title" });
      if (notes) s.addNotes(notes);
      return s;
    },
    text(s, t, o) { s.addText(t, { margin: 0, isTextBox: true, valign: "top", fontFace: B.bodyFont, ...o }); },
    // Footer source line (single line). Use legend() instead when sources are numbered.
    caption(s, t, color = B.caption) { s.addText(t, { x: X, y: 6.95, w: 11.0, h: 0.3, fontSize: 10, color, margin: 0, isTextBox: true, objectName: "Source" }); },
    // Numbered sources along the bottom: legend(s, ["StatCan 2026", "ISED 2025"]) renders "[1] ... · [2] ...".
    legend(s, items) {
      s.addText(items.map((t, i) => `[${i + 1}] ${t}`).join("   ·   "), { x: X, y: 6.45, w: 11.1, h: 0.75, fontSize: 9, color: B.caption, margin: 0, isTextBox: true, valign: "bottom", objectName: "Sources" });
    },
    card(s, x, y, w, hgt, fill = B.white) {
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h: hgt, rectRadius: 0.12, fill: { color: fill }, line: { color: B.line, width: 0.75 },
        shadow: { type: "outer", color: B.dark, opacity: 0.08, blur: 8, offset: 2, angle: 90 }, objectName: "Card" });
    },
    badge(s, label, x, y, fill = B.primary, color = B.white) {
      s.addShape(pres.shapes.OVAL, { x, y, w: 0.6, h: 0.6, fill: { color: fill }, line: { color: fill }, objectName: "Badge" });
      s.addText(label, { x, y, w: 0.6, h: 0.6, fontFace: B.headFont, fontSize: 15, bold: true, color, align: "center", valign: "middle", margin: 0, isTextBox: true });
    },
    pill(s, t, x, y, w, fill = B.line, color = B.dark) {
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h: 0.34, rectRadius: 0.17, fill: { color: fill }, line: { color: fill }, objectName: "Pill" });
      s.addText(t, { x, y, w, h: 0.34, fontSize: 11, bold: true, color, align: "center", valign: "middle", margin: 0, isTextBox: true });
    },
    // rows[0] is the header. opts: { x, w, size, rowH, hi: index of the column to highlight }.
    table(s, rows, colW, y, opts = {}) {
      const head = rows[0].map((t, i) => ({ text: t, options: { bold: true, color: i === opts.hi ? B.primary : B.dark, fill: { color: B.line } } }));
      const body = rows.slice(1).map((r, ri) => r.map((t, i) => ({ text: t, options: { color: i === opts.hi ? B.primary : B.ink, bold: i === opts.hi, fill: { color: ri % 2 ? B.tint : B.white } } })));
      s.addTable([head, ...body], { x: opts.x ?? X, y, w: opts.w ?? W, colW, fontFace: B.bodyFont, fontSize: opts.size || 13, valign: "middle", margin: 0.08,
        border: { type: "solid", color: B.line, pt: 0.75 }, autoPage: false, objectName: "Table", ...(opts.rowH ? { rowH: opts.rowH } : {}) });
    },
    // A row of big-number cards: stats = [["1,250", "orders delivered"], ...].
    statCards(s, stats, y = TOP + 0.1, hgt = 2.1) {
      const n = stats.length, w = (W - 0.3 * (n - 1)) / n;
      stats.forEach(([num, label], i) => {
        const x = X + i * (w + 0.3);
        h.card(s, x, y, w, hgt);
        h.text(s, num, { x: x + 0.25, y: y + 0.25, w: w - 0.5, h: 0.8, fontFace: B.headFont, fontSize: 36, bold: true, color: B.primary });
        h.text(s, label, { x: x + 0.25, y: y + 1.1, w: w - 0.5, h: hgt - 1.25, fontSize: 14, color: B.muted });
      });
    },
    // Common chart options in brand style. Spread into addChart options, then add title/barDir etc.
    chartStyle(title) {
      return { title, showTitle: true, titleFontFace: "+mj-lt", titleFontSize: 13, titleColor: B.dark, chartColors: [B.primary], // one colour: several colours on a one-series bar chart paint each bar differently
        catAxisLabelFontFace: "+mn-lt", valAxisLabelFontFace: "+mn-lt", dataLabelFontFace: "+mn-lt", catAxisLabelColor: B.muted, valAxisLabelColor: B.caption,
        catAxisLabelFontSize: 12, valAxisLabelFontSize: 10, dataLabelFontSize: 12, dataLabelColor: B.dark, showValue: true,
        valGridLine: { color: B.line, size: 0.75 }, catGridLine: { style: "none" }, showLegend: false };
    },
  };
  return { pres, h };
}

async function save(pres, file) {
  await pres.writeFile({ fileName: file });
  return file;
}

module.exports = { createDeck, save, DEFAULT_BRAND };
