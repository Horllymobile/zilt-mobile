"use client";

import AvatarPicker from "@/components/AvatarPicker";
import { PlainTextInput } from "@/components/PlainTextInput";
import { WideButton } from "@/components/WideButton";
import { useAuthStore } from "@/libs/store/authStore";
import { uploadProfileSvg } from "@/libs/utils/lib";
import { PLACEHOLDER_CONSTANTS } from "@/shared/constants/placeholders";
import { THEME } from "@/shared/constants/theme";
import { useDebounce } from "@/shared/hooks/use-debounce";
import {
  useCheckNameQuery,
  useGetProfileQuery,
  useOnboardingMutation,
} from "@/shared/services/auth/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

const onboardingSchema = z.object({
  name: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(
      /^[a-z0-9_]+$/,
      "Only lowercase letters, numbers, and underscores are allowed"
    ),
  bio: z.string().max(150, "Bio cannot exceed 150 characters").optional(),
});

type OnboardingForm = z.infer<typeof onboardingSchema>;

export default function Onboarding() {
  const router = useRouter();
  const { width } = Dimensions.get("window");
  const store = useAuthStore();
  const { data: profile, refetch: refetchProfile } = useGetProfileQuery(true);

  const [imageUri, setImageUri] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<OnboardingForm>({
    resolver: zodResolver(onboardingSchema),
    mode: "onChange",
  });

  const debounceName = useDebounce(watch("name"), 1000);

  const { data: checkNameExist, isFetching: isCheckingName } =
    useCheckNameQuery(!Boolean(watch("name") === ""), debounceName);
  const onboardingMutation = useOnboardingMutation();

  console.log("Onboarding", profile);

  useEffect(() => {
    if (!store.session) {
      router.replace("/(auth)/login");
      return;
    }

    if (!profile) return; // wait for profile to load

    // Update store first
    store.setAuthData({
      ...store,
      profile,
    });

    setImageUri(profile.avatar_url || profile.avatar || "");
    setValue("name", profile?.name || "");
    setValue("bio", profile?.bio || "");

    // Then navigate if onboarded
    if (profile.onboarded) {
      router.replace("/main/(dashboard)");
    }
  }, [profile, store.session]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, []);

  const onSubmit = async (data: OnboardingForm) => {
    try {
      if (!imageUri) {
        Alert.alert("Please select an image first");
        return;
      }

      setLoading(true);
      const avatar_url = await uploadProfileSvg(avatar, data.name);

      onboardingMutation.mutate(
        {
          name: data.name,
          bio: data.bio,
          avatar_url,
          location: {
            lat: location?.coords?.latitude,
            long: location?.coords?.longitude,
          },
        },
        {
          onSuccess: (data) => {
            console.log(data);
            refetchProfile();
            setLoading(false);
            store.setAuthData({ profile, ...store });
            router.replace("/main/(dashboard)");
          },
        }
      );
    } catch (err: any) {
      console.error(err);
      Alert.alert("Upload failed", err.message);
      setLoading(false);
    }
  };

  const isLoading = onboardingMutation.isPending || loading || isCheckingName;
  const isReady = !avatar || isValid || isLoading || !checkNameExist?.success;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: THEME.colors.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 40,
            gap: 20,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text
            style={{ fontSize: 24, marginBottom: 30, color: THEME.colors.text }}
          >
            Account Setup
          </Text>
          <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />

          <AvatarPicker
            onSelect={(url) => setImageUri(url)}
            imageURI={profile?.avatar_url || PLACEHOLDER_CONSTANTS.avatar}
          />

          {/* Username */}
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <PlainTextInput
                label="Username"
                plainText={value || ""}
                width={width}
                placeholder="Enter your username"
                setPlainText={(text) => onChange(text.toLowerCase())}
                error={
                  errors.name?.message || !checkNameExist?.success
                    ? checkNameExist?.message
                    : undefined
                }
              />
            )}
          />

          {/* Bio */}
          <Controller
            control={control}
            name="bio"
            render={({ field: { onChange, value } }) => (
              <PlainTextInput
                label="Bio"
                plainText={value || ""}
                width={width}
                placeholder="Enter your bio"
                setPlainText={onChange}
                error={errors.bio?.message}
              />
            )}
          />

          <WideButton
            style={{
              marginTop: 30,
              backgroundColor: THEME.colors.surface,
              width: width - 40,
              height: 58,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 20,
            }}
            disabled={!isReady}
            onPress={handleSubmit(onSubmit)}
            label="Submit"
            width={width}
            isLoading={isLoading}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
