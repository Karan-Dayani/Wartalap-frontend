import { useTheme } from "@react-navigation/native";
import { Link } from "expo-router";
import React from "react";
import { FlatList, Image, Text, View } from "react-native";

const Contacts = ({ contacts, currentUser }) => {
  const { colors } = useTheme();
  return (
    <View>
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
              // onPress={() => handleChatChange(item)}
              key={item._id}
              className="mb-5 rounded-3xl"
              style={{ backgroundColor: colors.secondary }}
            >
              <View className="flex-row items-center p-4 mb-4">
                <View
                  className="border-2 p-1 rounded-full mr-4"
                  style={{ borderColor: colors.text }}
                >
                  <Image
                    source={{
                      uri: `data:image/png;base64,${item.avatarImage}`,
                    }}
                    className="w-12 h-12 rounded-full"
                    resizeMode="cover"
                  />
                </View>

                {/* Username */}
                <Text
                  className="text-lg font-medium"
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
