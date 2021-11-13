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
  Alert,
} from "react-native";
import PlaylistInputmodel from "../components/PlaylistInputmodel";
import PlayListSongs from "../components/PlayListSongs";
import { Audiocontext } from "../context/AudiosProvider";
import Colors from "../misc/Colors";
import { EvilIcons } from "@expo/vector-icons";

const FavList = ({ navigation }) => {
  const [inputModel, setinputModel] = useState(false);
  const [isVisible, setisVisible] = useState(false);
  const [Modalplaylist, setModalplaylist] = useState({});
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

  const handlBannerpress = async (playlistitem) => {
    if (AddToPlaylist) {
      const result = await AsyncStorage.getItem("playlist");
      let updatedlist = [];
      let sameAudio = false;
      let old = [];
      if (result !== null) {
        old = JSON.parse(result);
        updatedlist = old.filter((list) => {
          if (list.id === playlistitem.id) {
            for (let audio of list.audios) {
              if (audio.id === AddToPlaylist.id) {
                sameAudio = true;
                return;
              }
            }
            list.audios = [...list.audios, AddToPlaylist];
          }
          return list;
        });
      }
      if (sameAudio) {
        Alert.alert(
          " Same audio Found !",
          `${AddToPlaylist.filename} is already in playlist`
        );
        sameAudio = false;
        updateState(context, { AddToPlaylist: null });
        return navigation.goBack();
      }
      updateState(context, { AddToPlaylist: null, playlist: [...updatedlist] });
      await AsyncStorage.setItem("playlist", JSON.stringify([...updatedlist]));
      return navigation.goBack();
    }
    updateState(context, {
      whereplaying: "playlist",
      currentAudioplaylist: playlistitem.audios,
    });
    setModalplaylist(playlistitem);
    setisVisible(!isVisible);
  };

  const deletePlaylist = async (item) => {
    let result = await AsyncStorage.getItem("playlist");
    let updatedlist = [];
    result = JSON.parse(result);
    updatedlist = result.filter((list) => list.id !== item.id);
    updateState(context, { playlist: [...updatedlist] });
    await AsyncStorage.setItem("playlist", JSON.stringify([...updatedlist]));
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
              <View style={styles.playlistbanner} key={item.id.toString()}>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => handlBannerpress(item)}
                >
                  <View>
                    <Text style={styles.favListname}>{item.title}</Text>
                    <Text style={styles.numsongs}>
                      {item.audios.length > 1
                        ? `${item.audios.length} Songs`
                        : `${item.audios.length} Song`}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deletePlaylist(item)}
                  style={{ alignSelf: "center" }}
                >
                  <View>
                    <EvilIcons name="trash" size={24} color="#FF6666" />
                  </View>
                </TouchableOpacity>
              </View>
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
      <PlayListSongs
        isVisible={isVisible}
        playlist={Modalplaylist}
        closeVisibility={() => {
          setisVisible(!isVisible);
          setModalplaylist({});
        }}
      />
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
    flexDirection: "row",
    justifyContent: "space-between",
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
