# Render QA and investor-readiness review

*Part of the investor-pitch-deck skill, created by Mohit Garg.*

## Part 1 — Render QA (every build)

`python scripts/render_check.py <decks> --out render` then open every contact sheet. Look for:

| Defect | Typical cause | Fix |
|---|---|---|
| Title wraps to 2 lines and runs into the content | Headline > ~48 characters at 32 pt | Shorten the headline |
| Big number wraps onto its label ("$59–249") | Value too long for the card at 36 pt | Shorter value ("4 plans") or wider card |
| Table overlaps the box/text below | Rows grow with wrapped text; `rowH` is a minimum | Shorten cells, widen columns, move the box down |
| Large empty space under cards | Card height fixed larger than its text | Reduce card height to content |
| Text collides with footer/source | Content runs past y ≈ 6.4 in | Move up or cut content; legend sits at 6.45–7.2 |
| One-series chart bars in several colours | More than one colour passed to a single-series bar chart | One colour (deck_kit default) |
| Data labels rounded ("6" for 6.1) | No format code | `dataLabelFormatCode: "0.0"` |
| Titles centred, kickers left | Placeholder alignment default | `align: "left"` on the title placeholder |
| A source cites a stat no longer on the slide | Edited content, stale caption | Update caption with the content |
| Pitch looks identical to full | Reordered instead of cut | `make_pitch.py` |

## Part 2 — Investor-readiness review

### Option A: founder-skills `deck-review` (most rigorous)

Repo: https://github.com/lool-ventures/founder-skills (Apache-2.0). Scores a deck against 35 criteria
(narrative, slide content, stage fit, design, common mistakes, AI-company checks, diligence readiness),
extracts every figure, cross-checks the arithmetic and writes a report with coaching notes.

Ask the user before installing it (it downloads and runs third-party code). Read its scripts first.
It ships as a plugin with SessionStart/PreToolUse/Stop hooks that fire in every session; if that is
unwanted, clone it to a tools folder and run `skills/deck-review/SKILL.md` by hand instead of
registering the plugin:

- Set the plugin root to the cloned `founder-skills/founder-skills` folder; run its scripts with `python`
  (Windows has no `python3`) and `PYTHONIOENCODING=utf-8`.
- Windows: `gate_state.py` imports `fcntl`. Put a stub `fcntl.py` (`LOCK_EX = 2; LOCK_UN = 8;
  def flock(fd, op): return None`) on `PYTHONPATH`; the lock is advisory and the run is single-writer.
- Its sub-agent type is not registered without the plugin: dispatch general-purpose agents told to read
  `agents/deck-review.md` first and follow it for the named context; keep each dispatch prompt verbatim.
- Build receipts with `json.dumps` (Windows backslashes break hand-typed JSON).
- If the Read tool cannot render PDF pages, render with `render_check.py` and record what you saw per slide
  in the inventory's `visuals` field (visual evidence captured = true).
- Units after numbers ("200 B2B products") can be read as multipliers by its ledger check: the repair is
  to spell the unit out in `raw`.

### Option B: built-in checklist (no install)

Score each pass / partial / fail with evidence from the deck:

- **Narrative:** purpose in one plain sentence; headlines alone tell the story; strongest proof by slide 3;
  readable without a presenter.
- **Content:** problem quantified with a cost; solution shown as a workflow or screenshot; a real why-now
  catalyst; bottom-up market; named competitors, fairly described; clear pricing; go-to-market with any
  proof; team with founder-market fit.
- **Stage fit:** structure fits the stage; traction appropriate; 12–18 month budget, burn, runway; ask tied
  to dated milestones; round size in range for the stage.
- **Design:** one idea per slide; little text; slide count (pitch ≤ 15); consistent design; readable on a
  phone.
- **Common mistakes:** no vague purpose, no nice-to-have problem, no hype without proof, outcomes over
  features, competition not dodged.
- **Diligence:** numbers consistent across slides; data room ready; contact details present.

### Triage every finding

| Bucket | Rule |
|---|---|
| Apply now | Changes you can make from verified facts: reorder, headlines, consistency, moving slides, removing drafting notes. |
| Needs the founder | Team, ask amount/terms, budget, cost to serve, engagement numbers, quotes, data room. Leave a `[placeholder]` and list them. |
| Disagree | Verify first, then say why with evidence. Known false positives: a growth multiple over N years flagged against an annual rate (check `(1+r)^N`); page-number mismatches it never rendered; "name drift" from an uppercase kicker label. |

Apply the agreed fixes in the full-deck build script, re-cut the pitch, re-render, and report:
score, what changed, what you disagreed with and why, and the founder-only list.
