// UIUC RNGdle - Location & Shared Badge Bank Database
// Strictly contains only locations described by the user

const RARITY_TIERS = {
  common: {
    id: 'common',
    label: 'Common',
    color: '#d6d7dc',
    bg: 'rgba(214, 215, 220, 0.12)',
    border: 'rgba(214, 215, 220, 0.35)',
    baseEp: 80,
    score: 20,
    emoji: '⚪'
  },
  uncommon: {
    id: 'uncommon',
    label: 'Uncommon',
    color: '#34d399',
    bg: 'rgba(52, 211, 153, 0.12)',
    border: 'rgba(52, 211, 153, 0.35)',
    baseEp: 180,
    score: 50,
    emoji: '🟢'
  },
  rare: {
    id: 'rare',
    label: 'Rare',
    color: '#60a5fa',
    bg: 'rgba(96, 165, 250, 0.14)',
    border: 'rgba(96, 165, 250, 0.35)',
    baseEp: 260,
    score: 100,
    emoji: '🔵'
  },
  epic: {
    id: 'epic',
    label: 'Epic',
    color: '#c084fc',
    bg: 'rgba(192, 132, 252, 0.14)',
    border: 'rgba(192, 132, 252, 0.35)',
    baseEp: 420,
    score: 200,
    emoji: '🟣'
  },
  anomaly: {
    id: 'anomaly',
    label: 'Anomaly',
    color: '#fb923c',
    bg: 'rgba(251, 146, 60, 0.15)',
    border: 'rgba(251, 146, 60, 0.40)',
    baseEp: 750,
    score: 400,
    emoji: '🟠'
  },
  mythic: {
    id: 'mythic',
    label: 'Mythic',
    color: '#f87171',
    bg: 'rgba(248, 113, 113, 0.18)',
    border: 'rgba(248, 113, 113, 0.45)',
    baseEp: 1200,
    score: 800,
    emoji: '🔴'
  }
};

// Badges (Zero fluff descriptions)
const BADGES = {
  // Shared Badges
  dining_hall: { id: 'dining_hall', name: 'Dining Hall', rarity: 'common' },
  food: { id: 'food', name: 'Food', rarity: 'common' },
  good_food: { id: 'good_food', name: 'Good Food', rarity: 'epic' },
  far_walk: { id: 'far_walk', name: 'Far Walk', rarity: 'common' },
  no_ac: { id: 'no_ac', name: 'No A/C', rarity: 'uncommon' }, // ONLY for Taft
  broken_elevator: { id: 'broken_elevator', name: 'Broken Elevator', rarity: 'common' },
  confusing_layout: { id: 'confusing_layout', name: 'Confusing Layout', rarity: 'common' },
  eight_am_lectures: { id: 'eight_am_lectures', name: '8 AM Lectures', rarity: 'common' },
  basement_dungeon: { id: 'basement_dungeon', name: 'Basement Dungeon', rarity: 'uncommon' },
  cs_major_odor: { id: 'cs_major_odor', name: 'CS Major Odor', rarity: 'uncommon' },
  campus_supplies: { id: 'campus_supplies', name: 'Campus Supplies', rarity: 'common' },
  four_or_more_floors: { id: 'four_or_more_floors', name: '4 or more floors', rarity: 'common' },

  // Specific / Lore Badges
  little_taft: { id: 'little_taft', name: 'Little Taft', rarity: 'epic' },
  ike_convenient: { id: 'ike_convenient', name: 'Convenient', rarity: 'uncommon' },
  meal_swipe_method: { id: 'meal_swipe_method', name: 'Meal Swipe for Items Method', rarity: 'epic' },
  taft_best_dorm: { id: 'taft_best_dorm', name: 'Best Dorm (has Zixuan)', rarity: 'anomaly' },
  taft_roommates: { id: 'taft_roommates', name: 'Lots of Roommates', rarity: 'epic' },
  isr_couch_secret: { id: 'isr_couch_secret', name: "ISR Badge (what's between the round couches?)", rarity: 'mythic' },
  siebel_secret_room: { id: 'siebel_secret_room', name: 'Secret Conference Room', rarity: 'epic' },
  mri_scanners: { id: 'mri_scanners', name: 'Superconducting MRI Scanners', rarity: 'rare' },
  solar_roof: { id: 'solar_roof', name: 'Net-Zero Solar Array', rarity: 'uncommon' },
  the_stacks: { id: 'the_stacks', name: 'The Endless Stacks', rarity: 'uncommon' },
  self_checkout: { id: 'self_checkout', name: 'Green St Self-Checkout Queue', rarity: 'common' },
  unit_one: { id: 'unit_one', name: 'Unit One Arts Floor', rarity: 'uncommon' }
};

