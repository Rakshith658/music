import "react-native-gesture-handler";
import React from "react";
import Navigation from "./Navigation/AppNavigation";
import { NavigationContainer } from "@react-navigation/native";
import AudiosProvider from "./context/AudiosProvider";

export default function App() {
  return (
    <AudiosProvider>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </AudiosProvider>
  );
}
