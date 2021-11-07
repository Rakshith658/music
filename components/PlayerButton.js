import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Colors from "../misc/Colors";

const PlayerButton = (props) => {
  const { iconType, size = 40, color = Colors.ACTIVE_FONT, onPress } = props;
  const getIcon = (type) => {
    switch (type) {
      case "Play":
        return "pausecircleo";
      case "Pause":
        return "playcircleo";
      case "Next":
        return "forward";
      case "Previous":
        return "banckward";
    }
  };
  return (
    <AntDesign
      {...props}
      name={getIcon(iconType)}
      size={size}
      color={color}
      onPress={onPress}
    />
  );
};

export default PlayerButton;

const styles = StyleSheet.create({});
