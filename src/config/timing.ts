// --- Timing -----------------------------------------------------------
// Each match gets its own slot: shots play out over perMatchDurationMs,
// then a quiet gapMs pause before the next match begins. Total loop length
// = 64 matches x (perMatchDurationMs + gapMs), so tune these two first
// if you want a shorter/longer full tournament loop.
export const TIMING_CONFIG = {
  perMatchDurationMs: 9000,
  gapMs: 2500,
  flightMs: 2200, // how long a single shot takes to travel — higher = slower individual shots
  goalAfterglowMs: 1000,
  missAfterglowMs: 350,
};