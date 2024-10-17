import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { useTheme } from "@react-navigation/native";
import axios from "axios";
import { getAllMessageRoute, sendMessageRoute } from "../api/apiRoutes";
import uuid from "react-native-uuid";
import Messages from "../../components/Messages";
import ChatInput from "../../components/ChatInput";

const ChatPage = () => {
  const { colors } = useTheme();
  const params = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  const [image, setImage] = useState("");
  const [selectedGif, setSelectedGif] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);

  const handleSendMessage = async (message, image, gif) => {
    const messageText = message || "";
    const imageURL = image || "";
    const gifURL = gif || "";
    const messageId = uuid.v4();
    setMessages((prev) => [
      ...prev,
      {
        fromSelf: true,
        message: messageText,
        image: imageURL,
        gif: gifURL,
        messageId,
      },
    ]);

    try {
      await axios.post(sendMessageRoute, {
        from: params.currentUser,
        to: params.contactId,
        messages: messageText,
        image: imageURL,
        gif: gifURL,
        messageId,
      });
    } catch (error) {
      console.error("error sending message", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.post(getAllMessageRoute, {
        from: params.currentUser,
        to: params.contactId,
      });

      if (response.data) {
        setMessages(response.data.messages);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("Error Fetching messages", error);
    }
  };

  useEffect(() => {
    if (params.currentUser) {
      fetchMessages();
    }
  }, [params.currentUser]);

  return (
    <View className="h-full">
      <Stack.Screen
        options={{
          headerTitle: params.contactName || "Chat",
          headerStyle: { backgroundColor: colors.secondary },
          headerShadowVisible: false,
        }}
      />
      <View className="relative mb-4 h-full">
        <Messages
          messages={messages}
          setMessages={setMessages}
          currentUser={params.currentUser}
          contactId={params.contactId}
        />
        <ChatInput
          handleSendMessage={handleSendMessage}
          image={image}
          setImage={setImage}
          selectedGif={selectedGif}
          setSelectedGif={setSelectedGif}
        />
      </View>
    </View>
  );
};

export default ChatPage;
