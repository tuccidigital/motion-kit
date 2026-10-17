import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { Fundo, Rotulo, useEscala } from '../componentes/base';
import type { Carrossel as CarrosselProps } from '../schema';
import { cor, fonte, textos } from '../tema';

/** Uma lâmina por frame. Renderize com scripts/render.ts --comp=Carrossel: sai 01.png, 02.png… */
export const Carrossel: React.FC<CarrosselProps> = (p) => {
  const frame = useCurrentFrame();
  const { u } = useEscala();
  const t = textos[p.idioma];
  const total = p.slides.length + 1;
  const indice = Math.min(frame, total - 1);
  const pagina = `${String(indice + 1).padStart(2, '0')}/${String(total).padStart(2, '0')}`;

  if (indice === total - 1) {
    return (
      <Fundo escuro grade>
        <AbsoluteFill style={{ padding: 88 * u, justifyContent: 'center', gap: 48 * u }}>
          <Img src={staticFile('marca/tucci-digital-lockup-reverse.svg')} style={{ height: 120 * u, alignSelf: 'flex-start' }} />
          <h2 style={{ fontFamily: fonte.display, fontWeight: 800, fontSize: 76 * u, lineHeight: 1.08, letterSpacing: '-0.02em', margin: 0, color: cor.musgoClaro, textWrap: 'balance' }}>
            {p.chamada}
          </h2>
          <span style={{ fontFamily: fonte.mono, fontSize: 30 * u, color: cor.apoioEscuro }}>{t.site}</span>
        </AbsoluteFill>
        <Rodape pagina={pagina} escuro ficticio={false} legenda="" />
      </Fundo>
    );
  }

  const s = p.slides[indice];
  return (
    <Fundo>
      <AbsoluteFill style={{ padding: `${96 * u}px ${88 * u}px ${150 * u}px`, gap: 36 * u, justifyContent: indice === 0 ? 'center' : 'flex-start' }}>
        {s.rotulo ? <Rotulo>{s.rotulo}</Rotulo> : null}
        <h2 style={{ fontFamily: fonte.display, fontWeight: indice === 0 ? 800 : 700, fontSize: (indice === 0 ? 84 : 60) * u, lineHeight: 1.1, letterSpacing: '-0.01em', margin: 0, textWrap: 'balance' }}>
          {s.titulo}
        </h2>
        {s.texto ? <p style={{ fontFamily: fonte.sans, fontSize: 36 * u, lineHeight: 1.5, color: cor.inkMuted, margin: 0, maxWidth: 860 * u }}>{s.texto}</p> : null}
        {s.codigo ? (
          <pre style={{ fontFamily: fonte.mono, fontSize: 28 * u, lineHeight: 1.5, background: cor.surfaceSunk, color: cor.ink, padding: 32 * u, borderRadius: 6 * u, margin: 0, whiteSpace: 'pre-wrap' }}>
            {s.codigo}
          </pre>
        ) : null}
        {s.lista ? (
          <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 20 * u }}>
            {s.lista.map((item, i) => (
              <li key={i} style={{ display: 'flex', gap: 20 * u, fontFamily: fonte.sans, fontSize: 36 * u, lineHeight: 1.35 }}>
                <span style={{ width: 14 * u, height: 14 * u, borderRadius: 999, background: cor.musgo, marginTop: 16 * u, flex: 'none' }} />
                {item}
              </li>
            ))}
          </ul>
        ) : null}
      </AbsoluteFill>
      <Rodape pagina={pagina} ficticio={p.ficticio} legenda={t.dadosFicticios} />
    </Fundo>
  );
};

const Rodape: React.FC<{ pagina: string; escuro?: boolean; ficticio: boolean; legenda: string }> = ({ pagina, escuro, ficticio, legenda }) => {
  const { u } = useEscala();
  return (
    <div style={{ position: 'absolute', left: 88 * u, right: 88 * u, bottom: 56 * u, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {!escuro ? <Img src={staticFile('marca/tucci-digital-lockup.svg')} style={{ height: 52 * u }} /> : <span />}
      <span style={{ display: 'flex', gap: 24 * u, alignItems: 'center', fontFamily: fonte.mono, fontSize: 24 * u, color: escuro ? cor.apoioEscuro : cor.inkMuted }}>
        {ficticio ? <span style={{ fontFamily: fonte.sans }}>{legenda}</span> : null}
        {pagina}
      </span>
    </div>
  );
};
