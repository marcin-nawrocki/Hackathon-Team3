import { useState } from 'react';
import { View } from 'react-native';
import Svg, {
  Defs,
  G,
  LinearGradient,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { fonts } from '../../theme';
import { useTheme } from '../../ThemeContext';
import { useElementWidth } from '../../hooks/useElementWidth';
import { MONTHS } from '../../utils/calendar';
import { formatGBPCompact } from '../../utils/statistics';

const MONTH_LETTERS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
const HEIGHT = 210;
const PADDING_BOTTOM = 22;
const PADDING_TOP = 30;
const ACCENT = '#F5A623';
const ACCENT_DARK = '#C77F13';

function niceMax(value: number): number {
  if (value <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(value)));
  const n = value / pow;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return step * pow;
}

type Props = {
  data: number[]; // length 12, revenue per month in £
};

/** Interactive bar chart of revenue per calendar month. Tap a bar for the exact amount. */
export default function RevenueChart({ data }: Props) {
  const { colors } = useTheme();
  const { width, onLayout } = useElementWidth();
  const [selected, setSelected] = useState<number | null>(null);
  const max = niceMax(Math.max(1, ...data));
  const chartHeight = HEIGHT - PADDING_BOTTOM - PADDING_TOP;
  const slot = width / 12;
  const barWidth = Math.max(6, slot * 0.6);

  const barTop = (i: number) => PADDING_TOP + (chartHeight - (data[i] / max) * chartHeight);

  return (
    <View onLayout={onLayout} style={{ width: '100%' }}>
      {width > 0 ? (
        <Svg width={width} height={HEIGHT}>
          <Defs>
            <LinearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={ACCENT} stopOpacity="1" />
              <Stop offset="1" stopColor={ACCENT} stopOpacity="0.5" />
            </LinearGradient>
          </Defs>

          {data.map((value, i) => {
            const barHeight = (value / max) * chartHeight;
            const x = i * slot + (slot - barWidth) / 2;
            const isSelected = selected === i;
            return (
              <G key={i} onPress={() => setSelected((prev) => (prev === i ? null : i))}>
                <Rect x={i * slot} y={PADDING_TOP} width={slot} height={chartHeight} fill="transparent" />
                <Rect
                  x={x}
                  y={barTop(i)}
                  width={barWidth}
                  height={Math.max(0, barHeight)}
                  rx={3}
                  fill={isSelected ? ACCENT_DARK : 'url(#revenueFill)'}
                  opacity={selected !== null && !isSelected ? 0.45 : 1}
                />
              </G>
            );
          })}

          {MONTH_LETTERS.map((letter, i) => (
            <SvgText
              key={`m${i}`}
              x={i * slot + slot / 2}
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
              label={`${MONTHS[selected]}: ${formatGBPCompact(data[selected])}`}
              x={selected * slot + slot / 2}
              y={barTop(selected)}
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
  const boxHeight = 22;
  const left = Math.max(2, Math.min(width - boxWidth - 2, x - boxWidth / 2));
  const top = Math.max(2, y - boxHeight - 6);
  return (
    <G>
      <Rect x={left} y={top} width={boxWidth} height={boxHeight} rx={5} fill={bg} />
      <SvgText
        x={left + boxWidth / 2}
        y={top + 15}
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
