import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { CenaChamada, CenaGancho, CenaProblema, CenaProcesso, CenaResultado, CenaTelas, TrilhaAudio } from '../cenas/cenas';
import { cenasDoCase, duracoesTelas, type Formato } from '../duracoes';
import type { VideoCase } from '../schema';

export const Case: React.FC<VideoCase & { formato: Formato }> = ({ formato, ...v }) => {
  const cenas = cenasDoCase(v, formato);
  const telas = duracoesTelas(v, formato);
  return (
    <AbsoluteFill>
      <Series>
        {cenas.map((c) => (
          <Series.Sequence key={c.nome} durationInFrames={c.frames} name={c.nome}>
            {c.nome === 'gancho' ? <CenaGancho v={v} duracao={c.frames} /> : null}
            {c.nome === 'problema' ? <CenaProblema v={v} duracao={c.frames} /> : null}
            {c.nome === 'processo' ? <CenaProcesso v={v} duracao={c.frames} /> : null}
            {c.nome === 'telas' ? <CenaTelas v={v} duracao={c.frames} duracoes={telas} /> : null}
            {c.nome === 'resultado' ? <CenaResultado v={v} duracao={c.frames} /> : null}
            {c.nome === 'chamada' ? <CenaChamada v={v} duracao={c.frames} /> : null}
          </Series.Sequence>
        ))}
      </Series>
      <TrilhaAudio v={v} />
    </AbsoluteFill>
  );
};
