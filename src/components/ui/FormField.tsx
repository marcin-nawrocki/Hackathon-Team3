import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../../theme';

type Props = {
  label: string;
  error?: string;
  /** Optional element rendered on the right of the label row (e.g. a link). */
  headerRight?: ReactNode;
  children: ReactNode;
};

/** Label + control + validation message wrapper for form inputs. */
export default function FormField({ label, error, headerRight, children }: Props) {
  return (
    <View style={styles.group}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        {headerRight}
      </View>
      {children}
      {error ? (
        <Text style={styles.error}>
          <Text style={styles.errorStrong}>{error}</Text>
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    marginBottom: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  label: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.text,
  },
  error: {
    marginTop: 5,
    fontSize: 14,
    color: colors.error,
  },
  errorStrong: {
    fontFamily: fonts.semibold,
  },
});
