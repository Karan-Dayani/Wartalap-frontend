import { View, Text } from "react-native";
import React from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { useTheme } from "@react-navigation/native";

const ChatPage = () => {
  const { colors } = useTheme();
  const params = useLocalSearchParams();
  return (
    <View>
      <Stack.Screen
        options={{
          headerTitle: params.contactName || "Chat",
          headerStyle: { backgroundColor: colors.secondary },
          headerShadowVisible: false,
        }}
      />
      <Text className="text-white">ChatPage</Text>
    </View>
  );
};

export default ChatPage;
