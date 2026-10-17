import React from 'react';
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { cor, ENTRADA, fonte } from '../tema';

/** Unidade de escala: 1 = layout desenhado para o lado menor de 1080 px. */
export function useEscala() {
  const { width, height } = useVideoConfig();
  const menor = Math.min(width, height);
  const formato = width > height ? 'horizontal' : width === height ? 'quadrado' : 'vertical';
  return { u: menor / 1080, width, height, formato } as const;
}

const suave = Easing.bezier(0.2, 0, 0, 1);

/** Entrada curta (opacidade + deslocamento), sem quicar. */
export function useEntrada(atraso = 0, distancia = 24) {
  const frame = useCurrentFrame();
  const p = interpolate(frame - atraso, [0, ENTRADA], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: suave });
  return { opacity: p, transform: `translateY(${(1 - p) * distancia}px)` } as React.CSSProperties;
}

/** Saída no fim da cena: fade de 6 frames. */
export function useSaida(duracao: number) {
  const frame = useCurrentFrame();
  return interpolate(frame, [duracao - 6, duracao], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
}

export const Fundo: React.FC<{ escuro?: boolean; grade?: boolean; children?: React.ReactNode }> = ({ escuro, grade, children }) => {
  const { u } = useEscala();
  const passo = 16 * u * 1.5;
  return (
    <AbsoluteFill
      style={{
        backgroundColor: escuro ? cor.grafite : cor.paper,
        backgroundImage: grade ? `radial-gradient(${cor.pontoGrade} ${1.4 * u}px, transparent ${1.6 * u}px)` : undefined,
        backgroundSize: grade ? `${passo}px ${passo}px` : undefined,
        fontFamily: fonte.sans,
        color: escuro ? '#FFFFFF' : cor.ink,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const Rotulo: React.FC<{ children: React.ReactNode; escuro?: boolean; style?: React.CSSProperties }> = ({ children, escuro, style }) => {
  const { u } = useEscala();
  return (
    <span
      style={{
        fontFamily: fonte.mono,
        fontSize: 22 * u,
        lineHeight: 1.3,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: escuro ? cor.musgoClaro : cor.musgo,
        ...style,
      }}
    >
      {children}
    </span>
  );
};

/** Legenda obrigatória do portfólio: "Dados fictícios". */
export const LegendaFicticia: React.FC<{ texto: string; escuro?: boolean }> = ({ texto, escuro }) => {
  const { u } = useEscala();
  return (
    <div
      style={{
        position: 'absolute',
        right: 40 * u,
        bottom: 32 * u,
        fontFamily: fonte.sans,
        fontSize: 20 * u,
        color: escuro ? cor.apoioEscuro : cor.inkMuted,
        padding: `${4 * u}px ${12 * u}px`,
        border: `${1.5 * u}px solid ${escuro ? '#3A4046' : cor.line}`,
        borderRadius: 999,
        background: escuro ? 'rgba(23,25,28,0.6)' : cor.surface,
      }}
    >
      {texto}
    </div>
  );
};

/** Logo pequeno no canto: lockup claro ou reverso conforme o fundo. */
export const MarcaCanto: React.FC<{ escuro?: boolean }> = ({ escuro }) => {
  const { u } = useEscala();
  return (
    <Img
      src={staticFile(escuro ? 'marca/tucci-digital-lockup-reverse.svg' : 'marca/tucci-digital-lockup.svg')}
      style={{ position: 'absolute', left: 40 * u, bottom: 30 * u, height: 44 * u }}
    />
  );
};
