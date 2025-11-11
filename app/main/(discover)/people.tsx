import EmptyState from "@/components/EmptyState";
import PeopleItem from "@/components/PeopleItem";
import PeopleSkeletonList from "@/components/PeopleSkeletonList";
import { THEME } from "@/shared/constants/theme";
import { useFindPeopleQuery } from "@/shared/services/discovers/discoverApi";
import { useState } from "react";
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
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
  const [isLoading, setIsLoading] = useState(true);

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
        <ScrollView style={{ flex: 1 }}>
          <PeopleSkeletonList items={8} />
        </ScrollView>
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
        <EmptyState label="No people nearby, try adjust your search" />
        // <View style={styles.empty}>
        //   <Text style={{ color: "#555" }}>No people nearby</Text>
        // </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background, // light water/map-like background
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
