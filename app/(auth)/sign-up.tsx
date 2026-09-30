import { useSignUp } from "@clerk/expo";
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

export default function SignUp() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [isVerificationPending, setIsVerificationPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const isLoading = fetchStatus === "fetching";
  const finishSignUp = async () => {
    const { error } = await signUp.finalize();
    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.replace("/(root)/(tabs)");
  };

  const onSignUpPress = async () => {
    if (isLoading) return;
    setErrorMessage("");
    try {
      const { error } = await signUp.password({
        emailAddress: email.trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      if (signUp.status === "complete") {
        await finishSignUp();
        return;
      }

      if (signUp.unverifiedFields.includes("email_address")) {
        const { error: sendError } = await signUp.verifications.sendEmailCode();
        if (sendError) {
          setErrorMessage(sendError.message);
          return;
        }

        setIsVerificationPending(true);
        return;
      }

      setErrorMessage("Your account requires additional information to finish sign-up.");
    } catch (error) {
      console.error("Sign up error:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to create your account.",
      );
    }
  };

  const onVerifyPress = async () => {
    if (isLoading || !code.trim()) return;
    setErrorMessage("");

    try {
      const { error } = await signUp.verifications.verifyEmailCode({
        code: code.trim(),
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      if (signUp.status === "complete") {
        await finishSignUp();
      } else {
        setErrorMessage("Email verification is not complete yet.");
      }
    } catch (error) {
      console.error("Email verification error:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to verify your email.",
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
            <Text style={styles.title}>Sign up for Droplet!</Text>
            <Text style={styles.subtitle}>
              Join the community and manage your finances with ease.
            </Text>
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            {isVerificationPending ? (
              <>
                <Text style={styles.subtitle}>
                  Enter the verification code sent to your email.
                </Text>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Verification Code</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter verification code"
                    placeholderTextColor="#8A8D96"
                    value={code}
                    onChangeText={setCode}
                    keyboardType="number-pad"
                    autoCapitalize="none"
                  />
                  {errors.fields.code ? (
                    <Text style={styles.errorText}>
                      {errors.fields.code.message}
                    </Text>
                  ) : null}
                </View>
                <TouchableOpacity
                  onPress={() => signUp.verifications.sendEmailCode()}
                  disabled={isLoading}
                  accessibilityRole="button"
                >
                  <Text style={styles.linkText}>Resend code</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {/* First Name & Last Name Row */}
                <View style={styles.row}>
                  <View style={styles.halfField}>
                    <Text style={styles.label}>First Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="First Name"
                      placeholderTextColor="#8A8D96"
                      value={firstName}
                      onChangeText={setFirstName}
                      autoCapitalize="words"
                    />
                  </View>

                  <View style={styles.halfField}>
                    <Text style={styles.label}>Last Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Last Name"
                      placeholderTextColor="#8A8D96"
                      value={lastName}
                      onChangeText={setLastName}
                      autoCapitalize="words"
                    />
                  </View>
                </View>

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
                  {errors.fields.emailAddress ? (
                    <Text style={styles.errorText}>
                      {errors.fields.emailAddress.message}
                    </Text>
                  ) : null}
                </View>

                {/* Password Field */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter password"
                    placeholderTextColor="#8A8D96"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                  {errors.fields.password ? (
                    <Text style={styles.errorText}>
                      {errors.fields.password.message}
                    </Text>
                  ) : null}
                </View>
              </>
            )}

            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            {/* Submit Button */}
            <TouchableOpacity
              onPress={isVerificationPending ? onVerifyPress : onSignUpPress}
              disabled={isLoading || (isVerificationPending && !code.trim())}
              style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>
                  {isVerificationPending ? "Verify Email" : "Sign Up"}
                </Text>
              )}
            </TouchableOpacity>

            {/* Sign In Link */}
            {!isVerificationPending ? (
              <View style={styles.footerRow}>
                <Text style={styles.footerText}>Already have an account? </Text>
                <Link href="/sign-in" asChild>
                  <TouchableOpacity>
                    <Text style={styles.linkText}>Sign In</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            ) : null}
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
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  halfField: {
    flex: 1,
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
  errorText: {
    color: "#E53E3E",
    fontSize: 12,
    marginTop: 4,
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
