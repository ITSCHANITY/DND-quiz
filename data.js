/* ===========================================================================
   data.js — ALL editable content for CHARACTER.SYS.
   Edit this file to add/change classes, races, and questions WITHOUT touching
   app.js. The logic reads these structures generically.

   SCORING MODEL (summary — full walkthrough in README):
   - Every answer option carries weight maps:
       class:  { Fighter: 2, Barbarian: 1, ... }   // how you ACT / solve problems
       race:   { Human: 2, Dwarf: 1, ... }          // temperament / values / lifestyle
       stats:  { STR: 1, CHA: 2, ... }              // ability-score leanings
   - Selecting an option ADDS those numbers to running totals.
   - Highest class total = your class; highest race total = your species.
   - Ties are broken by TIEBREAKER_PRIORITY below (lower index wins), after
     first checking the single strongest contribution (see app.js).
   Keep weights small (0–3). Spread them across several buckets so no single
   answer dumps everything into one class/race — that keeps results balanced.
   =========================================================================== */

/* ------------------------------------------------------------------ CLASSES */
const CLASSES = {
  Artificer: {
    subclass: "Artillerist / Battle Smith",
    alignment: "Lawful Neutral",
    strengths: ["Inventive problem-solver", "Prepared for anything", "Turns ideas into tools"],
    weaknesses: ["Overthinks the simple", "Impatient with inefficiency"],
    blurb: "a tinkerer who treats the world like a system to be improved — you fix things, build things, and trust what you can measure.",
  },
  Barbarian: {
    subclass: "Path of the Berserker / Totem Warrior",
    alignment: "Chaotic Neutral",
    strengths: ["Fearless under pressure", "Acts decisively", "Immense resilience"],
    weaknesses: ["Runs hot", "Little patience for red tape"],
    blurb: "raw, direct, and unstoppable once committed — you meet problems head-on and feel things at full volume.",
  },
  Bard: {
    subclass: "College of Lore / Glamour",
    alignment: "Chaotic Good",
    strengths: ["Reads people instantly", "Adapts to any room", "Inspires others"],
    weaknesses: ["Scattered focus", "Craves attention"],
    blurb: "a natural performer and connector — you move through life on charm, stories, and the ability to make anyone feel seen.",
  },
  Cleric: {
    subclass: "Life / Knowledge Domain",
    alignment: "Lawful Good",
    strengths: ["Steady moral compass", "Supports the group", "Calm in crisis"],
    weaknesses: ["Self-sacrificing to a fault", "Rigid about principles"],
    blurb: "devoted and dependable — you anchor the people around you to something larger than themselves.",
  },
  Druid: {
    subclass: "Circle of the Land / Moon",
    alignment: "Neutral Good",
    strengths: ["Deep empathy for living things", "Patient", "Comfortable alone"],
    weaknesses: ["Wary of crowds and cities", "Slow to trust the artificial"],
    blurb: "rooted in the natural world — you find clarity outdoors and distrust what's loud, fast, and manufactured.",
  },
  Fighter: {
    subclass: "Battle Master / Champion",
    alignment: "Lawful Neutral",
    strengths: ["Disciplined", "Reliable under stress", "Masters fundamentals"],
    weaknesses: ["Can be inflexible", "Values order over imagination"],
    blurb: "a dependable professional — you win through preparation, repetition, and showing up every single day.",
  },
  Monk: {
    subclass: "Way of the Open Hand / Shadow",
    alignment: "Lawful Neutral",
    strengths: ["Self-mastery", "Focused and calm", "Needs little to be content"],
    weaknesses: ["Overly controlled", "Hard on yourself"],
    blurb: "disciplined and inward — you pursue mastery of yourself before the world, and find power in restraint.",
  },
  Paladin: {
    subclass: "Oath of Devotion / Vengeance",
    alignment: "Lawful Good",
    strengths: ["Unshakable conviction", "Protects others", "Leads by example"],
    weaknesses: ["Black-and-white thinking", "Takes on too much"],
    blurb: "driven by a code — you hold yourself and others to a standard, and you'll stand in front of the people you love.",
  },
  Ranger: {
    subclass: "Hunter / Gloom Stalker",
    alignment: "Neutral Good",
    strengths: ["Self-reliant", "Observant", "Thrives in the in-between"],
    weaknesses: ["Keeps people at arm's length", "Restless indoors"],
    blurb: "a capable loner who bridges the wild and the civilized — watchful, prepared, and happiest with room to roam.",
  },
  Rogue: {
    subclass: "Thief / Arcane Trickster",
    alignment: "Chaotic Neutral",
    strengths: ["Quick-witted", "Adaptable", "Finds the angle others miss"],
    weaknesses: ["Bends rules", "Trust issues"],
    blurb: "clever and self-directed — you read the room, find the shortcut, and keep a card or two up your sleeve.",
  },
  Sorcerer: {
    subclass: "Wild Magic / Draconic Bloodline",
    alignment: "Chaotic Good",
    strengths: ["Intuitive", "Expressive", "Power comes naturally"],
    weaknesses: ["Impulsive", "Struggles with structure"],
    blurb: "you run on instinct and feeling — talent that was simply born in you, sometimes bigger than your control of it.",
  },
  Warlock: {
    subclass: "The Fiend / The Great Old One",
    alignment: "Neutral",
    strengths: ["Ambitious", "Pragmatic", "Makes bold bargains"],
    weaknesses: ["Ends-justify-means streak", "Keeps secrets"],
    blurb: "you chase power and knowledge on your own terms, willing to make hard trades others won't to get where you're going.",
  },
  Wizard: {
    subclass: "School of Divination / Evocation",
    alignment: "Lawful Neutral",
    strengths: ["Relentlessly curious", "Methodical", "Deep knowledge"],
    weaknesses: ["Analysis paralysis", "Lives in your head"],
    blurb: "a scholar to the core — you believe anything can be understood with enough study, and you love the understanding itself.",
  },
};

