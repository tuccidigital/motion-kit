/** Renderiza um exemplo de cada composição em out/exemplos. */
import { join } from 'node:path';
import { RAIZ } from './comum';
import { renderizar } from './render';

const fila: Array<{ comp: string; props?: string; out: string }> = [
  { comp: 'Vinheta', out: 'vinheta-1920x1080.mp4' },
  { comp: 'VinhetaQuadrada', out: 'vinheta-1080x1080.mp4' },
  { comp: 'Case', props: 'exemplos/case.json', out: 'case-1920x1080.mp4' },
  { comp: 'CaseQuadrado', props: 'exemplos/case.json', out: 'case-1080x1080.mp4' },
  { comp: 'CaseVertical', props: 'exemplos/case-en.json', out: 'case-en-1080x1920.mp4' },
  { comp: 'Carrossel', props: 'exemplos/carrossel.json', out: 'carrossel' },
  { comp: 'DicaTecnica', props: 'exemplos/dica.json', out: 'dica-1080x1350.mp4' },
  { comp: 'DicaTecnicaVertical', props: 'exemplos/dica-dax.json', out: 'dica-dax-1080x1920.mp4' },
];

const so = process.argv.slice(2);
for (const item of fila.filter((f) => !so.length || so.includes(f.comp))) {
  console.log(`\n== ${item.comp}`);
  await renderizar({ comp: item.comp, props: item.props && join(RAIZ, item.props), out: join(RAIZ, 'out', 'exemplos', item.out) });
}
