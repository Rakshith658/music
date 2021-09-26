import React from "react";
import { StyleSheet, Text, View } from "react-native";

const FavList = () => {
  return (
    <View style={styles.Container}>
      <Text>FavList</Text>
    </View>
  );
};

export default FavList;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
