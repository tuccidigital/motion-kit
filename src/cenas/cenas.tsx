import React from 'react';
import {
  AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame,
} from 'remotion';
import { Fundo, LegendaFicticia, MarcaCanto, Rotulo, useEntrada, useEscala, useSaida } from '../componentes/base';
import { Icone } from '../componentes/Icone';
import { VinhetaAnimada } from '../componentes/Simbolo';
import type { VideoCase } from '../schema';
import { cor, fonte, FPS, textos } from '../tema';

type Base = { v: VideoCase; duracao: number };

const Titulo: React.FC<{ children: React.ReactNode; tamanho: number; style?: React.CSSProperties; escuro?: boolean }> = ({
  children, tamanho, style, escuro,
}) => (
  <h1
    style={{
      fontFamily: fonte.display,
      fontWeight: 800,
      fontSize: tamanho,
      lineHeight: 1.08,
      letterSpacing: '-0.02em',
      margin: 0,
      textWrap: 'balance',
      color: escuro ? '#FFFFFF' : cor.ink,
      ...style,
    }}
  >
    {children}
  </h1>
);

const margem = (u: number, formato: string) => (formato === 'horizontal' ? 120 : 72) * u;

export const CenaGancho: React.FC<Base> = ({ v, duracao }) => {
  const { u, formato } = useEscala();
  const t = textos[v.idioma];
  return (
    <Fundo>
      <AbsoluteFill style={{ padding: margem(u, formato), justifyContent: 'center', gap: 28 * u, opacity: useSaida(duracao) }}>
        <div style={useEntrada(0)}><Rotulo>{v.projeto}</Rotulo></div>
        <div style={useEntrada(4, 32)}>
          <Titulo tamanho={(formato === 'horizontal' ? 92 : formato === 'quadrado' ? 84 : 88) * u}>{v.gancho}</Titulo>
        </div>
      </AbsoluteFill>
      <MarcaCanto />
      {v.ficticio ? <LegendaFicticia texto={t.dadosFicticios} /> : null}
    </Fundo>
  );
};

export const CenaProblema: React.FC<Base> = ({ v, duracao }) => {
  const { u, formato } = useEscala();
  const t = textos[v.idioma];
  const lado = formato === 'horizontal';
  const icone = 96 * u;
  return (
    <Fundo>
      <AbsoluteFill
        style={{
          padding: margem(u, formato),
          flexDirection: lado ? 'row' : 'column',
          alignItems: lado ? 'center' : 'flex-start',
          justifyContent: 'center',
          gap: 64 * u,
          opacity: useSaida(duracao),
        }}
      >
        <div style={{ flex: lado ? '1 1 0' : undefined, display: 'flex', flexDirection: 'column', gap: 24 * u }}>
          <div style={useEntrada(0)}><Rotulo>{t.problema}</Rotulo></div>
          <div style={useEntrada(3)}>
            <span style={{ fontFamily: fonte.sans, fontWeight: 600, fontSize: 34 * u, color: cor.inkMuted }}>{v.problema.personagem}</span>
          </div>
          <div style={useEntrada(6, 28)}>
            <Titulo tamanho={(lado ? 68 : 72) * u}>{v.problema.texto}</Titulo>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 28 * u, flexWrap: 'wrap' }}>
          {v.problema.icones.map((nome, i) => (
            <IconeCartao key={nome + i} nome={nome} tamanho={icone} atraso={18 + i * 8} />
          ))}
        </div>
      </AbsoluteFill>
      <MarcaCanto />
      {v.ficticio ? <LegendaFicticia texto={t.dadosFicticios} /> : null}
    </Fundo>
  );
};

