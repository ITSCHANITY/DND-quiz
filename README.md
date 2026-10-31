# CHARACTER.SYS — D&D Soul Scanner

A text-only, single-page web app that asks about your **real life** — how you
act, decide, handle stress, and treat people — and resolves it into a Dungeons &
Dragons **class** and **species**, with ability scores, strengths/weaknesses,
and a runner-up. Dark terminal aesthetic, no images, no backend, no tracking.

## Run it

It's a static site — just open the file:

```
1. open the folder PROJECTS/dnd-quiz
2. double-click index.html  (or drag it into a browser)
```

That's it. No install, no server, no internet needed.

> Optional, if you prefer serving it (avoids any browser file:// quirks):
> ```bash
> cd PROJECTS/dnd-quiz
> python3 -m http.server 8000      # then visit http://localhost:8000
> ```

## Files

| File | What it is |
| --- | --- |
| `index.html` | Page structure (intro / quiz / result screens). |
| `styles.css` | Dark terminal theme: monospace, green/amber on black, glow, scanlines, typewriter, responsive. |
| `data.js` | **All content** — classes, races (with sources), questions, answer weights, tiebreakers. Edit this. |
| `app.js` | All logic — scoring, modes, tiebreaker, rendering. Rarely needs edits. |
| `simulate.js` | Node balance checker (dev tool, not shipped to users). |

## How scoring works (and how to tweak it)

Everything lives in **`data.js`**. Each answer option carries up to three weight
maps:

```js
{
  text: "Research everything until I'm certain",
  class: { Wizard: 3, Artificer: 1 },   // how you ACT / solve problems
  race:  { Gnome: 2, Vedalken: 1 },      // temperament / values / lifestyle
  stats: { INT: 2 },                     // ability-score leanings
}
```

Choosing an option **adds** those numbers to running totals. Highest class total
= your class; highest race total = your species. Keep individual weights small
(0–3) and spread across a few buckets — don't dump everything into one.

### Fairness normalization (important)

A class or race that appears in *many* questions would win just by being
everywhere. So after summing, each score is divided by the **square root of that
bucket's "reach"** — the max points it could possibly earn across the asked
questions (computed automatically from the data in `computeReach()`):

```
finalScore[bucket] = rawScore[bucket] / sqrt(reach[bucket])
```

`sqrt` softens the correction so a rare-but-matched species stays competitive
without a single lucky hit dominating. **You don't maintain this by hand** — it
recomputes from your data, so add/remove content freely and balance self-corrects.

### Tiebreaker (deterministic — no randomness in results)

1. Higher final score wins.
2. If tied, the bucket whose single strongest answer contribution was larger.
3. Still tied → whichever appears earlier in `TIEBREAKER_PRIORITY` in `data.js`.

The **runner-up** shown on the result screen is simply second place.

### Stats

`STR/DEX/CON/INT/WIS/CHA` accumulate separately and are rescaled to a readable
8–18 D&D range for the bars (purely cosmetic; doesn't affect class/race).

## Adding content

- **A new question:** copy any object in the `QUESTIONS` array in `data.js`,
  change the text and options' weight maps. Add `pool: "short"` to include it in
  the 15-question short mode.
- **A new race/class:** add an entry to `RACES` / `CLASSES`, then reference it in
  some options' weight maps so it's reachable. Re-run the simulator to confirm it
  actually wins sometimes.

## Balance — how it was tested

`node simulate.js 30000` plays 30,000 random full-mode playthroughs and reports
how often each class/race wins. After tuning:

- **Classes (13):** every class reachable; spread ~2.7%–14.6% (top share 14.6%,
  uniform would be 7.7%). No class starved or dominant.
- **Races (38):** **0 never appear** — every species is reachable; top share
  ~9.0% (uniform would be 2.6%). Human/Dwarf/Halfling no longer dominate.

Random input is the worst case; real users with coherent personalities cluster
far more meaningfully. Re-run the simulator any time you edit `data.js`:

```bash
node simulate.js 30000
```

## Classes & races included

**Classes (13, all official):** Artificer*, Barbarian, Bard, Cleric, Druid,
Fighter, Monk, Paladin, Ranger, Rogue, Sorcerer, Warlock, Wizard.
*(\*Artificer: Tasha's Cauldron / Eberron.)*

**Races (39):** PHB (Human, Elf, Dwarf, Halfling, Gnome, Half-Elf, Half-Orc,
Dragonborn, Tiefling); Volo's (Aasimar, Goliath, Tabaxi, Firbolg, Kenku, Triton,
Lizardfolk, Orc, Goblin, Hobgoblin, Bugbear, Kobold, Yuan-ti); Elemental Evil
(Genasi, Aarakocra); Tortle Package (Tortle); Monsters of the Multiverse
(Githyanki, Githzerai); Eberron (Changeling, Shifter, Warforged, Kalashtar);
Ravnica (Centaur, Loxodon, Simic Hybrid, Vedalken); Witchlight (Fairy,
Harengon); Strixhaven (Owlin); Theros (Satyr). Each race's source is shown on
the result screen.

> Scope note: this is "core + major sourcebooks." A fully exhaustive list
> (Plasmoid, Thri-kreen, Autognome, Hadozee, Leonin, Grung, …) was intentionally
> left out — with 38 species already, more makes them hard to distinguish in
> 15–35 questions. Adding them is trivial in `data.js` if you want them.

## Accessibility & safety

- Keyboard: `1–5` pick answers, `Backspace` goes back, `Enter` on the name field
  starts. Visible focus outlines; `role=radiogroup`/`aria` on options; respects
  `prefers-reduced-motion`.
- The optional name is **sanitized** (letters/numbers/space/-/_ only, 24 chars)
  and rendered via `textContent`, so no HTML/script injection is possible.
- No secrets, no network calls, no storage. Runs fully offline.

## Suggested upgrades (next)

1. **Shareable result codes** — encode class/race/stats into a short base64
   string in the URL hash so people can share/reload their result.
2. **Hidden secret class** — e.g. "Blood Hunter": if a rare combination of
   answers is picked, override the result with an easter-egg class.
3. **Saved history** — store past results in `localStorage` and show a
   "previous scans" list (still no backend).
4. **Printable character sheet** — a `@media print` stylesheet that formats the
   result screen as a clean one-page sheet.
5. **Optional Flask version** — a tiny `app.py` that accepts a POSTed result and
   stores it in SQLite for a public leaderboard ("most common class this week").
   Keep the static app as the default; Flask is purely additive.

## License

MIT. Not affiliated with or endorsed by Wizards of the Coast; D&D class/race
names are used descriptively for a fan quiz.
