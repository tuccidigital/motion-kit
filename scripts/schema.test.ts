import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import { cenasDoCase, duracaoCase, duracaoDica, duracoesTelas } from '../src/duracoes';
import { carrosselSchema, detectarTipo, dicaSchema, errosLegiveis, videoCaseSchema } from '../src/schema';
import { RAIZ } from './comum';

const ler = (n: string) => JSON.parse(readFileSync(join(RAIZ, 'exemplos', n), 'utf-8'));

test('todos os exemplos são válidos', () => {
  assert.ok(videoCaseSchema.safeParse(ler('case.json')).success);
  assert.ok(videoCaseSchema.safeParse(ler('case-en.json')).success);
  assert.ok(carrosselSchema.safeParse(ler('carrossel.json')).success);
  assert.ok(dicaSchema.safeParse(ler('dica.json')).success);
  assert.ok(dicaSchema.safeParse(ler('dica-dax.json')).success);
});

test('resultado não medido exige ficticio: true', () => {
  const c = { ...ler('case.json'), ficticio: false };
  const r = videoCaseSchema.safeParse(c);
  assert.equal(r.success, false);
  if (!r.success) assert.match(errosLegiveis(r.error).join('\n'), /^ficticio: resultado não medido/m);
  assert.ok(videoCaseSchema.safeParse({ ...c, resultadoMedido: true }).success);
});

test('erros legíveis apontam o caminho do campo', () => {
  const c = ler('case.json');
  c.telas[0].fim = 0;
  const r = videoCaseSchema.safeParse(c);
  assert.equal(r.success, false);
  if (!r.success) assert.ok(errosLegiveis(r.error).some((l) => l.startsWith('telas[0].fim')));
});

test('detecta o tipo pelo conteúdo', () => {
  assert.equal(detectarTipo(ler('carrossel.json')), 'carrossel');
  assert.equal(detectarTipo(ler('dica.json')), 'dica');
  assert.equal(detectarTipo(ler('case.json')), 'case');
});

test('durações respeitam as faixas de cada formato', () => {
  const v = videoCaseSchema.parse(ler('case.json'));
  const seg = (f: number) => f / 30;
  assert.ok(seg(duracaoCase(v, 'horizontal')) >= 55 && seg(duracaoCase(v, 'horizontal')) <= 90);
  assert.ok(seg(duracaoCase(v, 'quadrado')) <= 60);
  assert.ok(seg(duracaoCase(v, 'vertical')) <= 45);
  assert.equal(cenasDoCase(v, 'vertical').length, 6);
});

test('telas são cortadas no teto do formato', () => {
  const longas = { telas: [1, 2, 3].map(() => ({ arquivo: 'x', moldura: 'desktop' as const, inicio: 0, fim: 10, destaques: [] })) };
  const d = duracoesTelas(longas, 'vertical');
  assert.equal(d.reduce((a, b) => a + b, 0), 16 * 30);
  assert.equal(d[2], 0);
});

test('dica fica entre 20 e 40 segundos', () => {
  const curta = duracaoDica({ codigo: 'x', explicacao: ['a'] });
  const longa = duracaoDica({ codigo: 'x'.repeat(600), explicacao: ['a', 'b', 'c'] });
  assert.equal(curta.total, 20 * 30);
  assert.equal(longa.total, 40 * 30);
});
