"use client";

import AvatarPicker from "@/components/AvatarPicker";
import { PlainTextInput } from "@/components/PlainTextInput";
import { WideButton } from "@/components/WideButton";
import { useAuthStore } from "@/libs/store/authStore";
import { uploadProfileSvg } from "@/libs/utils/lib";
import { Profile } from "@/models/profile";
import { IApiResponse } from "@/models/response";
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
import { ChevronLeft } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

const editProfileSchema = z.object({
  name: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(
      /^[a-z0-9_]+$/,
      "Only lowercase letters, numbers, and underscores are allowed"
    ),
  bio: z.string().max(100, "Bio cannot exceed 100 characters").optional(),
});

type EditProfileForm = z.infer<typeof editProfileSchema>;

export default function EditAccount() {
  const { data: profile, refetch: refetchProfile } = useGetProfileQuery(true);
  console.log(profile);
  const { setAuthData, session, profile: currentProfileData } = useAuthStore();
  const { width } = Dimensions.get("window");
  const router = useRouter();

  const [avatar, setAvatar] = useState<string>("");
  const [imageUri, setImageUri] = useState<string>(
    currentProfileData?.avatar_url ?? ""
  );
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
  } = useForm<EditProfileForm>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: currentProfileData?.name?.toLowerCase() || "",
      bio: currentProfileData?.bio || "",
    },
    mode: "onChange",
  });

  const name = watch("name");
  const bio = watch("bio");

  const debounceName = useDebounce(name, 500);
  const { data: checkNameExist, isFetching: isCheckingName } =
    useCheckNameQuery(false, debounceName);

  const onboardingMutation = useOnboardingMutation();

  useEffect(() => {
    if (profile) {
      setAuthData({ session, profile });
      setImageUri(profile.avatar_url || "");
      setValue("name", profile.name);
      setValue("bio", profile.bio);
    }
  }, [profile]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, []);

  const onSubmit = async (data: EditProfileForm) => {
    // console.log(data);
    try {
      if (!avatar) {
        Alert.alert("Please select an image first");
        return;
      }

      setLoading(true);
      const avatar_url = await uploadProfileSvg(avatar, data.name);

      onboardingMutation.mutate(
        {
          bio: data.bio,
          name: data.name,
          avatar_url: avatar_url?.trim() || profile?.avatar_url?.trim(),
          location: {
            lat: location?.coords?.latitude || profile?.location?.lat,
            long: location?.coords?.longitude || profile?.location?.long,
          },
        },
        {
          onSuccess: (response: IApiResponse<Profile>) => {
            setAuthData({
              session,
              profile: response.data,
            });
            refetchProfile();
            setLoading(false);

            if (router.canGoBack()) router.back();
          },
          onError: () => setLoading(false),
        }
      );
    } catch (err: any) {
      console.error("Upload error:", err);
      Alert.alert("Error uploading image");
      setLoading(false);
    }
  };

  const isLoading = loading || isCheckingName;
  const isReady = avatar || isValid || (checkNameExist?.success as boolean);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: THEME.colors.background }}>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
        }}
      >
        <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft color={THEME.colors.text} size={24} />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, color: THEME.colors.text }}>Back</Text>
        </View>
      </View>

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
          {/* Body */}
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              gap: 35,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                marginBottom: 30,
                color: THEME.colors.text,
              }}
            >
              Edit Profile
            </Text>

            <AvatarPicker
              onSelect={(svg) => setAvatar(svg)}
              imageURI={profile?.avatar_url ?? ""}
            />

            {/* Username */}
            <View>
              {checkNameExist?.success ? (
                <Text>{checkNameExist?.message}</Text>
              ) : null}
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                  <PlainTextInput
                    label="Username"
                    plainText={value}
                    width={width}
                    placeholder="Enter your username"
                    setPlainText={(text) => onChange(text.toLowerCase())}
                    error={errors.name?.message}
                  />
                )}
              />
            </View>

            {/* Bio */}
            <View style={{ marginTop: 10 }}>
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
            </View>

            {/* Save Button */}
            <WideButton
              style={{
                marginTop: 30,
                backgroundColor: THEME.colors.surface,
                width: width - 40,
                height: 58,
                justifyContent: "center",
                display: "flex",
                alignItems: "center",
                borderRadius: 20,
              }}
              disabled={!isReady || isLoading}
              onPress={handleSubmit(onSubmit)}
              label="Save Changes"
              width={width}
              isLoading={isLoading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
