import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  Dimensions,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { LayoutProvider, RecyclerListView } from "recyclerlistview";
import { Audiocontext } from "../context/AudiosProvider";
import Audiolistcomponents from "../components/Audiolistcomponents";

export default class AudioList extends Component {
  static contextType = Audiocontext;

  layoutProvider = new LayoutProvider(
    (index) => {
      return "audio";
    },
    (type, dim) => {
      switch (type) {
        case "audio":
          dim.width = Dimensions.get("window").width;
          dim.height = 70;
          break;

        default:
          dim.width = 0;
          dim.height = 0;
      }
    }
  );
  rowRenderer = (type, item) => {
    return (
      <Audiolistcomponents
        title={item.filename}
        duration={item.duration}
        activeListItem={false}
        isPlaying={false}
        onOptionpress={() => {
          console.log("Rakshith");
        }}
      />
    );
  };
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
      <Audiocontext.Consumer>
        {({ dataProvider }) => {
          return (
            <SafeAreaView
              style={{
                flex: 1,
                paddingTop:
                  Platform.OS === "android" ? StatusBar.currentHeight : 0,
              }}
            >
              <RecyclerListView
                dataProvider={dataProvider}
                layoutProvider={this.layoutProvider}
                rowRenderer={this.rowRenderer}
              />
            </SafeAreaView>
          );
        }}
      </Audiocontext.Consumer>
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
