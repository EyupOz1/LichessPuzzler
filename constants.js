const DEFAULT_SETTINGS = {
  enabled: true,
  triggerMode: 'newtab',
  timerInterval: 60,
  themes: ['mix'],
  newTabProbability: 30,
  colorTheme: 'crimson'
};

const COLOR_THEMES = {
  crimson:  { accent: '#e94560', bg: '#1a1a2e', surface: '#16213e', surfaceHover: '#1f2b47', border: '#2a2a4a', bgDeep: '#0f0f23' },
  ocean:    { accent: '#4596e9', bg: '#1a2230', surface: '#162a3e', surfaceHover: '#1f3550', border: '#2a3a5a', bgDeep: '#0f1723' },
  emerald:  { accent: '#45e996', bg: '#1a2e24', surface: '#163e2a', surfaceHover: '#1f4735', border: '#2a4a3a', bgDeep: '#0f2318' },
  purple:   { accent: '#9b59e9', bg: '#221a2e', surface: '#2a163e', surfaceHover: '#351f47', border: '#3a2a5a', bgDeep: '#180f23' },
  amber:    { accent: '#e9a345', bg: '#2e261a', surface: '#3e2f16', surfaceHover: '#47381f', border: '#4a3f2a', bgDeep: '#231c0f' },
  teal:     { accent: '#45d4e9', bg: '#1a2a2e', surface: '#16353e', surfaceHover: '#1f4047', border: '#2a4a4e', bgDeep: '#0f2023' }
};

function applyColorTheme(themeId) {
  var theme = COLOR_THEMES[themeId] || COLOR_THEMES.crimson;
  var r = parseInt(theme.accent.slice(1, 3), 16);
  var g = parseInt(theme.accent.slice(3, 5), 16);
  var b = parseInt(theme.accent.slice(5, 7), 16);
  var root = document.documentElement;
  root.style.setProperty('--accent', theme.accent);
  root.style.setProperty('--accent-rgb', r + ', ' + g + ', ' + b);
  root.style.setProperty('--bg', theme.bg);
  root.style.setProperty('--surface', theme.surface);
  root.style.setProperty('--surface-hover', theme.surfaceHover);
  root.style.setProperty('--border', theme.border);
  root.style.setProperty('--bg-deep', theme.bgDeep);
}

const THEMES = [
  { id: 'mix', label: 'Random Mix' },
  { id: 'opening', label: 'Opening' },
  { id: 'middlegame', label: 'Middlegame' },
  { id: 'endgame', label: 'Endgame' },
  { id: 'mateIn1', label: 'Mate in 1' },
  { id: 'mateIn2', label: 'Mate in 2' },
  { id: 'mateIn3', label: 'Mate in 3' },
  { id: 'fork', label: 'Fork' },
  { id: 'pin', label: 'Pin' },
  { id: 'skewer', label: 'Skewer' },
  { id: 'discoveredAttack', label: 'Discovered Attack' },
  { id: 'doubleCheck', label: 'Double Check' },
  { id: 'sacrifice', label: 'Sacrifice' },
  { id: 'hangingPiece', label: 'Hanging Piece' },
  { id: 'trappedPiece', label: 'Trapped Piece' },
  { id: 'backRankMate', label: 'Back Rank Mate' },
  { id: 'smotheredMate', label: 'Smothered Mate' },
  { id: 'promotion', label: 'Promotion' },
  { id: 'enPassant', label: 'En Passant' },
  { id: 'castling', label: 'Castling' },
  { id: 'short', label: 'Short (2 moves)' },
  { id: 'long', label: 'Long (3 moves)' },
  { id: 'crushing', label: 'Crushing' },
  { id: 'advantage', label: 'Advantage' },
  { id: 'equality', label: 'Equality' }
];
