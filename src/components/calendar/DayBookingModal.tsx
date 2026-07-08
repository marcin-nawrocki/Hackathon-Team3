import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fonts, Palette, radii, shadows, spacing } from '../../theme';
import { useTheme, useThemedStyles } from '../../ThemeContext';
import {
  Booking,
  BookingSource,
  COUNTRIES,
  SOURCES,
} from '../../data/bookings';
import { Input, PrimaryButton, Select, SelectOption } from '../ui';
import { MONTHS } from '../../utils/calendar';

export type NewBookingInput = {
  checkIn: string;
  nights: number;
  guests: number;
  source: BookingSource;
  countryCode: string;
  arrivalHour: number;
};

type Props = {
  visible: boolean;
  date: string | null;
  booking: Booking | null;
  onClose: () => void;
  onAdd: (input: NewBookingInput) => void;
};

const SOURCE_OPTIONS: SelectOption[] = SOURCES.map((s) => ({
  label: s.name,
  value: s.name,
}));
const COUNTRY_OPTIONS: SelectOption[] = COUNTRIES.map((c) => ({
  label: `${c.flag}  ${c.name}`,
  value: c.code,
}));

const SHORT_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function formatDate(date: string): string {
  const d = new Date(`${date}T00:00:00`);
  const shortDay = SHORT_DAYS[(d.getDay() + 6) % 7];
  return `${shortDay}, ${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`;
}

function nightsBetween(checkIn: string, checkOut: string): number {
  const a = new Date(`${checkIn}T00:00:00`).getTime();
  const b = new Date(`${checkOut}T00:00:00`).getTime();
  return Math.round((b - a) / 86400000);
}

function hour(h: number): string {
  return `${String(h).padStart(2, '0')}:00`;
}

