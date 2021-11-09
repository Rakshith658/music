import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  FlatList,
} from "react-native";
import PlaylistInputmodel from "../components/PlaylistInputmodel";
import { Audiocontext } from "../context/AudiosProvider";
import Colors from "../misc/Colors";

const FavList = () => {
  const [inputModel, setinputModel] = useState(false);
  const context = useContext(Audiocontext);
  const { playlist, AddToPlaylist, updateState } = context;

  const createPlaylist = async (playListName) => {
    const result = await AsyncStorage.getItem("playlist");
    if (result !== null) {
      const Audios = [];
      if (AddToPlaylist) {
        Audios.push(AddToPlaylist);
      }
      const newList = {
        id: Date.now(),
        title: playListName,
        audios: Audios,
      };
      const updatedplaylist = [...playlist, newList];
      updateState(context, { AddToPlaylist: null, playlist: updatedplaylist });
      await AsyncStorage.setItem("playlist", JSON.stringify(updatedplaylist));
    }
    setinputModel(false);
  };

  const renderPlaylist = async () => {
    const result = await AsyncStorage.getItem("playlist");
    if (result == null) {
      const defaultplaylist = {
        id: Date.now(),
        title: "My Favorite",
        audios: [],
      };

      const newplaylist = [...playlist, defaultplaylist];
      updateState(context, { playlist: [...newplaylist] });
      return await AsyncStorage.setItem(
        "playlist",
        JSON.stringify([...newplaylist])
      );
    }
    updateState(context, { playlist: JSON.parse(result) });
  };

  useEffect(() => {
    if (!playlist.length) {
      renderPlaylist();
    }
  }, []);
  return (
    <SafeAreaView style={styles.SafeAreaViewContainer}>
      <ScrollView contentContainerStyle={styles.Container}>
        {playlist.length
          ? playlist.map((item) => (
              <TouchableOpacity
                key={item.id.toString()}
                style={styles.playlistbanner}
              >
                <Text style={styles.favListname}>{item.title}</Text>
                <Text style={styles.numsongs}>
                  {item.audios.length > 1
                    ? `${item.audios.length} Songs`
                    : `${item.audios.length} Song`}
                </Text>
              </TouchableOpacity>
            ))
          : null}
        <TouchableOpacity onPress={() => setinputModel(!inputModel)}>
          <Text style={styles.playlistbutton}>+ Add New List</Text>
        </TouchableOpacity>
        <PlaylistInputmodel
          modalVisible={inputModel}
          CloseVisibility={() => setinputModel(!inputModel)}
          onSubmit={createPlaylist}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default FavList;

const styles = StyleSheet.create({
  SafeAreaViewContainer: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  Container: {
    padding: 10,
  },
  playlistbanner: {
    backgroundColor: "rgba(204,204,204,0.3)",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  favListname: {
    color: Colors.ACTIVE_FONT,
    fontSize: 16,
    fontWeight: "bold",
  },
  numsongs: {
    color: "gray",
    marginTop: 5,
    fontSize: 14,
    opacity: 0.5,
  },
  playlistbutton: {
    color: Colors.ACTIVE_FONT,
    marginTop: 15,
    fontSize: 17,
    alignSelf: "center",
    letterSpacing: 1,
  },
});
