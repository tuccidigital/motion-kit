import React from 'react';
import { Easing, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { cor } from '../tema';

// Caminhos do símbolo [t] (tucci-symbol-reverse.svg), viewBox -3 -3 64.9 70.
const COLCHETE_ESQ = 'M15.5 2.7H2.7V61.3H15.5';
const COLCHETE_DIR = 'M43.4 2.7H56.2V61.3H43.4';
const LETRA_T =
  'M32.36032 49.29728Q29.8144 49.29728 28.04224 48.52352Q26.27008 47.749759999999995 25.39648 46.202239999999996Q24.52288 44.65472 24.52288 42.458239999999996V28.33088H21.078400000000002V22.3904H24.77248L26.46976 14.70272H32.65984V22.3904H37.8016V28.33088H32.65984V40.461439999999996Q32.65984 41.8592 33.208960000000005 42.608000000000004Q33.75808 43.3568 35.20576 43.3568H37.8016V48.44864Q37.152640000000005 48.64832 36.1792 48.87296Q35.20576 49.0976 34.20736 49.19744Q33.208960000000005 49.29728 32.36032 49.29728Z';

const suave = Easing.bezier(0.2, 0, 0, 1);

/**
 * Vinheta da marca: os colchetes se abrem em musgo-claro, o t entra e o nome aparece ao lado.
 * `inicio` é o frame em que a animação começa; dura ~30 frames.
 */
export const VinhetaAnimada: React.FC<{ altura: number; inicio?: number; comNome?: boolean; escuro?: boolean }> = ({
  altura,
  inicio = 0,
  comNome = true,
  escuro = true,
}) => {
  const f = useCurrentFrame() - inicio;
  const cl = (a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: suave });
  const abre = cl(0, 12); // colchetes saem do centro
  const traco = cl(0, 10);
  const t = cl(8, 18);
  const nome = cl(16, 28);
  const largura = (altura * 64.9) / 70;
  const corColchete = escuro ? cor.musgoClaro : cor.musgo;
  const corT = escuro ? '#FFFFFF' : cor.ink;
  const deslocamento = (1 - abre) * 13; // unidades do viewBox
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: altura * 0.28 }}>
      <svg viewBox="-3 -3 64.9 70" width={largura} height={altura} style={{ overflow: 'visible' }}>
        <path
          d={COLCHETE_ESQ}
          transform={`translate(${deslocamento} 0)`}
          fill="none"
          stroke={corColchete}
          strokeWidth={5.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - traco}
        />
        <path
          d={COLCHETE_DIR}
          transform={`translate(${-deslocamento} 0)`}
          fill="none"
          stroke={corColchete}
          strokeWidth={5.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - traco}
        />
        <path d={LETRA_T} fill={corT} opacity={t} transform={`translate(0 ${(1 - t) * 6})`} />
      </svg>
      {comNome ? (
        <div style={{ overflow: 'hidden', width: altura * 2.75 * nome, height: altura * 1.4, display: 'flex', alignItems: 'center' }}>
          <Img
            src={staticFile(escuro ? 'marca/tucci-wordmark-reverse.svg' : 'marca/tucci-wordmark.svg')}
            style={{ height: altura * 1.25, opacity: nome, flex: 'none' }}
          />
        </div>
      ) : null}
    </div>
  );
};
