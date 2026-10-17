import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { detectarTipo, errosLegiveis, schemaDoTipo, type TipoProps } from '../src/schema';

export const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export const COMP_TIPO: Record<string, TipoProps> = {
  Case: 'case', CaseQuadrado: 'case', CaseVertical: 'case',
  Carrossel: 'carrossel', DicaTecnica: 'dica', DicaTecnicaVertical: 'dica',
  Vinheta: 'case', VinhetaQuadrada: 'case',
};

export function args(argv = process.argv.slice(2)) {
  const out: Record<string, string> = {};
  for (const a of argv) {
    const m = a.match(/^--([^=]+)=(.*)$/);
    if (m) out[m[1]] = m[2];
    else if (a.startsWith('--')) out[a.slice(2)] = 'true';
  }
  return out;
}

/** Lê e valida um JSON. Sai com erro legível se algo estiver errado. */
export function lerProps(caminho: string, tipoEsperado?: TipoProps) {
  const abs = resolve(caminho);
  if (!existsSync(abs)) throw new Error(`arquivo não encontrado: ${abs}`);
  let dados: unknown;
  try {
    dados = JSON.parse(readFileSync(abs, 'utf-8'));
  } catch (e) {
    throw new Error(`${caminho} não é um JSON válido: ${(e as Error).message}`);
  }
  const tipo = tipoEsperado ?? detectarTipo(dados);
  const r = schemaDoTipo(tipo).safeParse(dados);
  if (!r.success) {
    const linhas = errosLegiveis(r.error).map((l) => `  • ${l}`).join('\n');
    throw new Error(`${caminho} tem ${r.error.issues.length} problema(s):\n${linhas}`);
  }
  return { dados: r.data as Record<string, unknown>, tipo, pasta: dirname(abs) };
}

/** Copia gravações e áudios referenciados pelo JSON para public/_render e reescreve os caminhos. */
export function prepararMidia(dados: Record<string, unknown>, pastaJson: string) {
  const destino = join(RAIZ, 'public', '_render');
  mkdirSync(destino, { recursive: true });
  const copiar = (rel: string) => {
    if (rel.startsWith('pendente:') || rel.startsWith('http')) return rel;
    const origem = resolve(pastaJson, rel);
    if (!existsSync(origem)) throw new Error(`mídia não encontrada: ${origem}\n  (use "pendente:${rel}" para renderizar com o quadro de gravação pendente)`);
    const h = createHash('sha1').update(origem).digest('hex').slice(0, 8);
    const nome = `${h}-${basename(origem)}`;
    copyFileSync(origem, join(destino, nome));
    return `_render/${nome}`;
  };
  const telas = (dados.telas as Array<Record<string, unknown>> | undefined)?.map((t) => ({ ...t, arquivo: copiar(String(t.arquivo)) }));
  const audio = dados.audio as { trilha: string | null; locucao: string | null } | undefined;
  return {
    ...dados,
    ...(telas ? { telas } : {}),
    ...(audio ? { audio: { trilha: audio.trilha ? copiar(audio.trilha) : null, locucao: audio.locucao ? copiar(audio.locucao) : null } } : {}),
  };
}

/** Em Linux sem o Chrome do Remotion, usa o headless_shell do Playwright se existir. */
export function navegador(): string | undefined {
  if (process.env.REMOTION_BROWSER) return process.env.REMOTION_BROWSER;
  const base = '/opt/pw-browsers';
  if (process.platform === 'linux' && existsSync(base)) {
    const pasta = readdirSync(base).find((d) => d.startsWith('chromium_headless_shell'));
    if (pasta) {
      const exe = join(base, pasta, 'chrome-linux', 'headless_shell');
      if (existsSync(exe)) return exe;
    }
  }
  return undefined;
}
