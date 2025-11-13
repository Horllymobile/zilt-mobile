"use client";
import { THEME } from "@/shared/constants/theme";
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
import Marketplace from "./marketplace";
import Moment from "./moment";
import People from "./people";

const initialLayout = {
  width: Dimensions.get("window").width,
  height: Dimensions.get("window").height,
};
export default function Discover() {
  const { width } = Dimensions.get("window");
  const [index, setIndex] = useState(1);
  const [routes] = useState([
    { key: "moment", title: "Moments" },
    { key: "marketplace", title: "Marketplace" },
    { key: "people", title: "People" },
    // { key: "events", title: "Events" },
  ]);

  const renderScene = SceneMap({
    people: People,
    marketplace: Marketplace,
    moment: Moment,
    // events: Events,
  });

  return (
    <SafeAreaView
      edges={["top"]}
      style={{
        flex: 1,
        // justifyContent: "center",
        backgroundColor: THEME.colors.background,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 10,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "500",
            color: THEME.colors.text,
          }}
        >
          Discover
        </Text>

        <TouchableOpacity onPress={() => {}}>
          <Search color={THEME.colors.text} />
        </TouchableOpacity>
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            activeColor={THEME.colors.text}
            inactiveColor={THEME.colors.text}
            scrollEnabled
            indicatorStyle={styles.indicator}
            style={styles.tabbar}
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
    backgroundColor: THEME.colors.background,
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
    color: THEME.colors.primary,
  },
  tabbar: {
    backgroundColor: THEME.colors.background,
    elevation: 100,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    color: THEME.colors.text,
  },
  indicator: {
    backgroundColor: THEME.colors.text,
    height: 3,
    borderRadius: 3,
  },
  label: {
    color: THEME.colors.text,
    // fontSize: 24,
    fontWeight: "600",
    textTransform: "none",
  },
  tab: {
    width: initialLayout.width / 3,
  },
});
