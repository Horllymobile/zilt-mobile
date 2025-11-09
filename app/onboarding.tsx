"use client";

import AvatarPicker from "@/components/AvatarPicker";
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
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from "react-native";
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
        onImageLoaded={(url) => {
          setImageUri(url);
        }}
        imageURI={profile?.avatar_url || PLACEHOLDER_CONSTANTS.avatar}
      />
      {/* <ImagePicker onImageLoaded={onImageLoaded} imageURI={imageUri} />
       */}
      <View>
        <Text>Username</Text>
        <View
          style={{
            borderWidth: 0.2,
            borderRadius: 10,
            marginTop: 10,
            padding: 10,
            height: 58,
            width: width - 40,
          }}
        >
          <TextInput
            style={{
              fontSize: 16,
              width: width - 40,
              borderWidth: 0,
              borderRadius: 0,
            }}
            placeholder="Enter your username"
            value={name}
            onChangeText={(n) => {
              setName(n);
              if (n && n !== profile?.name) {
                recheckName();
              }
            }}
          />
        </View>
        <Text
          style={{
            marginTop: 5,
            color: checkNameExist?.success ? "green" : "red",
          }}
        >
          {checkNameExist?.message}
        </Text>
      </View>

      <View style={{ marginTop: 20 }}>
        <Text>Bio</Text>
        <View
          style={{
            borderWidth: 0.2,
            borderRadius: 10,
            marginTop: 10,
            padding: 10,
            height: 70,
            width: width - 40,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextInput
            style={{
              fontSize: 16,
              width: width - 40,
              height: 70,
              borderWidth: 0,
              borderRadius: 0,
              paddingHorizontal: 10,
            }}
            placeholder="Enter your bio"
            value={bio}
            multiline={true}
            maxLength={100}
            onChangeText={setBio}
          />
        </View>
      </View>

      <TouchableHighlight
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
        disabled={loading || !isValid || isUploading}
        onPress={handleSubmit}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "normal",
            fontFamily: Platform.select({
              android: "itim",
              ios: "itim",
            }),
            color: THEME.colors.text,
          }}
        >
          {loading ? (
            <ActivityIndicator size={"small"} color={THEME.colors.text} />
          ) : (
            "Submit"
          )}
        </Text>
      </TouchableHighlight>
    </SafeAreaView>
  );
}
