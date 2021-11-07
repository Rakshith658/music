import React, { Component, createContext } from "react";
import { StyleSheet, Alert, View, Text } from "react-native";
import * as Medialibrary from "expo-media-library";
import { DataProvider } from "recyclerlistview";
import { Audio } from "expo-av";
import { Play, PlayAnother, Puse, Resume } from "../misc/AudioController";

export const Audiocontext = createContext();

export default class AudiosProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audiofiles: [],
      permissionerrors: false,
      dataProvider: new DataProvider((r1, r2) => r1 !== r2),
      playbackObj: null,
      soundObj: null,
      currentAudio: null,
      isPlaying: false,
      currentAudioIndex: null,
      playbackposition: null,
      playbackduration: null,
    };
  }

  onPlaybackStatusupdate = (playbackstatus) => {
    if (playbackstatus.isLoaded && playbackstatus.isPlaying) {
      this.setState({
        ...this.state,
        playbackposition: playbackstatus.positionMillis,
        playbackduration: playbackstatus.durationMillis,
      });
    }
    if (playbackstatus.didJustFinish) {
      if (this.state.currentAudioIndex + 1 === this.state.audiofiles.length) {
        this.handleAudioPress(this.state.audiofiles[0]);
        return;
      }
      this.handleAudioPress(
        this.state.audiofiles[this.state.currentAudioIndex + 1]
      );
    }
  };
  handleAudioPress = async (audio) => {
    if (this.state.soundObj === null) {
      const playbackObj = new Audio.Sound();
      // const status = await Play(playbackObj, audio.uri);
      const status = await playbackObj.loadAsync(
        { uri: audio.uri },
        { shouldPlay: true }
      );

      const index = this.state.audiofiles.indexOf(audio);
      this.setState({
        ...this.state,
        currentAudio: audio,
        playbackObj: playbackObj,
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: index,
      });
      return playbackObj.setOnPlaybackStatusUpdate(this.onPlaybackStatusupdate);
    }

    //puse Audio
    if (
      this.state.soundObj.isLoaded &&
      this.state.soundObj.isPlaying &&
      this.state.currentAudio.id === audio.id
    ) {
      const status = await Puse(this.state.playbackObj);
      this.setState({
        ...this.state,
        soundObj: status,
        isPlaying: false,
      });
      return this.state.playbackObj.setOnPlaybackStatusUpdate(
        this.onPlaybackStatusupdate
      );
    }

    //resume Audio
    if (
      this.state.soundObj.isLoaded &&
      !this.state.soundObj.isPlaying &&
      this.state.currentAudio.id === audio.id
    ) {
      const status = await Resume(this.state.playbackObj);
      this.setState({
        ...this.state,
        soundObj: status,
        isPlaying: true,
      });
      return this.state.playbackObj.setOnPlaybackStatusUpdate(
        this.onPlaybackStatusupdate
      );
    }

    // Select another audio player

    if (
      this.state.soundObj.isLoaded &&
      this.state.currentAudio.id !== audio.id
    ) {
      const status = await PlayAnother(this.state.playbackObj, audio.uri);
      const index = this.state.audiofiles.indexOf(audio);
      this.setState({
        ...this.state,
        soundObj: status,
        currentAudio: audio,
        isPlaying: true,
        currentAudioIndex: index,
      });
      return this.state.playbackObj.setOnPlaybackStatusUpdate(
        this.onPlaybackStatusupdate
      );
    }
  };

  PermissionAlert = () => {
    Alert.alert("Permissions required", "this app need to read audio files", [
      { text: "I am ready", onPress: () => this.getPermission() },
      { text: "Cancle", onPress: () => this.PermissionAlert() },
    ]);
  };

  getAudioFiles = async () => {
    const { dataProvider, audiofiles } = this.state;
    let media = await Medialibrary.getAssetsAsync({ mediaType: "audio" });
    media = await Medialibrary.getAssetsAsync({
      mediaType: "audio",
      first: media.totalCount,
    });
    this.setState({
      ...this.state,
      dataProvider: dataProvider.cloneWithRows([
        ...audiofiles,
        ...media.assets,
      ]),
      audiofiles: [...audiofiles, ...media.assets],
    });
  };

  getPermission = async () => {
    const permission = await Medialibrary.getPermissionsAsync();

    if (permission.granted) {
      //get all audio files
      this.getAudioFiles();
    }

    if (!permission.canAskAgain && !permission.granted) {
      this.setState({ ...this.state, permissionerrors: true });
    }

    if (!permission.granted && permission.canAskAgain) {
      const { status, canAskAgain } =
        await Medialibrary.requestPermissionsAsync();

      if (status === "denied" && canAskAgain) {
        // we are going to display Alert message the user most allow this permission to work this app...
        this.PermissionAlert();
      }

      if (status === "granted") {
        // get all audio files...
        this.getAudioFiles();
      }
      if (status === "denied" && !canAskAgain) {
        // we went through some error message to the user...
        this.setState({ ...this.state, permissionerrors: true });
      }
    }
  };

  componentDidMount() {
    this.getPermission();
  }

  updateState = (prestate, newstate = {}) => {
    this.setState({ ...prestate, ...newstate });
  };
  render() {
    // if (this.state.permissionerrors) {
    //   return (
    //     <View>
    //       <Text>Open settings and allow the app to access the files</Text>
    //     </View>
    //   );
    // }

    const {
      audiofiles,
      dataProvider,
      permissionerrors,
      soundObj,
      currentAudio,
      playbackObj,
      isPlaying,
      currentAudioIndex,
      playbackduration,
      playbackposition,
    } = this.state;
    return (
      <Audiocontext.Provider
        value={{
          audiofiles: permissionerrors ? false : audiofiles,
          dataProvider,
          soundObj,
          currentAudio,
          playbackObj,
          updateState: this.updateState,
          isPlaying,
          currentAudioIndex,
          playbackduration,
          playbackposition,
          handleAudioPress: this.handleAudioPress,
        }}
      >
        {this.props.children}
      </Audiocontext.Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
