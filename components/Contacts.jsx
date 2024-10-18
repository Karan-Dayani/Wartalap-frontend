import { useTheme } from "@react-navigation/native";
import { Link } from "expo-router";
import React from "react";
import { FlatList, Image, Text, View } from "react-native";

const Contacts = ({ contacts, currentUser, handleChatChange }) => {
  const { colors } = useTheme();
  return (
    <View className="mt-5">
      <FlatList
        data={contacts}
        keyExtractor={(contact) => contact._id}
        renderItem={({ item, i }) => {
          return (
            <Link
              href={{
                pathname: "/chat/ChatPage",
                params: {
                  currentUser: currentUser._id,
                  contactName: item.username,
                  contactId: item._id,
                },
              }}
              onPress={() => handleChatChange(item)}
              key={item._id}
              className="mb-3 rounded-3xl mx-2"
              style={{ backgroundColor: colors.secondary }}
            >
              <View className="flex-row items-center p-4">
                <View
                  className="border-2 p-1 rounded-full mr-4"
                  style={{ borderColor: colors.primary }}
                >
                  <Image
                    source={{
                      uri: `data:image/png;base64,${item.avatarImage}`,
                    }}
                    className="w-14 h-14 rounded-full"
                    resizeMode="cover"
                  />
                </View>

                {/* Username */}
                <Text
                  className="text-2xl font-medium"
                  style={{ color: colors.text }}
                >
                  {item.username}
                </Text>
              </View>
            </Link>
          );
        }}
      />
    </View>
  );
};

export default Contacts;
