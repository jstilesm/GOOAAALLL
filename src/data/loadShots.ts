import Papa from 'papaparse';
import type { Shot } from '../types';

/**
 * Loads and parses the World Cup shot data CSV from /public/data.
 * Coerces numeric/boolean fields since PapaParse returns strings by default
 */
export async function loadShots(): Promise<Shot[]> {
  const response = await fetch('/data/world_cup_2022_shots.csv');
  const csvText = await response.text();

  const parsed = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  const shots: Shot[] = parsed.data.map((row) => ({
    match_id: Number(row.match_id),
    match_date: row.match_date,
    stage: row.stage,
    home_team: row.home_team,
    away_team: row.away_team,
    team: row.team,
    player: row.player,
    position: row.position,
    minute: Number(row.minute),
    second: Number(row.second),
    period: Number(row.period),
    x: Number(row.x),
    y: Number(row.y),
    end_x: Number(row.end_x),
    end_y: Number(row.end_y),
    end_z: row.end_z ? Number(row.end_z) : null,
    body_part: row.body_part,
    technique: row.technique,
    shot_type: row.shot_type,
    outcome: row.outcome,
    statsbomb_xg: Number(row.statsbomb_xg),
    first_time: row.first_time === 'True',
    under_pressure: row.under_pressure === 'True',
  }));

  // Filter out any rows missing valid coordinates
  return shots.filter(
    (s) => !Number.isNaN(s.x) && !Number.isNaN(s.y) && !Number.isNaN(s.end_x) && !Number.isNaN(s.end_y)
  );
}
