import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import MusicScreen from "../Screens/AudioList";
import PlayScreen from "../Screens/PlayScreen";
import FavListScreen from "../Screens/FavList";
import { Audiocontext } from "../context/AudiosProvider";

const Tab = createBottomTabNavigator();

export default function Navigation() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Audio"
        component={MusicScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="headset-sharp" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Music"
        component={PlayScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="compact-disc" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Playlist"
        component={FavListScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="library-music" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
