import { METER_TO_YARD } from '../utils/units';

export const GOAL_CONFIG = {
  // Goal dimensions in yards
  goalYMin: 36,
  goalYMax: 44,
  crossbarHeightYards: 2.44 * METER_TO_YARD,
  maxHeightMeters: 6, // clamp extreme outlier shots (some hit 7.6m) so the frame stays legible
};