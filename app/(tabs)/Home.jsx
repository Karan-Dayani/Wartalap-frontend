import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { useTheme } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = () => {
  const { colors } = useTheme();
  const handleLogout = async () => {
    await AsyncStorage.clear();
    router.replace("/(auth)/Login");
  };
  return (
    <View
      style={{
        backgroundColor: colors.background,
      }}
    >
      <Text>Home</Text>
      <TouchableOpacity onPress={handleLogout}>
        <Text style={{ color: colors.text }}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;
