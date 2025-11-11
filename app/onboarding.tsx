"use client";

import AvatarPicker from "@/components/AvatarPicker";
import { PlainTextInput } from "@/components/PlainTextInput";
import { WideButton } from "@/components/WideButton";
import { useAuthStore } from "@/libs/store/authStore";
import { PLACEHOLDER_CONSTANTS } from "@/shared/constants/placeholders";
import { THEME } from "@/shared/constants/theme";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { useProfile } from "@/shared/hooks/use-profile";
import {
  useCheckNameQuery,
  useGetProfileQuery,
  useOnboardingMutation,
} from "@/shared/services/auth/authApi";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Alert, Dimensions, Platform, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Onboarding() {
  const router = useRouter();
  const { width } = Dimensions.get("window");
  const [imageUri, setImageUri] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const { profile, setAuthData, session } = useAuthStore();

  const [isUploading, setIsUploading] = useState(false);

  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (profile?.onboarded) {
    router.replace("/main/(dashboard)");
  }

  useEffect(() => {
    if (!session) router.replace("/(auth)/login");
    if (session && profile?.onboarded) {
      router.replace("/main/(dashboard)");
    }
  }, [profile, session]);

  useEffect(() => {
    (async () => {
      // Ask for permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      // Get current location
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, []);

  const { profile: prof } = useProfile();

  const debounceName = useDebounce(name, 500);
  const {
    data: checkNameExist,
    isFetching: isCheckingName,
    refetch: recheckName,
  } = useCheckNameQuery(false, debounceName);

  const { data: newProfile, refetch: refetchProfile } =
    useGetProfileQuery(false);

  const onboardingMutation = useOnboardingMutation();
  const isValid = name !== "" && imageUri !== "";

  const handleSubmit = async () => {
    try {
      if (!imageUri) {
        Alert.alert("Please select an image first");
        return;
      }
      setLoading(true);

      onboardingMutation.mutate(
        {
          bio,
          name,
          avatar_url: imageUri,
          location: {
            lat: location?.coords?.latitude,
            long: location?.coords?.longitude,
          },
        },
        {
          onSuccess: () => {
            refetchProfile();
            setLoading(false);
            setAuthData({
              profile: newProfile,
              session,
            });
          },
        }
      );
    } catch (err) {
      console.error("Upload error:", err);
      Alert.alert("Error uploading image");
    }
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "space-evenly",
        alignItems: "center",
        backgroundColor: THEME.colors.background,
      }}
    >
      <Text style={{ fontSize: 24, marginBottom: 30 }}>Account Setup</Text>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      <AvatarPicker
        onSelect={(url) => {
          setImageUri(url);
        }}
        imageURI={profile?.avatar_url || PLACEHOLDER_CONSTANTS.avatar}
      />
      {/* <ImagePicker onImageLoaded={onImageLoaded} imageURI={imageUri} />
       */}
      <PlainTextInput
        label="Username"
        plainText={name}
        width={width}
        placeholder="Enter your username"
        setPlainText={setName}
      />

      <PlainTextInput
        label="Bio"
        plainText={bio}
        width={width}
        placeholder="Enter your bio"
        setPlainText={setBio}
      />

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
        disabled={
          onboardingMutation.isPending ||
          !isValid ||
          isUploading ||
          isCheckingName
        }
        onPress={handleSubmit}
        label="Submit"
        width={width}
        isLoading={onboardingMutation.isPending || isUploading}
      />
    </SafeAreaView>
  );
}
