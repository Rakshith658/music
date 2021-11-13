import React, { useContext, useEffect, useState } from "react";
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
import { pause, resume } from "../misc/AudioController";

const { width } = Dimensions.get("screen");

const PlayScreen = () => {
  const context = useContext(Audiocontext);
  const {
    audiofiles,
    currentAudio,
    currentAudioIndex,
    isPlaying,
    handleAudioPress,
    playbackduration,
    playbackposition,
    whereplaying,
    currentAudioplaylist,
    soundObj,
  } = context;
  const [currentPosition, setCurrentPosition] = useState(0);
  const convertTime = (minutes) => {
    if (minutes) {
      const hrs = minutes / 60;
      const minute = hrs.toString().split(".")[0];
      const percent = parseInt(hrs.toString().split(".")[1].slice(0, 2));
      const sec = Math.ceil((60 * percent) / 100);

      if (parseInt(minute) < 10 && sec < 10) {
        return `0${minute}:0${sec}`;
      }

      if (parseInt(minute) < 10) {
        return `0${minute}:${sec}`;
      }

      if (sec < 10) {
        return `${minute}:0${sec}`;
      }

      return `${minute}:${sec}`;
    }
  };

  const calculateSeebBar = () => {
    if (playbackposition !== 0 && playbackduration !== 0) {
      return playbackposition / playbackduration;
    }
    return 0;
  };
  const Previous = () => {
    if (whereplaying == "songList") {
      if (currentAudioIndex === 0) {
        handleAudioPress(audiofiles[audiofiles.length - 1]);
        return;
      }
      handleAudioPress(audiofiles[currentAudioIndex - 1]);
    } else {
      if (currentAudioIndex === 0) {
        handleAudioPress(currentAudioplaylist[currentAudioplaylist.length - 1]);
        return;
      }
      handleAudioPress(currentAudioplaylist[currentAudioIndex - 1]);
    }
  };

  const Next = () => {
    if (whereplaying == "songList") {
      if (currentAudioIndex + 1 === audiofiles.length) {
        handleAudioPress(audiofiles[0]);
        return;
      }
      handleAudioPress(audiofiles[currentAudioIndex + 1]);
    } else {
      if (currentAudioIndex + 1 === currentAudioplaylist.length) {
        handleAudioPress(currentAudioplaylist[0]);
        return;
      }
      handleAudioPress(currentAudioplaylist[currentAudioIndex + 1]);
    }
  };
  const renderCurrentTime = () => {
    if (!soundObj && currentAudio.lastPosition) {
      return convertTime(currentAudio.lastPosition / 1000);
    }
    return convertTime(playbackposition / 1000);
  };

  const moveAudio = async (context, value) => {
    const { soundObj, isPlaying, playbackObj, updateState } = context;
    if (soundObj === null || !isPlaying) return;

    try {
      const status = await playbackObj.setPositionAsync(
        Math.floor(soundObj.durationMillis * value)
      );
      updateState(context, {
        soundObj: status,
        playbackPosition: status.positionMillis,
      });

      await resume(playbackObj);
    } catch (error) {
      console.log("error inside onSlidingComplete callback", error);
    }
  };

  if (!currentAudio) return null;
  return (
    <SafeAreaView style={styles.Container}>
      <View style={styles.lengthContainer}>
        <Text style={styles.number}>
          {currentAudioIndex + 1}/
          {whereplaying == "songList"
            ? audiofiles.length
            : currentAudioplaylist.length}
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
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.number}>
            {currentPosition ? currentPosition : renderCurrentTime()}
          </Text>
          <Text style={styles.number}>
            {convertTime(currentAudio.duration)}
          </Text>
        </View>
        <Slider
          style={{ width: width, height: 40 }}
          minimumValue={0}
          maximumValue={1}
          value={calculateSeebBar()}
          minimumTrackTintColor={Colors.ACTIVE_FONT}
          maximumTrackTintColor={Colors.ACTIVE_BG}
          onValueChange={(value) => {
            setCurrentPosition(
              convertTime(value * context.currentAudio.duration)
            );
          }}
          onSlidingStart={async () => {
            if (!isPlaying) return;

            try {
              await pause(context.playbackObj);
            } catch (error) {
              console.log("error inside onSlidingStart callback", error);
            }
          }}
          onSlidingComplete={async (value) => {
            await moveAudio(context, value);
            setCurrentPosition(0);
          }}
        />
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
