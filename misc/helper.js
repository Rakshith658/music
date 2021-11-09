import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeAudioForNextOpeing = async (currentAudio, index) => {
  await AsyncStorage.setItem(
    "previousaudio",
    JSON.stringify({ currentAudio, index })
  );
};
