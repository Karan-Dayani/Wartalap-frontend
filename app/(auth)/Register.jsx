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
      className="flex-1 justify-center items-center "
      style={{
        backgroundColor: colors.background,
      }}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: colors.background },
          headerTitle: "",
        }}
      />
      <View
        className="px-8 py-12 rounded-3xl shadow-2xl w-11/12"
        style={{
          backgroundColor: colors.secondary,
        }}
      >
        <Text
          className="text-3xl mb-6 text-center"
          style={{
            color: colors.text,
          }}
        >
          Register
        </Text>

        <TextInput
          placeholder="Username"
          name="username"
          onChangeText={(value) => handleChange("username", value)}
          className="w-full p-4 text-lg"
          color={colors.text}
          backgroundColor={colors.background}
          borderWidth={0}
          autoComplete="off"
        />

        <TextInput
          placeholder="Email"
          name="email"
          onChangeText={(value) => handleChange("email", value)}
          className="w-full p-4 text-lg"
          color={colors.text}
          backgroundColor={colors.background}
          borderWidth={0}
        />

        <TextInput
          placeholder="Password"
          name="password"
          onChangeText={(value) => handleChange("password", value)}
          className="w-full p-4 text-lg"
          type="password"
          color={colors.text}
          backgroundColor={colors.background}
          borderWidth={0}
        />

        <TextInput
          placeholder="Confirm Password"
          name="confirmPassword"
          onChangeText={(value) => handleChange("confirmPassword", value)}
          className="w-full p-4 text-lg"
          color={colors.text}
          backgroundColor={colors.background}
          borderWidth={0}
        />

        <TouchableOpacity
          onPress={handleSubmit}
          className="w-full bg-red-500 py-4 rounded-2xl"
        >
          <Text className="text-white text-center text-xl">Sign Up</Text>
        </TouchableOpacity>
      </View>

      <Toast />
    </View>
  );
};

export default Register;
