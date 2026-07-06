import p5 from 'p5';
import { loadShots } from './data/loadShots';
import { createGoalSketch } from './sketches/goalSketch';
import { buildMatchSlots } from './utils/matchSlot';
import { createMatchPicker } from './ui/matchPicker';
import type { Shot } from './types';
import "./styles/theme.css";

type ViewMode = 'goal';

let currentInstance: p5 | null = null;

function mountView(mode: ViewMode, shots: Shot[]) {
  if (currentInstance) {
    currentInstance.remove();
  }
  const factory = mode === 'goal' ? createGoalSketch : createGoalSketch;
  currentInstance = new p5(factory(shots));
}

function createToggleUI(shots: Shot[]) {
  const bar = document.createElement('div');
  bar.className = 'toggle-bar';

  const { matchSlots } = buildMatchSlots(shots);
  const picker = createMatchPicker(matchSlots, (matchId) => {
    (currentInstance as any)?.jumpToMatch?.(matchId);
  });
  bar.appendChild(picker);

  document.body.appendChild(bar);
}

async function bootstrap() {
  const shots = await loadShots();
  console.log(`Loaded ${shots.length} shots`);
  createToggleUI(shots);
  mountView('goal', shots);
}

bootstrap();