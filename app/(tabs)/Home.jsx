import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { useTheme } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { allUsersRoute } from "../api/apiRoutes";

const Home = () => {
  const { colors } = useTheme();
  const [currentUser, setCurrentUser] = useState(null);
  const [contacts, setContacts] = useState(null);

  const handleLogout = async () => {
    await AsyncStorage.clear();
    router.replace("/(auth)/Login");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("chat-app-user");
        if (!storedUser) {
          router.replace("/(auth)/Login");
        } else {
          const parsedUser = JSON.parse(storedUser);
          setCurrentUser(parsedUser);
        }
      } catch (error) {
        console.error("Error fetching user from AsyncStorage:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser && Object.keys(currentUser).length > 0) {
        if (currentUser.isAvatarImageSet) {
          try {
            const { data } = await axios.get(
              `${allUsersRoute}/${currentUser._id}`
            );
            console.log(data);
            setContacts(data);
          } catch (error) {
            console.error("Failed to fetch contacts", error);
          }
        } else {
          router.push("/avatar/");
        }
      }
    };

    fetchContacts();
  }, [currentUser]);

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
