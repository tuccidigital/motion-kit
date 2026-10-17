import { loadFont } from '@remotion/fonts';
import React from 'react';
import { Composition, staticFile } from 'remotion';
import { Carrossel } from './composicoes/Carrossel';
import { Case } from './composicoes/Case';
import { DicaTecnica } from './composicoes/DicaTecnica';
import { Vinheta } from './composicoes/Vinheta';
import { duracaoCase, duracaoDica, type Formato } from './duracoes';
import { carrosselSchema, dicaSchema, videoCaseSchema, type Carrossel as CarrosselT, type Dica, type VideoCase } from './schema';
import { FPS } from './tema';
import exemploCase from '../exemplos/case.json';
import exemploCarrossel from '../exemplos/carrossel.json';
import exemploDica from '../exemplos/dica.json';

const fontes: Array<[string, string, string]> = [
  ['Archivo', 'fonts/Archivo-500.woff2', '500'],
  ['Archivo', 'fonts/Archivo-700.woff2', '700'],
  ['Archivo', 'fonts/Archivo-800.woff2', '800'],
  ['Figtree', 'fonts/Figtree-400.woff2', '400'],
  ['Figtree', 'fonts/Figtree-600.woff2', '600'],
  ['JetBrains Mono', 'fonts/JetBrainsMono-400.woff2', '400'],
];
for (const [family, arquivo, weight] of fontes) {
  loadFont({ family, url: staticFile(arquivo), weight }).catch(() => undefined);
}

const caseBase = videoCaseSchema.parse(exemploCase);

const formatos: Array<{ id: string; formato: Formato; width: number; height: number }> = [
  { id: 'Case', formato: 'horizontal', width: 1920, height: 1080 },
  { id: 'CaseQuadrado', formato: 'quadrado', width: 1080, height: 1080 },
  { id: 'CaseVertical', formato: 'vertical', width: 1080, height: 1920 },
];

export const Root: React.FC = () => (
  <>
    <Composition id="Vinheta" component={Vinheta} durationInFrames={3 * FPS} fps={FPS} width={1920} height={1080} />
    <Composition id="VinhetaQuadrada" component={Vinheta} durationInFrames={3 * FPS} fps={FPS} width={1080} height={1080} />
    {formatos.map((f) => (
      <Composition
        key={f.id}
        id={f.id}
        component={Case as unknown as React.FC<Record<string, unknown>>}
        schema={videoCaseSchema}
        defaultProps={caseBase as unknown as Record<string, unknown>}
        fps={FPS}
        width={f.width}
        height={f.height}
        durationInFrames={duracaoCase(caseBase, f.formato)}
        calculateMetadata={({ props }: { props: Record<string, unknown> }) => {
          const v = props as unknown as VideoCase;
          return { durationInFrames: duracaoCase(v, f.formato), props: { ...props, formato: f.formato } };
        }}
      />
    ))}
    <Composition
      id="Carrossel"
      component={Carrossel as unknown as React.FC<Record<string, unknown>>}
      schema={carrosselSchema}
      defaultProps={carrosselSchema.parse(exemploCarrossel) as unknown as Record<string, unknown>}
      fps={1}
      width={1080}
      height={1350}
      durationInFrames={carrosselSchema.parse(exemploCarrossel).slides.length + 1}
      calculateMetadata={({ props }: { props: Record<string, unknown> }) => ({ durationInFrames: (props as unknown as CarrosselT).slides.length + 1 })}
    />
    {[
      { id: 'DicaTecnica', width: 1080, height: 1350 },
      { id: 'DicaTecnicaVertical', width: 1080, height: 1920 },
    ].map((c) => (
      <Composition
        key={c.id}
        id={c.id}
        component={DicaTecnica as unknown as React.FC<Record<string, unknown>>}
        schema={dicaSchema}
        defaultProps={dicaSchema.parse(exemploDica) as unknown as Record<string, unknown>}
        fps={FPS}
        width={c.width}
        height={c.height}
        durationInFrames={duracaoDica(dicaSchema.parse(exemploDica)).total}
        calculateMetadata={({ props }: { props: Record<string, unknown> }) => ({ durationInFrames: duracaoDica(props as unknown as Dica).total })}
      />
    ))}
  </>
);
