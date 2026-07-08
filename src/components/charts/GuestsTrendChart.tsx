import { useState } from 'react';
import { View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { fonts } from '../../theme';
import { useTheme } from '../../ThemeContext';
import { useElementWidth } from '../../hooks/useElementWidth';
import { MONTHS } from '../../utils/calendar';

const MONTH_LETTERS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
const HEIGHT = 210;
const PADDING_BOTTOM = 22;
const PADDING_TOP = 26;
const PADDING_X = 8;
const ACCENT = '#7E6BC4';

type Props = {
  data: number[]; // length 12, average guests per month
};

/** Interactive area + line chart of average guests per month. Tap a point. */
export default function GuestsTrendChart({ data }: Props) {
  const { colors } = useTheme();
  const { width, onLayout } = useElementWidth();
  const [selected, setSelected] = useState<number | null>(null);
  const max = Math.max(1, Math.ceil(Math.max(...data)));
  const chartHeight = HEIGHT - PADDING_BOTTOM - PADDING_TOP;
  const innerWidth = width - PADDING_X * 2;

  const points = data.map((value, i) => {
    const x = PADDING_X + (data.length === 1 ? 0 : (i / (data.length - 1)) * innerWidth);
    const y = PADDING_TOP + (chartHeight - (value / max) * chartHeight);
    return { x, y, value };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x} ${PADDING_TOP + chartHeight} ` +
        `L ${points[0].x} ${PADDING_TOP + chartHeight} Z`
      : '';

  return (
    <View onLayout={onLayout} style={{ width: '100%' }}>
      {width > 0 ? (
        <Svg width={width} height={HEIGHT}>
          <Defs>
            <LinearGradient id="guestArea" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={ACCENT} stopOpacity="0.35" />
              <Stop offset="1" stopColor={ACCENT} stopOpacity="0.02" />
            </LinearGradient>
          </Defs>

          <Path d={areaPath} fill="url(#guestArea)" />
          <Path d={linePath} stroke={ACCENT} strokeWidth={2.5} fill="none" />

          {points.map((p, i) => {
            const isSelected = selected === i;
            return (
              <Circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={isSelected ? 5.5 : 3.5}
                fill={isSelected ? ACCENT : colors.surface}
                stroke={ACCENT}
                strokeWidth={2}
              />
            );
          })}

          {/* Wide invisible hit targets for easier tapping */}
          {points.map((p, i) => (
            <G key={`h${i}`} onPress={() => setSelected((prev) => (prev === i ? null : i))}>
              <Rect
                x={p.x - innerWidth / 24}
                y={PADDING_TOP}
                width={innerWidth / 12}
                height={chartHeight}
                fill="transparent"
              />
            </G>
          ))}

          {MONTH_LETTERS.map((letter, i) => (
            <SvgText
              key={`m${i}`}
              x={points[i]?.x ?? 0}
              y={HEIGHT - 6}
              fontSize={10}
              fontFamily={selected === i ? fonts.semibold : fonts.regular}
              fill={selected === i ? colors.text : colors.textMuted}
              textAnchor="middle"
            >
              {letter}
            </SvgText>
          ))}

          {selected !== null ? (
            <Tooltip
              label={`${MONTHS[selected]}: ${data[selected].toFixed(1)}`}
              x={points[selected].x}
              y={points[selected].y}
              width={width}
              bg={colors.text}
              fg={colors.surface}
            />
          ) : null}
        </Svg>
      ) : null}
    </View>
  );
}

function Tooltip({
  label,
  x,
  y,
  width,
  bg,
  fg,
}: {
  label: string;
  x: number;
  y: number;
  width: number;
  bg: string;
  fg: string;
}) {
  const boxWidth = 20 + label.length * 6.2;
  const boxHeight = 20;
  const left = Math.max(2, Math.min(width - boxWidth - 2, x - boxWidth / 2));
  const top = Math.max(2, y - boxHeight - 8);
  return (
    <G>
      <Rect x={left} y={top} width={boxWidth} height={boxHeight} rx={5} fill={bg} />
      <SvgText
        x={left + boxWidth / 2}
        y={top + 14}
        fontSize={11}
        fontFamily={fonts.semibold}
        fill={fg}
        textAnchor="middle"
      >
        {label}
      </SvgText>
    </G>
  );
}
