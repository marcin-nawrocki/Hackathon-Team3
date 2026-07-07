import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii } from '../../theme';

/** Legend explaining the available vs booked day colours. */
export default function CalendarLegend() {
  return (
    <View style={styles.legend}>
      <View style={styles.item}>
        <View style={[styles.swatch, styles.available]} />
        <Text style={styles.text}>Available</Text>
      </View>
      <View style={styles.item}>
        <View style={[styles.swatch, styles.booked]} />
        <Text style={styles.text}>Booked</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  legend: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 16,
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  swatch: {
    width: 16,
    height: 16,
    borderRadius: radii.sm,
  },
  available: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  booked: {
    backgroundColor: colors.green,
  },
  text: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
  },
});
