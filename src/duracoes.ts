import { FPS } from './tema';
import type { Dica, VideoCase } from './schema';

export type Formato = 'horizontal' | 'quadrado' | 'vertical';

type Tempos = { gancho: number; problema: number; processoBase: number; porEtapa: number; resultado: number; chamada: number; telasMax: number };

// Segundos por cena em cada formato. Horizontal: 60–90 s; quadrado: 45–60 s; vertical: 30–45 s.
const TEMPOS: Record<Formato, Tempos> = {
  horizontal: { gancho: 5, problema: 10, processoBase: 3, porEtapa: 2.2, resultado: 8, chamada: 6, telasMax: 60 },
  quadrado: { gancho: 4, problema: 8, processoBase: 2.5, porEtapa: 1.8, resultado: 7, chamada: 4.5, telasMax: 26 },
  vertical: { gancho: 3.5, problema: 6, processoBase: 2, porEtapa: 1.4, resultado: 6, chamada: 4, telasMax: 16 },
};

export type Cena = { nome: 'gancho' | 'problema' | 'processo' | 'telas' | 'resultado' | 'chamada'; frames: number };

/** Duração de cada trecho de tela no formato, cortando do fim quando passa do teto do formato. */
export function duracoesTelas(v: Pick<VideoCase, 'telas'>, formato: Formato): number[] {
  let restante = TEMPOS[formato].telasMax;
  return v.telas.map((t) => {
    const d = Math.max(0, Math.min(t.fim - t.inicio, restante));
    restante -= d;
    return Math.round(d * FPS);
  });
}

export function cenasDoCase(v: Pick<VideoCase, 'telas' | 'processo'>, formato: Formato): Cena[] {
  const t = TEMPOS[formato];
  const s = (seg: number) => Math.round(seg * FPS);
  const telas = duracoesTelas(v, formato).reduce((a, b) => a + b, 0);
  return [
    { nome: 'gancho', frames: s(t.gancho) },
    { nome: 'problema', frames: s(t.problema) },
    { nome: 'processo', frames: s(t.processoBase + t.porEtapa * v.processo.length) },
    { nome: 'telas', frames: Math.max(telas, s(2)) },
    { nome: 'resultado', frames: s(t.resultado) },
    { nome: 'chamada', frames: s(t.chamada) },
  ];
}

export function duracaoCase(v: Pick<VideoCase, 'telas' | 'processo'>, formato: Formato): number {
  return cenasDoCase(v, formato).reduce((a, c) => a + c.frames, 0);
}

/** Dica técnica: digitação a ~22 caracteres/s, depois a explicação. Entre 20 e 40 s. */
export function duracaoDica(d: Pick<Dica, 'codigo' | 'explicacao'>): { total: number; digitacao: number; inicioCodigo: number } {
  const inicioCodigo = Math.round(2 * FPS);
  const digitacao = Math.round((d.codigo.length / 22) * FPS);
  const explicacao = Math.round((3.5 + 3 * d.explicacao.length) * FPS);
  const total = Math.min(40 * FPS, Math.max(20 * FPS, inicioCodigo + digitacao + explicacao + 3 * FPS));
  return { total, digitacao, inicioCodigo };
}
