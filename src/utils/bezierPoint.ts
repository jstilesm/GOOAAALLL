import { ScheduledShot } from "../types";

// Utility function to calculate a point on a quadratic Bezier curve given parameter t and the control points from a ScheduledShot.
export function bezierPoint(t: number, s: ScheduledShot): { x: number; y: number } {
      const oneMinusT = 1 - t;
      const x = oneMinusT * oneMinusT * s.startX + 2 * oneMinusT * t * s.controlX + t * t * s.endX;
      const y = oneMinusT * oneMinusT * s.startY + 2 * oneMinusT * t * s.controlY + t * t * s.endY;
      return { x, y };
    }