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
import { colors } from './src/theme';
import LoginScreen from './src/screens/LoginScreen';
import PropertiesScreen from './src/screens/PropertiesScreen';
import BookingCalendarScreen from './src/screens/BookingCalendarScreen';

const DEFAULT_YEAR = 2026;

type Screen =
  | { name: 'login' }
  | { name: 'properties' }
  | { name: 'calendar'; propertyId: string; year: number };

export default function App() {
  const [fontsLoaded] = useFonts({
    SourceSans3_300Light,
    SourceSans3_400Regular,
    SourceSans3_600SemiBold,
  });

  const [screen, setScreen] = useState<Screen>({ name: 'login' });

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.green} />
        <StatusBar style="dark" />
      </View>
    );
  }

  let content;
  if (screen.name === 'login') {
    content = (
      <LoginScreen onLoginSuccess={() => setScreen({ name: 'properties' })} />
    );
  } else if (screen.name === 'properties') {
    content = (
      <PropertiesScreen
        onLogout={() => setScreen({ name: 'login' })}
        onOpenProperty={(propertyId) =>
          setScreen({ name: 'calendar', propertyId, year: DEFAULT_YEAR })
        }
      />
    );
  } else {
    content = (
      <BookingCalendarScreen
        propertyId={screen.propertyId}
        year={screen.year}
        onBack={() => setScreen({ name: 'properties' })}
        onChangeProperty={(propertyId) =>
          setScreen({ ...screen, propertyId })
        }
        onChangeYear={(year) => setScreen({ ...screen, year })}
      />
    );
  }

  return (
    <SafeAreaProvider>
      {content}
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
