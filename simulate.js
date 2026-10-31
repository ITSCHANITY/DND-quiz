/* ===========================================================================
   simulate.js — balance checker. Plays N random full-mode quizzes and reports
   how often each class and race wins. Run:  node simulate.js [N]
   A healthy spread = no class/race dominating. Uniform would be ~1/13 (7.7%)
   for classes and ~1/39 (2.6%) for races; real personality quizzes are never
   perfectly uniform, but we watch for anything hogging the results or never
   appearing at all.
   =========================================================================== */
const DATA = require("./data.js");
const { CLASSES, RACES, QUESTIONS, TIEBREAKER_PRIORITY, STAT_ORDER } = DATA;

function emptyScores(keys) { const o = {}; for (const k of keys) o[k] = 0; return o; }

function addWeights(map, totals, maxes) {
  if (!map) return;
  for (const k in map) {
    if (!(k in totals)) continue;
    totals[k] += map[k];
    if (map[k] > maxes[k]) maxes[k] = map[k];
  }
}

function rank(totals, maxes, priority) {
  const keys = Object.keys(totals);
  keys.sort((a, b) => {
    if (totals[b] !== totals[a]) return totals[b] - totals[a];
    if (maxes[b] !== maxes[a]) return maxes[b] - maxes[a];
    return priority.indexOf(a) - priority.indexOf(b);
  });
  return [keys[0], keys[1]];
}

function computeReach(kind, questions) {
  const reach = {};
  for (const q of questions) {
    const best = {};
    for (const opt of q.options) {
      const map = opt[kind];
      if (!map) continue;
      for (const k in map) if (!(k in best) || map[k] > best[k]) best[k] = map[k];
    }
    for (const k in best) reach[k] = (reach[k] || 0) + best[k];
  }
  return reach;
}
function normalize(scores, reach) {
  const out = {};
  for (const k in scores) { const r = reach[k] || 0; out[k] = r > 0 ? scores[k] / Math.sqrt(r) : 0; }
  return out;
}
// Reach is constant for full mode, so compute once.
const CLASS_REACH = computeReach("class", QUESTIONS);
const RACE_REACH = computeReach("race", QUESTIONS);

function playRandom() {
  const classScore = emptyScores(Object.keys(CLASSES));
  const raceScore = emptyScores(Object.keys(RACES));
  const classMax = emptyScores(Object.keys(CLASSES));
  const raceMax = emptyScores(Object.keys(RACES));
  for (const q of QUESTIONS) {
    const opt = q.options[Math.floor(Math.random() * q.options.length)];
    addWeights(opt.class, classScore, classMax);
    addWeights(opt.race, raceScore, raceMax);
  }
  const [c] = rank(normalize(classScore, CLASS_REACH), classMax, TIEBREAKER_PRIORITY.class);
  const [r] = rank(normalize(raceScore, RACE_REACH), raceMax, TIEBREAKER_PRIORITY.race);
  return { c, r };
}

function report(title, counts, n, total) {
  const rows = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  console.log(`\n=== ${title} (${total} buckets) ===`);
  const barW = 30;
  const top = rows[0] ? rows[0][1] : 1;
  for (const [name, count] of rows) {
    const pct = (count / n) * 100;
    const bar = "#".repeat(Math.round((count / top) * barW));
    console.log(`  ${name.padEnd(14)} ${pct.toFixed(1).padStart(5)}%  ${bar}`);
  }
  const zero = total - rows.filter(([, c]) => c > 0).length;
  console.log(`  -- never appeared: ${zero}/${total}`);
  console.log(`  -- top share: ${((rows[0][1] / n) * 100).toFixed(1)}%  (uniform would be ${(100 / total).toFixed(1)}%)`);
}

const N = Number(process.argv[2] || 20000);
const classCounts = emptyScores(Object.keys(CLASSES));
const raceCounts = emptyScores(Object.keys(RACES));
for (let i = 0; i < N; i++) {
  const { c, r } = playRandom();
  classCounts[c]++; raceCounts[r]++;
}
console.log(`Simulated ${N} random full-mode playthroughs.`);
report("CLASS distribution", classCounts, N, Object.keys(CLASSES).length);
report("RACE distribution", raceCounts, N, Object.keys(RACES).length);