/* --------------------------------------------------------------------- RACES
   Each race: source attribution + a short temperament/lore note.
   (Core PHB + major sourcebooks; the JSON makes adding the long tail easy.) */
const RACES = {
  Human:       { source: "Player's Handbook", note: "adaptable, ambitious, and endlessly varied — you meet life on its own terms." },
  Elf:         { source: "Player's Handbook", note: "graceful and long-viewed; you value refinement and don't rush." },
  Dwarf:       { source: "Player's Handbook", note: "sturdy and traditional; loyalty, craft, and memory matter to you." },
  Halfling:    { source: "Player's Handbook", note: "warm, grounded, and content; comfort and community over glory." },
  Gnome:       { source: "Player's Handbook", note: "bright-eyed and inventive; curiosity is your default state." },
  "Half-Elf":  { source: "Player's Handbook", note: "a bridge between worlds; charming, flexible, never quite one thing." },
  "Half-Orc":  { source: "Player's Handbook", note: "intense and big-hearted; you feel strongly and endure hard things." },
  Dragonborn:  { source: "Player's Handbook", note: "proud and principled; your word and your honor are the same thing." },
  Tiefling:    { source: "Player's Handbook", note: "self-possessed outsider; you've learned to own who you are." },
  Aasimar:     { source: "Volo's Guide to Monsters", note: "quietly radiant; you feel called to do good even when it costs you." },
  Genasi:      { source: "Elemental Evil / Monsters of the Multiverse", note: "elemental and moody; your inner weather runs hot, cold, or wild." },
  Goliath:     { source: "Volo's Guide / Elemental Evil", note: "competitive and fair; you measure yourself against the challenge, not others." },
  Tabaxi:      { source: "Volo's Guide to Monsters", note: "curious wanderer; novelty pulls you onward, then the next thing." },
  Firbolg:     { source: "Volo's Guide to Monsters", note: "gentle and private; you'd rather tend and protect than be seen." },
  Kenku:       { source: "Volo's Guide to Monsters", note: "observant mimic; you learn by copying and find your own voice slowly." },
  Triton:      { source: "Volo's Guide to Monsters", note: "dutiful guardian; you carry responsibility with a touch of pride." },
  Lizardfolk:  { source: "Volo's Guide to Monsters", note: "coolly rational; you see clearly because you don't let feeling cloud it." },
  Orc:         { source: "Volo's Guide / Monsters of the Multiverse", note: "driven and tireless; you push through where others stop." },
  Goblin:      { source: "Volo's Guide to Monsters", note: "scrappy and resourceful; you survive by being quick and clever." },
  Hobgoblin:   { source: "Volo's Guide to Monsters", note: "organized and disciplined; structure and the team come first." },
  Bugbear:     { source: "Volo's Guide to Monsters", note: "patient and sudden; you wait, watch, then move decisively." },
  Kobold:      { source: "Volo's Guide to Monsters", note: "clever collaborator; you're stronger as part of something." },
  "Yuan-ti":   { source: "Volo's Guide to Monsters", note: "calm and calculating; emotion rarely steers your decisions." },
  Tortle:      { source: "The Tortle Package", note: "unhurried and self-contained; you carry home with you and need little." },
  Aarakocra:   { source: "Elemental Evil", note: "free-spirited and restless; you need open sky and hate being boxed in." },
  Githyanki:   { source: "Monsters of the Multiverse", note: "fierce and exacting; you train relentlessly and aim high." },
  Githzerai:   { source: "Monsters of the Multiverse", note: "serene and disciplined; you master your mind before the world." },
  Changeling:  { source: "Eberron: Rising from the Last War", note: "fluid and perceptive; you shift to fit, and value that freedom." },
  Shifter:     { source: "Eberron: Rising from the Last War", note: "instinctive and loyal; your feelings live close to the surface." },
  Warforged:   { source: "Eberron: Rising from the Last War", note: "purpose-built and steady; you're defining who you are by choice." },
  Kalashtar:   { source: "Eberron: Rising from the Last War", note: "empathic and composed; you carry a quiet inner voice of conscience." },
  Centaur:     { source: "Guildmasters' Guide to Ravnica", note: "open and tireless; you move through life at a steady gallop." },
  Loxodon:     { source: "Guildmasters' Guide to Ravnica", note: "calm and remembering; patience and loyalty define you." },
  "Simic Hybrid": { source: "Guildmasters' Guide to Ravnica", note: "experimental and evolving; you adapt yourself to meet the moment." },
  Vedalken:    { source: "Guildmasters' Guide to Ravnica", note: "coolly logical and precise; you pursue perfection and trust reason over feeling." },
  Fairy:       { source: "The Wild Beyond the Witchlight", note: "playful and bright; wonder is your natural resting state." },
  Harengon:    { source: "The Wild Beyond the Witchlight", note: "alert and quick; you're always a step ahead and ready to bound." },
  Owlin:       { source: "Strixhaven", note: "watchful and thoughtful; you observe more than you speak." },
  Satyr:       { source: "Mythic Odysseys of Theros", note: "exuberant and sensory; you chase joy, music, and good company." },
};

/* ----------------------------------------------------------------- QUESTIONS
   `shapes` is a hint tag shown as "// probing <shapes>". `pool: "short"` marks
   the ~15 questions used in SHORT mode (full mode uses all of them).
   Each option: { text, class:{}, race:{}, stats:{} }.  (any map may be omitted) */
