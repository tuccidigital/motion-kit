import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { Fundo, useEscala } from '../componentes/base';
import { VinhetaAnimada } from '../componentes/Simbolo';

/** 3 s: os colchetes se abrem em musgo-claro, o t entra e o nome aparece ao lado. */
export const Vinheta: React.FC = () => {
  const { u, formato } = useEscala();
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const saida = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <Fundo escuro grade>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: saida }}>
        <VinhetaAnimada altura={(formato === 'horizontal' ? 190 : 150) * u} inicio={6} />
      </AbsoluteFill>
    </Fundo>
  );
};
