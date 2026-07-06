export interface Shot {
  match_id: number;
  match_date: string;
  stage: string;
  home_team: string;
  away_team: string;
  team: string;
  player: string;
  position: string;
  minute: number;
  second: number;
  period: number;
  x: number;
  y: number;
  end_x: number;
  end_y: number;
  end_z: number | null;
  body_part: string;
  technique: string;
  shot_type: string;
  outcome: string;
  statsbomb_xg: number;
  first_time: boolean;
  under_pressure: boolean;
}

export interface MatchSlot {
  matchId: number;
  homeTeam: string;
  awayTeam: string;
  stage: string;
  matchDate: string;
  maxMinute: number;
  slotStart: number;
}

export interface ScheduledShot {
  shot: Shot;
  startOffset: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  controlX: number;
  controlY: number;
}
