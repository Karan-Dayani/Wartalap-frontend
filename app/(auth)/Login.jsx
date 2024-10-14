import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { useTheme } from "@react-navigation/native";
import { Link, router } from "expo-router";
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
          text1: "Network Error",
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
      <View className=" p-4">
        <TextInput
          placeholder="Username"
          placeholderTextColor={colors.secondary}
          name="username"
          onChangeText={(value) => handleChange("username", value)}
          className="w-full p-4 text-lg"
          color={colors.text}
          backgroundColor={colors.background}
          borderWidth={0}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor={colors.secondary}
          name="password"
          onChangeText={(value) => handleChange("password", value)}
          className="w-full p-4 text-lg"
          color={colors.text}
          backgroundColor={colors.background}
          borderWidth={0}
        />
        <TouchableOpacity onPress={handleSubmit}>
          <Text>Login</Text>
        </TouchableOpacity>
        <Link href={"/(auth)/Register"}>Register</Link>
      </View>
      <Toast />
    </View>
  );
};

export default Login;
