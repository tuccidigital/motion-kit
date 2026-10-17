import { z } from 'zod';

const idioma = z.enum(['pt-BR', 'en-US'], {
  errorMap: () => ({ message: 'use "pt-BR" ou "en-US"' }),
});

const texto = (max: number) =>
  z.string().trim().min(1, 'não pode ficar vazio').max(max, `no máximo ${max} caracteres`);

export const destaqueSchema = z.object({
  t: z.number().min(0, 'o tempo do destaque começa em 0'),
  x: z.number().min(0).max(1, 'x vai de 0 a 1 (proporção da largura)'),
  y: z.number().min(0).max(1, 'y vai de 0 a 1 (proporção da altura)'),
  texto: texto(60),
});

export const telaSchema = z
  .object({
    arquivo: z.string().min(1, 'informe o caminho da gravação .mp4'),
    moldura: z.enum(['desktop', 'celular'], { errorMap: () => ({ message: 'use "desktop" ou "celular"' }) }),
    inicio: z.number().min(0),
    fim: z.number().positive(),
    destaques: z.array(destaqueSchema).max(4, 'no máximo 4 destaques por tela').default([]),
  })
  .refine((v) => v.fim > v.inicio, { message: '"fim" precisa ser maior que "inicio"', path: ['fim'] })
  .refine((v) => v.fim - v.inicio <= 20, { message: 'cada tela tem no máximo 20 segundos', path: ['fim'] })
  .refine((v) => v.destaques.every((d) => d.t <= v.fim - v.inicio), {
    message: 'um destaque passa do fim do trecho (t é contado a partir de "inicio")',
    path: ['destaques'],
  });

export const videoCaseSchema = z
  .object({
    idioma,
    projeto: texto(60),
    ficticio: z.boolean(),
    resultadoMedido: z.boolean().default(false),
    gancho: texto(110),
    problema: z.object({
      personagem: texto(70),
      texto: texto(120),
      icones: z.array(z.string().regex(/^[A-Z][A-Za-z]+$/, 'nome de ícone Fluent, ex.: "Mail"')).min(1).max(4),
    }),
    processo: z
      .array(z.object({ rotulo: texto(22), titulo: texto(40) }))
      .min(3, 'o processo tem de 3 a 6 etapas')
      .max(6, 'o processo tem de 3 a 6 etapas'),
    telas: z.array(telaSchema).min(1, 'inclua ao menos uma gravação de tela').max(6),
    resultado: z.array(texto(70)).min(1).max(3, 'no máximo 3 frases de resultado'),
    chamada: texto(60),
    audio: z
      .object({ trilha: z.string().nullable().default(null), locucao: z.string().nullable().default(null) })
      .default({ trilha: null, locucao: null }),
    legendas: z.enum(['auto', 'off']).default('auto'),
  })
  .refine((v) => v.resultadoMedido || v.ficticio, {
    message: 'resultado não medido exige "ficticio": true (a cena vai dizer "resultado esperado")',
    path: ['ficticio'],
  });

export const carrosselSchema = z.object({
  idioma,
  ficticio: z.boolean().default(false),
  slides: z
    .array(
      z.object({
        rotulo: z.string().max(30).optional(),
        titulo: texto(90),
        texto: z.string().max(260).optional(),
        codigo: z.string().max(400).optional(),
        lista: z.array(texto(80)).max(5).optional(),
      }),
    )
    .min(3, 'o carrossel tem de 3 a 9 lâminas (fora a de chamada)')
    .max(9, 'o carrossel tem de 3 a 9 lâminas (fora a de chamada)'),
  chamada: texto(70),
});

export const dicaSchema = z.object({
  idioma,
  linguagem: z.enum(['Power Fx', 'DAX', 'Power Automate', 'Power Query', 'SQL', 'TypeScript', 'C#']),
  titulo: texto(80),
  codigo: z.string().min(1).max(600, 'código com no máximo 600 caracteres; dica longa não cabe na tela'),
  explicacao: z.array(texto(110)).min(1).max(3),
  chamada: z.string().max(60).optional(),
});

export type VideoCase = z.infer<typeof videoCaseSchema>;
export type Carrossel = z.infer<typeof carrosselSchema>;
export type Dica = z.infer<typeof dicaSchema>;

export type TipoProps = 'case' | 'carrossel' | 'dica';

export function detectarTipo(dados: unknown): TipoProps {
  if (dados && typeof dados === 'object') {
    if ('slides' in dados) return 'carrossel';
    if ('codigo' in dados && 'linguagem' in dados) return 'dica';
  }
  return 'case';
}

export function schemaDoTipo(tipo: TipoProps) {
  return tipo === 'carrossel' ? carrosselSchema : tipo === 'dica' ? dicaSchema : videoCaseSchema;
}

/** Erros do Zod em linhas legíveis: "telas[0].fim: \"fim\" precisa ser maior que \"inicio\"". */
export function errosLegiveis(err: z.ZodError): string[] {
  return err.issues.map((i) => {
    const caminho = i.path
      .map((p, idx) => (typeof p === 'number' ? `[${p}]` : idx === 0 ? String(p) : `.${String(p)}`))
      .join('');
    return `${caminho || '(raiz)'}: ${i.message}`;
  });
}
