export const POSITIONS = [
  { left: 8, top: 8 },
  { left: 50, top: 8 },
  { left: 92, top: 8 },

  { left: 8, top: 50 },
  { left: 50, top: 50 },
  { left: 92, top: 50 },

  { left: 8, top: 92 },
  { left: 50, top: 92 },
  { left: 92, top: 92 },
];

export const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export const ADJACENCY = {
  0: [1, 3, 4],
  1: [0, 2, 4],
  2: [1, 5, 4],
  3: [0, 4, 6],
  4: [0, 1, 2, 3, 5, 6, 7, 8],
  5: [2, 4, 8],
  6: [3, 4, 7],
  7: [6, 4, 8],
  8: [5, 4, 7],
};