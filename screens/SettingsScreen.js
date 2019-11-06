import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsScreen() {
  return (
    <View
      style={{ flex: 1, padding: 15, paddingTop: 30, alignItems: "center" }}>
      <Text>Created by Arman Kuanysh</Text>
      <Text>armankuanysh.e@gmail.com</Text>
      <TouchableOpacity
        onPress={() => {
          Linking.openURL("https://github.com/armankuanysh");
        }}>
        <Ionicons name="logo-github" size={40} color="rgba(0,0,0,.8)" />
      </TouchableOpacity>
      <Text>This application uses api of Unsplash.com</Text>
    </View>
  );
}

SettingsScreen.navigationOptions = {
  title: "About"
};

{
  /* <Button
        title="armankuanysh.e@gmail.com"
        onPress={() => {
          Linking.openURL("https://google.com");
        }}
      /> */
}