const IconeCartao: React.FC<{ nome: string; tamanho: number; atraso: number }> = ({ nome, tamanho, atraso }) => {
  const { u } = useEscala();
  return (
    <div
      style={{
        ...useEntrada(atraso),
        width: tamanho * 1.9,
        height: tamanho * 1.9,
        background: cor.surface,
        border: `${2 * u}px solid ${cor.line}`,
        borderRadius: 10 * u * 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icone nome={nome} tamanho={tamanho} cor={cor.ink} />
    </div>
  );
};

export const CenaProcesso: React.FC<Base> = ({ v, duracao }) => {
  const { u, formato } = useEscala();
  const frame = useCurrentFrame();
  const t = textos[v.idioma];
  const n = v.processo.length;
  const vertical = formato === 'vertical' || (formato === 'quadrado' && n > 4);
  const passo = Math.max(10, Math.floor((duracao - 40) / n)); // frames entre nós
  const no = 26 * u;
  return (
    <Fundo escuro grade>
      <AbsoluteFill style={{ padding: margem(u, formato), justifyContent: 'center', gap: 56 * u, opacity: useSaida(duracao) }}>
        <div style={useEntrada(0)}><Rotulo escuro>{t.processo}</Rotulo></div>
        <ol
          style={{
            listStyle: 'none', margin: 0, padding: 0,
            display: 'flex', flexDirection: vertical ? 'column' : 'row', gap: vertical ? 36 * u : 0,
          }}
        >
          {v.processo.map((p, i) => {
            const inicio = 8 + i * passo;
            const ap = interpolate(frame - inicio, [0, 9], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.2, 0, 0, 1) });
            const linha = interpolate(frame - inicio - 6, [0, passo - 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            const ultimo = i === n - 1;
            const d = ultimo ? no * 1.35 : no;
            return (
              <li key={i} style={{ position: 'relative', flex: vertical ? undefined : '1 1 0', paddingTop: vertical ? 0 : no * 2, paddingLeft: vertical ? no * 2.2 : 0, paddingRight: vertical ? 0 : 24 * u, opacity: ap }}>
                <span
                  style={{
                    position: 'absolute',
                    left: vertical ? (no - d) / 2 : 0,
                    top: vertical ? 4 * u : (no - d) / 2,
                    width: d, height: d, borderRadius: 999, boxSizing: 'border-box',
                    background: ultimo ? cor.musgoClaro : cor.grafite,
                    border: ultimo ? 'none' : `${5 * u}px solid #FFFFFF`,
                    zIndex: 1,
                  }}
                />
                {!ultimo ? (
                  <span
                    style={
                      vertical
                        ? { position: 'absolute', left: no / 2 - 2.5 * u, top: no + 4 * u, width: 5 * u, height: `calc(${linha * 100}% + ${36 * u - no}px)`, background: '#FFFFFF' }
                        : { position: 'absolute', left: no, top: no / 2 - 2.5 * u, height: 5 * u, width: `calc(${linha * 100}% - ${no}px)`, background: '#FFFFFF' }
                    }
                  />
                ) : null}
                <span style={{ display: 'block', fontFamily: fonte.mono, fontSize: 22 * u, letterSpacing: '0.08em', textTransform: 'uppercase', color: ultimo ? cor.musgoClaro : cor.apoioEscuro }}>
                  {p.rotulo}
                </span>
                <span style={{ display: 'block', fontFamily: fonte.sans, fontWeight: 600, fontSize: (vertical ? 42 : 40) * u, lineHeight: 1.2, color: '#FFFFFF', marginTop: 10 * u }}>
                  {p.titulo}
                </span>
              </li>
            );
          })}
        </ol>
      </AbsoluteFill>
      <MarcaCanto escuro />
      {v.ficticio ? <LegendaFicticia texto={t.dadosFicticios} escuro /> : null}
    </Fundo>
  );
};

/** Moldura simples do design system: desktop (barra de janela) ou celular. */
const Moldura: React.FC<{ tipo: 'desktop' | 'celular'; largura: number; altura: number; children: React.ReactNode }> = ({ tipo, largura, altura, children }) => {
  const { u } = useEscala();
  if (tipo === 'celular') {
    return (
      <div style={{ width: largura, height: altura, background: cor.grafite, borderRadius: 48 * u, padding: 14 * u, boxSizing: 'border-box' }}>
        <div style={{ width: '100%', height: '100%', borderRadius: 36 * u, overflow: 'hidden', background: cor.surface, position: 'relative' }}>{children}</div>
      </div>
    );
  }
  const barra = 40 * u;
  return (
    <div style={{ width: largura, height: altura, background: cor.surface, border: `${2 * u}px solid ${cor.line}`, borderRadius: 15 * u, overflow: 'hidden', boxSizing: 'border-box' }}>
      <div style={{ height: barra, background: cor.surfaceSunk, display: 'flex', alignItems: 'center', gap: 10 * u, paddingLeft: 16 * u, borderBottom: `${1.5 * u}px solid ${cor.line}` }}>
        {[0, 1, 2].map((i) => <span key={i} style={{ width: 12 * u, height: 12 * u, borderRadius: 999, background: cor.lineStrong }} />)}
      </div>
      <div style={{ position: 'relative', width: '100%', height: altura - barra }}>{children}</div>
    </div>
  );
};

const Destaque: React.FC<{ x: number; y: number; texto: string; inicio: number }> = ({ x, y, texto, inicio }) => {
  const { u } = useEscala();
  const f = useCurrentFrame() - inicio;
  if (f < 0) return null;
  const p = interpolate(f, [0, 9], [0, 1], { extrapolateRight: 'clamp', easing: Easing.bezier(0.2, 0, 0, 1) });
  const fim = interpolate(f, [75, 84], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const r = 58 * u;
  return (
    <div style={{ position: 'absolute', left: `${x * 100}%`, top: `${y * 100}%`, opacity: p * fim, zIndex: 3 }}>
      <div style={{ position: 'absolute', left: -r, top: -r, width: r * 2, height: r * 2, borderRadius: 999, border: `${5 * u}px solid ${cor.musgo}`, transform: `scale(${0.7 + 0.3 * p})`, boxSizing: 'border-box' }} />
      <div
        style={{
          position: 'absolute',
          left: x > 0.6 ? undefined : r + 12 * u,
          right: x > 0.6 ? r + 12 * u : undefined,
          top: -22 * u,
          whiteSpace: 'nowrap',
          background: cor.grafite,
          color: '#FFFFFF',
          fontFamily: fonte.sans,
          fontWeight: 600,
          fontSize: 26 * u,
          padding: `${8 * u}px ${16 * u}px`,
          borderRadius: 6 * u,
        }}
      >
        {texto}
      </div>
    </div>
  );
};

export const CenaTelas: React.FC<Base & { duracoes: number[] }> = ({ v, duracao, duracoes }) => {
  const { u, formato, width, height } = useEscala();
  const t = textos[v.idioma];
  let acumulado = 0;
  return (
    <Fundo>
      {v.telas.map((tela, i) => {
        const frames = duracoes[i];
        const de = acumulado;
        acumulado += frames;
        if (frames <= 0) return null;
        const celular = tela.moldura === 'celular';
        // Área útil: deixa espaço para o rodapé com marca e legenda.
        const areaW = width - margem(u, formato) * (formato === 'horizontal' ? 1.2 : 1);
        const areaH = height - 200 * u;
        let w: number, h: number;
        if (celular) {
          h = Math.min(areaH, formato === 'horizontal' ? areaH : areaH * 0.92);
          w = h * (9 / 19.5);
        } else {
          w = areaW;
          h = w * (10 / 16) + 40 * u;
          if (h > areaH) { h = areaH; w = (h - 40 * u) * 1.6; }
        }
        return (
          <Sequence key={i} from={de} durationInFrames={frames} layout="none">
            <TelaUnica tela={tela} w={w} h={h} frames={frames} pendente={t.gravacaoPendente} />
          </Sequence>
        );
      })}
      <MarcaCanto />
      {v.ficticio ? <LegendaFicticia texto={t.dadosFicticios} /> : null}
    </Fundo>
  );
};

const TelaUnica: React.FC<{ tela: VideoCase['telas'][number]; w: number; h: number; frames: number; pendente: string }> = ({ tela, w, h, frames, pendente }) => {
  const { u } = useEscala();
  const entrada = useEntrada(0, 16);
  const saida = useSaida(frames);
  const ausente = tela.arquivo.startsWith('pendente:');
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 70 * u, ...entrada, opacity: (entrada.opacity as number) * saida }}>
      <Moldura tipo={tela.moldura} largura={w} altura={h}>
        {ausente ? (
          <AbsoluteFill style={{ background: cor.surfaceSunk, alignItems: 'center', justifyContent: 'center', gap: 12 * u, flexDirection: 'column' }}>
            <Rotulo>{pendente}</Rotulo>
            <span style={{ fontFamily: fonte.mono, fontSize: 20 * u, color: cor.inkMuted }}>{tela.arquivo.replace('pendente:', '')}</span>
          </AbsoluteFill>
        ) : (
          <OffthreadVideo
            src={tela.arquivo.startsWith('http') ? tela.arquivo : staticFile(tela.arquivo)}
            startFrom={Math.round(tela.inicio * FPS)}
            endAt={Math.round(tela.fim * FPS)}
            muted
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
          />
        )}
        {tela.destaques.map((d, j) => (
          <Destaque key={j} x={d.x} y={d.y} texto={d.texto} inicio={Math.round(d.t * FPS)} />
        ))}
      </Moldura>
    </AbsoluteFill>
  );
};

