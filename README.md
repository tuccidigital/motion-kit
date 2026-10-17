# P10 · Tucci Motion Kit

Gera, a partir de um arquivo JSON, o vídeo de cada case e as peças de LinkedIn com a identidade da Tucci, sem abrir editor de vídeo. Feito em [Remotion](https://www.remotion.dev) (React).

Apps do Power Platform só abrem para quem tem licença; o vídeo é como qualquer cliente vê o trabalho.

## Composições

| Composição | Formato | Duração | Uso |
| --- | --- | --- | --- |
| `Vinheta` / `VinhetaQuadrada` | 1920×1080 / 1080×1080 | 3 s | Abertura e fechamento: os colchetes do `[t]` se abrem, o `t` entra e o nome aparece |
| `Case` | 1920×1080 | 60–90 s | Vídeo do case no site e no YouTube |
| `CaseQuadrado` | 1080×1080 | 45–60 s | Feed do LinkedIn |
| `CaseVertical` | 1080×1920 | 30–45 s | Stories, Reels, Shorts |
| `Carrossel` | 1080×1350, PNG | 3–9 lâminas + chamada | Carrossel de LinkedIn (`01.png`, `02.png`...) |
| `DicaTecnica` / `DicaTecnicaVertical` | 1080×1350 / 1080×1920 | 20–40 s | Dica de Power Fx, DAX ou expressão com o código sendo digitado |

Cenas do `Case`: gancho, problema (personagem e ícones Fluent), processo (o `ProcessFlow` da marca se desenhando), telas (gravações em moldura de desktop ou celular, com destaques), resultado e chamada com a vinheta.

## Como usar

Requisitos: Node.js 22+.

```bash
npm install
npm run validar -- caminho/VIDEO.json                 # confere o JSON e mostra erros legíveis
npm run render -- --props=caminho/VIDEO.json --comp=Case
npm run render -- --props=exemplos/carrossel.json --comp=Carrossel
npm run exemplos                                     # um exemplo de cada composição em out/exemplos
npm run studio                                       # editor visual do Remotion
npm test                                             # testes do esquema e das durações
```

- Gravações de tela (`telas[].arquivo`) são caminhos relativos à pasta do JSON. Para renderizar antes de gravar, use `"pendente:gravacoes/arquivo.mp4"`: a cena mostra o quadro "Gravação pendente".
- Trilha e locução (`audio`) são opcionais, também relativas ao JSON.
- Em Linux sem o Chrome do Remotion, defina `REMOTION_BROWSER` com o caminho de um Chrome headless.

## Formato do `VIDEO.json`

Veja `exemplos/case.json` e `exemplos/case-en.json`. Regras que o validador aplica:

- `idioma`: `pt-BR` ou `en-US` (a mesma estrutura gera as duas versões).
- `processo`: 3 a 6 etapas; a última é o resultado de negócio.
- `telas`: 1 a 6 trechos, cada um com até 20 s; `destaques[].t` conta a partir de `inicio`.
- `resultado`: até 3 frases. Se o resultado não foi medido (`resultadoMedido: false`, o padrão), o JSON exige `"ficticio": true` e a cena diz "Resultado esperado".
- Toda cena mostra a legenda "Dados fictícios" quando `ficticio` é verdadeiro.

## Marca

Tokens, fontes (Archivo, Figtree, JetBrains Mono) e logos vêm do design system Tucci e estão em `src/tema.ts` e `public/`. Movimento: entradas curtas (200–400 ms), sem quicar, sem gradiente. Ícones: Fluent UI System Icons (MIT); a lista aceita está em `src/componentes/Icone.tsx`.

## Licença do Remotion

Gratuito para empresas de até 3 pessoas, inclusive uso comercial. A partir de 4 pessoas exige licença de empresa. Verificado em 16/10/2026 em remotion.dev/docs/pricing; confira de novo quando a equipe crescer.
