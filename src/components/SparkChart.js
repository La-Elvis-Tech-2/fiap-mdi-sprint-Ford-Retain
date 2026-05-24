import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

export default function SparkChart({ data = [], width = 300, height = 140, color = '#2563EB' }) {
  if (!data || data.length < 2) return <View style={{ width, height }} />;

  const max = Math.max(...data, 1);
  const min = 0;
  const padX = 4;
  const padY = 10;
  const w = width - padX * 2;
  const h = height - padY * 2;

  const pts = data.map((v, i) => {
    const x = padX + (i / (data.length - 1)) * w;
    const y = padY + h - ((v - min) / (max - min || 1)) * h;
    return { x, y };
  });

  const linePath = pts.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `C${pts[i - 1].x + (p.x - pts[i - 1].x) / 2},${pts[i - 1].y} ${pts[i - 1].x + (p.x - pts[i - 1].x) / 2},${p.y} ${p.x},${p.y}`)).join(' ');

  const areaPath = linePath + ` L${pts[pts.length - 1].x},${padY + h} L${pts[0].x},${padY + h} Z`;

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity="0.18" />
            <Stop offset="1" stopColor={color} stopOpacity="0" />
          </LinearGradient>
          <LinearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity="0.06" />
            <Stop offset="1" stopColor={color} stopOpacity="0" />
          </LinearGradient>
        </Defs>
        {/* Shadow area */}
        <Path d={areaPath} fill="url(#grad2)" />
        {/* Main area */}
        <Path d={areaPath} fill="url(#grad)" />
        {/* Line */}
        <Path d={linePath} stroke={color} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </View>
  );
}