const QUESTIONS = [
  /* ---------- SOCIAL STYLE ---------- */
  {
    id: "social_energy", pool: "short", shapes: "social style",
    text: "It's a Friday night with nothing planned. What actually sounds good?",
    options: [
      { text: "A big night out with a crowd of people", class: { Bard: 2, Sorcerer: 2 }, race: { "Half-Elf": 2, Satyr: 2 }, stats: { CHA: 2 } },
      { text: "A few close friends, low-key", class: { Cleric: 1, Fighter: 1, Bard: 1 }, race: { Halfling: 2, Human: 1, Loxodon: 1 }, stats: { CHA: 1, WIS: 1 } },
      { text: "Alone with a project, book, or game", class: { Wizard: 2, Artificer: 1, Monk: 1 }, race: { Gnome: 1, Owlin: 2, Warforged: 1 }, stats: { INT: 2 } },
      { text: "Outside, away from everyone, just me", class: { Ranger: 2, Druid: 2 }, race: { Firbolg: 2, Tortle: 1, Aarakocra: 1 }, stats: { WIS: 2 } },
    ],
  },
  {
    id: "new_room", pool: "short", shapes: "social style",
    text: "You walk into a room full of strangers. What do you do?",
    options: [
      { text: "Work the room — I'll know half of them by the end", class: { Bard: 3 }, race: { "Half-Elf": 2, Satyr: 1 }, stats: { CHA: 2 } },
      { text: "Find one person and have a real conversation", class: { Cleric: 1, Warlock: 1, Druid: 1 }, race: { Kalashtar: 2, Loxodon: 1 }, stats: { WIS: 1, CHA: 1 } },
      { text: "Hang back, watch, and read the room first", class: { Rogue: 2, Ranger: 1, Monk: 1 }, race: { Bugbear: 3, Owlin: 2, Kenku: 1 }, stats: { WIS: 1, DEX: 1 } },
      { text: "Stick to whoever I came with", class: { Fighter: 1, Barbarian: 1 }, race: { Halfling: 2, Dwarf: 1, Shifter: 1 }, stats: { CON: 1 } },
    ],
  },
  {
    id: "meet_people", shapes: "social style",
    text: "How do you usually come across to people who just met you?",
    options: [
      { text: "Warm and easy to talk to", class: { Bard: 2, Cleric: 1 }, race: { Halfling: 2, "Half-Elf": 1 }, stats: { CHA: 2 } },
      { text: "A bit reserved until I trust you", class: { Ranger: 1, Monk: 1, Druid: 1 }, race: { Elf: 2, Firbolg: 1, "Yuan-ti": 1 }, stats: { WIS: 1 } },
      { text: "Intense or intimidating at first", class: { Barbarian: 2, Paladin: 1, Warlock: 1 }, race: { "Half-Orc": 2, Githyanki: 1, Orc: 1 }, stats: { STR: 1, CHA: 1 } },
      { text: "Hard to read — people aren't sure", class: { Rogue: 2, Warlock: 1 }, race: { Changeling: 2, Kenku: 1, Tiefling: 1 }, stats: { DEX: 1 } },
    ],
  },

  /* ---------- DECISION-MAKING ---------- */
  {
    id: "decide", pool: "short", shapes: "decision-making",
    text: "You've got a big decision to make. How do you make it?",
    options: [
      { text: "Research everything until I'm certain", class: { Wizard: 3, Artificer: 1 }, race: { Gnome: 2, Vedalken: 1, Owlin: 1 }, stats: { INT: 2 } },
      { text: "Go with my gut — I usually just know", class: { Sorcerer: 3, Barbarian: 1 }, race: { Genasi: 2, Shifter: 1, Tiefling: 1 }, stats: { CHA: 1 } },
      { text: "Ask people I trust and weigh their input", class: { Cleric: 2, Bard: 1 }, race: { Kobold: 2, Loxodon: 1, Human: 1 }, stats: { WIS: 1, CHA: 1 } },
      { text: "Weigh the logic coldly and commit", class: { Fighter: 1, Monk: 1, Warlock: 1 }, race: { Lizardfolk: 2, "Yuan-ti": 2, Githzerai: 1 }, stats: { INT: 1 } },
    ],
  },
  {
    id: "wrong_argument", pool: "short", shapes: "moral values",
    text: "You realize mid-argument that you're actually wrong. What happens next?",
    options: [
      { text: "I admit it right away — truth matters more than my ego", class: { Cleric: 2, Paladin: 2 }, race: { Aasimar: 2, Kalashtar: 1 }, stats: { WIS: 1, CHA: 1 } },
      { text: "I concede, but quietly, and move on", class: { Monk: 2, Druid: 1 }, race: { Tortle: 2, Githzerai: 1 }, stats: { WIS: 1 } },
      { text: "I'll admit it later once I've cooled off", class: { Fighter: 1, Ranger: 1, Barbarian: 1 }, race: { Dwarf: 2, "Half-Orc": 1 }, stats: { CON: 1 } },
      { text: "I find a way to still come out okay", class: { Rogue: 2, Warlock: 1, Bard: 1 }, race: { Changeling: 1, Tiefling: 2, "Yuan-ti": 1 }, stats: { CHA: 1 } },
    ],
  },
  {
    id: "plan_or_wing", shapes: "decision-making",
    text: "A trip or event is coming up. Are you a planner?",
    options: [
      { text: "Detailed itinerary, backups for the backups", class: { Wizard: 2, Artificer: 2, Fighter: 1 }, race: { Dwarf: 1, Hobgoblin: 2, Vedalken: 1 }, stats: { INT: 1 } },
      { text: "Rough plan, happy to improvise", class: { Ranger: 1, Rogue: 1, Bard: 1 }, race: { Human: 2, "Half-Elf": 1 }, stats: { DEX: 1 } },
      { text: "I'll figure it out when I get there", class: { Sorcerer: 2, Barbarian: 1 }, race: { Tabaxi: 2, Satyr: 1, Aarakocra: 1 }, stats: { CHA: 1 } },
      { text: "I'd rather someone else plan it", class: { Cleric: 1, Monk: 1 }, race: { Halfling: 2, Kobold: 1 }, stats: { WIS: 1 } },
    ],
  },

  /* ---------- STRESS RESPONSE ---------- */
  {
    id: "stressed", pool: "short", shapes: "stress response",
    text: "You're genuinely stressed out. What do you reach for?",
    options: [
      { text: "Exercise or something physical to burn it off", class: { Barbarian: 2, Monk: 1, Fighter: 1 }, race: { Goliath: 2, "Half-Orc": 1, Centaur: 1 }, stats: { STR: 1, CON: 1 } },
      { text: "Quiet and solitude to reset", class: { Monk: 2, Druid: 1, Wizard: 1 }, race: { Tortle: 2, Firbolg: 1, Githzerai: 1 }, stats: { WIS: 2 } },
      { text: "Talk it out with someone", class: { Bard: 2, Cleric: 1 }, race: { "Half-Elf": 1, Kalashtar: 2 }, stats: { CHA: 1 } },
      { text: "Throw myself into a task or hobby", class: { Artificer: 2, Rogue: 1 }, race: { Gnome: 2, Warforged: 1 }, stats: { INT: 1 } },
    ],
  },
  {
    id: "crisis", pool: "short", shapes: "stress response",
    text: "Something goes wrong fast and everyone's panicking. You...",
    options: [
      { text: "Take charge and start giving direction", class: { Paladin: 2, Fighter: 2 }, race: { Dragonborn: 2, Hobgoblin: 1, Human: 1 }, stats: { CHA: 1, STR: 1 } },
      { text: "Go calm and focused while others spin", class: { Monk: 2, Cleric: 1, Wizard: 1 }, race: { Githzerai: 2, Kalashtar: 1, Loxodon: 1 }, stats: { WIS: 2 } },
      { text: "Act on instinct before I even think", class: { Barbarian: 2, Sorcerer: 1 }, race: { Harengon: 3, Shifter: 1, Genasi: 1 }, stats: { DEX: 1, STR: 1 } },
      { text: "Quietly find the exit or the fix no one sees", class: { Rogue: 2, Ranger: 1, Artificer: 1 }, race: { Bugbear: 2, Goblin: 2, Lizardfolk: 1 }, stats: { DEX: 1, INT: 1 } },
    ],
  },
  {
    id: "anger", shapes: "stress response",
    text: "How does your anger usually show up?",
    options: [
      { text: "Loud and fast, then it's over", class: { Barbarian: 3 }, race: { "Half-Orc": 2, Orc: 1, Genasi: 1 }, stats: { STR: 1 } },
      { text: "Cold and quiet — you'll feel it", class: { Warlock: 2, Rogue: 1, Monk: 1 }, race: { "Yuan-ti": 2, Githyanki: 1, Tiefling: 1 }, stats: { INT: 1 } },
      { text: "I bottle it and let it out alone later", class: { Druid: 1, Ranger: 1, Monk: 1 }, race: { Firbolg: 2, Tortle: 1 }, stats: { WIS: 1 } },
      { text: "I rarely get angry — I let it go", class: { Cleric: 1, Monk: 2 }, race: { Loxodon: 2, Kalashtar: 1, Halfling: 1 }, stats: { WIS: 1, CON: 1 } },
    ],
  },

  /* ---------- DISCIPLINE ---------- */
  {
    id: "learn", pool: "short", shapes: "discipline / curiosity",
    text: "You want to get good at something new. How do you actually learn it?",
    options: [
      { text: "Read, study, understand the theory first", class: { Wizard: 3 }, race: { Gnome: 1, Vedalken: 2, Owlin: 1 }, stats: { INT: 2 } },
      { text: "Drill it daily — reps until it's automatic", class: { Monk: 2, Fighter: 2 }, race: { Hobgoblin: 2, Githyanki: 1, Dwarf: 1 }, stats: { CON: 1, DEX: 1 } },
      { text: "Just dive in and learn by doing", class: { Barbarian: 1, Sorcerer: 1, Rogue: 1 }, race: { Human: 1, Tabaxi: 2 }, stats: { DEX: 1 } },
      { text: "Take it apart and tinker until it clicks", class: { Artificer: 3 }, race: { Gnome: 2, "Simic Hybrid": 1, Warforged: 1 }, stats: { INT: 1 } },
    ],
  },
  {
    id: "routine", shapes: "discipline",
    text: "How's your relationship with routine and structure?",
    options: [
      { text: "I live by it — order keeps me sane", class: { Fighter: 2, Monk: 1, Paladin: 1 }, race: { Dwarf: 2, Hobgoblin: 1, Warforged: 1 }, stats: { CON: 1 } },
      { text: "Some structure, with room to breathe", class: { Cleric: 1, Ranger: 1, Wizard: 1 }, race: { Human: 2, Elf: 1 }, stats: { WIS: 1 } },
      { text: "Routine bores me — I need variety", class: { Bard: 2, Sorcerer: 1, Rogue: 1 }, race: { Tabaxi: 2, Satyr: 1, Changeling: 1 }, stats: { CHA: 1 } },
      { text: "I rebel against it almost on principle", class: { Barbarian: 2, Warlock: 1 }, race: { Aarakocra: 2, Tiefling: 1 }, stats: { STR: 1 } },
    ],
  },
  {
    id: "finish", shapes: "discipline",
    text: "You start a lot of things. How many do you finish?",
    options: [
      { text: "I finish what I start, always", class: { Fighter: 2, Paladin: 2 }, race: { Dwarf: 2, Warforged: 1, Tortle: 1 }, stats: { CON: 2 } },
      { text: "Most of them, if I stay interested", class: { Ranger: 1, Cleric: 1, Artificer: 1 }, race: { Human: 2 }, stats: { WIS: 1 } },
      { text: "I jump to the next shiny thing a lot", class: { Bard: 1, Sorcerer: 2 }, race: { Tabaxi: 2, Fairy: 1, Gnome: 1 }, stats: { CHA: 1 } },
      { text: "I finish when it's genuinely mine to finish", class: { Rogue: 1, Warlock: 2 }, race: { Changeling: 1, "Half-Elf": 1, Tiefling: 1 }, stats: { INT: 1 } },
    ],
  },

  /* ---------- CREATIVITY / CURIOSITY ---------- */
  {
    id: "create", pool: "short", shapes: "creativity",
    text: "Which of these is most 'you'?",
    options: [
      { text: "Making things — art, music, writing, building", class: { Bard: 2, Artificer: 2 }, race: { Gnome: 1, Satyr: 1, "Simic Hybrid": 1 }, stats: { CHA: 1, INT: 1 } },
      { text: "Understanding things — how and why they work", class: { Wizard: 3 }, race: { Vedalken: 2, Owlin: 1 }, stats: { INT: 2 } },
      { text: "Mastering things — a craft, a skill, my body", class: { Monk: 2, Fighter: 1 }, race: { Githyanki: 1, Goliath: 1, Dwarf: 1 }, stats: { DEX: 1, STR: 1 } },
      { text: "Experiencing things — travel, people, thrills", class: { Rogue: 1, Ranger: 1, Barbarian: 1 }, race: { Tabaxi: 2, Aarakocra: 1, Human: 1 }, stats: { DEX: 1 } },
    ],
  },
  {
    id: "curiosity", pool: "short", shapes: "curiosity",
    text: "A topic you know nothing about comes up. Your reaction?",
    options: [
      { text: "I go down a rabbit hole for hours", class: { Wizard: 2, Artificer: 1 }, race: { Gnome: 2, Owlin: 1, Vedalken: 1 }, stats: { INT: 2 } },
      { text: "Mild interest, I'll look it up sometime", class: { Ranger: 1, Fighter: 1 }, race: { Human: 2, Halfling: 1 }, stats: { WIS: 1 } },
      { text: "Only if it's useful to me", class: { Warlock: 2, Rogue: 1 }, race: { "Yuan-ti": 1, Lizardfolk: 2 }, stats: { INT: 1 } },
      { text: "I'd rather experience it than read about it", class: { Barbarian: 1, Sorcerer: 1, Bard: 1 }, race: { Tabaxi: 2, Satyr: 1 }, stats: { CHA: 1 } },
    ],
  },
  {
    id: "music", shapes: "creativity / lifestyle",
    text: "Your taste in music / hobbies leans toward...",
    options: [
      { text: "Expressive, emotional, dramatic", class: { Bard: 2, Sorcerer: 1 }, race: { Satyr: 2, Tiefling: 1, Fairy: 1 }, stats: { CHA: 2 } },
      { text: "Complex, technical, intricate", class: { Wizard: 1, Artificer: 2 }, race: { Gnome: 1, Vedalken: 2 }, stats: { INT: 1 } },
      { text: "Hard, heavy, high-energy", class: { Barbarian: 2, Fighter: 1 }, race: { "Half-Orc": 1, Goliath: 2, Orc: 1 }, stats: { STR: 1 } },
      { text: "Calm, natural, grounding", class: { Druid: 2, Monk: 1 }, race: { Firbolg: 2, Loxodon: 1, Tortle: 1 }, stats: { WIS: 1 } },
    ],
  },

  /* ---------- LEADERSHIP ---------- */
  {
    id: "group_project", pool: "short", shapes: "leadership",
    text: "Group project, and someone clearly isn't pulling their weight. You...",
    options: [
      { text: "Step up and organize everyone, including them", class: { Paladin: 2, Fighter: 1, Bard: 1 }, race: { Human: 1, Dragonborn: 1, Hobgoblin: 2 }, stats: { CHA: 1 } },
      { text: "Quietly pick up the slack myself", class: { Cleric: 2, Monk: 1 }, race: { Loxodon: 2, Tortle: 1, Warforged: 1 }, stats: { CON: 1, WIS: 1 } },
      { text: "Talk to them directly about it", class: { Paladin: 1, Cleric: 1, Fighter: 1 }, race: { Dwarf: 1, Kalashtar: 1, Aasimar: 1 }, stats: { CHA: 1 } },
      { text: "Route around them and get it done", class: { Rogue: 2, Artificer: 1, Warlock: 1 }, race: { Goblin: 1, "Yuan-ti": 1, Lizardfolk: 1 }, stats: { INT: 1 } },
    ],
  },
  {
    id: "lead_follow", shapes: "leadership",
    text: "Honestly — do you prefer to lead or follow?",
    options: [
      { text: "Lead. I'd rather be responsible than wait around", class: { Paladin: 2, Fighter: 1, Bard: 1 }, race: { Dragonborn: 2, Githyanki: 1 }, stats: { CHA: 2 } },
      { text: "Support. I make the leader better", class: { Cleric: 2, Artificer: 1 }, race: { Kobold: 2, Kalashtar: 1, Halfling: 1 }, stats: { WIS: 1 } },
      { text: "Neither — I work best solo", class: { Ranger: 2, Rogue: 1, Wizard: 1 }, race: { Firbolg: 1, Tortle: 1, Aarakocra: 1 }, stats: { DEX: 1 } },
      { text: "Depends — I read the situation", class: { Monk: 1, Warlock: 1, Bard: 1 }, race: { Changeling: 2, "Half-Elf": 1 }, stats: { WIS: 1 } },
    ],
  },
  {
    id: "spotlight", shapes: "leadership / social",
    text: "How do you feel about being the center of attention?",
    options: [
      { text: "Love it — I come alive", class: { Bard: 3, Sorcerer: 1 }, race: { Satyr: 2, "Half-Elf": 1 }, stats: { CHA: 2 } },
      { text: "Fine when I've earned it", class: { Paladin: 1, Fighter: 1, Barbarian: 1 }, race: { Dragonborn: 2, Goliath: 1 }, stats: { CHA: 1 } },
      { text: "I'd rather influence from the edges", class: { Warlock: 2, Rogue: 1, Wizard: 1 }, race: { "Yuan-ti": 1, Kenku: 1, Changeling: 1 }, stats: { INT: 1 } },
      { text: "Please, no — put it on someone else", class: { Druid: 1, Monk: 1, Ranger: 1 }, race: { Firbolg: 2, Owlin: 1, Tortle: 1 }, stats: { WIS: 1 } },
    ],
  },

  /* ---------- RISK-TAKING ---------- */
  {
    id: "risk", pool: "short", shapes: "risk-taking",
    text: "How do you feel about risk?",
    options: [
      { text: "I chase it — safe is boring", class: { Barbarian: 2, Rogue: 1, Sorcerer: 1 }, race: { Tabaxi: 1, Aarakocra: 1, Genasi: 1 }, stats: { DEX: 1, STR: 1 } },
      { text: "Calculated risks, after I've done the math", class: { Artificer: 2, Wizard: 1, Warlock: 1 }, race: { Vedalken: 2, Lizardfolk: 1 }, stats: { INT: 2 } },
      { text: "I'll take a risk for something that matters", class: { Paladin: 2, Cleric: 1 }, race: { Aasimar: 2, Dragonborn: 1 }, stats: { CHA: 1 } },
      { text: "I avoid it — stability over thrills", class: { Fighter: 1, Monk: 1, Druid: 1 }, race: { Dwarf: 1, Halfling: 2, Tortle: 1 }, stats: { CON: 1 } },
    ],
  },
  {
    id: "money", shapes: "risk-taking / values",
    text: "A surprise windfall of money lands in your lap. You...",
    options: [
      { text: "Invest or save it — future me will thank me", class: { Artificer: 1, Wizard: 1, Fighter: 1 }, race: { Dwarf: 2, Vedalken: 1, Hobgoblin: 1 }, stats: { INT: 1 } },
      { text: "Spend it on an experience I'll remember", class: { Bard: 2, Sorcerer: 1 }, race: { Satyr: 2, Tabaxi: 1 }, stats: { CHA: 1 } },
      { text: "Share it with people I care about", class: { Cleric: 2, Paladin: 1 }, race: { Halfling: 2, Loxodon: 1, Aasimar: 1 }, stats: { WIS: 1 } },
      { text: "Use it to get ahead of where I am now", class: { Warlock: 2, Rogue: 1 }, race: { "Yuan-ti": 1, Orc: 1, Githyanki: 1 }, stats: { INT: 1 } },
    ],
  },
  {
    id: "comfort_zone", shapes: "risk-taking",
    text: "How often do you leave your comfort zone?",
    options: [
      { text: "Constantly — I get restless if I don't", class: { Barbarian: 1, Ranger: 1, Sorcerer: 1 }, race: { Tabaxi: 2, Harengon: 2, Aarakocra: 1 }, stats: { DEX: 1 } },
      { text: "Deliberately, in planned doses", class: { Monk: 2, Artificer: 1 }, race: { Githzerai: 1, Vedalken: 1, Githyanki: 1 }, stats: { WIS: 1 } },
      { text: "When something important pushes me", class: { Paladin: 1, Cleric: 1, Fighter: 1 }, race: { Dragonborn: 1, Human: 1, Aasimar: 1 }, stats: { CON: 1 } },
      { text: "Rarely — I like my comfort zone", class: { Druid: 1, Wizard: 1 }, race: { Halfling: 2, Tortle: 2, Firbolg: 1 }, stats: { CON: 1 } },
    ],
  },

  /* ---------- MORAL VALUES ---------- */
  {
    id: "rules", pool: "short", shapes: "moral values",
    text: "A rule is clearly unfair but following it is easier. You...",
    options: [
      { text: "Follow it — rules exist for a reason", class: { Fighter: 1, Paladin: 1, Cleric: 1 }, race: { Hobgoblin: 2, Triton: 2, Warforged: 1 }, stats: { CON: 1 } },
      { text: "Challenge it openly and try to change it", class: { Paladin: 2, Bard: 1 }, race: { Dragonborn: 1, Aasimar: 2 }, stats: { CHA: 1 } },
      { text: "Quietly ignore it and do what's right", class: { Rogue: 2, Druid: 1, Ranger: 1 }, race: { Tiefling: 1, Changeling: 1, Fairy: 1 }, stats: { DEX: 1 } },
      { text: "Bend it to my advantage", class: { Warlock: 2, Rogue: 1 }, race: { "Yuan-ti": 2, Goblin: 1 }, stats: { INT: 1 } },
    ],
  },
  {
    id: "help_stranger", shapes: "moral values / treat others",
    text: "A stranger clearly needs help, but it's inconvenient for you. You...",
    options: [
      { text: "Help — no question, every time", class: { Paladin: 2, Cleric: 2 }, race: { Aasimar: 2, Loxodon: 1 }, stats: { CHA: 1, WIS: 1 } },
      { text: "Help if it's not a huge cost to me", class: { Cleric: 1, Bard: 1, Ranger: 1 }, race: { Human: 1, Halfling: 2 }, stats: { WIS: 1 } },
      { text: "Hesitate — I've been burned before", class: { Rogue: 1, Warlock: 1, Monk: 1 }, race: { Kenku: 1, Tiefling: 2 }, stats: { INT: 1 } },
      { text: "Weigh if it's really my problem", class: { Warlock: 1, Wizard: 1 }, race: { Lizardfolk: 2, "Yuan-ti": 1 }, stats: { INT: 1 } },
    ],
  },
  {
    id: "ends_means", shapes: "moral values",
    text: "Do the ends justify the means?",
    options: [
      { text: "Never — how you do it IS the point", class: { Paladin: 2, Monk: 1, Cleric: 1 }, race: { Aasimar: 2, Githzerai: 1 }, stats: { WIS: 1 } },
      { text: "Usually not, but it's complicated", class: { Cleric: 1, Druid: 1, Wizard: 1 }, race: { Kalashtar: 1, Human: 1, Loxodon: 1 }, stats: { WIS: 1 } },
      { text: "Sometimes — results matter most", class: { Fighter: 1, Ranger: 1, Artificer: 1 }, race: { Hobgoblin: 1, Orc: 1 }, stats: { STR: 1 } },
      { text: "Often — I do what the goal requires", class: { Warlock: 3 }, race: { "Yuan-ti": 2, Githyanki: 1, Tiefling: 1 }, stats: { INT: 1 } },
    ],
  },

  /* ---------- RELATIONSHIP WITH NATURE ---------- */
  {
    id: "nature", pool: "short", shapes: "nature",
    text: "How do you feel about being out in nature?",
    options: [
      { text: "It's where I feel most myself", class: { Druid: 3, Ranger: 1 }, race: { Firbolg: 2, Centaur: 1, Shifter: 1 }, stats: { WIS: 2 } },
      { text: "Love a good trip, but I like coming home", class: { Ranger: 1, Barbarian: 1 }, race: { Human: 1, Goliath: 1, Halfling: 1 }, stats: { CON: 1 } },
      { text: "It's fine in small doses", class: { Bard: 1, Fighter: 1 }, race: { Elf: 1, "Half-Elf": 1 }, stats: { CHA: 1 } },
      { text: "I'm a creature of the city and comfort", class: { Wizard: 2, Artificer: 1, Warlock: 1 }, race: { Gnome: 1, Vedalken: 1, Warforged: 1 }, stats: { INT: 1 } },
    ],
  },
  {
    id: "animals", shapes: "nature / empathy",
    text: "Your relationship with animals is...",
    options: [
      { text: "Deep — I connect with them easily", class: { Druid: 2, Ranger: 2 }, race: { Shifter: 2, Firbolg: 1, Centaur: 1 }, stats: { WIS: 2 } },
      { text: "I love them, pets are family", class: { Cleric: 1, Bard: 1 }, race: { Halfling: 2, Loxodon: 1 }, stats: { WIS: 1 } },
      { text: "I like them fine from a distance", class: { Fighter: 1, Wizard: 1 }, race: { Human: 1, Elf: 1 }, stats: { CON: 1 } },
      { text: "Not really an animal person", class: { Warlock: 1, Artificer: 1 }, race: { Warforged: 2, "Yuan-ti": 1 }, stats: { INT: 1 } },
    ],
  },

  /* ---------- TRADITION VS CHANGE ---------- */
  {
    id: "tradition", pool: "short", shapes: "tradition vs change",
    text: "Tradition vs. doing things a new way — where do you land?",
    options: [
      { text: "Tradition — it's wisdom that survived", class: { Cleric: 2, Fighter: 1, Monk: 1 }, race: { Dwarf: 2, Elf: 1, Loxodon: 1 }, stats: { WIS: 1 } },
      { text: "Keep what works, change what doesn't", class: { Artificer: 1, Ranger: 1, Wizard: 1 }, race: { Human: 2, "Half-Elf": 1 }, stats: { INT: 1 } },
      { text: "New way — the old way is usually stale", class: { Sorcerer: 2, Bard: 1 }, race: { "Simic Hybrid": 2, Changeling: 1, Gnome: 1 }, stats: { CHA: 1 } },
      { text: "Burn it down and rebuild", class: { Barbarian: 2, Warlock: 1 }, race: { Tiefling: 1, Orc: 1, Genasi: 1 }, stats: { STR: 1 } },
    ],
  },
  {
    id: "roots", shapes: "tradition / background",
    text: "How connected do you feel to where you came from?",
    options: [
      { text: "Very — my roots are a huge part of me", class: { Cleric: 1, Paladin: 1, Barbarian: 1 }, race: { Dwarf: 2, Goliath: 1, Triton: 1 }, stats: { CON: 1 } },
      { text: "Connected, but I've grown beyond it", class: { Fighter: 1, Ranger: 1, Wizard: 1 }, race: { Human: 1, "Half-Elf": 1, Elf: 1 }, stats: { WIS: 1 } },
      { text: "I made my own identity from scratch", class: { Warlock: 1, Sorcerer: 1, Rogue: 1 }, race: { Warforged: 2, Changeling: 1, Tiefling: 1 }, stats: { INT: 1 } },
      { text: "I feel at home everywhere and nowhere", class: { Bard: 1, Ranger: 1 }, race: { Tabaxi: 1, Aarakocra: 1, "Half-Elf": 1 }, stats: { DEX: 1 } },
    ],
  },

  /* ---------- HOW THEY TREAT OTHERS ---------- */
  {
    id: "loyalty", pool: "short", shapes: "treat others",
    text: "When it comes to the people close to you, you're...",
    options: [
      { text: "Fiercely loyal — I'd take a hit for them", class: { Paladin: 2, Barbarian: 1, Fighter: 1 }, race: { "Half-Orc": 1, Dwarf: 1, Shifter: 1 }, stats: { STR: 1, CON: 1 } },
      { text: "Nurturing — I take care of my people", class: { Cleric: 2, Druid: 1 }, race: { Loxodon: 2, Firbolg: 1, Halfling: 1 }, stats: { WIS: 2 } },
      { text: "Loyal, but I keep some walls up", class: { Ranger: 1, Rogue: 1, Monk: 1 }, race: { Elf: 1, "Yuan-ti": 1, Kenku: 1 }, stats: { DEX: 1 } },
      { text: "Loyal to those who've earned it, not by default", class: { Warlock: 2, Rogue: 1 }, race: { Githyanki: 1, Tiefling: 1, Orc: 1 }, stats: { INT: 1 } },
    ],
  },
  {
    id: "conflict", shapes: "treat others",
    text: "A friend wrongs you. What's your move?",
    options: [
      { text: "Talk it through — I want to understand", class: { Cleric: 1, Bard: 1, Paladin: 1 }, race: { Kalashtar: 2, Aasimar: 1, "Half-Elf": 1 }, stats: { CHA: 1 } },
      { text: "Forgive, but I won't forget", class: { Monk: 1, Ranger: 1, Druid: 1 }, race: { Elf: 2, Tortle: 1 }, stats: { WIS: 1 } },
      { text: "Cut them off cleanly", class: { Warlock: 1, Rogue: 1, Barbarian: 1 }, race: { "Yuan-ti": 1, Githyanki: 1, Tiefling: 1 }, stats: { INT: 1 } },
      { text: "Confront it head-on, right now", class: { Barbarian: 2, Fighter: 1 }, race: { "Half-Orc": 2, Orc: 1, Dragonborn: 1 }, stats: { STR: 1 } },
    ],
  },
  {
    id: "praise", shapes: "treat others / values",
    text: "What kind of recognition actually means something to you?",
    options: [
      { text: "Knowing I did the right thing, even unseen", class: { Paladin: 2, Cleric: 1, Monk: 1 }, race: { Aasimar: 2, Githzerai: 1 }, stats: { WIS: 1 } },
      { text: "Respect from people I respect", class: { Fighter: 2, Ranger: 1 }, race: { Dwarf: 1, Goliath: 1, Githyanki: 1 }, stats: { CON: 1 } },
      { text: "Applause, praise, being admired", class: { Bard: 2, Sorcerer: 1 }, race: { Satyr: 1, "Half-Elf": 1, Fairy: 1 }, stats: { CHA: 2 } },
      { text: "Results — the win speaks for itself", class: { Warlock: 1, Artificer: 1, Rogue: 1 }, race: { "Simic Hybrid": 1, Vedalken: 1, Orc: 1 }, stats: { INT: 1 } },
    ],
  },

  /* ---------- SELF-IMAGE / MISC ---------- */
  {
    id: "self_image", shapes: "identity",
    text: "Which description fits how you see yourself best?",
    options: [
      { text: "The dependable one people lean on", class: { Fighter: 1, Cleric: 1, Paladin: 1 }, race: { Dwarf: 1, Loxodon: 1, Warforged: 1 }, stats: { CON: 1 } },
      { text: "The clever one who figures it out", class: { Wizard: 1, Rogue: 1, Artificer: 1 }, race: { Gnome: 1, Vedalken: 1, Goblin: 1 }, stats: { INT: 1 } },
      { text: "The free spirit who does their own thing", class: { Sorcerer: 1, Bard: 1, Ranger: 1 }, race: { Tabaxi: 1, Aarakocra: 1, Fairy: 1 }, stats: { CHA: 1 } },
      { text: "The quiet one with hidden depth", class: { Monk: 1, Druid: 1, Warlock: 1 }, race: { Firbolg: 1, Kenku: 1, Owlin: 1 }, stats: { WIS: 1 } },
    ],
  },
  {
    id: "energy_source", shapes: "temperament",
    text: "What genuinely recharges you?",
    options: [
      { text: "People and connection", class: { Bard: 2, Cleric: 1 }, race: { "Half-Elf": 1, Satyr: 1, Halfling: 1 }, stats: { CHA: 1 } },
      { text: "Solitude and quiet", class: { Monk: 1, Druid: 1, Wizard: 1 }, race: { Firbolg: 1, Owlin: 1, Tortle: 1 }, stats: { WIS: 1 } },
      { text: "Movement and doing", class: { Barbarian: 1, Ranger: 1, Monk: 1 }, race: { Goliath: 1, Centaur: 1, Shifter: 1 }, stats: { STR: 1 } },
      { text: "Learning and making", class: { Wizard: 1, Artificer: 2 }, race: { Gnome: 1, "Simic Hybrid": 1 }, stats: { INT: 1 } },
    ],
  },
  {
    id: "legacy", shapes: "values / ambition",
    text: "What would you most want to be remembered for?",
    options: [
      { text: "Being good — kind, fair, honorable", class: { Paladin: 2, Cleric: 1 }, race: { Aasimar: 2, Loxodon: 1 }, stats: { CHA: 1, WIS: 1 } },
      { text: "Creating something that lasts", class: { Artificer: 2, Wizard: 1, Bard: 1 }, race: { Gnome: 1, Vedalken: 1, "Simic Hybrid": 1 }, stats: { INT: 1 } },
      { text: "Living fully and on my own terms", class: { Barbarian: 1, Sorcerer: 1, Ranger: 1 }, race: { Tabaxi: 1, Aarakocra: 1, Satyr: 1 }, stats: { DEX: 1 } },
      { text: "Achieving something nobody thought I could", class: { Warlock: 2, Fighter: 1 }, race: { Orc: 1, "Half-Orc": 1, Githyanki: 1 }, stats: { STR: 1 } },
    ],
  },
];

