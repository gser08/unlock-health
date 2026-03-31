// Medical self-exam technique definitions with educational content
// Each technique maps to a valid sequence of node indices on the 3x3 grid

export interface Technique {
  id: string;
  name: string;
  nameEn: string;
  emoji: string;
  description: string;
  tip: string;
  guidePath: number[]; // The "ideal" node path to show as ghost guide
  validPaths: number[][]; // All acceptable variations
}

export const TECHNIQUES: Technique[] = [
  {
    id: 'circular',
    name: 'Circular',
    nameEn: 'Circular',
    emoji: '🔄',
    description: 'Traza círculos concéntricos desde el borde hacia el pezón. Es la técnica más recomendada por oncólogos.',
    tip: 'Empieza por la esquina y recorre el borde en círculo hasta llegar al centro.',
    guidePath: [0, 1, 2, 5, 8, 7, 6, 3, 4],
    validPaths: [
      [0, 1, 2, 5, 8, 7, 6, 3, 4],
      [2, 5, 8, 7, 6, 3, 0, 1, 4],
      [8, 7, 6, 3, 0, 1, 2, 5, 4],
      [6, 3, 0, 1, 2, 5, 8, 7, 4],
      // Counter-clockwise
      [0, 3, 6, 7, 8, 5, 2, 1, 4],
      [6, 7, 8, 5, 2, 1, 0, 3, 4],
      [8, 5, 2, 1, 0, 3, 6, 7, 4],
      [2, 1, 0, 3, 6, 7, 8, 5, 4],
      // Center-outward (reversed)
      [4, 3, 0, 1, 2, 5, 8, 7, 6],
      [4, 1, 2, 5, 8, 7, 6, 3, 0],
      [4, 5, 8, 7, 6, 3, 0, 1, 2],
      [4, 7, 6, 3, 0, 1, 2, 5, 8],
    ],
  },
  {
    id: 'vertical',
    name: 'Vertical',
    nameEn: 'Vertical Strip',
    emoji: '↕️',
    description: 'Recorre el seno de arriba a abajo en franjas verticales como "cortacésped". Cubre toda el área sistemáticamente.',
    tip: 'Baja por una columna, sube por la siguiente, y baja por la última.',
    guidePath: [0, 3, 6, 7, 4, 1, 2, 5, 8],
    validPaths: [
      [0, 3, 6, 7, 4, 1, 2, 5, 8],
      [6, 3, 0, 1, 4, 7, 8, 5, 2],
      [2, 5, 8, 7, 4, 1, 0, 3, 6],
      [8, 5, 2, 1, 4, 7, 6, 3, 0],
    ],
  },
  {
    id: 'horizontal',
    name: 'Horizontal',
    nameEn: 'Horizontal Strip',
    emoji: '↔️',
    description: 'Recorre el seno de izquierda a derecha en franjas horizontales. Ideal si prefieres un barrido lateral.',
    tip: 'Ve de izquierda a derecha, baja, vuelve de derecha a izquierda.',
    guidePath: [0, 1, 2, 5, 4, 3, 6, 7, 8],
    validPaths: [
      [0, 1, 2, 5, 4, 3, 6, 7, 8],
      [2, 1, 0, 3, 4, 5, 8, 7, 6],
      [6, 7, 8, 5, 4, 3, 0, 1, 2],
      [8, 7, 6, 3, 4, 5, 2, 1, 0],
    ],
  },
  {
    id: 'radial',
    name: 'Radial',
    nameEn: 'Wedge / Spoke',
    emoji: '✳️',
    description: 'Traza líneas rectas que cruzan el pezón de un extremo al opuesto, como las "rebanadas de un pastel".',
    tip: 'Elige un borde, cruza por el centro, y termina en el borde opuesto.',
    guidePath: [0, 4, 8],
    validPaths: [
      [0, 4, 8], [8, 4, 0],
      [1, 4, 7], [7, 4, 1],
      [2, 4, 6], [6, 4, 2],
      [3, 4, 5], [5, 4, 3],
    ],
  },
];

// Get the technique for today (cycles through them)
export const getTechniqueForToday = (): Technique => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  return TECHNIQUES[dayOfYear % TECHNIQUES.length];
};

// Check if a drawn path matches any valid path for a given technique
export const validatePath = (drawnPath: number[], technique: Technique): boolean => {
  const drawnString = drawnPath.join(',');
  return technique.validPaths.some(vp => vp.join(',') === drawnString);
};

// Check if a drawn path matches ANY technique
export const validateAnyTechnique = (drawnPath: number[]): Technique | null => {
  const drawnString = drawnPath.join(',');
  for (const technique of TECHNIQUES) {
    if (technique.validPaths.some(vp => vp.join(',') === drawnString)) {
      return technique;
    }
  }
  return null;
};