export const CenaResultado: React.FC<Base> = ({ v, duracao }) => {
  const { u, formato } = useEscala();
  const t = textos[v.idioma];
  return (
    <Fundo>
      <AbsoluteFill style={{ padding: margem(u, formato), justifyContent: 'center', gap: 40 * u, opacity: useSaida(duracao) }}>
        <div style={useEntrada(0)}><Rotulo>{v.resultadoMedido ? t.resultado : t.resultadoEsperado}</Rotulo></div>
        {v.resultado.map((r, i) => (
          <div key={i} style={{ ...useEntrada(6 + i * 14, 28), display: 'flex', alignItems: 'center', gap: 28 * u }}>
            <Icone nome="CheckmarkCircle" tamanho={64 * u} cor={cor.musgo} />
            <span style={{ fontFamily: fonte.display, fontWeight: 700, fontSize: (formato === 'horizontal' ? 56 : 54) * u, lineHeight: 1.15, letterSpacing: '-0.01em', textWrap: 'balance' }}>
              {r}
            </span>
          </div>
        ))}
      </AbsoluteFill>
      <MarcaCanto />
      {v.ficticio ? <LegendaFicticia texto={t.dadosFicticios} /> : null}
    </Fundo>
  );
};

export const CenaChamada: React.FC<Base> = ({ v }) => {
  const { u, formato } = useEscala();
  const t = textos[v.idioma];
  return (
    <Fundo escuro grade>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 64 * u, padding: margem(u, formato) }}>
        <VinhetaAnimada altura={(formato === 'horizontal' ? 150 : 130) * u} />
        <div style={{ ...useEntrada(26), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 * u }}>
          <span
            style={{
              background: cor.musgoClaro, color: cor.grafite, fontFamily: fonte.sans, fontWeight: 600,
              fontSize: 40 * u, padding: `${16 * u}px ${36 * u}px`, borderRadius: 6 * u, textAlign: 'center',
            }}
          >
            {v.chamada}
          </span>
          {v.chamada.includes(t.site) ? null : (
            <span style={{ fontFamily: fonte.mono, fontSize: 28 * u, color: cor.apoioEscuro, letterSpacing: '0.04em' }}>{t.site}</span>
          )}
        </div>
      </AbsoluteFill>
    </Fundo>
  );
};

/** Trilha e locução opcionais. Caminhos relativos à pasta public/. */
export const TrilhaAudio: React.FC<{ v: VideoCase }> = ({ v }) => (
  <>
    {v.audio.trilha ? <Audio src={staticFile(v.audio.trilha)} volume={0.25} /> : null}
    {v.audio.locucao ? <Audio src={staticFile(v.audio.locucao)} /> : null}
  </>
);

export { Img };
