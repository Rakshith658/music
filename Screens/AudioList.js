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
// import { Audio } from "expo-av";
// import { Play, PlayAnother, Puse, Resume } from "../misc/AudioController";

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

  rowRenderer = (type, item, index, extendedState) => {
    const { currentAudio, handleAudioPress } = this.context;
    return (
      <Audiolistcomponents
        title={item.filename}
        duration={item.duration}
        activeListItem={currentAudio?.id === item.id}
        isPlaying={extendedState.isPlaying}
        onOptionpress={() => {
          this.currentItem = item;
          this.setState({ ...this.state, optionModalvisible: true });
        }}
        AudioPlay={() => handleAudioPress(item)}
      />
    );
  };

  componentDidMount() {
    this.context.loadpreviousaudio();
  }
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
        {({ dataProvider, isPlaying, handleAudioPress, updateState }) => {
          if (!dataProvider._data.length) return null;
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
                onAddtoPlaylistPress={() => {
                  updateState(this.context, {
                    AddToPlaylist: this.currentItem,
                  });
                  this.props.navigation.navigate("Playlist");
                }}
                onPlayPress={() => handleAudioPress(this.currentItem)}
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

// handleAudioPress = async (audio) => {
//   const { handleAudioPress } = this.context;
//   if (soundObj === null) {
//     const playbackObj = new Audio.Sound();
//     const status = await Play(playbackObj, audio.uri);
//     const index = audiofiles.indexOf(audio);
//     return updateState(this.context, {
//       currentAudio: audio,
//       playbackObj: playbackObj,
//       soundObj: status,
//       isPlaying: true,
//       currentAudioIndex: index,
//     });
//   }

//   //puse Audio
//   if (
//     soundObj.isLoaded &&
//     soundObj.isPlaying &&
//     currentAudio.id === audio.id
//   ) {
//     const status = await Puse(playbackObj);
//     return updateState(this.context, {
//       soundObj: status,
//       isPlaying: false,
//     });
//   }

//   //resume Audio
//   if (
//     soundObj.isLoaded &&
//     !soundObj.isPlaying &&
//     currentAudio.id === audio.id
//   ) {
//     const status = await Resume(playbackObj);
//     return updateState(this.context, {
//       soundObj: status,
//       isPlaying: true,
//     });
//   }

//   // Select another audio player

//   if (soundObj.isLoaded && currentAudio.id !== audio.id) {
//     const status = await PlayAnother(playbackObj, audio.uri);
//     const index = audiofiles.indexOf(audio);
//     return updateState(this.context, {
//       soundObj: status,
//       currentAudio: audio,
//       isPlaying: true,
//       currentAudioIndex: index,
//     });
//   }
// };