function DetailRow({
  icon,
  label,
  value,
  styles,
  iconColor,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  styles: ReturnType<typeof createStyles>;
  iconColor: string;
}) {
  return (
    <View style={styles.detailRow}>
      <Ionicons name={icon} size={16} color={iconColor} style={styles.detailIcon} />
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

/** Popup showing booking details for a booked day, or an add-booking form for a free day. */
export default function DayBookingModal({ visible, date, booking, onClose, onAdd }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [nights, setNights] = useState('3');
  const [guests, setGuests] = useState('2');
  const [source, setSource] = useState<BookingSource>('Direct');
  const [countryCode, setCountryCode] = useState('GB');
  const [arrival, setArrival] = useState('15');

  useEffect(() => {
    if (visible && !booking) {
      setNights('3');
      setGuests('2');
      setSource('Direct');
      setCountryCode('GB');
      setArrival('15');
    }
  }, [visible, booking, date]);

  const handleAdd = () => {
    if (!date) return;
    const n = Math.max(1, Math.min(30, parseInt(nights, 10) || 1));
    const g = Math.max(1, Math.min(30, parseInt(guests, 10) || 1));
    const a = Math.max(0, Math.min(23, parseInt(arrival, 10) || 15));
    onAdd({ checkIn: date, nights: n, guests: g, source, countryCode, arrivalHour: a });
  };

  const country = booking ? COUNTRIES.find((c) => c.code === booking.countryCode) : null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card}>
          {booking ? (
            <>
              <View style={styles.header}>
                <View style={[styles.badge, { backgroundColor: colors.liveBg }]}>
                  <Ionicons name="calendar" size={16} color={colors.liveText} />
                  <Text style={[styles.badgeText, { color: colors.liveText }]}>Booked</Text>
                </View>
                <Pressable onPress={onClose} hitSlop={8}>
                  <Ionicons name="close" size={22} color={colors.textMuted} />
                </Pressable>
              </View>

              <Text style={styles.title}>{booking.ref}</Text>
              <Text style={styles.subtitle}>
                {nightsBetween(booking.checkIn, booking.checkOut)} nights · {booking.guests} guests
              </Text>

              <View style={styles.detailBlock}>
                <DetailRow
                  icon="log-in-outline"
                  label="Check-in"
                  value={`${formatDate(booking.checkIn)} · ${hour(booking.arrivalHour)}`}
                  styles={styles}
                  iconColor={colors.textMuted}
                />
                <DetailRow
                  icon="log-out-outline"
                  label="Check-out"
                  value={`${formatDate(booking.checkOut)} · ${hour(booking.departureHour)}`}
                  styles={styles}
                  iconColor={colors.textMuted}
                />
                <DetailRow
                  icon="people-outline"
                  label="Guests"
                  value={String(booking.guests)}
                  styles={styles}
                  iconColor={colors.textMuted}
                />
                <DetailRow
                  icon="earth-outline"
                  label="Origin"
                  value={country ? `${country.flag}  ${country.name}` : booking.countryCode}
                  styles={styles}
                  iconColor={colors.textMuted}
                />
                <DetailRow
                  icon="pricetag-outline"
                  label="Source"
                  value={booking.source}
                  styles={styles}
                  iconColor={colors.textMuted}
                />
              </View>

              <PrimaryButton label="Close" onPress={onClose} style={styles.action} />
            </>
          ) : (
            <>
              <View style={styles.header}>
                <View style={[styles.badge, { backgroundColor: colors.offlineBg }]}>
                  <Ionicons name="add-circle-outline" size={16} color={colors.textMuted} />
                  <Text style={[styles.badgeText, { color: colors.textMuted }]}>Available</Text>
                </View>
                <Pressable onPress={onClose} hitSlop={8}>
                  <Ionicons name="close" size={22} color={colors.textMuted} />
                </Pressable>
              </View>

              <Text style={styles.title}>New booking</Text>
              <Text style={styles.subtitle}>{date ? formatDate(date) : ''}</Text>

              <View style={styles.formBlock}>
                <View style={styles.formRow}>
                  <View style={styles.formField}>
                    <Text style={styles.fieldLabel}>Nights</Text>
                    <Input
                      value={nights}
                      onChangeText={setNights}
                      keyboardType="number-pad"
                      maxLength={2}
                    />
                  </View>
                  <View style={styles.formField}>
                    <Text style={styles.fieldLabel}>Guests</Text>
                    <Input
                      value={guests}
                      onChangeText={setGuests}
                      keyboardType="number-pad"
                      maxLength={2}
                    />
                  </View>
                  <View style={styles.formField}>
                    <Text style={styles.fieldLabel}>Arrival (h)</Text>
                    <Input
                      value={arrival}
                      onChangeText={setArrival}
                      keyboardType="number-pad"
                      maxLength={2}
                    />
                  </View>
                </View>

                <Text style={styles.fieldLabel}>Source</Text>
                <Select
                  value={source}
                  options={SOURCE_OPTIONS}
                  onChange={(v) => setSource(v as BookingSource)}
                  icon="pricetag-outline"
                  title="Booking source"
                />

                <Text style={[styles.fieldLabel, { marginTop: spacing.md }]}>Guest origin</Text>
                <Select
                  value={countryCode}
                  options={COUNTRY_OPTIONS}
                  onChange={setCountryCode}
                  icon="earth-outline"
                  title="Guest origin"
                />
              </View>

              <PrimaryButton label="Add booking" onPress={handleAdd} style={styles.action} />
            </>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.lg,
    ...shadows.modal,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.pill,
  },
  badgeText: {
    fontFamily: fonts.semibold,
    fontSize: 12,
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: 20,
    color: colors.text,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  detailBlock: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    width: 24,
  },
  detailLabel: {
    width: 90,
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
  },
  detailValue: {
    flex: 1,
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.text,
    textAlign: 'right',
  },
  formBlock: {
    marginTop: spacing.lg,
  },
  formRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  formField: {
    flex: 1,
  },
  fieldLabel: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 5,
  },
  action: {
    marginTop: spacing.xl,
  },
});
