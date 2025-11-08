import PeopleItem from "@/components/PeopleItem";
import { COLORS } from "@/shared/constants/color";
import { useFindPeopleQuery } from "@/shared/services/discovers/discoverApi";
import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";

const initialLayout = {
  width: Dimensions.get("window").width,
  height: Dimensions.get("window").height,
};
export default function People() {
  const { data: people, isFetching } = useFindPeopleQuery(true);

  //   console.log(people);

  // if (isFetching) {
  //   return <LoaderActivity />;
  // }
  return (
    <View style={styles.scene}>
      {people ? (
        <FlatList
          data={people || []}
          keyExtractor={(chat) => chat.id}
          renderItem={({ item }) => <PeopleItem person={item} />}
          contentContainerStyle={{
            padding: 5,
          }}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      ) : (
        <View
          style={{
            height: initialLayout.height - 250,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>No people nearby</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
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
