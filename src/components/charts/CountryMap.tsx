import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fonts, Palette, radii } from '../../theme';
import { useTheme, useThemedStyles } from '../../ThemeContext';
import { CountryStat } from '../../utils/statistics';
import { useElementWidth } from '../../hooks/useElementWidth';
import WorldMap from './WorldMap';

const R_MIN = 9;
const R_MAX = 26;
const MAX_ZOOM = 3;
const MIN_ZOOM = 1;
const canZoom = Platform.OS !== 'web';

function project(lon: number, lat: number, width: number, height: number) {
  return {
    x: ((lon + 180) / 360) * width,
    y: ((90 - lat) / 180) * height,
  };
}

type Props = {
  countries: CountryStat[];
};

/** Interactive bubble map of guest origin countries with a ranked legend. */
export default function CountryMap({ countries }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { width, onLayout } = useElementWidth();
  const [selected, setSelected] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  const baseHeight = Math.max(220, Math.min(460, width * 0.46));
  const mapWidth = width * zoom;
  const mapHeight = baseHeight * zoom;
  const maxCount = Math.max(1, ...countries.map((c) => c.count));

  const toggle = (code: string) => setSelected((prev) => (prev === code ? null : code));

  const bubbles = width > 0 && (
    <View style={{ width: mapWidth, height: mapHeight }}>
      <WorldMap width={mapWidth} height={mapHeight} />

      {countries.map((country) => {
        const { x, y } = project(country.lon, country.lat, mapWidth, mapHeight);
        const r = R_MIN + (country.count / maxCount) * (R_MAX - R_MIN);
        const isSelected = selected === country.code;
        const dim = selected !== null && !isSelected;
        return (
          <Pressable
            key={country.code}
            onPress={() => toggle(country.code)}
            style={[
              styles.bubble,
              {
                width: r * 2,
                height: r * 2,
                borderRadius: r,
                left: x - r,
                top: y - r,
                opacity: dim ? 0.35 : 1,
                borderWidth: isSelected ? 3 : 1.5,
                borderColor: isSelected ? colors.greenDark : 'rgba(114,168,56,0.9)',
                backgroundColor: isSelected
                  ? 'rgba(130,191,64,0.55)'
                  : 'rgba(130,191,64,0.32)',
              },
            ]}
          >
            <Text style={{ fontSize: r * 0.9 }}>{country.flag}</Text>
          </Pressable>
        );
      })}

      {selected
        ? (() => {
            const country = countries.find((c) => c.code === selected);
            if (!country) return null;
            const { x, y } = project(country.lon, country.lat, mapWidth, mapHeight);
            const r = R_MIN + (country.count / maxCount) * (R_MAX - R_MIN);
            const label = `${country.name} · ${country.count}`;
            const boxWidth = 8 + label.length * 6.3;
            const left = Math.max(4, Math.min(mapWidth - boxWidth - 4, x - boxWidth / 2));
            const top = Math.max(2, y - r - 26);
            return (
              <View style={[styles.tooltip, { left, top, width: boxWidth }]}>
                <Text style={styles.tooltipText} numberOfLines={1}>
                  {label}
                </Text>
              </View>
            );
          })()
        : null}
    </View>
  );

  return (
    <View>
      <View onLayout={onLayout} style={styles.map}>
        {width > 0 && zoom > 1 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator
            bounces={false}
            style={{ height: mapHeight }}
          >
            {bubbles}
          </ScrollView>
        ) : (
          bubbles || null
        )}

        {canZoom && width > 0 ? (
          <View style={styles.zoomControls}>
            <Pressable
              style={[styles.zoomBtn, zoom >= MAX_ZOOM && styles.zoomBtnDisabled]}
              onPress={() => setZoom((z) => Math.min(MAX_ZOOM, +(z + 0.5).toFixed(1)))}
              accessibilityLabel="Zoom in"
            >
              <Ionicons name="add" size={20} color={colors.text} />
            </Pressable>
            <Pressable
              style={[styles.zoomBtn, zoom <= MIN_ZOOM && styles.zoomBtnDisabled]}
              onPress={() => setZoom((z) => Math.max(MIN_ZOOM, +(z - 0.5).toFixed(1)))}
              accessibilityLabel="Zoom out"
            >
              <Ionicons name="remove" size={20} color={colors.text} />
            </Pressable>
          </View>
        ) : null}
      </View>

      <View style={styles.legend}>
        {countries.map((country) => {
          const isSelected = selected === country.code;
          return (
            <Pressable
              key={country.code}
              onPress={() => toggle(country.code)}
              style={[styles.row, isSelected && styles.rowSelected]}
            >
              <Text style={styles.flag}>{country.flag}</Text>
              <Text style={styles.name} numberOfLines={1}>
                {country.name}
              </Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${(country.count / maxCount) * 100}%`,
                      backgroundColor: isSelected ? colors.greenDark : colors.green,
                    },
                  ]}
                />
              </View>
              <Text style={styles.count}>{country.count}</Text>
              <Text style={styles.share}>{Math.round(country.share * 100)}%</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
  map: {
    width: '100%',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.mapBorder,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.mapOcean,
  },
  bubble: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: colors.text,
    borderRadius: radii.sm,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  tooltipText: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    color: colors.surface,
    textAlign: 'center',
  },
  zoomControls: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    gap: 8,
  },
  zoomBtn: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomBtnDisabled: {
    opacity: 0.4,
  },
  legend: {
    marginTop: 14,
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: radii.sm,
  },
  rowSelected: {
    backgroundColor: colors.liveBg,
  },
  flag: {
    fontSize: 16,
    width: 22,
    textAlign: 'center',
  },
  name: {
    width: 108,
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.text,
  },
  barTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.borderLight,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: colors.green,
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
