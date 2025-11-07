import FloatingActionButton from "@/components/FloatingActionButton";
import { COLORS } from "@/shared/constants/color";
import { Plus } from "lucide-react-native";
import { Dimensions, StyleSheet, Text } from "react-native";
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
      <Text style={styles.text}>👥 Events Nearby</Text>

      <FloatingActionButton
        icon={<Plus color={COLORS.white} />}
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
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primary,
  },
  tabbar: {
    backgroundColor: "#fff",
    elevation: 100,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  indicator: {
    backgroundColor: COLORS.primary,
    height: 3,
    borderRadius: 3,
  },
  label: {
    color: COLORS.primary,
    // fontSize: 24,
    fontWeight: "600",
    textTransform: "none",
  },
  tab: {
    width: initialLayout.width / 2,
  },
});
