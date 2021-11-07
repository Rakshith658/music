import React, { useContext, useEffect } from "react";
import {
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../misc/Colors";
import Slider from "@react-native-community/slider";
import PlayerButton from "../components/PlayerButton";
import { Audiocontext } from "../context/AudiosProvider";

const { width } = Dimensions.get("screen");

const PlayScreen = () => {
  const {
    audiofiles,
    currentAudio,
    currentAudioIndex,
    isPlaying,
    handleAudioPress,
    playbackduration,
    playbackposition,
  } = useContext(Audiocontext);

  const calculateSeebBar = () => {
    if (playbackposition !== 0 && playbackduration !== 0) {
      return playbackposition / playbackduration;
    }
    return 0;
  };
  const Previous = () => {
    if (currentAudioIndex === 0) {
      handleAudioPress(audiofiles[audiofiles.length - 1]);
      return;
    }
    handleAudioPress(audiofiles[currentAudioIndex - 1]);
  };
  const Next = () => {
    if (currentAudioIndex + 1 === audiofiles.length) {
      handleAudioPress(audiofiles[0]);
      return;
    }
    handleAudioPress(audiofiles[currentAudioIndex + 1]);
  };

  if (!currentAudio) return null;
  return (
    <SafeAreaView style={styles.Container}>
      <View style={styles.lengthContainer}>
        <Text style={styles.number}>
          {currentAudioIndex + 1}/{audiofiles.length}
        </Text>
        <View style={styles.mindIconContainer}>
          <MaterialCommunityIcons
            name="music-circle"
            size={300}
            color={isPlaying ? Colors.ACTIVE_BG : Colors.ACTIVE_FONT}
          />
        </View>
        <View style={styles.nameContainer}>
          <Text numberOfLines={1} style={styles.musicName}>
            {currentAudio.filename}
          </Text>
          <Slider
            style={{ width: width, height: 40 }}
            minimumValue={0}
            maximumValue={1}
            value={calculateSeebBar()}
            minimumTrackTintColor={Colors.ACTIVE_FONT}
            maximumTrackTintColor={Colors.ACTIVE_BG}
          />
        </View>
        <View style={styles.audioControlers}>
          <PlayerButton
            iconType="Previous"
            color={Colors.FONT_LIGHT}
            onPress={Previous}
            style={styles.Icons}
          />
          <PlayerButton
            iconType={isPlaying ? "Play" : "Pause"}
            color={isPlaying ? Colors.ACTIVE_BG : Colors.FONT_LIGHT}
            size={50}
            onPress={() => handleAudioPress(currentAudio)}
            style={styles.Icons}
          />
          <PlayerButton
            iconType="Next"
            color={Colors.FONT_LIGHT}
            onPress={Next}
            style={styles.Icons}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PlayScreen;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  lengthContainer: {
    flex: 1,
  },
  number: {
    color: Colors.ACTIVE_FONT,
    textAlign: "right",
    padding: 15,
    fontSize: 14,
  },
  mindIconContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  nameContainer: {
    alignItems: "center",
  },
  musicName: {
    color: Colors.ACTIVE_FONT,
  },
  audioControlers: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
  },
  Icons: {
    marginHorizontal: 10,
  },
});
