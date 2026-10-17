import React from 'react';
import {
  Alert24Regular, ArrowSync24Regular, Box24Regular, Building24Regular, BuildingFactory24Regular,
  CalendarLtr24Regular, Camera24Regular, Cart24Regular, Chat24Regular, CheckmarkCircle24Regular,
  Clock24Regular, CloudOff24Regular, Code24Regular, DataBarVertical24Regular, Document24Regular,
  DocumentError24Regular, DocumentText24Regular, Folder24Regular, Gauge24Regular, Mail24Regular,
  Money24Regular, People24Regular, Person24Regular, PersonClock24Regular, Phone24Regular,
  Print24Regular, QuestionCircle24Regular, Receipt24Regular, Search24Regular, Settings24Regular,
  Shield24Regular, Table24Regular, Timer24Regular, Warning24Regular, Wrench24Regular,
} from '@fluentui/react-icons';

// Fluent UI System Icons (MIT), estilo Regular: a família que o cliente já vê no Microsoft 365.
const MAPA: Record<string, React.ComponentType<{ style?: React.CSSProperties }>> = {
  Alert: Alert24Regular, ArrowSync: ArrowSync24Regular, Box: Box24Regular, Building: Building24Regular,
  BuildingFactory: BuildingFactory24Regular, Calendar: CalendarLtr24Regular, CalendarLtr: CalendarLtr24Regular,
  Camera: Camera24Regular, Cart: Cart24Regular, Chat: Chat24Regular, CheckmarkCircle: CheckmarkCircle24Regular,
  Clock: Clock24Regular, CloudOff: CloudOff24Regular, Code: Code24Regular, DataBarVertical: DataBarVertical24Regular,
  Document: Document24Regular, DocumentError: DocumentError24Regular, DocumentText: DocumentText24Regular,
  Folder: Folder24Regular, Gauge: Gauge24Regular, Mail: Mail24Regular, Money: Money24Regular, People: People24Regular,
  Person: Person24Regular, PersonClock: PersonClock24Regular, Phone: Phone24Regular, Print: Print24Regular,
  QuestionCircle: QuestionCircle24Regular, Receipt: Receipt24Regular, Search: Search24Regular,
  Settings: Settings24Regular, Shield: Shield24Regular, Table: Table24Regular, Timer: Timer24Regular,
  Warning: Warning24Regular, Wrench: Wrench24Regular,
};

export const ICONES_DISPONIVEIS = Object.keys(MAPA);

export const Icone: React.FC<{ nome: string; tamanho: number; cor: string }> = ({ nome, tamanho, cor }) => {
  const C = MAPA[nome] ?? QuestionCircle24Regular;
  return <C style={{ fontSize: tamanho, width: tamanho, height: tamanho, color: cor, display: 'block' }} />;
};
