import CreateMoment from "@/components/CreateMoment";
import FloatingActionButton from "@/components/FloatingActionButton";
import { COLORS } from "@/shared/constants/color";
import { Zap } from "lucide-react-native";
import { useState } from "react";
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const initialLayout = {
  width: Dimensions.get("window").width,
  height: Dimensions.get("window").height,
};

export default function Moment() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", backgroundColor: "#fff" }}
    >
      <Text style={styles.text}>👥 Zilt Moment</Text>

      {!modalVisible && (
        <FloatingActionButton
          icon={<Zap color={COLORS.white} />}
          onPress={() => setModalVisible(true)}
        />
      )}

      <View>
        <Modal
          animationType="slide"
          transparent={false} // keep true for overlay look
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>

          <View style={styles.modalContainer}>
            <CreateMoment
              setModalVisible={setModalVisible}
              modalVisible={modalVisible}
            />
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)", // dimmed background
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "100%", // Full screen modal that respects SafeAreaView inside CreateMoment
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
  },
});
