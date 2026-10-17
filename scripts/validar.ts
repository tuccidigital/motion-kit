/** Uso: npm run validar -- caminho/VIDEO.json [outro.json ...] */
import { lerProps } from './comum';

const arquivos = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (!arquivos.length) {
  console.error('Informe ao menos um JSON. Ex.: npm run validar -- exemplos/case.json');
  process.exit(1);
}
let falhas = 0;
for (const a of arquivos) {
  try {
    const { tipo } = lerProps(a);
    console.log(`ok  ${a} (${tipo})`);
  } catch (e) {
    falhas++;
    console.error(`ERRO ${(e as Error).message}`);
  }
}
process.exit(falhas ? 1 : 0);
