import '../styles/theme.css';
import './speedControl.css';

export interface SpeedControl {
  element: HTMLDivElement;
  getSpeed: () => number;
  destroy: () => void;
}

const MIN_SPEED = 0.25;
const MAX_SPEED = 3;
const STEP = 0.25;

const SPEED_ICON_SVG = `
<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 2a10 10 0 1 0 10 10" />
  <path d="M12 2a10 10 0 0 1 7.07 2.93" stroke-dasharray="2 3" />
  <line x1="12" y1="12" x2="16" y2="7" />
  <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
</svg>
`;

export function createSpeedControl(
  initialSpeed = 1,
  onChange?: (speed: number) => void
): SpeedControl {
  const container = document.createElement('div');
  container.className = 'panel speed-control';
  container.tabIndex = 0; // allow focus so keyboard hint reads naturally, not required for the listener to work

  const icon = document.createElement('span');
  icon.className = 'speed-icon';
  icon.innerHTML = SPEED_ICON_SVG;

  const label = document.createElement('span');
  label.className = 'label';
  label.textContent = `${initialSpeed.toFixed(2)}x`;

  const hint = document.createElement('span');
  hint.className = 'hint';
  hint.textContent = '↑/↓';

  container.appendChild(icon);
  container.appendChild(label);
  container.appendChild(hint);
  document.body.appendChild(container);

  let speed = initialSpeed;

  function setSpeed(next: number) {
    speed = Math.min(MAX_SPEED, Math.max(MIN_SPEED, Math.round(next * 100) / 100));
    label.textContent = `${speed.toFixed(2)}x`;
    container.classList.add('pulse');
    window.setTimeout(() => container.classList.remove('pulse'), 150);
    onChange?.(speed);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowUp' || e.key === '+' || e.key === '=') {
      e.preventDefault();
      setSpeed(speed + STEP);
    } else if (e.key === 'ArrowDown' || e.key === '-' || e.key === '_') {
      e.preventDefault();
      setSpeed(speed - STEP);
    }
  }

  window.addEventListener('keydown', handleKeydown);

  return {
    element: container,
    getSpeed: () => speed,
    destroy: () => {
      window.removeEventListener('keydown', handleKeydown);
      container.remove();
    },
  };
}