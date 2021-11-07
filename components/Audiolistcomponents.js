import React, { Component } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import Colors from "../misc/Colors";

const getThumbnailText = (filename) => filename[0];
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
const renderPlayPauseIcon = (isPlaying) => {
  if (isPlaying)
    return (
      <Entypo name="controller-paus" size={24} color={Colors.ACTIVE_FONT} />
    );
  return <Entypo name="controller-play" size={24} color={Colors.ACTIVE_FONT} />;
};
export default Audiolistcomponents = ({
  title,
  duration,
  isPlaying,
  activeListItem,
  onOptionpress,
  AudioPlay,
}) => {
  return (
    <>
      <View style={styles.audiolistcomponents}>
        <TouchableWithoutFeedback onPress={AudioPlay}>
          <View style={styles.audiolistcomponentsIcon}>
            <View
              style={[
                styles.tumblenel,
                {
                  backgroundColor: activeListItem
                    ? Colors.ACTIVE_BG
                    : Colors.FONT_LIGHT,
                },
              ]}
            >
              <Text style={styles.tumblenelText}>
                {activeListItem
                  ? renderPlayPauseIcon(isPlaying)
                  : getThumbnailText(title)}
              </Text>
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
              <Text style={styles.timeText}>{convertTime(duration)}</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.audiolistcomponentsText}>
          <Entypo
            onPress={onOptionpress}
            name="dots-three-vertical"
            size={24}
            color={Colors.ACTIVE_FONT}
            style={{ padding: 10 }}
          />
        </View>
      </View>
      <View style={styles.separator} />
    </>
  );
};
const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  audiolistcomponents: {
    flexDirection: "row",
    alignSelf: "center",
    width: width - 80,
  },
  audiolistcomponentsIcon: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  audiolistcomponentsText: {
    flexBasis: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  tumblenel: {
    height: 50,
    flexBasis: 50,
    backgroundColor: Colors.FONT_LIGHT,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  tumblenelText: {
    color: Colors.ACTIVE_FONT,
    fontSize: 22,
    fontWeight: "bold",
  },
  titleContainer: {
    width: width - 180,
    paddingLeft: 10,
  },
  title: {
    fontSize: 16,
    color: Colors.ACTIVE_FONT,
  },
  timeText: {
    fontSize: 14,
    color: Colors.FONT_LIGHT,
  },
  separator: {
    width: width - 80,
    backgroundColor: Colors.FONT_LIGHT,
    opacity: 0.3,
    height: 0.5,
    alignSelf: "center",
    marginTop: 10,
  },
});
