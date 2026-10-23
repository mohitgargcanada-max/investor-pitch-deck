// Part of the investor-pitch-deck skill, created by Mohit Garg.
// example_deck.js — a 5-slide sample showing every deck_kit helper. Copy it as the starting point for a real deck.
// Run: node example_deck.js [output.pptx]
const path = require("path");
const kit = require("./deck_kit.js");

const { pres, h } = kit.createDeck({ title: "Example Investor Deck", brand: { name: "Example Co" } });
const { X, W, TOP, B } = h;

// 1. Cover (logo only on cover and closing)
let s = h.slide("cover", "Opening", null, null, "One sentence: what you do, for whom, with a number.");
h.text(s, "EXAMPLE CO", { x: X, y: 1.75, w: 7.5, h: 0.4, fontFace: B.headFont, fontSize: 14, bold: true, color: B.accent, charSpacing: 3 });
h.text(s, "Example Co", { x: X, y: 2.25, w: 7.5, h: 1.1, fontFace: B.headFont, fontSize: 60, bold: true, color: B.white });
h.text(s, "[One plain sentence: who it is for and what they get, with a number]", { x: X, y: 3.45, w: 7.5, h: 0.9, fontFace: B.headFont, fontSize: 20, color: B.white });
h.text(s, "[Founder name] · [email] · Investor overview · [Month Year]", { x: X, y: 6.7, w: 11, h: 0.35, fontSize: 12, color: B.line });

// 2. Stat cards + numbered legend
s = h.slide("light", "Opening", "At a glance", "[Headline that states the strongest proof]", "Lead with the strongest real number.");
h.statCards(s, [["[__]", "customers live"], ["[__]", "units delivered"], ["[__]", "market size, with source"], ["[__]", "price range, currency labelled"]]);
h.legend(s, ["[Publisher, report, date]", "[Company report, date]"]);

// 3. Chart + side cards
s = h.slide("light", "Why now", "Why now", "[The catalyst, as a statement]", "Why could this not have been built five years ago?");
h.card(s, X, TOP + 0.1, 6.4, 4.5);
s.addChart(pres.charts.BAR, [{ name: "Metric", labels: ["2024", "2025", "2026"], values: [6.1, 12.2, 19.2] }],
  { x: X + 0.2, y: TOP + 0.25, w: 6.0, h: 4.2, barDir: "col", dataLabelPosition: "outEnd", dataLabelFormatCode: "0.0", valAxisHidden: true, ...h.chartStyle("[Metric] (%) — replace with sourced data") });
[["01", "[Point one]"], ["02", "[Point two]"], ["03", "[Point three]"]].forEach(([n, t], i) => {
  const y = TOP + 0.1 + i * 1.55;
  h.card(s, X + 6.7, y, W - 6.7, 1.35);
  h.badge(s, n, X + 6.95, y + 0.37);
  h.text(s, t, { x: X + 7.8, y: y + 0.3, w: W - 8.05, h: 0.8, fontSize: 14, color: B.muted });
});
h.caption(s, "Source: [publisher, survey, release date]");

// 4. Table with highlighted column
s = h.slide("light", "Competition", "Differentiation", "[Where we differ, as a statement]", "Name real competitors; critiques must be fair.");
h.table(s, [["Capability", "Us", "Alternative A", "Alternative B"], ["[Capability]", "Yes", "No", "Partly"], ["[Capability]", "Yes", "Lists you search", "No"]],
  [4.6, 2.4, 2.4, 2.43], TOP + 0.1, { hi: 1, size: 15, rowH: 0.8 });
h.caption(s, "Alternatives: [named vendors] · prices from vendor pages, [date]");

// 5. Statement slide (the ask)
s = h.slide("statement", "Ask", "The ask", null, "Amount, instrument, runway, use of funds, milestones it buys.");
h.text(s, "[$___] pre-seed", { x: X, y: 0.9, w: W, h: 1.0, fontFace: B.headFont, fontSize: 54, bold: true, color: B.dark });
h.text(s, "[SAFE or priced round] · [valuation cap] · [runway: __ months]", { x: X, y: 2.0, w: W, h: 0.5, fontFace: B.headFont, fontSize: 18, color: B.dark });

const out = process.argv[2] || path.join(process.cwd(), "Example_Deck_Full.pptx");
kit.save(pres, out).then((f) => console.log(f));
