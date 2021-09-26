import React from "react";
import { StyleSheet, Text, View } from "react-native";

const PlayScreen = () => {
  return (
    <View style={styles.Container}>
      <Text>PlayScreen</Text>
    </View>
  );
};

export default PlayScreen;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
