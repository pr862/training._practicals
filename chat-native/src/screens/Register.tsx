import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Lock, Mail, MessagesSquare, User as UserIcon } from "lucide-react-native";
import { registerUser, updateUserProfile } from "../services/auth";
import { saveUser } from "../services/user";
import { validateName, validateEmail, validatePassword, validateConfirmPassword } from "../utils/validation";
import { Input } from "../components/Input";
import Button from "../components/Button";
import { useAuthForm } from "../hooks/useAuthForm";
import { uploadImageToCloudinary } from "../services/upload";
import { colors, textStyles } from "../constants/theme";

export default function RegisterScreen({ navigation }: any) {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { values, errors, setErrors, loading, setLoading, handleChange } = useAuthForm({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission Denied", "We need camera roll permissions to upload a profile picture.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleRegister = async () => {
    const newErrors = {
      name: validateName(values.name) || "",
      email: validateEmail(values.email) || "",
      password: validatePassword(values.password) || "",
      confirmPassword: validateConfirmPassword(values.confirmPassword, values.password) || "",
    };

    if (Object.values(newErrors).some((err) => err !== "")) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const res = await registerUser(values.email, values.password);
      let photoURL = "";

      if (profileImage) {
        photoURL = await uploadImageToCloudinary(profileImage);
      }

      await updateUserProfile(res.user, {
        displayName: values.name,
        ...(photoURL ? { photoURL } : {}),
      });

      await saveUser(res.user.uid, res.user.email!, values.name, photoURL);
    } catch (err) {
      const errorCode = err && typeof err === "object" && "code" in err ? String(err.code) : "";

      if (errorCode === "auth/email-already-in-use") {
        setErrors((prev) => ({
          ...prev,
          email: "Email already exists.",
        }));
        return;
      }

      Alert.alert("Registration Failed", err instanceof Error ? err.message : "Something went wrong");
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
            <View style={styles.logoContainer}>
              <MessagesSquare color={colors.accentText} size={28} strokeWidth={2.2} />
            </View>
            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>Fill in your details to get started</Text>
          </View>

          <View style={styles.avatarSection}>
            <TouchableOpacity
              onPress={pickImage}
              style={styles.imagePicker}
              activeOpacity={0.8}
            >
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.fullImage} />
              ) : (
                <UserIcon size={36} color={colors.icon} />
              )}
              <View style={styles.cameraIconBadge}>
                <Camera size={14} color={colors.accentText} strokeWidth={2.5} />
              </View>
            </TouchableOpacity>
            <Text style={styles.uploadText}>Add profile photo</Text>
          </View>

          <View style={styles.formContainer}>
            <Input
              label="Full Name"
              placeholder="Your name"
              value={values.name}
              error={errors.name}
              icon={<UserIcon size={20} color={colors.icon} />}
              onChangeText={(text) => handleChange("name", text)}
            />

            <Input
              label="Email Address"
              placeholder="name@example.com"
              value={values.email}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              icon={<Mail size={20} color={colors.icon} />}
              onChangeText={(text) => handleChange("email", text)}
            />

            <Input
              label="Password"
              placeholder="••••••••"
              value={values.password}
              error={errors.password}
              secureTextEntry={true}
              autoCapitalize="none"
              icon={<Lock size={20} color={colors.icon} />}
              onChangeText={(text) => handleChange("password", text)}
            />

            <Input
              label="Confirm Password"
              placeholder="••••••••"
              value={values.confirmPassword}
              error={errors.confirmPassword}
              secureTextEntry={true}
              autoCapitalize="none"
              icon={<Lock size={20} color={colors.icon}/>}
              onChangeText={(text) => handleChange("confirmPassword", text)}
            />

            <Button
              onPress={handleRegister}
              loading={!!loading}
              style={styles.registerButton}
            >
              Get Started
            </Button>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.7}
            >
              <Text style={styles.linkText}>Sign in</Text>
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
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingTop: 30,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoContainer: {
    marginBottom: 16,
    height: 60,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  title: {
    ...textStyles.screenTitle,
    color: colors.text,
  },
  subtitle: {
    ...textStyles.screenSubtitle,
    color: colors.textMuted,
    marginTop: 0,
    textAlign: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  imagePicker: {
    height: 96,
    width: 96,
    borderRadius: 48,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    elevation: 2,
  },

  fullImage: {
    height: '100%',
    width: '100%',
    borderRadius: 48,
  },
  cameraIconBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: colors.accent,
    height: 28,
    width: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surfaceRaised ,
  },
  uploadText: {
    ...textStyles.helper,
    color: '#6b6b72',
    marginTop: 10,
  },
  formContainer: {
    width: '100%',
    gap: 20,
  },
  registerButton: {
    marginTop: 10,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
  },
  footer: {
    marginTop: 40,
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
