import p5 from "p5";

/** Draws a small ball split into three equal wedges, one per flag color. */
export function drawTricolorBall(p: p5, x: number, y: number, diameter: number, colors: [string, string, string], alpha: number) {
  p.push();
  p.noStroke();
  const third = (2 * Math.PI) / 3;
  for (let i = 0; i < 3; i++) {
    const c = p.color(colors[i]);
    c.setAlpha(alpha);
    p.fill(c);
    p.arc(x, y, diameter, diameter, i * third, (i + 1) * third, p.PIE);
  }
  p.pop();
}