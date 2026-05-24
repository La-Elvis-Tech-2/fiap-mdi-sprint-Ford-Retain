import React from 'react';
import Svg, { Path, Circle, Line, Polyline, Rect, Polygon } from 'react-native-svg';

const ICONS = {
  // ── existentes ──────────────────────────────────────────────────────────────
  grid: (
    <>
      <Rect x="3" y="3" width="7" height="7" />
      <Rect x="14" y="3" width="7" height="7" />
      <Rect x="14" y="14" width="7" height="7" />
      <Rect x="3" y="14" width="7" height="7" />
    </>
  ),
  user: (
    <>
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <Circle cx="12" cy="7" r="4" />
    </>
  ),
  bell: (
    <>
      <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </>
  ),
  plus: (
    <>
      <Line x1="12" y1="5" x2="12" y2="19" />
      <Line x1="5" y1="12" x2="19" y2="12" />
    </>
  ),
  search: (
    <>
      <Circle cx="11" cy="11" r="8" />
      <Line x1="21" y1="21" x2="16.65" y2="16.65" />
    </>
  ),
  'chevron-down': (
    <Polyline points="6 9 12 15 18 9" />
  ),
  'chevron-right': (
    <Polyline points="9 18 15 12 9 6" />
  ),
  'trending-up': (
    <>
      <Polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <Polyline points="17 6 23 6 23 12" />
    </>
  ),
  'trending-down': (
    <>
      <Polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <Polyline points="17 18 23 18 23 12" />
    </>
  ),
  'check-circle': (
    <>
      <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <Polyline points="22 4 12 14.01 9 11.01" />
    </>
  ),
  'alert-triangle': (
    <>
      <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <Line x1="12" y1="9" x2="12" y2="13" />
      <Line x1="12" y1="17" x2="12.01" y2="17" />
    </>
  ),
  'alert-circle': (
    <>
      <Circle cx="12" cy="12" r="10" />
      <Line x1="12" y1="8" x2="12" y2="12" />
      <Line x1="12" y1="16" x2="12.01" y2="16" />
    </>
  ),
  'x-circle': (
    <>
      <Circle cx="12" cy="12" r="10" />
      <Line x1="15" y1="9" x2="9" y2="15" />
      <Line x1="9" y1="9" x2="15" y2="15" />
    </>
  ),
  'edit-2': (
    <Path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  ),
  settings: (
    <>
      <Circle cx="12" cy="12" r="3" />
      <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </>
  ),
  zap: (
    <Polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  ),
  star: (
    <Polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  ),
  trophy: (
    <>
      <Path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <Path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <Path d="M4 22h16" />
      <Path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <Path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <Path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
    </>
  ),
  percent: (
    <>
      <Line x1="19" y1="5" x2="5" y2="19" />
      <Circle cx="6.5" cy="6.5" r="2.5" />
      <Circle cx="17.5" cy="17.5" r="2.5" />
    </>
  ),
  wrench: (
    <Path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  ),
  car: (
    <>
      <Path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-3" />
      <Circle cx="9" cy="17" r="2" />
      <Circle cx="17" cy="17" r="2" />
    </>
  ),
  navigation: (
    <Polygon points="3 11 22 2 13 21 11 13 3 11" />
  ),
  history: (
    <>
      <Path d="M3 3v5h5" />
      <Path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
      <Path d="M12 7v5l4 2" />
    </>
  ),
  gift: (
    <>
      <Polyline points="20 12 20 22 4 22 4 12" />
      <Rect x="2" y="7" width="20" height="5" />
      <Line x1="12" y1="22" x2="12" y2="7" />
      <Path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <Path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </>
  ),
  'check-square': (
    <>
      <Polyline points="9 11 12 14 22 4" />
      <Path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </>
  ),
  info: (
    <>
      <Circle cx="12" cy="12" r="10" />
      <Line x1="12" y1="16" x2="12" y2="12" />
      <Line x1="12" y1="8" x2="12.01" y2="8" />
    </>
  ),
  robot: (
    <>
      <Rect x="3" y="11" width="18" height="10" rx="2" />
      <Path d="M12 11V7" />
      <Circle cx="12" cy="5" r="2" />
      <Line x1="8" y1="15" x2="8" y2="15" />
      <Line x1="16" y1="15" x2="16" y2="15" />
      <Path d="M8 19h8" />
    </>
  ),
  brain: (
    <>
      <Path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.14" />
      <Path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.14" />
    </>
  ),

  // ── novos ───────────────────────────────────────────────────────────────────

  // home — aba Início do TabBar
  home: (
    <>
      <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <Polyline points="9 22 9 12 15 12 15 22" />
    </>
  ),

  // activity — pulso/atividade (usado em KM e TabBar Compare)
  activity: (
    <Polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  ),

  // bar-chart — usado na aba Comparar do TabBar
  'bar-chart': (
    <>
      <Line x1="18" y1="20" x2="18" y2="10" />
      <Line x1="12" y1="20" x2="12" y2="4" />
      <Line x1="6"  y1="20" x2="6"  y2="14" />
    </>
  ),

  // battery — saúde do veículo
  battery: (
    <>
      <Rect x="1" y="6" width="18" height="12" rx="2" ry="2" />
      <Line x1="23" y1="13" x2="23" y2="11" />
      <Line x1="6"  y1="10" x2="6"  y2="14" />
      <Line x1="10" y1="10" x2="10" y2="14" />
    </>
  ),

  // bell-off — lembretes desativados
  'bell-off': (
    <>
      <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
      <Path d="M18.63 13A17.89 17.89 0 0 1 18 8" />
      <Path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14" />
      <Path d="M18 8a6 6 0 0 0-9.33-5" />
      <Line x1="1" y1="1" x2="23" y2="23" />
    </>
  ),

  // calendar — agendamento
  calendar: (
    <>
      <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <Line x1="16" y1="2" x2="16" y2="6" />
      <Line x1="8"  y1="2" x2="8"  y2="6" />
      <Line x1="3"  y1="10" x2="21" y2="10" />
    </>
  ),

  // check — confirmar agendamento
  check: (
    <Polyline points="20 6 9 17 4 12" />
  ),

  // clock — lembrete "em breve"
  clock: (
    <>
      <Circle cx="12" cy="12" r="10" />
      <Polyline points="12 6 12 12 16 14" />
    </>
  ),

  // disc — freios / revisão
  disc: (
    <>
      <Circle cx="12" cy="12" r="10" />
      <Circle cx="12" cy="12" r="3" />
    </>
  ),

  // droplet — óleo
  droplet: (
    <Path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
  ),

  // file-text — IPVA / documentos
  'file-text': (
    <>
      <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <Polyline points="14 2 14 8 20 8" />
      <Line x1="16" y1="13" x2="8" y2="13" />
      <Line x1="16" y1="17" x2="8" y2="17" />
      <Polyline points="10 9 9 9 8 9" />
    </>
  ),

  // hash — VIN do veículo
  hash: (
    <>
      <Line x1="4"  y1="9"  x2="20" y2="9"  />
      <Line x1="4"  y1="15" x2="20" y2="15" />
      <Line x1="10" y1="3"  x2="8"  y2="21" />
      <Line x1="16" y1="3"  x2="14" y2="21" />
    </>
  ),

  // map-pin — concessionárias
  'map-pin': (
    <>
      <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <Circle cx="12" cy="10" r="3" />
    </>
  ),

  // shield — garantia
  shield: (
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  ),

  // sliders — alinhamento / configurações
  sliders: (
    <>
      <Line x1="4"  y1="21" x2="4"  y2="14" />
      <Line x1="4"  y1="10" x2="4"  y2="3"  />
      <Line x1="12" y1="21" x2="12" y2="12" />
      <Line x1="12" y1="8"  x2="12" y2="3"  />
      <Line x1="20" y1="21" x2="20" y2="16" />
      <Line x1="20" y1="12" x2="20" y2="3"  />
      <Line x1="1"  y1="14" x2="7"  y2="14" />
      <Line x1="9"  y1="8"  x2="15" y2="8"  />
      <Line x1="17" y1="16" x2="23" y2="16" />
    </>
  ),

  // wind — ar-condicionado
  wind: (
    <>
      <Path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
    </>
  ),

  // x — fechar modais
  x: (
    <>
      <Line x1="18" y1="6"  x2="6"  y2="18" />
      <Line x1="6"  y1="6"  x2="18" y2="18" />
    </>
  ),
};

export default function Icon({ name, size = 20, color = '#64748B', strokeWidth = 1.75 }) {
  const paths = ICONS[name];
  if (!paths) return null;
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths}
    </Svg>
  );
}