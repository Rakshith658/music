import React, { Component } from "react";
import { Text, StyleSheet, ScrollView, View } from "react-native";
import { Audiocontext } from "../context/AudiosProvider";

export default class AudioList extends Component {
  static contextType = Audiocontext;
  render() {
    if (!this.context.audiofiles)
      return (
        <View style={styles.Container}>
          <Text>
            open the app settings and allow the app to access the storage
          </Text>
        </View>
      );

    return (
      <ScrollView>
        {this.context.audiofiles.map((item) => (
          <Text key={item.id} style={{ padding: 5, borderBottomWidth: 1 }}>
            {item.filename}
          </Text>
        ))}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
