# GOOAAALLL
Generative art from 2022 FIFA World Cup shot data.

Data source: [StatsBomb Open Data](https://github.com/statsbomb/open-data) — every shot event
(1,494 shots, 195 goals) across all 64 matches of the tournament, including location, end
location, xG, body part, technique, and outcome.

## Stack
- [Vite](https://vitejs.dev/) — dev server / bundler
- TypeScript
- [p5.js](https://p5js.org/) — rendering
- [PapaParse](https://www.papaparse.com/) — CSV parsing

## Setup

```bash
npm install
npm run dev
```

## Project structure

```
public/data/world_cup_2022_shots.csv   # raw shot data, fetched client-side

src/
  types.ts                    # Shot, MatchSlot, ScheduledShot interfaces
  main.ts                     # entry point — loads data, builds match slots, mounts the sketch

  data/
    loadShots.ts              # CSV loader/parser (PapaParse), numeric/boolean coercion
    teamColors.ts             # per-nation flag color triples + fallback lookup

  sketches/
    goalSketch.ts             # p5 sketch — the main visual (start here)
    ballDesign.ts             # tricolor ball rendering
    confetti.ts               # goal celebration particle burst (seeded PRNG)
    goalSketch.css

  ui/
    matchPicker.ts            # "jump to match" dropdown
    speedControl.ts           # playback speed control
    speedControl.css

  utils/
    bezierPoint.ts            # quadratic Bezier interpolation for shot flight paths
    matchSlot.ts              # groups shots by match, assigns each match a timeline slot
    units.ts                  # easing + unit conversion helpers

  config/
    goal.ts                   # goal frame dimensions (yards)
    timing.ts                 # playback timing constants (durations, gaps, afterglow)

  styles/
    theme.css
```

## Future implementation updates

Todo: 
- Add arrow press to navigate matches
- Add tagging for goal information
- Add depth to representation
- Can body part, pressure, technique be expressed

- testing?

Live presentation of world cup shots and goals


## Data field reference

| Field | Description |
|---|---|
| `x`, `y` | Shot origin, on a 120×80 pitch coordinate grid |
| `end_x`, `end_y`, `end_z` | Where the shot ended up (z = height, for shots that go airborne) |
| `statsbomb_xg` | Expected goals value for the shot (0–1) |
| `outcome` | Goal, Saved, Off T, Blocked, Wayward, etc. |
| `technique` | Normal, Volley, Half Volley, Lob, Overhead Kick, etc. |
| `body_part` | Left Foot, Right Foot, Head, Other |
| `under_pressure` | Whether a defender was closing down the shooter |