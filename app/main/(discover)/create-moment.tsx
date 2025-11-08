import { getRandomColor } from "@/libs/utils/colors";
import { COLORS } from "@/shared/constants/color";
import { useRouter } from "expo-router";
import { Image, Pencil, Send, X } from "lucide-react-native";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FloatingActionButton from "../../../components/FloatingActionButton";

export default function CreateMoment({
  setModalVisible,
  modalVisible,
}: {
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  modalVisible: boolean;
}) {
  const [type, setType] = useState("text");
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              onPress={() => {
                if (router.canDismiss()) {
                  router.dismiss();
                }
              }}
            >
              <X color={COLORS.primary} size={24} />
            </TouchableOpacity>
          </View>
        </View>

        {/* TYPE SELECTOR */}
        <View style={styles.selectorContainer}>
          <TouchableOpacity
            onPress={() => setType("text")}
            style={[
              styles.selectorButton,
              {
                backgroundColor:
                  type === "text" ? COLORS.primary : COLORS.white,
                borderColor: type === "text" ? COLORS.white : COLORS.primary,
              },
            ]}
          >
            <Pencil
              color={type === "text" ? COLORS.white : COLORS.primary}
              size={28}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setType("media")}
            style={[
              styles.selectorButton,
              {
                backgroundColor:
                  type === "media" ? COLORS.primary : COLORS.white,
                borderColor: type === "media" ? COLORS.white : COLORS.primary,
              },
            ]}
          >
            <Image
              color={type === "media" ? COLORS.white : COLORS.primary}
              size={28}
            />
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={() => setType("live")}
            style={[
              styles.selectorButton,
              {
                backgroundColor:
                  type === "live" ? COLORS.primary : COLORS.white,
                borderColor: type === "live" ? COLORS.white : COLORS.primary,
              },
            ]}
          >
            <Video
              color={type === "live" ? COLORS.white : COLORS.primary}
              size={28}
            />
          </TouchableOpacity> */}
        </View>

        {/* TEXT INPUT */}
        {type === "text" && (
          <View style={styles.textInputWrapper}>
            <TextInput
              style={styles.textInput}
              multiline={true}
              maxLength={700}
              autoFocus={true}
              placeholder="Type a moment"
              placeholderTextColor={COLORS.white}
              textAlign="center"
              textAlignVertical="center"
            />

            <FloatingActionButton
              icon={<Send color={COLORS.white} />}
              onPress={() => setModalVisible(true)}
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: getRandomColor(),
  },
  header: {
    paddingTop: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "500",
  },
  selectorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    marginTop: 16,
    paddingHorizontal: 16,
  },
  selectorButton: {
    width: 80,
    height: 70,
    borderWidth: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  textInputWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  textInput: {
    fontSize: 34,
    width: "100%",
    textAlign: "center",
    textAlignVertical: "center",
  },
});
