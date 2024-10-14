import { Text, View } from "react-native";
import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";

const Index = () => {
  const router = useRouter();
  const { colors } = useTheme();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await AsyncStorage.getItem("chat-app-user");
        if (user) {
          router.replace("/(tabs)/Home");
        } else {
          router.replace("/(auth)/Login");
        }
      } catch (error) {
        console.log("Error checking AsyncStorage:", error);
        router.replace("/(auth)/Login");
      }
    };
    checkUser();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background,
      }}
    >
      <Text>Loading...</Text>
    </View>
  );
};

export default Index;
