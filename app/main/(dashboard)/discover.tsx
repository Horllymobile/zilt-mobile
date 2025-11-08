"use client";
import { COLORS } from "@/shared/constants/color";
import { Search } from "lucide-react-native";
import { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import Events from "../(discover)/events";
import Moment from "../(discover)/moment";
import People from "../(discover)/people";

const initialLayout = { width: Dimensions.get("window").width };
export default function Discover() {
  const { width } = Dimensions.get("window");
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "moment", title: "Zilt Moments" },
    // { key: "feed", title: "Feed" },
    { key: "people", title: "People" },
    { key: "events", title: "Events" },
  ]);

  const renderScene = SceneMap({
    people: People,
    moment: Moment,
    events: Events,
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: 16,
          paddingRight: 16,
          backgroundColor: "#fff",
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "medium" }}>Discover</Text>

        <TouchableOpacity onPress={() => {}}>
          <Search />
        </TouchableOpacity>
      </View>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        // style={{ minHeight: "100%" }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            activeColor={COLORS.primary}
            inactiveColor={"black"}
            scrollEnabled
            indicatorStyle={styles.indicator}
            style={styles.tabbar}
            // labelStyle={styles.label}
            tabStyle={styles.tab}
          />
        )}
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
    width: initialLayout.width / 3,
  },
});
