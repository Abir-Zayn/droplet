import { useSignIn } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignIn() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [isVerificationPending, setIsVerificationPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const isLoading = fetchStatus === "fetching";

  const finishSignIn = async () => {
    const { error } = await signIn.finalize();
    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.replace("/(root)/(tabs)");
  };

  const onSignInPress = async () => {
    if (isLoading) return;
    setErrorMessage("");

    try {
      const { error } = await signIn.password({
        identifier: email.trim(),
        password,
      });
      if (error) {
        setErrorMessage(error.message);
        return;
      }

      if (signIn.status === "complete") {
        await finishSignIn();
        return;
      }

      if (
        signIn.status === "needs_client_trust" ||
        signIn.status === "needs_second_factor"
      ) {
        const emailCodeFactor = signIn.supportedSecondFactors?.find(
          (factor) => factor.strategy === "email_code",
        );

        if (emailCodeFactor) {
          const { error: sendError } = await signIn.mfa.sendEmailCode();
          if (sendError) {
            setErrorMessage(sendError.message);
            return;
          }

          setIsVerificationPending(true);
          return;
        }
      }

      setErrorMessage("Your account requires another sign-in verification method.");
    } catch (error) {
      console.error("Sign in error:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to sign in. Please check your credentials.",
      );
    }
  };

  const onVerifyPress = async () => {
    if (isLoading || !code.trim()) return;
    setErrorMessage("");

    try {
      const { error } = await signIn.mfa.verifyEmailCode({ code: code.trim() });
      if (error) {
        setErrorMessage(error.message);
        return;
      }

      if (signIn.status === "complete") {
        await finishSignIn();
      } else {
        setErrorMessage("Sign-in verification is not complete yet.");
      }
    } catch (error) {
      console.error("Sign-in verification error:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to verify the code.",
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Section */}
          <View style={styles.header}>
            <Image
              source={require("../../assets/images/android-icon-foreground.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Welcome back to Droplet!</Text>
            <Text style={styles.subtitle}>
              Sign in to manage your budget and view your finances.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {errorMessage ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorBannerText}>{errorMessage}</Text>
              </View>
            ) : null}

            {isVerificationPending ? (
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Verification Code</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter the code sent to your email"
                  placeholderTextColor="#8A8D96"
                  value={code}
                  onChangeText={setCode}
                  keyboardType="number-pad"
                  autoCapitalize="none"
                />
                {errors.fields.code ? (
                  <Text style={styles.errorBannerText}>
                    {errors.fields.code.message}
                  </Text>
                ) : null}
                <TouchableOpacity
                  onPress={() => signIn.mfa.sendEmailCode()}
                  disabled={isLoading}
                  accessibilityRole="button"
                >
                  <Text style={styles.linkText}>Resend code</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {/* Email Field */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Email Address</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="you@example.com"
                    placeholderTextColor="#8A8D96"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  {errors.fields.identifier ? (
                    <Text style={styles.errorBannerText}>
                      {errors.fields.identifier.message}
                    </Text>
                  ) : null}
                </View>

                {/* Password Field */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor="#8A8D96"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                  {errors.fields.password ? (
                    <Text style={styles.errorBannerText}>
                      {errors.fields.password.message}
                    </Text>
                  ) : null}
                </View>
              </>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              onPress={isVerificationPending ? onVerifyPress : onSignInPress}
              disabled={isLoading || (isVerificationPending && !code.trim())}
              style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>
                  {isVerificationPending ? "Verify" : "Sign In"}
                </Text>
              )}
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Don&apos;t have an account? </Text>
              <Link href="/sign-up" asChild>
                <TouchableOpacity>
                  <Text style={styles.linkText}>Sign Up</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F4F0",
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    justifyContent: "center",
  },
  header: {
    marginBottom: 28,
  },
  logo: {
    width: 64,
    height: 64,
    marginBottom: 16,
    borderRadius: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1D26",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: "#5C5F68",
    lineHeight: 22,
  },
  form: {
    width: "100%",
  },
  errorBox: {
    backgroundColor: "#FED7D7",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorBannerText: {
    color: "#C53030",
    fontSize: 13,
    fontWeight: "500",
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1A1D26",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8E6DF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#1A1D26",
  },
  primaryButton: {
    backgroundColor: "#1A85FF",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#5C5F68",
  },
  linkText: {
    fontSize: 14,
    color: "#1A85FF",
    fontWeight: "600",
  },
});