/* ----------------------------------------------- TIEBREAKER PRIORITY
   If two classes (or races) end exactly tied AND their single strongest
   contribution is also tied, the one that appears EARLIER in these lists wins.
   This keeps results deterministic. Reorder to taste. */
const TIEBREAKER_PRIORITY = {
  class: [
    "Fighter", "Rogue", "Wizard", "Cleric", "Ranger", "Barbarian", "Bard",
    "Paladin", "Druid", "Monk", "Sorcerer", "Warlock", "Artificer",
  ],
  race: [
    "Human", "Elf", "Dwarf", "Halfling", "Half-Elf", "Tiefling", "Dragonborn",
    "Gnome", "Half-Orc", "Aasimar", "Tabaxi", "Firbolg", "Goliath", "Genasi",
    "Triton", "Lizardfolk", "Kenku", "Orc", "Goblin", "Hobgoblin", "Bugbear",
    "Kobold", "Yuan-ti", "Tortle", "Aarakocra", "Githyanki", "Githzerai",
    "Changeling", "Shifter", "Warforged", "Kalashtar", "Centaur", "Loxodon",
    "Simic Hybrid", "Fairy", "Harengon", "Owlin", "Satyr", "Vedalken",
  ],
};

const STAT_ORDER = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];
const STAT_NAMES = {
  STR: "Strength", DEX: "Dexterity", CON: "Constitution",
  INT: "Intelligence", WIS: "Wisdom", CHA: "Charisma",
};

/* Expose to app.js (and to the Node balance simulator via module.exports). */
const DATA = { CLASSES, RACES, QUESTIONS, TIEBREAKER_PRIORITY, STAT_ORDER, STAT_NAMES };
if (typeof module !== "undefined" && module.exports) module.exports = DATA;
