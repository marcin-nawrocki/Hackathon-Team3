import { useState } from 'react';
import {
  useFonts,
  SourceSans3_300Light,
  SourceSans3_400Regular,
  SourceSans3_600SemiBold,
} from '@expo-google-fonts/source-sans-3';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/ThemeContext';
import LoginScreen from './src/screens/LoginScreen';
import PropertiesScreen from './src/screens/PropertiesScreen';
import BookingCalendarScreen from './src/screens/BookingCalendarScreen';
import StatisticsScreen from './src/screens/StatisticsScreen';

const DEFAULT_YEAR = 2026;

type Screen =
  | { name: 'login' }
  | { name: 'properties' }
  | { name: 'calendar'; propertyId: string; year: number }
  | { name: 'statistics' };

function AppInner() {
  const { colors, isDark } = useTheme();
  const [fontsLoaded] = useFonts({
    SourceSans3_300Light,
    SourceSans3_400Regular,
    SourceSans3_600SemiBold,
  });

  const [screen, setScreen] = useState<Screen>({ name: 'login' });

  if (!fontsLoaded) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.green} />
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </View>
    );
  }

  let content;
  if (screen.name === 'login') {
    content = <LoginScreen onLoginSuccess={() => setScreen({ name: 'properties' })} />;
  } else if (screen.name === 'properties') {
    content = (
      <PropertiesScreen
        onLogout={() => setScreen({ name: 'login' })}
        onOpenProperty={(propertyId) =>
          setScreen({ name: 'calendar', propertyId, year: DEFAULT_YEAR })
        }
        onOpenStatistics={() => setScreen({ name: 'statistics' })}
      />
    );
  } else if (screen.name === 'statistics') {
    content = <StatisticsScreen onBack={() => setScreen({ name: 'properties' })} />;
  } else {
    content = (
      <BookingCalendarScreen
        propertyId={screen.propertyId}
        year={screen.year}
        onBack={() => setScreen({ name: 'properties' })}
        onChangeProperty={(propertyId) => setScreen({ ...screen, propertyId })}
        onChangeYear={(year) => setScreen({ ...screen, year })}
      />
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {content}
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <AppInner />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