// Location Bank: ONLY locations described by the user
// Individual probabilities calibrated:
// ISR is strictly 1 in 19 (~5.263%)
// Individual campus rolls (FAR, PAR, IKE, TAFT, ALLEN, ARMORY, DKH, GREGORY) each have a slightly higher chance (> 5.263%)
const LOCATIONS = [
  // 1. ISR (Mythic) - Strictly 1 in 19 (~5.263%)
  {
    id: 'isr',
    word: 'ISR',
    implied: '',
    fullName: 'Illinois Street Residences',
    rarity: 'mythic',
    isOneInNineteen: true,
    badges: [
      BADGES.dining_hall,
      BADGES.food,
      BADGES.isr_couch_secret,
      BADGES.four_or_more_floors
    ]
  },

  // 2. FAR/PAR (Common) - ~6.60% (> ISR) - AC exists! Dining hall & Food!
  {
    id: 'far_par',
    word: 'FAR/PAR',
    implied: '',
    fullName: 'FAR & PAR (Florida & Pennsylvania)',
    rarity: 'common',
    baseWeight: 14.0,
    badges: [
      BADGES.dining_hall,
      BADGES.food,
      BADGES.far_walk,
      BADGES.four_or_more_floors
    ]
  },

  // 4. IKE (Anomaly) - ~6.13% (> ISR)
  {
    id: 'ike',
    word: 'IKE',
    implied: '',
    fullName: 'Ikenberry Commons',
    rarity: 'anomaly',
    baseWeight: 13.0,
    badges: [
      BADGES.dining_hall,
      BADGES.food,
      BADGES.ike_convenient,
      BADGES.little_taft,
      BADGES.good_food,
      BADGES.four_or_more_floors
    ]
  },

  // 5. Taft (Anomaly) - ~6.13% (> ISR) - ONLY dorm with No A/C! Has both Food and Good Food!
  {
    id: 'taft',
    word: 'TAFT',
    implied: '',
    fullName: 'Taft-Van Doren Hall',
    rarity: 'anomaly',
    baseWeight: 13.0,
    badges: [
      BADGES.food,
      BADGES.no_ac,
      BADGES.good_food,
      BADGES.taft_roommates,
      BADGES.taft_best_dorm,
      BADGES.four_or_more_floors
    ]
  },

  // 6. Allen Hall (Epic) - ~6.13% (> ISR) - AC exists! Has Good Food and Dining Hall!
  {
    id: 'allen',
    word: 'ALLEN',
    implied: '(Hall)',
    fullName: 'Allen Residence Hall',
    rarity: 'epic',
    baseWeight: 13.0,
    badges: [
      BADGES.dining_hall,
      BADGES.food,
      BADGES.unit_one,
      BADGES.good_food,
      BADGES.four_or_more_floors
    ]
  },

  // 7. David Kinley (Common) - ~6.13% (> ISR)
  {
    id: 'dkh',
    word: 'DKH',
    implied: '(David Kinley)',
    fullName: 'David Kinley Hall',
    rarity: 'common',
    baseWeight: 13.0,
    badges: [
      BADGES.confusing_layout,
      BADGES.eight_am_lectures,
      BADGES.broken_elevator,
      BADGES.four_or_more_floors
    ]
  },

  // 8. The Armory (Common) - ~6.13% (> ISR)
  {
    id: 'armory',
    word: 'ARMORY',
    implied: '',
    fullName: 'The Armory',
    rarity: 'common',
    baseWeight: 13.0,
    badges: [
      BADGES.confusing_layout,
      BADGES.basement_dungeon
    ]
  },

  // 9. Gregory Hall (Common) - ~5.66% (> ISR)
  {
    id: 'gregory',
    word: 'GREGORY',
    implied: '(hall)',
    fullName: 'Gregory Hall',
    rarity: 'common',
    baseWeight: 12.0,
    badges: [
      BADGES.eight_am_lectures,
      BADGES.confusing_layout,
      BADGES.broken_elevator,
      BADGES.four_or_more_floors
    ]
  },

  // 10. English Building (Common) - ~4.71%
  {
    id: 'english',
    word: 'ENGLISH',
    implied: '(Building)',
    fullName: 'English Building',
    rarity: 'common',
    baseWeight: 10.0,
    badges: [
      BADGES.confusing_layout,
      BADGES.basement_dungeon,
      BADGES.four_or_more_floors
    ]
  },

  // 11. Lincoln Hall (Common) - ~4.71%
  {
    id: 'lincoln',
    word: 'LINCOLN',
    implied: '(Hall)',
    fullName: 'Lincoln Hall',
    rarity: 'common',
    baseWeight: 10.0,
    badges: [
      BADGES.eight_am_lectures,
      BADGES.broken_elevator,
      BADGES.four_or_more_floors
    ]
  },

  // 12. Target (Common) - ~4.71%
  {
    id: 'target',
    word: 'TARGET',
    implied: '(Green St)',
    fullName: 'Target on Green',
    rarity: 'common',
    baseWeight: 10.0,
    badges: [
      BADGES.campus_supplies,
      BADGES.food,
      BADGES.self_checkout
    ]
  },

  // 13. Scott Hall (Rare) - ~3.77% - AC exists! Dining hall & Food!
  {
    id: 'scott',
    word: 'SCOTT',
    implied: '(Hall)',
    fullName: 'Scott Residence Hall',
    rarity: 'rare',
    baseWeight: 8.0,
    badges: [
      BADGES.dining_hall,
      BADGES.food,
      BADGES.ike_convenient,
      BADGES.four_or_more_floors
    ]
  },

  // 14. Nugent Hall (Rare) - ~3.77% - AC exists! Convenient (no dining hall or food)
  {
    id: 'nugent',
    word: 'NUGENT',
    implied: '',
    fullName: 'Nugent Hall',
    rarity: 'rare',
    baseWeight: 8.0,
    badges: [
      BADGES.ike_convenient,
      BADGES.four_or_more_floors
    ]
  },

  // 15. Main Library (Uncommon) - ~3.77%
  {
    id: 'library',
    word: 'LIBRARY',
    implied: '(Main)',
    fullName: 'Main Library',
    rarity: 'uncommon',
    baseWeight: 8.0,
    badges: [
      BADGES.the_stacks,
      BADGES.basement_dungeon,
      BADGES.confusing_layout,
      BADGES.four_or_more_floors
    ]
  },

  // 15. Ice Arena (Common) - ~4.7%
  {
    id: 'ice',
    word: 'ICE',
    implied: '(Arena)',
    fullName: 'UI Ice Arena',
    rarity: 'common',
    baseWeight: 10.0,
    badges: [
      BADGES.eight_am_lectures
    ]
  },

  // 17. ECE Building (Rare) - ~3.30%
  {
    id: 'ece',
    word: 'ECE',
    implied: '(Building)',
    fullName: 'ECE Building',
    rarity: 'rare',
    baseWeight: 7.0,
    badges: [
      BADGES.solar_roof,
      BADGES.cs_major_odor,
      BADGES.four_or_more_floors
    ]
  },

  // 18. CIF (Rare) - ~3.30%
  {
    id: 'cif',
    word: 'CIF',
    implied: '',
    fullName: 'Campus Instructional Facility',
    rarity: 'rare',
    baseWeight: 7.0,
    badges: [
      BADGES.broken_elevator,
      BADGES.eight_am_lectures,
      BADGES.four_or_more_floors
    ]
  },

  // 19. Grainger Library (Epic) - ~2.83%
  {
    id: 'grainger',
    word: 'GRAINGER',
    implied: '(Library)',
    fullName: 'Grainger Engineering Library',
    rarity: 'epic',
    baseWeight: 6.0,
    badges: [
      BADGES.four_or_more_floors,
      BADGES.basement_dungeon,
      BADGES.cs_major_odor
    ]
  },

  // 20. Beckman (Epic) - ~2.36%
  {
    id: 'beckman',
    word: 'BECKMAN',
    implied: '(Institute)',
    fullName: 'Beckman Institute',
    rarity: 'epic',
    baseWeight: 5.0,
    badges: [
      BADGES.mri_scanners,
      BADGES.confusing_layout,
      BADGES.four_or_more_floors
    ]
  },

  // 21. Corner Cafe (Epic) - ~2.36% - Its own standalone location!
  {
    id: 'corner',
    word: 'CORNER',
    implied: '(Cafe)',
    fullName: 'Corner Cafe (FAR & PAR)',
    rarity: 'epic',
    baseWeight: 5.0,
    badges: [
      BADGES.dining_hall,
      BADGES.food,
      BADGES.good_food,
      BADGES.meal_swipe_method
    ]
  },

  // 22. Siebel (Anomaly) - ~2.36%
  {
    id: 'siebel',
    word: 'SIEBEL',
    implied: '',
    fullName: 'Thomas M. Siebel Center',
    rarity: 'anomaly',
    baseWeight: 5.0,
    badges: [
      BADGES.siebel_secret_room,
      BADGES.cs_major_odor,
      BADGES.basement_dungeon,
      BADGES.four_or_more_floors
    ]
  }
];

// Determine the maximum word length in the bank
const MAX_WORD_LENGTH = Math.max(...LOCATIONS.map(loc => loc.word.length)); // 8 (from GRAINGER)

// Probability selection logic:
// ISR has EXACTLY 1 in 19 chance (~5.26315789%).
// The other locations share the remaining (18/19) based on their relative base weights.
function rollLocation() {
  const isISR = Math.random() < (1 / 19);
  if (isISR) {
    return LOCATIONS.find(l => l.id === 'isr');
  }

  // Non-ISR locations
  const pool = LOCATIONS.filter(l => l.id !== 'isr');
  const totalWeight = pool.reduce((sum, item) => sum + item.baseWeight, 0);
  let rand = Math.random() * totalWeight;

  for (const loc of pool) {
    if (rand < loc.baseWeight) {
      return loc;
    }
    rand -= loc.baseWeight;
  }

  return pool[pool.length - 1];
}

window.UIUC_RNGDLE = {
  BADGES,
  LOCATIONS,
  RARITY_TIERS,
  MAX_WORD_LENGTH,
  rollLocation
};
