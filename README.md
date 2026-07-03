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

This opens a local dev server (usually `http://localhost:5173`)

## Project structure

```
public/data/world_cup_2022_shots.csv   # raw shot data, fetched client-side
src/types.ts                            # Shot interface
src/data.ts                             # CSV loader
src/sketch.ts                           # p5 sketch — the actual visual (start here)
src/main.ts                             # entry point, boots the sketch
```

## Current state

`src/sketch.ts` has a literal, unstyled first pass: every shot drawn as a line from its
origin to where it ended up, colored by outcome (gold = goal, blue = saved/on target, gray =
off target/blocked), with opacity weighted by StatsBomb's xG value. This is scaffolding —
the next step is developing an actual visual language on top of it (particle systems,
accumulation/trails, sound, interactivity, whatever direction feels right).

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
