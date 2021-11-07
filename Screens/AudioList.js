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
import Optionmodel from "../components/Optionmodel";
import { Audio } from "expo-av";
import { Play, PlayAnother, Puse, Resume } from "../misc/AudioController";

export default class AudioList extends Component {
  static contextType = Audiocontext;

  constructor(props) {
    super(props);
    this.state = {
      optionModalvisible: false,
    };
    this.currentItem = {};
  }

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
  handleAudioPress = async (audio) => {
    const { soundObj, currentAudio, playbackObj, updateState } = this.context;
    if (soundObj === null) {
      const playbackObj = new Audio.Sound();
      const status = await Play(playbackObj, audio.uri);

      return updateState(this.context, {
        currentAudio: audio,
        playbackObj: playbackObj,
        soundObj: status,
        isPlaying: true,
      });
    }

    //puse Audio
    if (
      soundObj.isLoaded &&
      soundObj.isPlaying &&
      currentAudio.id === audio.id
    ) {
      const status = await Puse(playbackObj);
      return updateState(this.context, {
        soundObj: status,
        isPlaying: false,
      });
    }

    //resume Audio
    if (
      soundObj.isLoaded &&
      !soundObj.isPlaying &&
      currentAudio.id === audio.id
    ) {
      const status = await Resume(playbackObj);
      return updateState(this.context, {
        soundObj: status,
        isPlaying: true,
      });
    }

    // Select another audio player

    if (soundObj.isLoaded && currentAudio.id !== audio.id) {
      const status = await PlayAnother(playbackObj, audio.uri);
      return updateState(this.context, {
        soundObj: status,
        currentAudio: audio,
        isPlaying: true,
      });
    }
  };
  rowRenderer = (type, item, index, extendedState) => {
    const { currentAudio, isPlaying } = this.context;
    return (
      <Audiolistcomponents
        title={item.filename}
        duration={item.duration}
        activeListItem={currentAudio.id === item.id}
        isPlaying={extendedState.isPlaying}
        onOptionpress={() => {
          this.currentItem = item;
          this.setState({ ...this.state, optionModalvisible: true });
        }}
        AudioPlay={() => this.handleAudioPress(item)}
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
        {({ dataProvider, isPlaying }) => {
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
                extendedState={{ isPlaying }}
              />
              <Optionmodel
                visible={this.state.optionModalvisible}
                closeVisibility={() => {
                  this.setState({ ...this.state, optionModalvisible: false });
                }}
                currentItem={this.currentItem}
                onAddtoPlaylistPress={() => console.log("onAddtoPlaylistPress")}
                onPlayPress={() => console.log("onPlayPress")}
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
