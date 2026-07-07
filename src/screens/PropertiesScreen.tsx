import { useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing } from '../theme';
import { contentMaxWidth, gridItemWidth, usePropertyColumns } from '../constants/layout';
import { properties as allProperties } from '../data/properties';
import { AppBar, ChipOption, FilterChips, SearchBar } from '../components/ui';
import PropertyCard from '../components/properties/PropertyCard';
import SearchSuggestions from '../components/properties/SearchSuggestions';

type Filter = 'all' | 'live' | 'offline';

const FILTERS: ChipOption<Filter>[] = [
  { key: 'all', label: 'All' },
  { key: 'live', label: 'Live' },
  { key: 'offline', label: 'Offline' },
];

type Props = {
  onLogout: () => void;
  onOpenProperty: (propertyId: string) => void;
};

function matchesQuery(
  property: (typeof allProperties)[number],
  query: string,
): boolean {
  return (
    property.name.toLowerCase().includes(query) ||
    property.location.toLowerCase().includes(query) ||
    property.id.toLowerCase().includes(query)
  );
}

export default function PropertiesScreen({ onLogout, onOpenProperty }: Props) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [searchFocused, setSearchFocused] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allProperties.filter((p) => {
      const matchesFilter = filter === 'all' || p.status === filter;
      return matchesFilter && (!q || matchesQuery(p, q));
    });
  }, [query, filter]);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allProperties
      .filter((p) => matchesQuery(p, q) && p.name.toLowerCase() !== q)
      .slice(0, 5);
  }, [query]);

  const showSuggestions = searchFocused && suggestions.length > 0;
  const liveCount = allProperties.filter((p) => p.status === 'live').length;

  const columns = usePropertyColumns();
  const cardStyle = { width: gridItemWidth(columns) };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppBar maxWidth={contentMaxWidth.properties}>
        <View style={styles.appBarContent}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Pressable
            style={styles.logoutBtn}
            onPress={onLogout}
            hitSlop={8}
            accessibilityLabel="Log out"
          >
            <Ionicons name="log-out-outline" size={20} color={colors.textMuted} />
            <Text style={styles.logoutText}>Log out</Text>
          </Pressable>
        </View>
      </AppBar>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Properties</Text>
            <Text style={styles.subtitle}>
              {allProperties.length} total · {liveCount} live
            </Text>
          </View>

          <SearchBar
            value={query}
            onChangeText={setQuery}
            placeholder="Search properties"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />

          {showSuggestions ? (
            <SearchSuggestions
              items={suggestions}
              onSelect={(property) => {
                setQuery(property.name);
                setSearchFocused(false);
              }}
            />
          ) : null}

          <FilterChips options={FILTERS} value={filter} onChange={setFilter} />

          {filtered.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="file-tray-outline" size={40} color="#ccc" />
              <Text style={styles.emptyText}>No properties found</Text>
            </View>
          ) : (
            <View style={styles.grid}>
              {filtered.map((item) => (
                <PropertyCard
                  key={item.id}
                  item={item}
                  onPress={() => onOpenProperty(item.id)}
                  style={cardStyle}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  appBarContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: 150,
    height: 30,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  logoutText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  content: {
    width: '100%',
    maxWidth: contentMaxWidth.properties,
  },
  titleRow: {
    marginTop: 20,
    marginBottom: 12,
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: 24,
    color: colors.text,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 10,
  },
  emptyText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: '#999',
  },
});
