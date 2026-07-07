import { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, fonts, radii } from '../theme';
import { contentMaxWidth } from '../constants/layout';
import {
  Card,
  Checkbox,
  FormField,
  Input,
  PasswordInput,
  PrimaryButton,
} from '../components/ui';

type Props = {
  onLoginSuccess: () => void;
};

export default function LoginScreen({ onLoginSuccess }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLogin = async () => {
    const nextUsernameError = username.trim() ? '' : 'Please enter your username.';
    const nextPasswordError = password ? '' : 'Please enter your password.';
    setUsernameError(nextUsernameError);
    setPasswordError(nextPasswordError);
    if (nextUsernameError || nextPasswordError) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    onLoginSuccess();
  };

  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        <View style={styles.cardWrapper}>
          <Card style={styles.card}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />

            <FormField label="Login" error={usernameError}>
              <Input
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  if (usernameError) setUsernameError('');
                }}
                hasError={!!usernameError}
                autoComplete="username"
              />
            </FormField>

            <FormField
              label="Password"
              error={passwordError}
              headerRight={
                <Pressable
                  onPress={() =>
                    Alert.alert('Forgot password', 'Password reset link would open here.')
                  }
                >
                  <Text style={styles.forgotPassword}>Forgot password?</Text>
                </Pressable>
              }
            >
              <PasswordInput
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) setPasswordError('');
                }}
                hasError={!!passwordError}
              />
            </FormField>

            <View style={styles.checkboxRow}>
              <Checkbox
                checked={rememberMe}
                onToggle={() => setRememberMe((prev) => !prev)}
                label="Remember me"
              />
            </View>

            <View style={styles.actionsRow}>
              <PrimaryButton
                label="Log in"
                onPress={handleLogin}
                loading={loading}
                style={styles.loginButton}
              />
            </View>
          </Card>

          <View style={styles.footer}>
            <Text style={styles.copyright}>
              ©{' '}
              <Text
                style={styles.link}
                onPress={() => Linking.openURL('https://www.supercontrol.co.uk/')}
              >
                SuperControl Ltd
              </Text>{' '}
              {new Date().getFullYear()}. All Rights Reserved.
            </Text>
            <Pressable
              onPress={() => Alert.alert('Support', 'Support information would open here.')}
            >
              <Text style={styles.link}>Support info</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  cardWrapper: {
    width: '100%',
    maxWidth: contentMaxWidth.login,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    paddingHorizontal: 32,
    paddingVertical: 30,
  },
  logo: {
    width: 215,
    height: 48,
    alignSelf: 'center',
    marginBottom: 36,
  },
  forgotPassword: {
    fontFamily: fonts.light,
    fontSize: 16,
    color: colors.green,
  },
  checkboxRow: {
    marginBottom: 15,
    paddingLeft: 4,
  },
  actionsRow: {
    alignItems: 'flex-end',
    minHeight: 40,
    justifyContent: 'center',
  },
  loginButton: {
    width: 80,
    borderRadius: radii.sm,
    marginRight: 0,
  },
  footer: {
    marginTop: 10,
    alignItems: 'center',
    padding: 10,
  },
  copyright: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 4,
  },
  link: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.green,
    textAlign: 'center',
  },
});
