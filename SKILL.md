---
name: investor-pitch-deck
description: Build, refine and review investor pitch decks as real PowerPoint files - a short pitch deck (~15 slides) plus a full deck (~30) and a branded template - from a company's own repo, README, docs and live data, with every figure verified at source, market research done by parallel sub-agents, LibreOffice render QA, an investor-readiness review with triaged fixes, and a share-ready folder. Use this whenever someone asks for a pitch deck, investor deck, fundraising deck, seed/pre-seed/Series A deck, "deck for investors/VCs", wants an existing deck reviewed, scored, refined or made "investor ready", wants competitor/market/TAM slides researched for a deck, or wants pitch and long versions of the same deck - even if they don't say "PowerPoint" or name this skill.
metadata:
  author: Mohit Garg
  version: "1.1"
---

# Investor pitch deck

*Created by Mohit Garg.*

Turns a company's real material into two decks investors can read without you in the room, and keeps
them honest. The process below was learned the hard way on a live fundraising deck; the rules in
"Hard-won rules" each come from a mistake that reached the founder.

## What you produce

| Deliverable | What it is |
|---|---|
| `<Co>_Pitch.pptx` + `.pdf` | 12–15 slides, the one sent to investors. A true cut: the other slides are not in the file. |
| `<Co>_Full.pptx` + `.pdf` | ~25–35 slides: everything in the pitch plus detail (competitor depth, agents/roadmap, channels, financials, risks). |
| `<Co>_Template.potx` | Branded PowerPoint template so the team can add slides themselves (optional). |
| `<Co>_Deck_Review.md/.html` | Investor-readiness review of the pitch, with the fixes applied or argued against (optional). |
| Share folder + `.zip` + `README.txt` | Only finished files, with what each one is and what to fill before sending. |

## Workflow

Run the phases in order. Tell the user in one line what you are doing at each phase; keep findings in
the files, not the chat.

### 1. Intake (ask once, with options)

Ask with a multiple-choice question, not open prose: **audience** (investors / customers / partners),
**stage** (pre-seed / seed / Series A), **the ask** (amount if known, else leave a placeholder),
**presenter and team** (never invent people), **geography focus** (which country/region the market,
competitors and stats must come from), **brand** (colours, fonts, logo path) and **existing decks or
recipes** to follow. Default to whatever the repo already shows; ask only what you cannot find.

### 2. Gather the company's facts (one cheap sub-agent)

Dispatch an `Explore`/cheap-model agent to build a fact sheet from the repo and docs: one-liner and
taglines, problem, how the product works, live features, pricing (and its CURRENCY), customers and
usage numbers with their measurement date, test/engineering stats, roadmap, team, brand colours/fonts/logo,
and anything about fundraising. Every fact needs a file path; "not found" when absent. Then **grep or
read the key figures yourself** before they go on a slide - the agent summarises, you verify.
Customer names: ask before naming any customer on a slide.

### 3. Research the market (parallel sub-agents, then verify)

Use `references/research-playbook.md` for the prompts. Typical parallel set: local competitors,
worldwide look-alikes, market size and why-now statistics (official sources first), product/agent
expansion with price evidence, and marketing channels. Run them in the background while you work.

When they return, **re-fetch every figure that will appear on a slide** from its source page. Agents
mis-copy numbers (a US$70.11 cost-per-lead was really US$66.69), mix regions (a US survey presented as
local) and present vendor blog stats as research. Drop anything you cannot confirm; never fill a gap
with a remembered number.

### 4. Storyline

Plan both decks from `references/slide-catalogue.md`. The pitch follows the investor order: purpose →
problem → solution → why now → proof → market (bottom-up) → beachhead → competition → business model →
go-to-market → roadmap → team → ask → close. Everything else goes in the full deck.

