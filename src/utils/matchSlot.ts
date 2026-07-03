import { Shot, MatchSlot } from "../types";
import { TIMING_CONFIG } from "../config/timing";

export function buildMatchSlots(shots: Shot[]) {
      const byMatch = new Map<number, Shot[]>();
      for (const shot of shots) {
        const arr = byMatch.get(shot.match_id) ?? [];
        arr.push(shot);
        byMatch.set(shot.match_id, arr);
      }

      const slots: MatchSlot[] = Array.from(byMatch.entries()).map(([matchId, matchShots]) => {
        const maxMinute = Math.max(...matchShots.map((s) => s.minute), 90);
        return {
          matchId,
          homeTeam: matchShots[0].home_team,
          awayTeam: matchShots[0].away_team,
          stage: matchShots[0].stage,
          matchDate: matchShots[0].match_date,
          maxMinute,
          slotStart: 0, // assigned below
        };
      });

      // Chronological order (date, then match_id as a stable tiebreaker)
      slots.sort((a, b) => a.matchDate.localeCompare(b.matchDate) || a.matchId - b.matchId);

      const slotDuration = TIMING_CONFIG.perMatchDurationMs + TIMING_CONFIG.gapMs;
      slots.forEach((slot, i) => {
        slot.slotStart = i * slotDuration;
      });

      return { matchSlots: slots, totalCycle: slots.length * slotDuration, slotDuration };
    }