import FloatingActionButton from "@/components/FloatingActionButton";
import { THEME } from "@/shared/constants/theme";
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
    backgroundColor: THEME.colors.primary,
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
    color: THEME.colors.text,
  },
});
