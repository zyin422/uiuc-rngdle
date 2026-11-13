# UIUC RNGdle 🔶🎰

A web-based RNG roll machine tailored to the University of Illinois Urbana-Champaign (UIUC), replicating the exact UI, 3D mechanical cards, pacing, and badge mechanics of [RNGdle](https://rngdle.net).

## Features & Implementation

- **1:1 RNGdle Laboratory UI**: Styled with RNGdle's exact technical blueprint background grid (`52px 52px`), neon signal accents (`#38ffc2`), and metallic 3D flip card dynamics (`rotateY(180deg)`).
- **8-Digit Mechanical Reel Array**: The number of digit reels is dynamically bound to the maximum word length in the bank (`MAX_WORD_LENGTH = 8`, derived from `GRAINGER`).
- **Empty Character Prefix (`␣`)**: Shorter words prefix empty characters (`[ ␣ ][ ␣ ][ ␣ ][ ␣ ][ ␣ ][ I ][ K ][ E ]`), right-aligning names across the array.
- **Paced Suspense Animation**: Each digit card is focused (`.is-next`), cycles characters with physical tick audio, and flips into locked position (`.is-locked`).
- **Sequential Badge Reveals**: Badges appear one by one in ascending rarity order (Common $\rightarrow$ Uncommon $\rightarrow$ Rare $\rightarrow$ Epic $\rightarrow$ Mythic $\rightarrow$ Anomaly) with dedicated audio chimes.
- **Streamlined Display**: Zero description fluff and zero numerical odds clutter.

## Campus Dorm & Dining Accuracy

- **A/C Invariant**: `Taft` is strictly the **ONLY** dorm with `No A/C`. All other residence halls (`FAR`, `PAR`, `ALLEN`, `SCOTT`, `NUGENT`, `IKE`, `ISR`) have air conditioning.
- **Dining Halls & Food**:
  - `Food` and `Good Food` can be possessed simultaneously.
  - All dining halls (`ISR`, `IKE`, `PAR`, `ALLEN`, `SCOTT`, `CORNER`), `Taft`, and `Target` carry `Food`.
  - `Allen`, `Taft`, `IKE`, and `CORNER` carry `Good Food`.
  - `Taft` carries both `Food` and `Good Food` alongside `Best Dorm (has Zixuan)`.
  - `Nugent` has NO food at all (only `Convenient`).

## Location Roster & Tiers (RNGdle 1:1 Palette)

- **Common (⚪ `#d6d7dc`)**:
  - `FAR/PAR`: `Dining Hall`, `Food`, `Far Walk`, `4 or more floors`
  - `DKH (David Kinley)`: `Confusing Layout`, `8 AM Lectures`, `Broken Elevator`, `4 or more floors`
  - `ARMORY`: `Confusing Layout`, `Basement Dungeon`
  - `GREGORY (hall)`: `8 AM Lectures`, `Confusing Layout`, `Broken Elevator`, `4 or more floors`
  - `ENGLISH (Building)`: `Confusing Layout`, `Basement Dungeon`, `4 or more floors`
  - `LINCOLN (Hall)`: `8 AM Lectures`, `Broken Elevator`, `4 or more floors`
  - `TARGET (Green St)`: `Campus Supplies`, `Food`, `Green St Self-Checkout Queue`
  - `ICE (Arena)`: `8 AM Lectures`
- **Uncommon (🟢 `#34d399`)**:
  - `LIBRARY (Main)`: `The Endless Stacks`, `Basement Dungeon`, `Confusing Layout`, `4 or more floors`
- **Rare (🔵 `#60a5fa`)**:
  - `SCOTT (Hall)`: `Dining Hall`, `Food`, `Convenient`, `4 or more floors`
  - `NUGENT`: `Convenient`, `4 or more floors` (No food!)
  - `ECE (Building)`: `Net-Zero Solar Array`, `CS Major Odor`, `4 or more floors`
  - `CIF`: `Broken Elevator`, `8 AM Lectures`, `4 or more floors`
- **Epic (🟣 `#c084fc`)**:
  - `BECKMAN (Institute)`: `Superconducting MRI Scanners`, `Confusing Layout`, `4 or more floors`
  - `ALLEN (Hall)`: `Dining Hall`, `Food`, `Unit One Arts Floor`, `Good Food`, `4 or more floors`
  - `CORNER (Cafe)`: Standalone location! Badges: `Dining Hall`, `Food`, `Good Food`, `Meal Swipe for Items Method`
  - `GRAINGER (Library)`: `4 or more floors`, `Basement Dungeon`, `CS Major Odor`
- **Anomaly (🟠 `#fb923c`)**:
  - `IKE`: `Dining Hall`, `Food`, `Convenient`, `Little Taft`, `Good Food`, `4 or more floors`. (~6.13% chance, > ISR)
  - `TAFT`: `Food`, `No A/C`, `Good Food`, `Lots of Roommates`, `Best Dorm (has Zixuan)`, `4 or more floors`. (~6.13% chance, > ISR)
  - `SIEBEL`: `Secret Conference Room`, `CS Major Odor`, `Basement Dungeon`, `4 or more floors`. (~2.36% chance)
- **Mythic (🔴 `#f87171`)**:
  - `ISR`: Locked to **1 in 19 chance (~5.263%)**. Badges: `Dining Hall`, `Food`, `ISR Badge (what's between the round couches?)`, `4 or more floors`.

## Reveal Mechanics & Pacing

1. **Digits**: Evaluates 8 digit slots with empty characters prefixed (`[ ␣ ]`).
2. **Location Reveal**: Location name displays first with neutral status (`ANALYZING ATTRIBUTES...`). The overall rarity tier, pill, and EP score remain hidden.
3. **Upward Badge Reveal**: Badges pop in ascending rarity order (least rare to most rare). Each new badge drops into the top slot via `badgeList.prepend()`, pushing older badges down.
4. **Final Rarity Climax**: Only after all badges have been revealed does the rarity status explode with the tier banner, glowing rarity pill, EP score, and fanfare.
5. **⚡ Turbo Mode**: Toggleable via `⚡ Turbo` button or checkbox for accelerated spins (60ms reel suspense, 120ms badge drops).
