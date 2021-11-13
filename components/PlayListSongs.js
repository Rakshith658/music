import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Audiocontext } from "../context/AudiosProvider";
import Colors from "../misc/Colors";
import Audiolistcomponents from "./Audiolistcomponents";

const PlayListSongs = ({ isVisible, playlist, closeVisibility }) => {
  const context = useContext(Audiocontext);
  const { currentAudio, handleAudioPress, isPlaying, updateState } = context;

  const deleteAudio = async (song) => {
    let result = await AsyncStorage.getItem("playlist");
    let updatedlist = [];
    result = JSON.parse(result);
    updatedlist = result.filter((list) => {
      if (list.id === playlist.id) {
        let a = list.audios.filter((i) => i.id !== song.id);
        list.audios = a;
      }
      return list;
    });
    closeVisibility();
    updateState(context, { playlist: [...updatedlist] });
    await AsyncStorage.setItem("playlist", JSON.stringify([...updatedlist]));
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent
      onRequestClose={closeVisibility}
    >
      <View style={styles.modal}>
        <Text style={styles.title}>{playlist.title}</Text>
        <FlatList
          contentContainerStyle={styles.contentlistContainer}
          data={playlist.audios}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 10 }}>
              <Audiolistcomponents
                title={item.filename}
                duration={item.duration}
                activeListItem={currentAudio?.id === item.id}
                isPlaying={isPlaying}
                onOptionpress={() => deleteAudio(item)}
                AudioPlay={() => {
                  handleAudioPress(item);
                }}
              />
            </View>
          )}
        />
      </View>
      <TouchableWithoutFeedback onPress={closeVisibility}>
        <View style={styles.modelbg} />
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default PlayListSongs;

const { width, height } = Dimensions.get("screen");

const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: Colors.lightblack,
    borderTopEndRadius: 15,
    borderTopLeftRadius: 15,
    zIndex: 1000,
    width: width - 30,
    height: width - 15,
  },
  title: {
    padding: 20,
    paddingBottom: 0,
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.ACTIVE_FONT,
    marginBottom: 10,
  },
  contentlistContainer: {
    padding: 10,
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
