"use client";

import AvatarPicker from "@/components/AvatarPicker";
import { useAuthStore } from "@/libs/store/authStore";
import { COLORS } from "@/shared/constants/color";
import { PLACEHOLDER_CONSTANTS } from "@/shared/constants/placeholders";
import { useDebounce } from "@/shared/hooks/use-debounce";
import {
  useCheckNameQuery,
  useGetProfileQuery,
  useOnboardingMutation,
} from "@/shared/services/auth/authApi";

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
  const { setAuthData, session } = useAuthStore();
  const { width } = Dimensions.get("window");
  const [imageUri, setImageUri] = useState<string>(profile?.avatar_url ?? "");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [name, setName] = useState(profile?.name ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");

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
    if (profile) {
      setAuthData({
        session,
        profile,
      });
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
  //   const { data, error } = await supabase.storage
  //     .from("ZiltStorage")
  //     .upload(filePath, uint8Array, {
  //       contentType: file.type,
  //       cacheControl: "3600",
  //       upsert: true,
  //     });

  //   if (error) {
  //     // console.error("Upload error:", error);
  //     Alert.alert("Upload failed", error.message);
  //     return;
  //   }

  //   const { data: publicUrl } = supabase.storage
  //     .from("ZiltStorage")
  //     .getPublicUrl(filePath);

  //   setImageUri(publicUrl.publicUrl);
  //   setIsUploading(false);
  // };

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
          name: name || profile?.name || "",
          avatar_url: imageUri || profile?.avatar_url,
          location: {
            lat: location?.coords?.latitude || profile?.location?.lat,
            long: location?.coords?.longitude || profile?.location?.long,
          },
        },
        {
          onSuccess: () => {
            refetchProfile();
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
          imageURI={profile?.avatar_url || PLACEHOLDER_CONSTANTS.avatar}
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
          disabled={loading || !isValid || isUploading || isCheckingName}
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
            {loading ? (
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
