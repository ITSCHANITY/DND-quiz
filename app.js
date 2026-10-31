/* ===========================================================================
   app.js — all the LOGIC for CHARACTER.SYS. Reads content from data.js.
   You should rarely need to touch this file to add content; edit data.js.

   Flow:  intro  ->  quiz (N questions)  ->  result
   Scoring: see computeResult(). Determinism: no randomness in results, only in
   question ORDER (which doesn't affect totals).
   =========================================================================== */
(function () {
  "use strict";

  // DATA is a global from data.js (browser) — grab its pieces.
  const { CLASSES, RACES, QUESTIONS, TIEBREAKER_PRIORITY, STAT_ORDER, STAT_NAMES } = DATA;

  const SHORT_COUNT = 15;

  /* ---------------------------------------------------------------- state */
  const state = {
    mode: "short",
    name: "anonymous",
    questions: [], // the ordered subset being asked
    index: 0,
    answers: [], // answers[i] = chosen option index for questions[i]
  };

  /* --------------------------------------------------------------- helpers */
  const $ = (id) => document.getElementById(id);

  /** Sanitize the optional name: allow letters/numbers/space/-/_ only, trim,
   *  cap length, and fall back to a safe default. Using textContent elsewhere
   *  means we never inject HTML, but we sanitize here too as defence in depth. */
  function sanitizeName(raw) {
    if (typeof raw !== "string") return "anonymous";
    const cleaned = raw.replace(/[^\p{L}\p{N} _-]/gu, "").trim().slice(0, 24);
    return cleaned.length ? cleaned : "anonymous";
  }

  /** Fisher–Yates shuffle (returns a new array; does not mutate input). */
  function shuffled(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function show(screenId) {
    for (const s of document.querySelectorAll(".screen")) s.classList.add("hidden");
    $(screenId).classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ----------------------------------------------------------- quiz build */
  function buildQuestionSet(mode) {
    if (mode === "short") {
      // Take the curated short pool; if fewer than SHORT_COUNT are tagged,
      // top up with other questions so the count is always right.
      const pool = QUESTIONS.filter((q) => q.pool === "short");
      const rest = QUESTIONS.filter((q) => q.pool !== "short");
      const chosen = pool.concat(shuffled(rest).slice(0, Math.max(0, SHORT_COUNT - pool.length)));
      return shuffled(chosen).slice(0, SHORT_COUNT);
    }
    return shuffled(QUESTIONS); // full mode: every question, random order
  }

  function startQuiz() {
    state.name = sanitizeName($("name-input").value);
    const modeEl = document.querySelector('input[name="mode"]:checked');
    state.mode = modeEl ? modeEl.value : "short";
    state.questions = buildQuestionSet(state.mode);
    state.index = 0;
    state.answers = new Array(state.questions.length).fill(null);
    show("screen-quiz");
    renderQuestion();
  }

  /* --------------------------------------------------------- render quiz */
  let typeTimer = null;

  function renderQuestion() {
    const total = state.questions.length;
    const q = state.questions[state.index];

    // progress
    $("progress-label").textContent = `question ${state.index + 1} / ${total}`;
    const pct = Math.round((state.index / total) * 100);
    const fill = $("progress-fill");
    fill.style.width = pct + "%";
    fill.parentElement.setAttribute("aria-valuenow", String(pct));

    $("q-tag").textContent = "// probing " + (q.shapes || "you");

    // typewriter effect for the question text (respects reduced-motion)
    const qEl = $("q-text");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (typeTimer) clearInterval(typeTimer);
    if (reduce) {
      qEl.textContent = q.text;
    } else {
      qEl.textContent = "";
      let i = 0;
      typeTimer = setInterval(() => {
        qEl.textContent = q.text.slice(0, i + 1);
        i++;
        if (i >= q.text.length) clearInterval(typeTimer);
      }, 14);
    }

    // options
    const box = $("options");
    box.innerHTML = "";
    q.options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.className = "option" + (state.answers[state.index] === idx ? " selected" : "");
      btn.type = "button";
      btn.setAttribute("role", "radio");
      btn.setAttribute("aria-checked", state.answers[state.index] === idx ? "true" : "false");

      const key = document.createElement("span");
      key.className = "key";
      key.textContent = `[${idx + 1}]`;
      const label = document.createElement("span");
      label.textContent = opt.text; // textContent => no HTML injection

      btn.appendChild(key);
      btn.appendChild(label);
      btn.addEventListener("click", () => choose(idx));
      box.appendChild(btn);
    });

    $("back-btn").disabled = state.index === 0;
  }

  function choose(optIdx) {
    state.answers[state.index] = optIdx;
    // brief highlight, then advance (or finish)
    renderQuestion();
    window.setTimeout(() => {
      if (state.index < state.questions.length - 1) {
        state.index++;
        renderQuestion();
      } else {
        finish();
      }
    }, 140);
  }

  function goBack() {
    if (state.index > 0) {
      state.index--;
      renderQuestion();
    }
  }

  /* ------------------------------------------------------------- scoring */
  function emptyScores(keys) {
    const o = {};
    for (const k of keys) o[k] = 0;
    return o;
  }

  function computeResult() {
    const classScore = emptyScores(Object.keys(CLASSES));
    const raceScore = emptyScores(Object.keys(RACES));
    const statScore = emptyScores(STAT_ORDER);
    // Track each bucket's single strongest contribution, for tie-breaking.
    const classMax = emptyScores(Object.keys(CLASSES));
    const raceMax = emptyScores(Object.keys(RACES));

    state.questions.forEach((q, i) => {
      const ans = state.answers[i];
      if (ans === null) return;
      const opt = q.options[ans];
      addWeights(opt.class, classScore, classMax);
      addWeights(opt.race, raceScore, raceMax);
      if (opt.stats) for (const s in opt.stats) statScore[s] = (statScore[s] || 0) + opt.stats[s];
    });

    // Fairness normalization: a class/race that appears in MANY options has an
    // unfair advantage just by being everywhere. Divide each raw score by the
    // sqrt of that bucket's "reach" (max points it could earn across the asked
    // questions). sqrt keeps rare-but-matched buckets competitive without wildly
    // over-rewarding a single lucky niche hit. Computed from the data, so it
    // self-corrects as you edit content. See REACH_NOTE in README.
    const classReach = computeReach("class", state.questions);
    const raceReach = computeReach("race", state.questions);
    const classNorm = normalize(classScore, classReach);
    const raceNorm = normalize(raceScore, raceReach);

    const [topClass, runnerClass] = rank(classNorm, classMax, TIEBREAKER_PRIORITY.class);
    const [topRace, runnerRace] = rank(raceNorm, raceMax, TIEBREAKER_PRIORITY.race);

    return {
      topClass, runnerClass, topRace, runnerRace,
      classScore: classNorm, raceScore: raceNorm, statScore,
    };
  }

  /** For each bucket, the max points it could earn across the asked questions
   *  (sum over questions of the single best option's weight for that bucket). */
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
    for (const k in scores) {
      const r = reach[k] || 0;
      out[k] = r > 0 ? scores[k] / Math.sqrt(r) : 0;
    }
    return out;
  }

  function addWeights(map, totals, maxes) {
    if (!map) return;
    for (const k in map) {
      const v = map[k];
      if (!(k in totals)) continue; // ignore unknown keys gracefully
      totals[k] += v;
      if (v > maxes[k]) maxes[k] = v;
    }
  }

  /** Rank buckets: by total desc, then by strongest single contribution desc,
   *  then by TIEBREAKER_PRIORITY (earlier wins). Returns [winner, runnerUp]. */
  function rank(totals, maxes, priority) {
    const keys = Object.keys(totals);
    keys.sort((a, b) => {
      if (totals[b] !== totals[a]) return totals[b] - totals[a];
      if (maxes[b] !== maxes[a]) return maxes[b] - maxes[a];
      return priority.indexOf(a) - priority.indexOf(b);
    });
    return [keys[0], keys[1]];
  }

  /* -------------------------------------------------------- render result */
  function finish() {
    const r = computeResult();
    const cls = CLASSES[r.topClass];
    const race = RACES[r.topRace];

    $("result-greeting").textContent =
      state.name === "anonymous"
        ? "the scan resolved your signal:"
        : `${state.name}, the scan resolved your signal:`;

    $("res-class").textContent = r.topClass;
    $("res-subclass").textContent = "likely path: " + cls.subclass;
    $("res-race").textContent = r.topRace;
    $("res-race-source").textContent = "source: " + race.source;
    $("res-align").textContent = cls.alignment;

    // lore readout explains WHY (combines class + race blurbs)
    $("res-lore").textContent =
      `You read as a ${r.topRace} ${r.topClass}: ${cls.blurb} As a ${r.topRace}, you're ${race.note}`;

    // stats
    renderStats(r.statScore);

    // strengths / weaknesses
    fillList("res-strengths", cls.strengths);
    fillList("res-weaknesses", cls.weaknesses);

    // runner-up
    $("res-runner-class").textContent = r.runnerClass || "—";
    $("res-runner-race").textContent = r.runnerRace || "—";

    // stash a compact result for the copy button
    state.lastResult = r;

    $("copy-note").textContent = "";
    show("screen-result");
  }

  function fillList(id, items) {
    const ul = $(id);
    ul.innerHTML = "";
    (items || []).forEach((t) => {
      const li = document.createElement("li");
      li.textContent = t;
      ul.appendChild(li);
    });
  }

  function renderStats(statScore) {
    // Normalize raw points into a readable 8–18 D&D-style range for display.
    const vals = STAT_ORDER.map((s) => statScore[s] || 0);
    const max = Math.max(1, ...vals);
    const box = $("res-stats");
    box.innerHTML = "";
    STAT_ORDER.forEach((s) => {
      const raw = statScore[s] || 0;
      const score = 8 + Math.round((raw / max) * 10); // 8..18
      const pct = Math.round(((score - 8) / 10) * 100);

      const row = document.createElement("div");
      row.className = "stat-row";
      const name = document.createElement("span");
      name.className = "stat-name";
      name.textContent = s;
      const bar = document.createElement("div");
      bar.className = "stat-bar";
      const fillEl = document.createElement("div");
      fillEl.className = "stat-fill";
      fillEl.style.width = pct + "%";
      bar.appendChild(fillEl);
      const val = document.createElement("span");
      val.className = "stat-val";
      val.textContent = String(score);
      val.title = STAT_NAMES[s];

      row.appendChild(name); row.appendChild(bar); row.appendChild(val);
      box.appendChild(row);
    });
  }

  /* --------------------------------------------------------------- copy */
  function copyResult() {
    const r = state.lastResult;
    if (!r) return;
    const cls = CLASSES[r.topClass];
    const text =
      `CHARACTER.SYS result for ${state.name}\n` +
      `Class: ${r.topClass} (${cls.subclass}) · ${cls.alignment}\n` +
      `Species: ${r.topRace} [${RACES[r.topRace].source}]\n` +
      `Runner-up: ${r.runnerClass} / ${r.runnerRace}\n` +
      `Stats: ` + STAT_ORDER.map((s) => `${s} ${8 + Math.round(((r.statScore[s]||0) / Math.max(1, ...STAT_ORDER.map(x=>r.statScore[x]||0))) * 10)}`).join(" ");
    const done = () => { $("copy-note").textContent = "✓ copied to clipboard"; };
    const fail = () => { $("copy-note").textContent = "clipboard unavailable — select and copy manually"; };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(fail);
    } else {
      fail();
    }
  }

  /* ------------------------------------------------------------- restart */
  function restart() {
    if (typeTimer) clearInterval(typeTimer);
    state.index = 0;
    state.answers = [];
    show("screen-intro");
  }

  /* --------------------------------------------------------- keyboard */
  function onKey(e) {
    if (!$("screen-quiz").classList.contains("hidden")) {
      const q = state.questions[state.index];
      if (!q) return;
      if (e.key >= "1" && e.key <= "5") {
        const idx = Number(e.key) - 1;
        if (idx < q.options.length) { e.preventDefault(); choose(idx); }
      } else if (e.key === "Backspace") {
        e.preventDefault(); goBack();
      }
    }
  }

  /* --------------------------------------------------------------- init */
  function init() {
    $("start-btn").addEventListener("click", startQuiz);
    $("back-btn").addEventListener("click", goBack);
    $("restart-btn").addEventListener("click", restart);
    $("restart-btn-quiz").addEventListener("click", restart);
    $("copy-btn").addEventListener("click", copyResult);
    document.addEventListener("keydown", onKey);

    // Enter on the name field starts the quiz
    $("name-input").addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); startQuiz(); }
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
