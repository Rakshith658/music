import "react-native-gesture-handler";
import React, { useContext } from "react";
import Navigation from "./Navigation/AppNavigation";
import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import AudiosProvider, { Audiocontext } from "./context/AudiosProvider";
import { StatusBar } from "expo-status-bar";

export default function App() {
  return (
    <AudiosProvider>
      <NavigationContainer theme={DarkTheme}>
        <StatusBar style="light" />
        <Navigation />
      </NavigationContainer>
    </AudiosProvider>
  );
}
