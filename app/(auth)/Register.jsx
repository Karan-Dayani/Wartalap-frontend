import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Toast from "react-native-toast-message";
import axios, { Axios } from "axios";
import { registerRoute } from "../api/apiRoutes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, Stack } from "expo-router";
import { useTheme } from "@react-navigation/native";

const Register = () => {
  const { colors } = useTheme();
  const toastOptions = {
    postion: "bottom",
    autoHide: "true",
    visibilityTime: 5000,
  };

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = formData;
    if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Password Mismatch",
        text2: "Passwords do not match.",
        ...toastOptions,
      });
      return false;
    } else if (username.length < 3) {
      Toast.show({
        type: "error",
        text1: "Username Error",
        text2: "Username should be greater than 3 characters.",
        ...toastOptions,
      });
      return false;
    } else if (password.length <= 5) {
      Toast.show({
        type: "error",
        text1: "Password Error",
        text2: "Password should be at least 8 characters long.",
        ...toastOptions,
      });
      return false;
    } else if (email === "") {
      Toast.show({
        type: "error",
        text1: "Email Error",
        text2: "Email is required.",
        ...toastOptions,
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (handleValidation()) {
      const { password, username, email } = formData;
      try {
        const { data } = await axios.post(registerRoute, {
          password,
          username,
          email,
        });
        if (data.status === false) {
          Toast.show({
            type: "error",
            text1: "Registration Error Occured",
            text2: data.message,
            ...toastOptions,
          });
        }
        if (data.status === true) {
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
      style={{ backgroundColor: colors.background }}
      className="justify-center h-full"
    >
      <Stack.Screen options={{ headerShown: false }} />
      <Text
        style={{ color: colors.text }}
        className="text-center text-3xl font-bold mb-3"
      >
        Register
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
          placeholder="Email"
          placeholderTextColor={colors.tabBarBtInActive}
          name="email"
          onChangeText={(value) => handleChange("email", value)}
          className="w-full p-4 text-lg rounded-md my-2"
          color={colors.text}
          backgroundColor={colors.secondary}
          borderWidth={0}
        />
        <TextInput
          secureTextEntry={true}
          placeholder="Password"
          placeholderTextColor={colors.tabBarBtInActive}
          name="password"
          onChangeText={(value) => handleChange("password", value)}
          className="w-full p-4 text-lg rounded-md my-2"
          color={colors.text}
          backgroundColor={colors.secondary}
          borderWidth={0}
        />
        <TextInput
          secureTextEntry={true}
          placeholder="Confirm Password"
          placeholderTextColor={colors.tabBarBtInActive}
          name="confirmPassword"
          onChangeText={(value) => handleChange("confirmPassword", value)}
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
            Register
          </Text>
        </TouchableOpacity>
      </View>
      <Toast />
    </View>
  );
};

export default Register;
