import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { router, Stack } from "expo-router";
import Toast from "react-native-toast-message";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setAvatarRoute } from "../api/apiRoutes";
import { useTheme } from "@react-navigation/native";

const avatar = () => {
  const { colors } = useTheme();
  const api = "https://api.dicebear.com/6.x/lorelei/png";

  const toastOptions = {
    position: "bottom",
    autoHide: true,
    visibilityTime: 5000,
  };

  const [avatars, setAvatars] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const fetchAvatars = async () => {
    const avatarData = [];
    try {
      for (let i = 0; i < 6; i++) {
        const avatarUrl = `${api}?seed=${Math.round(Math.random() * 10000)}`;
        avatarData.push(avatarUrl);
      }
      setAvatars(avatarData);
    } catch (error) {
      console.error("Error fetching avatars:", error);
    }
  };

  useEffect(() => {
    fetchAvatars();
  }, []);

  const setProfilePicture = async () => {
    if (!selectedAvatar) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please select an avatar.",
        ...toastOptions,
      });
    } else {
      const user = JSON.parse(await AsyncStorage.getItem("chat-app-user"));
      const selectedImageUrl = avatars[selectedAvatar];
      try {
        const response = await axios.get(selectedImageUrl, {
          responseType: "arraybuffer",
        });

        const image64 = response?.request?._response;

        const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
          image: image64,
        });
        console.log(data);

        if (data.isSet) {
          user.isAvatarImageSet = true;
          user.avatarImage = data.image;
          await AsyncStorage.setItem("chat-app-user", JSON.stringify(user));
          router.replace("/(tabs)/Home");
        } else {
          Toast.show({
            type: "error",
            text1: "Validation Error",
            text2: "Error setting an avatar.",
            ...toastOptions,
          });
        }
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Validation Error",
          text2: error.message,
          ...toastOptions,
        });
      }
    }
  };

  return (
    <View
      className="flex-1 items-center justify-center min-h-screen"
      style={{
        backgroundColor: colors.background,
      }}
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Text className="text-3xl font-bold" style={{ color: colors.text }}>
        Pick Your Avatar
      </Text>

      <View className="my-4 flex-wrap flex-row justify-center">
        {avatars.map((avatar, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedAvatar(index)}
            style={{
              margin: 10,
              borderWidth: 2,
              borderColor: selectedAvatar === index ? colors.primary : "white",
              borderRadius: 48,
            }}
          >
            <Image
              source={{ uri: avatar }}
              style={{ width: 100, height: 96, borderRadius: 48 }}
              onError={(error) =>
                console.log("Image loading error", error.nativeEvent.error)
              }
            />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        className="bg-blue-500 mb-4 text-white p-4 rounded-2xl "
        onPress={fetchAvatars}
      >
        <Text className="text-white text-lg">Load more</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-green-500 text-white p-4 rounded-2xl hover:bg-blue-600"
        onPress={setProfilePicture}
      >
        <Text className="text-white text-lg">Confirm Selection</Text>
      </TouchableOpacity>
      <Toast />
    </View>
  );
};

export default avatar;
