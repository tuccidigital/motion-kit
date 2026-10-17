/**
 * Uso: npm run render -- --props=caminho/VIDEO.json --comp=Case [--out=out/arquivo.mp4]
 * Composições: Vinheta, VinhetaQuadrada, Case, CaseQuadrado, CaseVertical, Carrossel, DicaTecnica, DicaTecnicaVertical.
 */
import { bundle } from '@remotion/bundler';
import { renderMedia, renderStill, selectComposition } from '@remotion/renderer';
import { mkdirSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { args, COMP_TIPO, lerProps, navegador, prepararMidia, RAIZ } from './comum';

let bundleCache: string | null = null;

export async function renderizar(opts: { props?: string; comp: string; out?: string }) {
  const comp = opts.comp;
  if (!(comp in COMP_TIPO)) throw new Error(`composição desconhecida: ${comp}. Use: ${Object.keys(COMP_TIPO).join(', ')}`);
  let inputProps: Record<string, unknown> = {};
  let nomeBase = comp;
  if (opts.props) {
    const { dados, pasta } = lerProps(opts.props, COMP_TIPO[comp]);
    inputProps = prepararMidia(dados, pasta);
    nomeBase = `${basename(opts.props, '.json')}-${comp}`;
  }
  if (!bundleCache) {
    process.stdout.write('Empacotando o projeto... ');
    bundleCache = await bundle({ entryPoint: join(RAIZ, 'src', 'index.ts'), publicDir: join(RAIZ, 'public') });
    console.log('ok');
  }
  const browserExecutable = navegador();
  const composition = await selectComposition({ serveUrl: bundleCache, id: comp, inputProps, browserExecutable });

  if (comp === 'Carrossel') {
    const pasta = resolve(opts.out ?? join(RAIZ, 'out', nomeBase));
    mkdirSync(pasta, { recursive: true });
    for (let f = 0; f < composition.durationInFrames; f++) {
      const arquivo = join(pasta, `${String(f + 1).padStart(2, '0')}.png`);
      await renderStill({ composition, serveUrl: bundleCache, output: arquivo, frame: f, inputProps, browserExecutable, imageFormat: 'png' });
    }
    console.log(`${composition.durationInFrames} lâminas em ${pasta}`);
    return pasta;
  }

  const saida = resolve(opts.out ?? join(RAIZ, 'out', `${nomeBase}.mp4`));
  mkdirSync(dirname(saida), { recursive: true });
  let ultimo = -1;
  await renderMedia({
    composition, serveUrl: bundleCache, codec: 'h264', outputLocation: saida, inputProps, browserExecutable,
    concurrency: 2, crf: 20,
    onProgress: ({ progress }) => {
      const p = Math.floor(progress * 10);
      if (p !== ultimo) { ultimo = p; process.stdout.write(`${p * 10}% `); }
    },
  });
  console.log(`\n${saida} (${(composition.durationInFrames / composition.fps).toFixed(1)} s)`);
  return saida;
}

const ehPrincipal = process.argv[1] && resolve(process.argv[1]).endsWith(join('scripts', 'render.ts'));
if (ehPrincipal) {
  const a = args();
  if (!a.comp) {
    console.error('Informe --comp. Ex.: npm run render -- --props=exemplos/case.json --comp=Case');
    process.exit(1);
  }
  renderizar({ props: a.props, comp: a.comp, out: a.out }).catch((e) => {
    console.error(`\nErro: ${(e as Error).message}`);
    process.exit(1);
  });
}
