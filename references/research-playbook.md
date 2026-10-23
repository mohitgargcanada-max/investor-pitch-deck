# Research playbook

*Part of the investor-pitch-deck skill, created by Mohit Garg.*

Run these as background sub-agents (general-purpose, a mid-tier model is enough), in parallel, while you
build. Fill `<…>` from the intake. Every prompt ends with the same rules block.

## Rules block (append to every prompt)

> Use web search (extended mode when standard results are thin) and fetch the source page to confirm.
> Never invent a number or a company fact; every figure needs publisher, year and URL; say "not found"
> when not found. Mark each fact [official] / [analyst] / [vendor] / [third-party snippet]. Prefer
> <COUNTRY> sources, then North American. Do not install or run anything. Concise report, under ~1,000
> words.

## 1. Company fact sheet (Explore agent on the repo)

> Build a fact sheet for an investor deck from <repo paths>. Read excerpts, not whole huge files; grep
> large trackers. Return: one-liner/taglines, problem, how it works (3 steps), live features, pricing
> with currency, customers and usage numbers with measurement dates, engineering stats, roadmap, team,
> brand colours/fonts/logo paths, fundraising info. Every item with file path; "not found" when absent.

## 2. Local competitors (<COUNTRY>)

> Find what a <COUNTRY> <target customer> uses today for <the job>. Groups: local list/data vendors,
> local platforms, reputation/messaging suites, CRM + general AI. For each: one line, HQ, serves
> <COUNTRY>?, public price, fair one-line gap vs <product>. Recommend 4 groupings for one slide.

## 3. Worldwide look-alikes

> Find the 8–12 tools most like <product> worldwide (AI agents/employees for small business, AI sales
> reps, local SEO/reputation tools). For each: what it does, target, HQ, price from the vendor pricing
> page, gap vs <product>. Then: 4–6 market gaps <product> can fill, each backed by the evidence.

## 4. Market size and why-now statistics

> Find official <COUNTRY> figures: number of target businesses (total, by region, by industry), adoption
> of the relevant technology over time, the main barriers, and one cost-of-inaction statistic for the
> customer's pain. Exact figure, table/edition, release date, URL.

## 5. Product / agent expansion with revenue evidence

> For each candidate product or agent (<list>): vendors and verified prices, demand evidence (surveys,
> with sample and year), credible market size or "not found", competition intensity, integrations and
> build difficulty, fit with <core asset>. Rank by financial potential with one-line reasons.

## 6. Marketing channels

> Find verified reach and cost facts for channels to reach <target customer> in <REGION>: chambers and
> business associations (member counts), trade associations, accountants/advisers, software-buying
> behaviour surveys, paid-search benchmarks, freemium conversion benchmarks, referral evidence, and the
> legal rule for cold outreach (<anti-spam law>, quote the official text). Rank 6–8 channels by cost,
> speed and fit, each with the one fact that supports it.

## Verification step (you, not an agent)

1. List every figure that will appear on a slide.
2. Re-fetch each one at the URL given (or grep the repo). Compare value, unit, year, population, currency.
3. Fix or drop mismatches. Note corrections in the journal/notes so the next person knows.
4. Things that went wrong before: copied value wrong; a "B" in "B2B" read as billions by a parser; a
   survey from another country used in a national deck; a vendor's own blog cited as research; a market figure for "all
   businesses" next to one for "1–4 employees" without saying so.
