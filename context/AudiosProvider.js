import React, { Component, createContext } from "react";
import { StyleSheet, Alert, View, Text } from "react-native";
import * as Medialibrary from "expo-media-library";

export const Audiocontext = createContext();

export default class AudiosProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audiofiles: [],
      permissionerrors: false,
    };
  }

  PermissionAlert = () => {
    Alert.alert("Permissions required", "this app need to read audio files", [
      { text: "I am ready", onPress: () => this.getPermission() },
      { text: "Cancle", onPress: () => this.PermissionAlert() },
    ]);
  };

  getAudioFiles = async () => {
    let media = await Medialibrary.getAssetsAsync({ mediaType: "audio" });
    media = await Medialibrary.getAssetsAsync({
      mediaType: "audio",
      first: media.totalCount,
    });
    this.setState({ ...this.state, audiofiles: media.assets });
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

  render() {
    return (
      <Audiocontext.Provider
        value={{
          audiofiles: this.state.permissionerrors
            ? false
            : this.state.audiofiles,
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
