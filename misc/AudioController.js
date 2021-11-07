// Play Music

export const Play = async (playbackObj, uri) => {
  try {
    return await playbackObj.loadAsync({ uri }, { shouldPlay: true });
  } catch (error) {
    console.log("error in play Music", error.message);
  }
};

// puse Music

export const Puse = async (playbackObj) => {
  try {
    return await playbackObj.setStatusAsync({
      shouldPlay: false,
    });
  } catch (error) {
    console.log("error in puse Music", error.message);
  }
};

//resume Audio

export const Resume = async (playbackObj) => {
  try {
    return await playbackObj.playAsync();
  } catch (error) {
    console.log("error in Resume Music", error.message);
  }
};

// Select another Music

export const PlayAnother = async (playbackObj, uri) => {
  try {
    await playbackObj.stopAsync();
    await playbackObj.unloadAsync();
    return await Play(playbackObj, uri);
  } catch (error) {
    console.log("error in Another Music", error.message);
  }
};
