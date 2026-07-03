import type { MatchSlot } from '../types.js';

export function createMatchPicker(
  matchSlots: MatchSlot[],
  onSelect: (matchId: number) => void
): HTMLSelectElement {
  const select = document.createElement('select');
  select.className = 'match-picker';

  const placeholder = document.createElement('option');
  placeholder.textContent = 'Jump to match…';
  placeholder.disabled = true;
  placeholder.selected = true;
  select.appendChild(placeholder);

  const byStage = new Map<string, MatchSlot[]>();
  for (const slot of matchSlots) {
    const arr = byStage.get(slot.stage) ?? [];
    arr.push(slot);
    byStage.set(slot.stage, arr);
  }

  for (const [stage, slots] of byStage) {
    const group = document.createElement('optgroup');
    group.label = stage;
    for (const slot of slots) {
      const opt = document.createElement('option');
      opt.value = String(slot.matchId);
      opt.textContent = `${slot.homeTeam} vs ${slot.awayTeam}`;
      group.appendChild(opt);
    }
    select.appendChild(group);
  }

  select.onchange = () => onSelect(Number(select.value));
  return select;
}