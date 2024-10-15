import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { useTheme } from "@react-navigation/native";
import { Link, router, Stack } from "expo-router";
import { loginRoute } from "../api/apiRoutes";
import Toast from "react-native-toast-message";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = () => {
  const { colors } = useTheme();
  const toastOptions = {
    postion: "bottom",
    autoHide: "true",
    visibilityTime: 5000,
  };
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleValidation = () => {
    const { password, username } = formData;
    if (password === "" || username === "") {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Username and Password are required.",
        ...toastOptions,
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();
    if (handleValidation()) {
      const { password, username } = formData;
      try {
        const { data } = await axios.post(loginRoute, {
          username,
          password,
        });
        if (data.status === false) {
          Toast.show({
            type: "error",
            text1: "Login Error",
            text2: data.msg,
            ...toastOptions,
          });
        } else if (data.status === true) {
          await AsyncStorage.setItem(
            "chat-app-user",
            JSON.stringify(data.user)
          );
          router.replace("/(tabs)/Home");
        }
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Error Occured",
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
      <Text
        style={{ color: colors.text }}
        className="text-center text-3xl font-bold mb-3"
      >
        Login
      </Text>
      <View className="p-4">
        <TextInput
          placeholder="Username"
          placeholderTextColor={colors.tabBarBtInActive}
          name="username"
          onChangeText={(value) => handleChange("username", value)}
          className="w-full p-4 text-lg rounded-md mb-2"
          color={colors.text}
          backgroundColor={colors.secondary}
          borderWidth={0}
        />
        <TextInput
          type="password"
          secureTextEntry={true}
          placeholder="Password"
          placeholderTextColor={colors.tabBarBtInActive}
          name="password"
          onChangeText={(value) => handleChange("password", value)}
          className="w-full p-4 text-lg rounded-md mt-2"
          color={colors.text}
          backgroundColor={colors.secondary}
          borderWidth={0}
        />
        <TouchableOpacity
          onPress={handleSubmit}
          style={{ backgroundColor: colors.primary }}
          className="rounded-md p-3 my-4"
        >
          <Text style={{ color: colors.text }} className="text-center text-lg">
            Login
          </Text>
        </TouchableOpacity>
        <Text style={{ color: colors.text }} className="text-center">
          Are you new here?{" "}
          <Link href={"/(auth)/Register"} className="text-blue-400">
            Register
          </Link>
        </Text>
      </View>
      <Toast />
    </View>
  );
};

export default Login;
