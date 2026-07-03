/**
 * Three colors per nation, drawn from each country's actual flag.
 * Where a flag only has two real colors (e.g. Japan, Switzerland), the
 * dominant color is repeated so every team still resolves to a triple —
 * this keeps the tricolor ball rendering uniform across all 32 teams.
 */
export const TEAM_COLORS: Record<string, [string, string, string]> = {
  Argentina: ['#75AADB', '#FFFFFF', '#F6B40E'],
  Australia: ['#00008B', '#FF0000', '#FFFFFF'],
  Belgium: ['#000000', '#FDDA24', '#EF3340'],
  Brazil: ['#009739', '#FEDD00', '#012169'],
  Cameroon: ['#007A5E', '#CE1126', '#FCD116'],
  Canada: ['#FF0000', '#FFFFFF', '#FF0000'],
  'Costa Rica': ['#002B7F', '#FFFFFF', '#CE1126'],
  Croatia: ['#FF0000', '#FFFFFF', '#0093DD'],
  Denmark: ['#C60C30', '#FFFFFF', '#C60C30'],
  Ecuador: ['#FFDD00', '#034EA2', '#ED1C24'],
  England: ['#FFFFFF', '#CE1124', '#FFFFFF'],
  France: ['#0055A4', '#FFFFFF', '#EF4135'],
  Germany: ['#000000', '#DD0000', '#FFCE00'],
  Ghana: ['#CE1126', '#FCD116', '#006B3F'],
  Iran: ['#239F40', '#FFFFFF', '#DA0000'],
  Japan: ['#FFFFFF', '#BC002D', '#FFFFFF'],
  Mexico: ['#006847', '#FFFFFF', '#CE1126'],
  Morocco: ['#C1272D', '#006233', '#C1272D'],
  Netherlands: ['#AE1C28', '#FFFFFF', '#21468B'],
  Poland: ['#FFFFFF', '#DC143C', '#FFFFFF'],
  Portugal: ['#046A38', '#DA020E', '#FFCC00'],
  Qatar: ['#8D1B3D', '#FFFFFF', '#8D1B3D'],
  'Saudi Arabia': ['#006C35', '#FFFFFF', '#006C35'],
  Senegal: ['#00853F', '#FDEF42', '#E31B23'],
  Serbia: ['#C6363C', '#0C4076', '#FFFFFF'],
  'South Korea': ['#FFFFFF', '#C60C30', '#003478'],
  Spain: ['#AA151B', '#F1BF00', '#AA151B'],
  Switzerland: ['#FF0000', '#FFFFFF', '#FF0000'],
  Tunisia: ['#E70013', '#FFFFFF', '#E70013'],
  'United States': ['#3C3B6E', '#FFFFFF', '#B22234'],
  Uruguay: ['#75AADB', '#FFFFFF', '#FCD116'],
  Wales: ['#FFFFFF', '#00B140', '#C8102E'],
};

const FALLBACK: [string, string, string] = ['#888888', '#888888', '#888888'];

/** Single representative color — used where only one swatch is needed (e.g. line tints). */
export function teamColor(team: string): string {
  return (TEAM_COLORS[team] ?? FALLBACK)[0];
}

/** Full three-color set, for the tricolor ball rendering. */
export function teamColorSet(team: string): [string, string, string] {
  return TEAM_COLORS[team] ?? FALLBACK;
}
