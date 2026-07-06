import type p5 from 'p5';

// Simple deterministic PRNG (mulberry32) so the same shot always produces
// the same confetti burst, regardless of playback speed or time-jumps.
function seededRandom(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface ConfettiParticle {
  angle: number;
  speed: number;
  size: number;
  colorIdx: number;
  spin: number;
  spinSpeed: number;
}

const PARTICLE_COUNT = 26;
const GRAVITY = 340; // px/s^2, pulls confetti downward as it flies out

function buildParticles(seed: number): ConfettiParticle[] {
  const rand = seededRandom(seed);
  const particles: ConfettiParticle[] = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      angle: rand() * Math.PI * 2,
      speed: 90 + rand() * 160,
      size: 4 + rand() * 5,
      colorIdx: Math.floor(rand() * 3),
      spin: rand() * Math.PI * 2,
      spinSpeed: (rand() - 0.5) * 10,
    });
  }
  return particles;
}

// Cache particle layouts per seed so we don't rebuild the PRNG sequence every frame.
const particleCache = new Map<number, ConfettiParticle[]>();

function getParticles(seed: number): ConfettiParticle[] {
  let cached = particleCache.get(seed);
  if (!cached) {
    cached = buildParticles(seed);
    particleCache.set(seed, cached);
  }
  return cached;
}

/**
 * Draws a burst of confetti radiating from (x, y), fully determined by
 * elapsedMs so it can be scrubbed, sped up, or slowed down without drift.
 *
 * @param seed - stable per-shot identifier (e.g. match_id * 1000 + minute * 10 + index)
 */
export function drawConfetti(
  p: p5,
  x: number,
  y: number,
  colors: [string, string, string] | string[],
  elapsedMs: number,
  windowMs: number,
  seed: number
) {
  const t = elapsedMs / 1000; // seconds since goal
  const life = windowMs / 1000;
  if (t < 0 || t > life) return;

  const fade = 1 - t / life;
  const particles = getParticles(seed);

  p.push();
  p.noStroke();
  for (const particle of particles) {
    const vx = Math.cos(particle.angle) * particle.speed;
    const vy = Math.sin(particle.angle) * particle.speed;

    const px = x + vx * t;
    const py = y + vy * t + 0.5 * GRAVITY * t * t;

    const col = p.color(colors[particle.colorIdx % colors.length]);
    col.setAlpha(255 * fade);
    p.fill(col);

    p.push();
    p.translate(px, py);
    p.rotate(particle.spin + particle.spinSpeed * t);
    p.rectMode(p.CENTER);
    p.rect(0, 0, particle.size, particle.size * 0.5);
    p.pop();
  }
  p.pop();
}