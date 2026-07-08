import { useState } from 'react';
import { View } from 'react-native';
import Svg, { G, Rect, Text as SvgText } from 'react-native-svg';
import { fonts } from '../../theme';
import { useTheme } from '../../ThemeContext';
import { useElementWidth } from '../../hooks/useElementWidth';

const HEIGHT = 160;
const PADDING_BOTTOM = 20;
const PADDING_TOP = 26;
const HOUR_LABELS = [0, 3, 6, 9, 12, 15, 18, 21];

function formatHour(hour: number): string {
  const h = hour % 12 === 0 ? 12 : hour % 12;
  return `${h}${hour < 12 ? 'am' : 'pm'}`;
}

type Props = {
  data: number[]; // length 24
  color: string;
};

/** Interactive "popular times" hourly histogram. Tap a bar for the exact count. */
export default function HourlyChart({ data, color }: Props) {
  const { colors } = useTheme();
  const { width, onLayout } = useElementWidth();
  const [selected, setSelected] = useState<number | null>(null);
  const max = Math.max(1, ...data);
  const chartHeight = HEIGHT - PADDING_BOTTOM - PADDING_TOP;
  const slot = width / 24;
  const barWidth = Math.max(3, slot * 0.68);

  const barTop = (i: number) => PADDING_TOP + (chartHeight - (data[i] / max) * chartHeight);

  return (
    <View onLayout={onLayout} style={{ width: '100%' }}>
      {width > 0 ? (
        <Svg width={width} height={HEIGHT}>
          {data.map((value, i) => {
            const ratio = value / max;
            const barHeight = ratio * chartHeight;
            const x = i * slot + (slot - barWidth) / 2;
            const isSelected = selected === i;
            return (
              <G key={i} onPress={() => setSelected((prev) => (prev === i ? null : i))}>
                <Rect x={i * slot} y={PADDING_TOP} width={slot} height={chartHeight} fill="transparent" />
                <Rect
                  x={x}
                  y={barTop(i)}
                  width={barWidth}
                  height={Math.max(1, barHeight)}
                  rx={2}
                  fill={color}
                  opacity={isSelected ? 1 : selected !== null ? 0.25 : 0.3 + ratio * 0.7}
                />
              </G>
            );
          })}

          {HOUR_LABELS.map((hour) => (
            <SvgText
              key={hour}
              x={hour * slot + slot / 2}
              y={HEIGHT - 5}
              fontSize={9}
              fontFamily={fonts.regular}
              fill={colors.textMuted}
              textAnchor="middle"
            >
              {formatHour(hour)}
            </SvgText>
          ))}

          {selected !== null ? (
            <Tooltip
              label={`${formatHour(selected)}: ${data[selected]}`}
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
  const boxWidth = 16 + label.length * 6.2;
  const boxHeight = 20;
  const left = Math.max(2, Math.min(width - boxWidth - 2, x - boxWidth / 2));
  const top = Math.max(2, y - boxHeight - 5);
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
