import EmptyState from "@/components/EmptyState";
import FloatingActionButton from "@/components/FloatingActionButton";
import { THEME } from "@/shared/constants/theme";
import { Plus } from "lucide-react-native";
import { Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const initialLayout = {
  width: Dimensions.get("window").width,
  height: Dimensions.get("window").height,
};

export default function Events() {
  // const { data: people, isFetching } = useFindMomentsQuery(true);

  //   console.log(people);

  // if (isFetching) {
  //   return <LoaderActivity />;
  // }
  return (
    <SafeAreaView style={styles.scene}>
      <EmptyState
        label="No Events Nearby. Tap to create!"
        trigger={
          <TouchableOpacity
            style={{
              backgroundColor: THEME.colors.primary,
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 50,
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={() => {}}
          >
            <Plus color={THEME.colors.text} />
          </TouchableOpacity>
        }
      />

      <FloatingActionButton
        color={THEME.colors.surface}
        icon={<Plus color={THEME.colors.text} />}
        onPress={() => {}}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: THEME.colors.background,
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
    color: THEME.colors.text,
  },
});