**Slide counts follow the evidence, not a template.** The pitch is 12–15 slides: drop a pitch slide
only when it genuinely does not apply (no separate beachhead, no roadmap for an idea-stage company).
The full deck is the pitch plus optional slides from the catalogue, and an optional slide goes in
**only when verified facts exist for it** - real numbers, named competitors, actual customers, a real
product feature. No evidence means no slide: do not pad the deck with generic or placeholder slides.
The one exception is a fill-in slide the user explicitly asks for (team photos, financials they will
complete), clearly marked with `[brackets]`. At the end, list the optional slides you considered and
skipped, with the reason for each ("Cohort retention: skipped, fewer than 3 months of paying
customers"), so the user can supply the missing evidence later.

Write every headline as the claim the slide proves ("40 customers live, 3,200 jobs booked"), not a
topic label ("Traction"). Read the headlines alone in order: they should tell the story.

### 5. Build

Build the FULL deck with `scripts/deck_kit.js` (pptxgenjs; copy `scripts/example_deck.js` as the
starting point), then cut the pitch from it - so a content fix is made once:

```bash
npm install pptxgenjs            # once, in the build folder (or set NODE_PATH)
node build_deck.js               # writes <Co>_Full.pptx
python scripts/make_pitch.py <Co>_Full.pptx <Co>_Pitch.pptx --keep 1,2,3,8,4,11,5,6,16,10,22,24,25,29,32
```

`--keep` lists the positions of the pitch slides in YOUR full deck, in pitch order (the numbers above
are only an example). Report both slide counts to the user so the difference is visible.

If the `pptx` skill is available, read it first: its pptxgenjs gotchas apply (hex without `#`, no
shared option objects, `LAYOUT_WIDE`, notes via `addNotes`) and its `validate.py` is the file check.

Build rules: speaker notes on every slide; sources on every data slide (`h.caption` or numbered
`h.legend`); currency on every price (C$, US$, €); placeholders in `[brackets]` for anything only the
founder knows; one accent colour; logo only on cover and closing; safe fonts (Arial/Calibri) so the
LibreOffice preview matches PowerPoint.

### 6. QA - render and look

```bash
python <pptx-skill>/scripts/office/validate.py <deck>.pptx       # file check, if the pptx skill is installed
python scripts/render_check.py <Co>_Full.pptx <Co>_Pitch.pptx --out render
```

Then **open every contact sheet and look**. See `references/review-and-qa.md` for the defect list - the
common ones are a two-line title running into the content, big numbers wrapping onto their label, a
table growing into the box below it, and empty space under over-tall cards. Fix in the build script,
rebuild, re-render only what changed. Never ship a slide you have not seen rendered.

### 7. Investor-readiness review (when asked, or before calling a deck "ready")

Follow `references/review-and-qa.md`: either run the founder-skills `deck-review` tool (35 criteria;
how to run it outside its plugin is documented there) or the built-in checklist. Then **triage** every
finding into: apply now / needs the founder / disagree (with the evidence). Check its claims before
acting - review tools produce false positives (a "contradiction" between a 5-year multiple and an
annual growth rate that actually agree; page numbers it never saw). Apply the agreed fixes to the build
script so both decks get them.

### 8. Package to share

Make `<Co>-Investor-Decks-<date>/` with only finished files (both decks as .pptx and .pdf, template,
review), a `README.txt` saying which deck goes to investors, what is internal, and which placeholders to
fill first, and a `.zip` of it. Send the zip with the file-sending tool if one exists.

## Hard-won rules

- **The pitch and full decks must visibly differ.** A "pitch" that is the full deck reordered behind an
  appendix divider looks identical when opened. Cut the pitch with `make_pitch.py` and state slide counts.
- **Verify, don't relay.** Every number on a slide was re-read at its source in this session (repo grep or
  fetched page). Research agents' figures are leads, not facts.
- **Match the geography.** A national/regional deck uses that country's official statistics; a figure
  from another country is either labelled as such or left out.
- **Label the population.** Two similar stats for different groups (all businesses vs. 1–4 employees)
  must say which group each describes, or a reviewer will call them inconsistent.
- **Say the weakness before the investor does.** If the deck's honest gap is engagement, revenue or team,
  put it on the proof slide with the plan to fix it. Hiding it in speaker notes reads as evasion.
- **No drafting notes on slides.** "For the founders to confirm", "[set target]" and internal-only slides
  belong in speaker notes or the full deck's last slide, marked for deletion.
- **Fill or cut placeholder slides in the pitch.** An empty traction or projections slide reads worse than
  none; keep fill-in versions in the full deck.
- **Jargon out.** One plain sentence with a number, used on the cover, summary and close ("An AI assistant
  that books independent dental clinics 30 new patients a month"), beats brand-speak.
- **Windows paths.** Use long paths (`C:\Users\<name>\...`), not 8.3 short names (`ADMINI~1`); some tools
  refuse the short form. Use `python`, not `python3`, on Windows.

## Reference files

- `references/slide-catalogue.md` - the 15 pitch slides, plus a library of ~50 optional slides, each with
  the condition that must hold before it is included, the evidence it needs, and where it goes; and the
  slides to leave out by default.
- `references/research-playbook.md` - sub-agent prompts for each research topic and the verification step.
- `references/review-and-qa.md` - render-QA defect list, investor-readiness checklist, running founder-skills
  `deck-review`, and how to triage review findings.
- `scripts/deck_kit.js` - brand theme, slide layouts and helpers (cards, stat cards, tables, badges, pills,
  numbered source legend, chart style). `scripts/example_deck.js` shows each one.
- `scripts/make_pitch.py` - cut the pitch deck from the full deck.
- `scripts/render_check.py` - LibreOffice → PDF → per-slide PNGs and labelled contact sheets.
- `scripts/to_potx.py` - turn a template .pptx into a real .potx.
