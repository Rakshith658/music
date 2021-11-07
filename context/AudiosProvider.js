import React, { Component, createContext } from "react";
import { StyleSheet, Alert, View, Text } from "react-native";
import * as Medialibrary from "expo-media-library";
import { DataProvider } from "recyclerlistview";

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
      currentAudio: {},
      isPlaying: false,
    };
  }

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
