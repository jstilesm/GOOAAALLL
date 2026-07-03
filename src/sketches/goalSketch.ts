import p5 from 'p5';
import type { Shot, MatchSlot, ScheduledShot } from '../types';
import { teamColor, teamColorSet } from '../data/teamColors';
import { drawTricolorBall } from './ballDesign';
import { buildMatchSlots } from '../utils/matchSlot';
import { easeOutCubic, METER_TO_YARD } from '../utils/units';
import { bezierPoint } from '../utils/bezierPoint';

import { TIMING_CONFIG} from '../config/timing';
import { GOAL_CONFIG } from '../config/goal';

const { goalYMin: GOAL_Y_MIN, goalYMax: GOAL_Y_MAX, crossbarHeightYards: CROSSBAR_HEIGHT_YARDS, maxHeightMeters: MAX_HEIGHT_METERS } = GOAL_CONFIG;
const { perMatchDurationMs: PER_MATCH_DURATION_MS, flightMs: FLIGHT_MS, goalAfterglowMs: GOAL_AFTERGLOW_MS, missAfterglowMs: MISS_AFTERGLOW_MS } = TIMING_CONFIG;

/**
 * GOAL CAM
 * --------
 * A literal goal frame drawn at true proportions. Shots launch from a point
 * reflecting their real pitch distance/position and travel a curved path to
 * where they actually ended up — net, post, save, or wide/over.
 *
 * Matches play out sequentially, each in its own timed slot with a quiet
 * gap before the next kicks off. A scoreboard overlay tracks the live
 * score and running match clock for whichever match is currently active.
 */

