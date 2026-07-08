import { StyleSheet, Text, View } from 'react-native';
import { fonts, radii } from '../../theme';
import { useTheme } from '../../ThemeContext';
import { PropertyStatus } from '../../data/properties';

type Props = {
  status: PropertyStatus;
};

/** Coloured "Live" / "Offline" pill with a status dot. */
export default function StatusBadge({ status }: Props) {
  const { colors } = useTheme();
  const isLive = status === 'live';
  return (
    <View
      style={[styles.badge, { backgroundColor: isLive ? colors.liveBg : colors.offlineBg }]}
    >
      <View
        style={[styles.dot, { backgroundColor: isLive ? colors.green : colors.offlineText }]}
      />
      <Text style={[styles.text, { color: isLive ? colors.liveText : colors.offlineText }]}>
        {isLive ? 'Live' : 'Offline'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.xl,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontFamily: fonts.semibold,
    fontSize: 11,
  },
});
