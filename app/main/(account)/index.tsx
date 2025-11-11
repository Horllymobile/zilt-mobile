"use client";

import AvatarPicker from "@/components/AvatarPicker";
import { PlainTextInput } from "@/components/PlainTextInput";
import { WideButton } from "@/components/WideButton";
import { useAuthStore } from "@/libs/store/authStore";
import { supabase } from "@/libs/superbase";
import { Profile } from "@/models/profile";
import { IApiResponse } from "@/models/response";
import { THEME } from "@/shared/constants/theme";
import { useDebounce } from "@/shared/hooks/use-debounce";
import {
  useCheckNameQuery,
  useGetProfileQuery,
  useOnboardingMutation,
} from "@/shared/services/auth/authApi";

import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
// import { unescape } from "lodash";
import { ChevronLeft } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditAccount() {
  const { data: profile, refetch: refetchProfile } = useGetProfileQuery(true);
  const { setAuthData, session, profile: currentProfileData } = useAuthStore();
  const { width } = Dimensions.get("window");
  const [imageUri, setImageUri] = useState<string>(
    currentProfileData?.avatar_url ?? ""
  );
  const [avatar, setAvatar] = useState<string>("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [name, setName] = useState(currentProfileData?.name ?? "");
  const [bio, setBio] = useState(currentProfileData?.bio ?? "");

  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isValid = name !== "" && imageUri !== "";

  useEffect(() => {
    (async () => {
      // Ask for permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        // setErrorMsg("Permission to access location was denied");
        Alert.alert("Permission to access location was denied");
        return;
      }

      // Get current location
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, []);

  useEffect(() => {
    // console.log(profile);
    if (profile) {
      setAuthData({
        session,
        profile: profile,
      });

      console.log(profile.avatar_url);
      setImageUri(profile.avatar_url || profile.avatar || "");
      setName(profile?.name);
      setBio(profile?.bio);
    }
  }, [profile]);

  const onboardingMutation = useOnboardingMutation();
  const debounceName = useDebounce(name, 500);
  const {
    data: checkNameExist,
    isFetching: isCheckingName,
    refetch: recheckName,
  } = useCheckNameQuery(false, debounceName);

  // const onImageLoaded = async () => {
  //   // ✅ Use new File API
  //   const file = new File(imageUri);
  //   const buff = await file.arrayBuffer();
  //   const uint8Array = new Uint8Array(buff);
  //   const filePath = `avatars/${name}-${Date.now()}.jpg`;

  //   setIsUploading(true);
  // const { data, error } = await supabase.storage
  //   .from("ZiltStorage")
  //   .upload(filePath, uint8Array, {
  //     contentType: file.type,
  //     cacheControl: "3600",
  //     upsert: true,
  //   });

  // if (error) {
  //   // console.error("Upload error:", error);
  //   Alert.alert("Upload failed", error.message);
  //   return;
  // }

  // const { data: publicUrl } = supabase.storage
  //   .from("ZiltStorage")
  //   .getPublicUrl(filePath);

  // setImageUri(publicUrl.publicUrl);
  //   setIsUploading(false);
  // };

  const uploadSvg = async () => {
    const filePath = `avatars/${name}-Profile.svg`;

    // Encode the SVG string to base64
    const base64 = btoa(unescape(encodeURIComponent(avatar)));

    // Convert base64 → binary → Uint8Array
    // console.log(avatar);
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    await supabase.storage.from("ZiltStorage").remove([filePath]);

    const { data, error } = await supabase.storage
      .from("ZiltStorage")
      .upload(filePath, bytes, {
        contentType: "image/svg+xml",
        // cacheControl: "3600",
      });

    if (error) {
      console.error("Upload error:", error);
      Alert.alert("Upload failed", error.message);
      return;
    }

    const { data: publicUrl } = supabase.storage
      .from("ZiltStorage")
      .getPublicUrl(filePath);

    console.log(publicUrl);

    return publicUrl.publicUrl;
  };

  const handleSubmit = async () => {
    try {
      if (!imageUri) {
        Alert.alert("Please select an image first");
        return;
      }

      const avatar_url = await uploadSvg();

      console.log(avatar_url);

      setLoading(true);
      onboardingMutation.mutate(
        {
          bio,
          name: name || profile?.name || "",
          avatar_url: avatar_url?.trim() || profile?.avatar_url?.trim(),
          location: {
            lat: location?.coords?.latitude || profile?.location?.lat,
            long: location?.coords?.longitude || profile?.location?.long,
          },
        },
        {
          onSuccess: (data: IApiResponse<Profile>) => {
            setAuthData({
              session,
              profile: data.data,
            });
            refetchProfile();
            setLoading(false);

            if (router?.canGoBack()) {
              router.back();
            }
          },
          onError: () => {
            setLoading(false);
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
        backgroundColor: THEME.colors.background,
      }}
    >
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: 16,
          paddingRight: 16,
        }}
      >
        <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
          >
            <ChevronLeft color={THEME.colors.text} size={24} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "medium",
              color: THEME.colors.text,
            }}
          >
            Back
          </Text>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: 20,
        }}
      >
        <Text
          style={{ fontSize: 24, marginBottom: 30, color: THEME.colors.text }}
        >
          Edit Profile
        </Text>
        <AvatarPicker
          onSelect={(avatar) => {
            setAvatar(avatar);
          }}
          imageURI={profile?.avatar_url ?? ""}
        />
        {/* <ImagePicker onImageLoaded={onImageLoaded} imageURI={imageUri} /> */}

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
          label="Save Changes"
          width={width}
          isLoading={onboardingMutation.isPending || isUploading}
        />
      </View>
    </SafeAreaView>
  );
}
