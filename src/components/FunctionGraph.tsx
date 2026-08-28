import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';

export function FunctionGraph({ kind = 'parabola', color = '#4F7A61', dark = false }: { kind?: 'parabola' | 'sine'; color?: string; dark?: boolean }) {
  const axis = dark ? '#708078' : '#B8C1B9';
  const grid = dark ? '#354139' : '#E7EBE5';
  const path = kind === 'sine'
    ? 'M 34 83 C 70 22 106 22 142 83 S 214 144 250 83 S 322 22 358 83'
    : 'M 34 126 C 92 126 110 31 196 31 C 282 31 300 126 358 126';
  return (
    <Svg width="100%" height={180} viewBox="0 0 392 160" accessibilityLabel={kind === 'sine' ? '正弦函数示意图' : '二次函数示意图'}>
      {[40, 80, 120].map((y) => <Line key={`h-${y}`} x1="34" y1={y} x2="358" y2={y} stroke={grid} strokeWidth="1" />)}
      {[86, 142, 198, 254, 310].map((x) => <Line key={`v-${x}`} x1={x} y1="24" x2={x} y2="136" stroke={grid} strokeWidth="1" />)}
      <Line x1="34" y1="80" x2="358" y2="80" stroke={axis} strokeWidth="1.4" />
      <Line x1="196" y1="22" x2="196" y2="138" stroke={axis} strokeWidth="1.4" />
      <Path d={path} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
      {kind === 'parabola' ? <Circle cx="196" cy="31" r="4" fill={color} /> : null}
      <SvgText x="365" y="76" fill={axis} fontSize="11">x</SvgText>
      <SvgText x="202" y="20" fill={axis} fontSize="11">y</SvgText>
    </Svg>
  );
}
