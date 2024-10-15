import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { router, Stack } from "expo-router";
import Toast from "react-native-toast-message";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setAvatarRoute } from "../api/apiRoutes";
import { useTheme } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

const avatar = () => {
  const { colors } = useTheme();
  const api = "https://api.dicebear.com/6.x/pixel-art/png";

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
      for (let i = 0; i < 4; i++) {
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
      style={{
        backgroundColor: colors.background,
      }}
      className="justify-center h-full"
    >
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-row justify-center items-center gap-5">
        <Text
          style={{ color: colors.text }}
          className="text-3xl text-center font-bold"
        >
          Pick your Avatar
        </Text>
        <TouchableOpacity
          className="bg-blue-400 p-2 rounded-full"
          onPress={fetchAvatars}
        >
          <Ionicons name="reload-outline" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View className="flex-wrap flex-row my-4 justify-center">
        {avatars.map((avatar, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => setSelectedAvatar(i)}
            style={{
              margin: 20,
              borderWidth: 2,
              borderRadius: 15,
              borderColor: selectedAvatar === i ? colors.primary : "white",
            }}
          >
            <Image
              source={{ uri: avatar }}
              style={{ width: 100, height: 100 }}
              onError={(error) =>
                console.log("Image loading error", error.nativeEvent.error)
              }
            />
          </TouchableOpacity>
        ))}
      </View>

      <View className="flex-row justify-center gap-5">
        <TouchableOpacity
          className="p-4 rounded-lg"
          style={{ backgroundColor: colors.primary }}
          onPress={setProfilePicture}
        >
          <Text className="text-lg" style={{ color: colors.text }}>
            Confirm Selection
          </Text>
        </TouchableOpacity>
      </View>
      <Toast />
    </View>
  );
};

export default avatar;
