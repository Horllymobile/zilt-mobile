import PeopleItem from "@/components/PeopleItem";
import { COLORS } from "@/shared/constants/color";
import { useFindPeopleQuery } from "@/shared/services/discovers/discoverApi";
import { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  // TextInput,
  View,
} from "react-native";

const initialLayout = {
  width: Dimensions.get("window").width,
  height: Dimensions.get("window").height,
};

export default function People() {
  const { data: people, isFetching, refetch } = useFindPeopleQuery(true);
  const [search, setSearch] = useState("");

  // Filter results locally based on search
  const filteredPeople = search
    ? people?.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    : people;

  return (
    <View style={styles.container}>
      {/* Search Input */}
      {/* <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search people nearby"
          placeholderTextColor="#888"
          value={search}
          onChangeText={(text) => setSearch(text)}
        />
      </View> */}

      {/* People List */}
      {isFetching ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : filteredPeople && filteredPeople.length > 0 ? (
        <FlatList
          data={filteredPeople}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PeopleItem person={item} />}
          contentContainerStyle={{ padding: 10 }}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          onRefresh={refetch}
          refreshing={isFetching}
        />
      ) : (
        <View style={styles.empty}>
          <Text style={{ color: "#555" }}>No people nearby</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0F7FA", // light water/map-like background
  },
  searchContainer: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 10,
    elevation: 2,
  },
  searchInput: {
    fontSize: 16,
    color: "#333",
    padding: 8,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
