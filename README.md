# Investor Pitch Deck

A customized AI-agent skill for turning company material into an evidence-backed
investor pitch, a detailed PowerPoint deck, and optional template and review files.
Adapted and maintained by **Mohit Garg**. It combines earlier skills with his workflow
changes; original-source attribution is still incomplete. See [credits](CREDITS.md).

## What it does

- Builds a short pitch (usually 12–15 slides) and a full deck (usually 25–35).
- Researches markets and competitors, then verifies figures against sources.
- Creates editable `.pptx` files, optional `.potx` templates, PDFs and review reports.
- Renders decks for visual QA and separates verified facts from founder placeholders.

This is an agent workflow with helper scripts, not a standalone deck-generation app.
Provide company documents, brand assets, audience, funding stage, geography and the ask.
Its research workflow assumes an agent with file, web and delegation capabilities;
optional review tools and artifact delivery depend on the host environment.

## Install the skill

Clone directly into your agent's skills directory. For Codex on Windows (PowerShell):

```powershell
git clone https://github.com/mohitgargcanada-max/investor-pitch-deck.git "$env:USERPROFILE\.codex\skills\investor-pitch-deck"
```

For Claude Code, use `~/.claude/skills/investor-pitch-deck` instead. For another
compatible host, place this repository folder in its documented skills directory.
The required `SKILL.md` is at the repository root. Reload the host if necessary.

## Use with an agent

Ask the agent to use `investor-pitch-deck`, or invoke it through the host's skill UI:

> Use investor-pitch-deck to build a seed-stage investor deck from this repository
> and these company documents. Focus on Canada. Create a short pitch and full deck,
> verify every statistic, and leave missing founder details clearly marked.

For an existing deck:

> Use investor-pitch-deck to review this deck, verify its claims, triage the findings,
> and create updated pitch and full versions with rendered visual QA.

Read [SKILL.md](SKILL.md) for the full workflow and approval boundaries.

## Dependencies and manual example

Use a supported Python 3 and Node.js installation, plus LibreOffice for PDF rendering.
Install packages in your chosen local environment:

```text
python -m pip install python-pptx pymupdf Pillow
npm install pptxgenjs
```

From the repository root, these commands build the bundled five-slide sample,
extract a three-slide pitch and render both:

```text
node scripts/example_deck.js Example_Full.pptx
python scripts/make_pitch.py Example_Full.pptx Example_Pitch.pptx --keep 1,2,5
python scripts/render_check.py Example_Full.pptx Example_Pitch.pptx --out render
python scripts/to_potx.py Example_Full.pptx Example_Template.potx
```

The sample contains illustrative numbers and placeholders, not investment research.
Open the generated contact sheets and review every slide before sharing. When making
a real build script, keep it beside `deck_kit.js` or update its require path; copy both
files together if building outside this repository. Packages must resolve from there.
The `pptx` validation skill and founder-skills review tool are optional, separate installs.

## Repository structure

```text
SKILL.md                 Agent workflow and hard-won rules
scripts/                 Deck helpers, example, pitch extraction and render QA
references/              Slide catalogue, research playbook and review checklist
README.md                Installation and usage
CREDITS.md               Known sources and unresolved attribution
NOTICE.md                Attribution summary
MODIFICATIONS.md         Publication and modification scope
LICENSE-STATUS.md        Licensing limitations
```

## Attribution and license status

This is Mohit's customized edition, not a claim of sole original authorship.
Lool Ventures' founder-skills is a verified reference; other original skills remain
unidentified. See [CREDITS.md](CREDITS.md). The supplied archive has no license for
the combined customized work; no new one has been assigned. See
[LICENSE-STATUS.md](LICENSE-STATUS.md).
