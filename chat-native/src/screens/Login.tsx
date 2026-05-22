import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, MessagesSquare } from 'lucide-react-native';
import { loginUser } from '../services/auth';
import { saveUser } from '../services/user';
import { validateEmail, validatePassword } from '../utils/validation';
import { useAuthForm } from '../hooks/useAuthForm';
import { Input } from '../components/Input';
import Button from '../components/Button';
import { colors, textStyles } from '../constants/theme';

export default function LoginScreen({ navigation }: any) {
  const { values, errors, setErrors, loading, setLoading, handleChange } = useAuthForm({
    email: '',
    password: '',
  });

  const handleLogin = async () => {
    const emailError = validateEmail(values.email);
    const passwordError = validatePassword(values.password);

    if (emailError || passwordError) {
      setErrors({ email: emailError || '', password: passwordError || '' });
      return;
    }

    try {
      setLoading(true);
      const res = await loginUser(values.email, values.password);
      await saveUser(
        res.user.uid,
        res.user.email!,
        res.user.displayName ?? undefined,
        res.user.photoURL ?? undefined
      );
    } catch {
      setErrors({
        email: 'Invalid email.',
        password: 'Invalid password.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <MessagesSquare color={colors.accentText} size={32} strokeWidth={2.2} />
            </View>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Sign in to start your conversation</Text>
          </View>

          <View style={styles.formContainer}>
            <Input
              label="Email Address"
              placeholder="name@example.com"
              value={values.email}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              icon={<Mail size={20} color={colors.icon} />}
              onChangeText={(text) => handleChange('email', text)}
            />

            <Input
              label="Password"
              placeholder="••••••••"
              value={values.password}
              error={errors.password}
              secureTextEntry={true}
              autoCapitalize="none"
              icon={<Lock size={20} color={colors.icon} />}
              onChangeText={(text) => handleChange('password', text)}
            />

            <Button
              onPress={handleLogin}
              loading={!!loading}
              style={styles.loginButton}
            >
              Sign In
            </Button>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              activeOpacity={0.7}
            >
              <Text style={styles.linkText}>Create account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    marginBottom: 20,
    height: 68,
    width: 68,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    ...textStyles.screenTitle,
    color: colors.text,
  },
  subtitle: {
    ...textStyles.screenSubtitle,
    color: colors.textMuted,
    marginTop: 8,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    gap: 20,
  },
  loginButton: {
    marginTop: 10,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
  },
  footer: {
    marginTop: 48,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    ...textStyles.footer,
    color: colors.icon,
  },
  linkText: {
    ...textStyles.footerLink,
    color: colors.textMuted,
  },
});
