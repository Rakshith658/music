import React, { useState } from "react";
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Colors from "../misc/Colors";

const PlaylistInputmodel = ({ modalVisible, CloseVisibility, onSubmit }) => {
  const [playListName, setplayListName] = useState("");

  const handleSubmit = () => {
    if (!playListName.trim()) {
      CloseVisibility();
    } else {
      onSubmit(playListName);
      setplayListName("");
      CloseVisibility();
    }
  };
  return (
    <Modal visible={modalVisible} animationType="slide" transparent>
      <View style={styles.Modalcontainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.title}>Create a new Playlist</Text>
          <TextInput
            style={styles.TextInput}
            placeholder="Enter playlist Name"
            value={playListName}
            onChangeText={(e) => setplayListName(e)}
          />
          <AntDesign
            name="check"
            size={24}
            color={Colors.APP_BG}
            style={styles.submitIcon}
            onPress={handleSubmit}
          />
        </View>
      </View>
      <TouchableWithoutFeedback onPress={CloseVisibility}>
        <View style={[StyleSheet.absoluteFillObject, styles.Modalbg]} />
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default PlaylistInputmodel;
const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  Modalcontainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    width: width - 20,
    height: 200,
    borderRadius: 10,
    backgroundColor: Colors.APP_BG,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },
  TextInput: {
    width: width - 40,
    paddingVertical: 15,
    fontSize: 17,
    borderBottomWidth: 1,
  },
  submitIcon: {
    padding: 10,
    backgroundColor: Colors.ACTIVE_BG,
    borderRadius: 50,
    marginTop: 15,
  },
  Modalbg: {
    backgroundColor: Colors.MODAL_BG,
    zIndex: -1,
  },
});