export function createGoalSketch(shots: Shot[]) {
  return (p: p5) => {
    let canvasW: number;
    let canvasH: number;
    let pxPerYard: number;
    let goalBaselineY: number;
    let scheduled: ScheduledShot[] = [];
    let matchSlots: MatchSlot[] = [];
    let totalCycle = 0;
    let slotDuration = 0;
    let overlay: HTMLDivElement;
    let scoreLine: HTMLDivElement;
    let clockLine: HTMLDivElement;
    let timeOffset = 0; // ms offset to jump to a specific match slot

    function computeLayout() {
      canvasW = p.windowWidth * 0.92;
      canvasH = p.windowHeight * 0.85; // leave room below for the scoreboard overlay
      pxPerYard = canvasW / 80;;
      goalBaselineY = canvasH * 0.35;
    }

    function screenX(pitchY: number): number {
      return pitchY * pxPerYard;
    }

    function launchScreenY(distanceYards: number): number {
      const maxDistance = 61;
      const t = p.constrain(distanceYards / maxDistance, 0, 1);
      return goalBaselineY + t * (canvasH - goalBaselineY - 20);
    }

    function heightScreenY(heightMeters: number): number {
      const clamped = p.constrain(heightMeters, 0, MAX_HEIGHT_METERS);
      const heightYards = clamped * METER_TO_YARD;
      return goalBaselineY - heightYards * pxPerYard;
    }
     function currentT(): number {
      return ((p.millis() + timeOffset) % totalCycle + totalCycle) % totalCycle;
    }

    function jumpToMatch(matchId: number) {
      const slot = matchSlots.find((s) => s.matchId === matchId);
      if (!slot) return;
      timeOffset += slot.slotStart - currentT();
    }

    function buildSchedule() {
      const slotByMatchId = new Map(matchSlots.map((s) => [s.matchId, s]));

      scheduled = shots.map((shot) => {
        const slot = slotByMatchId.get(shot.match_id)!;
        const distance = 120 - shot.x;
        const startX = screenX(shot.y);
        const startY = launchScreenY(distance);
        const endX = screenX(shot.end_y);
        const endZ = shot.end_z ?? 0;
        const endY = heightScreenY(endZ);

        const midX = (startX + endX) / 2;
        const straightMidY = (startY + endY) / 2;
        const arcLift = 30 + p.constrain(endZ, 0, MAX_HEIGHT_METERS) * 10;

        const jitter = p.random(-150, 150);
        const withinMatchOffset = (shot.minute / slot.maxMinute) * PER_MATCH_DURATION_MS;
        const startOffset = slot.slotStart + withinMatchOffset + jitter;

        return {
          shot,
          startOffset: ((startOffset % totalCycle) + totalCycle) % totalCycle,
          startX,
          startY,
          endX,
          endY,
          controlX: midX,
          controlY: straightMidY - arcLift,
        };
      });
    }

    function drawGoalFrame(dim: boolean) {
      const leftX = screenX(GOAL_Y_MIN);
      const rightX = screenX(GOAL_Y_MAX);
      const topY = goalBaselineY - CROSSBAR_HEIGHT_YARDS * pxPerYard;
      const alphaMult = dim ? 0.4 : 1;

      p.stroke(255, 255, 255, 20 * alphaMult);
      p.strokeWeight(1);
      p.line(0, goalBaselineY, canvasW, goalBaselineY);

      p.stroke(255, 255, 255, 130 * alphaMult);
      p.strokeWeight(2.5);
      p.line(leftX, goalBaselineY, leftX, topY);
      p.line(rightX, goalBaselineY, rightX, topY);
      p.line(leftX, topY, rightX, topY);

      p.stroke(255, 255, 255, 40 * alphaMult);
      p.strokeWeight(0.6);
      const netCols = 10;
      const netRows = 6;
      for (let i = 0; i <= netCols; i++) {
        const x = p.lerp(leftX, rightX, i / netCols);
        p.line(x, goalBaselineY, x, topY);
      }
      for (let j = 0; j <= netRows; j++) {
        const y = p.lerp(goalBaselineY, topY, j / netRows);
        p.line(leftX, y, rightX, y);
      }
    }

    function drawShot(s: ScheduledShot, t: number) {
      const elapsed = ((t - s.startOffset) % totalCycle + totalCycle) % totalCycle;
      const totalWindow = FLIGHT_MS + (s.shot.outcome === 'Goal' ? GOAL_AFTERGLOW_MS : MISS_AFTERGLOW_MS);
      if (elapsed > totalWindow) return;

      const colors = teamColorSet(s.shot.team);

      if (elapsed <= FLIGHT_MS) {
        const rawProgress = elapsed / FLIGHT_MS;
        const progress = easeOutCubic(rawProgress);
        const pos = bezierPoint(progress, s);

        // Faint full path, tinted with the team's primary flag color
        p.noFill();
        const pathCol = p.color(colors[0]);
        pathCol.setAlpha(35);
        p.stroke(pathCol);
        p.strokeWeight(1);
        p.beginShape();
        const steps = 12;
        for (let i = 0; i <= steps * progress; i++) {
          const tp = i / steps;
          const pp = bezierPoint(tp, s);
          p.vertex(pp.x, pp.y);
        }
        p.endShape();

        // Traveling ball — tricolor wedge, all three flag colors visible at once
        drawTricolorBall(p, pos.x, pos.y, 10, colors, 235);  
      } else {
        const afterglowElapsed = elapsed - FLIGHT_MS;
        const window = s.shot.outcome === 'Goal' ? GOAL_AFTERGLOW_MS : MISS_AFTERGLOW_MS;
        const fade = 1 - afterglowElapsed / window;

        p.noStroke();
        if (s.shot.outcome === 'Goal') {
          // Glow bloom cycles through all three flag colors for a richer burst
          for (let i = 4; i >= 1; i--) {
            const glowCol = p.color(colors[i % 3]);
            glowCol.setAlpha(25 * fade);
            p.fill(glowCol);
            p.circle(s.endX, s.endY, i * 12);
          }
          drawTricolorBall(p, s.endX, s.endY, 13, colors, 255 * fade);
        } else {
          drawTricolorBall(p, s.endX, s.endY, 8, colors, 180 * fade);
        }
      }
    }

    function createOverlay() {
      overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.bottom = '20px';
      overlay.style.left = '50%';
      overlay.style.transform = 'translateX(-50%)';
      overlay.style.zIndex = '10';
      overlay.style.fontFamily = 'system-ui, sans-serif';
      overlay.style.textAlign = 'center';
      overlay.style.background = 'rgba(255,255,255,0.06)';
      overlay.style.border = '1px solid rgba(255,255,255,0.15)';
      overlay.style.borderRadius = '10px';
      overlay.style.padding = '10px 24px';
      overlay.style.color = '#eee';
      overlay.style.minWidth = '260px';

      scoreLine = document.createElement('div');
      scoreLine.style.fontSize = '16px';
      scoreLine.style.fontWeight = '600';
      scoreLine.style.letterSpacing = '0.02em';

      clockLine = document.createElement('div');
      clockLine.style.fontSize = '12px';
      clockLine.style.opacity = '0.6';
      clockLine.style.marginTop = '2px';

      overlay.appendChild(scoreLine);
      overlay.appendChild(clockLine);
      document.body.appendChild(overlay);
    }

    function updateOverlay(t: number) {
      const idx = Math.min(Math.floor(t / slotDuration), matchSlots.length - 1);
      const slot = matchSlots[idx];
      const withinSlot = t - idx * slotDuration;
      const isActive = withinSlot < PER_MATCH_DURATION_MS;

      const currentMinute = isActive
        ? (withinSlot / PER_MATCH_DURATION_MS) * slot.maxMinute
        : slot.maxMinute;

      const homeGoals = shots.filter(
        (s) => s.match_id === slot.matchId && s.team === slot.homeTeam && s.outcome === 'Goal' && s.minute <= currentMinute
      ).length;
      const awayGoals = shots.filter(
        (s) => s.match_id === slot.matchId && s.team === slot.awayTeam && s.outcome === 'Goal' && s.minute <= currentMinute
      ).length;

      const homeColor = teamColor(slot.homeTeam);
      const awayColor = teamColor(slot.awayTeam);

      scoreLine.innerHTML = `<span style="color:${homeColor}">${slot.homeTeam}</span> ${homeGoals} &ndash; ${awayGoals} <span style="color:${awayColor}">${slot.awayTeam}</span>`;
      clockLine.textContent = isActive ? `${slot.stage} · ${Math.floor(currentMinute)}'` : `${slot.stage} · FT`;
    }

    p.setup = () => {
      computeLayout();
      p.createCanvas(canvasW, canvasH).parent('sketch-holder');
      p.angleMode(p.RADIANS);

      const built = buildMatchSlots(shots);
      matchSlots = built.matchSlots;
      totalCycle = built.totalCycle;
      slotDuration = built.slotDuration;

      buildSchedule();
      createOverlay();

      // Ensure the scoreboard overlay is cleaned up if the view is switched away from
      const originalRemove = p.remove.bind(p);
      p.remove = () => {
        overlay.remove();
        originalRemove();
      };
      (p as any).jumpToMatch = jumpToMatch;

      p.loop();
    };

    p.draw = () => {
      p.background(5, 5, 5);
      const t = currentT();
      const idx = Math.min(Math.floor(t / slotDuration), matchSlots.length - 1);
      const withinSlot = t - idx * slotDuration;
      const isActive = withinSlot < PER_MATCH_DURATION_MS;

      drawGoalFrame(!isActive);
      if (isActive) {
        for (const s of scheduled) drawShot(s, t);
      }
      updateOverlay(t);
    };

    p.windowResized = () => {
      computeLayout();
      p.resizeCanvas(canvasW, canvasH);
      buildSchedule();
    };
  };
}
