
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export const METER_TO_YARD = 1 / 0.9144; // StatsBomb x/y are in yards, but shot end_z is in meters — convert so height and width are proportionally accurate
