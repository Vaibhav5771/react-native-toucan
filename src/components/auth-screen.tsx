import { useSignIn, useSignUp, useSSO } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AuthTextInput } from "@/components/auth-text-input";
import { Image } from "@/components/image";
import { PrimaryButton } from "@/components/primary-button";
import { SocialAuthButton } from "@/components/social-auth-button";
import { VerificationModal } from "@/components/verification-modal";
import { images } from "@/constants/images";

type AuthMode = "sign-up" | "sign-in";

const COPY: Record<
  AuthMode,
  {
    title: string;
    subtitle: string;
    submitLabel: string;
    footerPrompt: string;
    footerActionLabel: string;
    footerHref: "/sign-up" | "/sign-in";
  }
> = {
  "sign-up": {
    title: "Create your account",
    subtitle: "Start your language journey today ✨",
    submitLabel: "Sign Up",
    footerPrompt: "Already have an account? ",
    footerActionLabel: "Log in",
    footerHref: "/sign-in",
  },
  "sign-in": {
    title: "Welcome back",
    subtitle: "Continue your language journey ✨",
    submitLabel: "Log In",
    footerPrompt: "Don't have an account? ",
    footerActionLabel: "Sign up",
    footerHref: "/sign-up",
  },
};

const SOCIAL_PROVIDERS = [
  { strategy: "oauth_google", icon: "google", iconColor: "#EA4335", label: "Continue with Google" },
] as const;

export function AuthScreen({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const copy = COPY[mode];

  const { signUp, errors: signUpErrors, fetchStatus: signUpFetchStatus } = useSignUp();
  const { signIn, errors: signInErrors, fetchStatus: signInFetchStatus } = useSignIn();
  const { startSSOFlow } = useSSO();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [socialError, setSocialError] = useState<string | null>(null);

  const passwordInputRef = useRef<TextInput>(null);

  const fetchStatus = mode === "sign-up" ? signUpFetchStatus : signInFetchStatus;
  const isSubmitting = fetchStatus === "fetching";

  const handleSubmit = async () => {
    setSocialError(null);

    if (mode === "sign-up") {
      const { error } = await signUp.password({ emailAddress: email, password });
      if (error) return;

      const { error: codeError } = await signUp.verifications.sendEmailCode();
      if (codeError) return;
    } else {
      const { error } = await signIn.emailCode.sendCode({ emailAddress: email });
      if (error) return;
    }

    setIsVerifying(true);
  };

  const handleVerify = async (code: string) => {
    if (mode === "sign-up") {
      const { error } = await signUp.verifications.verifyEmailCode({ code });
      if (error) return { error: error.longMessage ?? error.message };

      if (signUp.status === "complete") {
        await signUp.finalize({ navigate: () => router.replace("/") });
      }
    } else {
      const { error } = await signIn.emailCode.verifyCode({ code });
      if (error) return { error: error.longMessage ?? error.message };

      if (signIn.status === "complete") {
        await signIn.finalize({ navigate: () => router.replace("/") });
      }
    }
  };

  const handleSocialAuth = async (strategy: (typeof SOCIAL_PROVIDERS)[number]["strategy"]) => {
    setSocialError(null);
    try {
      const { createdSessionId, setActive } = await startSSOFlow({ strategy });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace("/");
      }
    } catch {
      setSocialError("Something went wrong. Please try again.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <ScrollView
        className="bg-background"
        contentContainerClassName="gap-6 px-screen pb-6 pt-2"
        keyboardShouldPersistTaps="handled"
      >
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          className="h-8 w-8 items-center justify-start"
        >
          <Ionicons name="chevron-back" size={26} color="#10151f" />
        </Pressable>

        <View className="gap-2">
          <Text className="font-poppins-bold text-h1 text-ink">{copy.title}</Text>
          <Text className="text-body-md text-ink-muted">{copy.subtitle}</Text>
        </View>

        <Image
          source={images.mascotAuth}
          contentFit="contain"
          className="mt-12 aspect-[1313/1198] h-40 self-center"
        />

        <View className="-mt-6 gap-4">
          <AuthTextInput
            label="Email"
            placeholder="alex@gmail.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType={mode === "sign-up" ? "next" : "done"}
            onSubmitEditing={() =>
              mode === "sign-up" ? passwordInputRef.current?.focus() : handleSubmit()
            }
            submitBehavior={mode === "sign-up" ? "submit" : "blurAndSubmit"}
            value={email}
            onChangeText={setEmail}
            error={
              mode === "sign-up"
                ? signUpErrors.fields.emailAddress?.message
                : signInErrors.fields.identifier?.message
            }
          />

          {mode === "sign-up" && (
            <AuthTextInput
              ref={passwordInputRef}
              label="Password"
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password-new"
              textContentType="newPassword"
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
              value={password}
              onChangeText={setPassword}
              error={signUpErrors.fields.password?.message}
            />
          )}

          <PrimaryButton
            onPress={handleSubmit}
            disabled={isSubmitting}
            label={copy.submitLabel}
          />

          {mode === "sign-up" && <View nativeID="clerk-captcha" />}
        </View>

        <View className="flex-row items-center gap-3">
          <View className="h-px flex-1 bg-border" />
          <Text className="text-body-sm text-ink-muted">or continue with</Text>
          <View className="h-px flex-1 bg-border" />
        </View>

        <View className="gap-3">
          {socialError && (
            <Text className="text-center text-caption text-error">{socialError}</Text>
          )}
          {SOCIAL_PROVIDERS.map((provider) => (
            <SocialAuthButton
              key={provider.strategy}
              icon={provider.icon}
              iconColor={provider.iconColor}
              label={provider.label}
              onPress={() => handleSocialAuth(provider.strategy)}
            />
          ))}
        </View>

        <View className="flex-row flex-wrap items-center justify-center gap-1 pt-2">
          <Text className="text-body-md text-ink-muted">{copy.footerPrompt}</Text>
          <Pressable onPress={() => router.replace(copy.footerHref)}>
            <Text className="font-poppins-semibold text-body-md text-tucana-teal-deep">
              {copy.footerActionLabel}
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <VerificationModal
        visible={isVerifying}
        email={email || "your email"}
        onVerify={handleVerify}
        onClose={() => setIsVerifying(false)}
      />
    </SafeAreaView>
  );
}
