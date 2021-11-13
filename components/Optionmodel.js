import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Colors from "../misc/Colors";

const Optionmodel = ({
  visible,
  closeVisibility,
  currentItem,
  onAddtoPlaylistPress,
  onPlayPress,
}) => {
  return (
    <>
      <Modal
        animationType="slide"
        transparent
        visible={visible}
        style={{ backgroundColor: "green" }}
        onRequestClose={closeVisibility}
      >
        <View style={styles.modal}>
          <Text style={styles.title} numberOfLines={1}>
            {currentItem.filename}
          </Text>
          <View style={styles.optionContainer}>
            <TouchableWithoutFeedback onPress={onPlayPress}>
              <Text style={styles.option}>Play</Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={onAddtoPlaylistPress}>
              <Text style={styles.option}>Add to Playlist</Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
        <TouchableWithoutFeedback onPress={closeVisibility}>
          <View style={styles.modelbg} />
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default Optionmodel;

const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: Colors.lightblack,
    borderTopEndRadius: 15,
    borderTopLeftRadius: 15,
    zIndex: 1000,
  },
  optionContainer: {
    padding: 20,
  },
  title: {
    padding: 20,
    paddingBottom: 0,
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.ACTIVE_BG,
  },
  option: {
    color: Colors.APP_BG,
    fontSize: 14,
    fontWeight: "bold",
    paddingVertical: 10,
    letterSpacing: 1,
  },
  modelbg: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: Colors.MODAL_BG,
  },
});
