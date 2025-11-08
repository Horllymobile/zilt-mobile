"use client";

import AvatarPicker from "@/components/AvatarPicker";
import { useAuthStore } from "@/libs/store/authStore";
import { supabase } from "@/libs/superbase";
import { Profile } from "@/models/profile";
import { IApiResponse } from "@/models/response";
import { COLORS } from "@/shared/constants/color";
import { useDebounce } from "@/shared/hooks/use-debounce";
import {
  useCheckNameQuery,
  useGetProfileQuery,
  useOnboardingMutation,
} from "@/shared/services/auth/authApi";

import { decode as atob, encode as btoa } from "base-64";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ChevronLeft } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  Text,
  TextInput,
  TouchableHighlight,
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
      setImageUri(profile.avatar_url);
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
    const svgString = imageUri; // "<svg ...>...</svg>"
    const filePath = `avatars/${name}-Profile.svg`;

    // Encode the SVG string to base64
    const base64 = btoa(unescape(encodeURIComponent(svgString)));

    // Convert base64 → binary → Uint8Array
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    console.log(bytes.byteLength);

    const { data, error } = await supabase.storage
      .from("ZiltStorage")
      .upload(filePath, bytes, {
        contentType: "image/svg+xml",
        cacheControl: "3600",
        upsert: true,
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

      setLoading(true);
      onboardingMutation.mutate(
        {
          bio,
          name: name || profile?.name || "",
          avatar_url: avatar_url || profile?.avatar_url,
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
        // justifyContent: "center",
        // alignItems: "center",
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
            <ChevronLeft color={COLORS.primary} size={24} />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: "medium" }}>Back</Text>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 24, marginBottom: 30 }}>Edit Profile</Text>
        <AvatarPicker
          onImageLoaded={(url) => {
            setImageUri(url);
          }}
          imageURI={profile?.avatar_url ?? ""}
        />
        {/* <ImagePicker onImageLoaded={onImageLoaded} imageURI={imageUri} /> */}

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
              maxLength={100}
              onChangeText={setBio}
            />
          </View>
        </View>

        <TouchableHighlight
          style={{
            marginTop: 30,
            backgroundColor: COLORS.primary,
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
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "normal",
              fontFamily: Platform.select({
                android: "itim",
                ios: "itim",
              }),
              color: COLORS.white,
            }}
          >
            {onboardingMutation.isPending || isUploading ? (
              <ActivityIndicator color={COLORS.white} size={"small"} />
            ) : (
              "Submit"
            )}
          </Text>
        </TouchableHighlight>
      </View>
    </SafeAreaView>
  );
}
