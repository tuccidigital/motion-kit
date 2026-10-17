import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { Fundo, MarcaCanto, Rotulo, useEntrada, useEscala } from '../componentes/base';
import { duracaoDica } from '../duracoes';
import type { Dica } from '../schema';
import { cor, fonte, FPS, textos } from '../tema';

/** Dica de Power Fx, DAX ou expressão com o código sendo digitado na tela. */
export const DicaTecnica: React.FC<Dica> = (d) => {
  const frame = useCurrentFrame();
  const { u, formato } = useEscala();
  const t = textos[d.idioma];
  const { digitacao, inicioCodigo } = duracaoDica(d);
  const visiveis = Math.floor(interpolate(frame - inicioCodigo, [0, Math.max(1, digitacao)], [0, d.codigo.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  const cursor = Math.floor(frame / 15) % 2 === 0 || visiveis < d.codigo.length;
  const fimDigitacao = inicioCodigo + digitacao;
  const vertical = formato === 'vertical';
  return (
    <Fundo>
      <AbsoluteFill style={{ padding: `${(vertical ? 140 : 96) * u}px ${80 * u}px ${160 * u}px`, gap: 40 * u }}>
        <div style={useEntrada(0)}><Rotulo>{`${t.dica} · ${d.linguagem}`}</Rotulo></div>
        <div style={useEntrada(4, 28)}>
          <h2 style={{ fontFamily: fonte.display, fontWeight: 800, fontSize: (vertical ? 80 : 70) * u, lineHeight: 1.08, letterSpacing: '-0.02em', margin: 0, textWrap: 'balance' }}>{d.titulo}</h2>
        </div>
        <pre
          style={{
            ...useEntrada(inicioCodigo - 8, 16),
            fontFamily: fonte.mono, fontSize: (vertical ? 34 : 30) * u, lineHeight: 1.5, background: cor.grafite, color: '#E8EAE5',
            padding: 40 * u, borderRadius: 10 * u, margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', minHeight: 200 * u,
          }}
        >
          {d.codigo.slice(0, visiveis)}
          {cursor ? <span style={{ background: cor.musgoClaro, color: cor.grafite }}>&nbsp;</span> : null}
        </pre>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 * u }}>
          {d.explicacao.map((e, i) => (
            <div key={i} style={{ ...useEntrada(fimDigitacao + 10 + i * Math.round(3 * FPS)), display: 'flex', gap: 20 * u, fontFamily: fonte.sans, fontSize: (vertical ? 38 : 34) * u, lineHeight: 1.4 }}>
              <span style={{ width: 14 * u, height: 14 * u, borderRadius: 999, background: cor.musgo, marginTop: 18 * u, flex: 'none' }} />
              {e}
            </div>
          ))}
        </div>
        {d.chamada ? (
          <div style={{ ...useEntrada(fimDigitacao + 10 + d.explicacao.length * Math.round(3 * FPS)), fontFamily: fonte.sans, fontWeight: 600, fontSize: 30 * u, color: cor.musgo }}>{d.chamada}</div>
        ) : null}
      </AbsoluteFill>
      <MarcaCanto />
    </Fundo>
  );
};
