import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { G, Path, Text as SvgText } from 'react-native-svg';
import { fonts, Palette, radii } from '../../theme';
import { useTheme, useThemedStyles } from '../../ThemeContext';
import { SourceStat } from '../../utils/statistics';

const SIZE = 200;

function polar(cx: number, cy: number, r: number, angleDeg: number): [number, number] {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

function arcPath(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  start: number,
  end: number,
): string {
  const [x1, y1] = polar(cx, cy, rOuter, end);
  const [x2, y2] = polar(cx, cy, rOuter, start);
  const [x3, y3] = polar(cx, cy, rInner, start);
  const [x4, y4] = polar(cx, cy, rInner, end);
  const largeArc = end - start <= 180 ? 0 : 1;
  return (
    `M ${x1} ${y1} A ${rOuter} ${rOuter} 0 ${largeArc} 0 ${x2} ${y2} ` +
    `L ${x3} ${y3} A ${rInner} ${rInner} 0 ${largeArc} 1 ${x4} ${y4} Z`
  );
}

type Props = {
  sources: SourceStat[];
};

/** Interactive donut chart of booking sources. Tap a slice or legend row. */
export default function SourcesDonut({ sources }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [selected, setSelected] = useState<string | null>(null);
  const total = sources.reduce((sum, s) => sum + s.count, 0);
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const rOuter = SIZE / 2 - 8;
  const rInner = rOuter * 0.62;

  const toggle = (name: string) => setSelected((prev) => (prev === name ? null : name));

  let angle = 0;
  const segments = sources.map((s) => {
    const sweep = total ? (s.count / total) * 360 : 0;
    const isSelected = selected === s.name;
    const seg = {
      name: s.name,
      color: s.color,
      isSelected,
      path: arcPath(cx, cy, isSelected ? rOuter + 6 : rOuter, rInner, angle + 0.5, angle + sweep - 0.5),
    };
    angle += sweep;
    return seg;
  });

  const active = sources.find((s) => s.name === selected);
  const centerValue = active ? active.count : total;
  const centerLabel = active ? `${Math.round(active.share * 100)}%` : 'bookings';

  return (
    <View style={styles.wrap}>
      <Svg width={SIZE} height={SIZE}>
        {segments.map((seg) => (
          <G key={seg.name} onPress={() => toggle(seg.name)}>
            <Path
              d={seg.path}
              fill={seg.color}
              opacity={selected !== null && !seg.isSelected ? 0.35 : 1}
            />
          </G>
        ))}
        <SvgText x={cx} y={cy - 4} fontSize={26} fontFamily={fonts.semibold} fill={colors.text} textAnchor="middle">
          {centerValue}
        </SvgText>
        <SvgText x={cx} y={cy + 15} fontSize={11} fontFamily={fonts.regular} fill={colors.textMuted} textAnchor="middle">
          {centerLabel}
        </SvgText>
        {active ? (
          <SvgText x={cx} y={cy + 30} fontSize={10} fontFamily={fonts.semibold} fill={active.color} textAnchor="middle">
            {active.name}
          </SvgText>
        ) : null}
      </Svg>

      <View style={styles.legend}>
        {sources.map((s) => {
          const isSelected = selected === s.name;
          return (
            <Pressable
              key={s.name}
              onPress={() => toggle(s.name)}
              style={[styles.row, isSelected && styles.rowSelected]}
            >
              <View style={[styles.dot, { backgroundColor: s.color }]} />
              <Text style={[styles.name, isSelected && styles.nameSelected]} numberOfLines={1}>
                {s.name}
              </Text>
              <Text style={styles.count}>{s.count}</Text>
              <Text style={styles.share}>{Math.round(s.share * 100)}%</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
  wrap: {
    alignItems: 'center',
  },
  legend: {
    marginTop: 14,
    width: '100%',
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: radii.sm,
  },
  rowSelected: {
    backgroundColor: colors.background,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  name: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.text,
  },
  nameSelected: {
    fontFamily: fonts.semibold,
  },
  count: {
    width: 34,
    textAlign: 'right',
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.text,
  },
  share: {
    width: 38,
    textAlign: 'right',
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
});
