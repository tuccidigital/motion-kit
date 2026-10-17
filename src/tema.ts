// Tokens do design system Tucci Digital Solutions (paleta Grafite & Musgo).
export const cor = {
  musgo: '#5B6B35',
  musgoClaro: '#9DB067',
  grafite: '#17191C',
  cobalt: '#2C47A6',
  paper: '#F2F3EF',
  surface: '#FFFFFF',
  surfaceSunk: '#E5E7E1',
  ink: '#17191C',
  inkMuted: '#51565C',
  line: '#D2D5CD',
  lineStrong: '#7A8077',
  onMusgo: '#FFFFFF',
  apoioEscuro: '#B8BCC0',
  pontoGrade: '#353D2B',
  success: '#1C7346',
  warning: '#8F5B00',
  danger: '#B0281F',
} as const;

export const fonte = {
  display: '"Archivo", "Segoe UI", system-ui, sans-serif',
  sans: '"Figtree", "Segoe UI", system-ui, sans-serif',
  mono: '"JetBrains Mono", Consolas, monospace',
} as const;

export type Idioma = 'pt-BR' | 'en-US';

export const textos: Record<Idioma, Record<string, string>> = {
  'pt-BR': {
    dadosFicticios: 'Dados fictícios',
    resultado: 'Resultado',
    resultadoEsperado: 'Resultado esperado',
    problema: 'O problema',
    processo: 'Como ficou',
    gravacaoPendente: 'Gravação pendente',
    dica: 'Dica',
    site: 'tuccidigital.com',
  },
  'en-US': {
    dadosFicticios: 'Sample data',
    resultado: 'Result',
    resultadoEsperado: 'Expected result',
    problema: 'The problem',
    processo: 'What we built',
    gravacaoPendente: 'Recording pending',
    dica: 'Tip',
    site: 'tuccidigital.com',
  },
};

export const FPS = 30;

// Movimento da marca: entradas curtas (200–400 ms), sem quicar, sem gradiente.
export const ENTRADA = 9; // frames (300 ms)
