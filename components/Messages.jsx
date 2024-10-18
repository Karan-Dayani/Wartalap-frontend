import { View, Text, FlatList, Pressable, Modal, Image } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "@react-navigation/native";
import axios from "axios";
import { deleteMessageRoute } from "../app/api/apiRoutes";
import { TouchableOpacity } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import { storage } from "../firebaseClient";
import socket from "../socket";

const Messages = ({ messages, setMessages, currentUser, contactId }) => {
  const { colors } = useTheme();
  const [selectedMessage, setSelectedMessage] = useState();
  const [messageMenu, setMessageMenu] = useState(false);
  const [visible, setVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [gifStates, setGifStates] = useState({});
  // const scrollViewRef = useRef(null);

  // useEffect(() => {
  //   if (scrollViewRef.current) {
  //     scrollViewRef.current.scrollToEnd({ animated: true });
  //   }
  // }, [messages]);

  // useEffect(() => {
  //   scrollViewRef.current.scrollToEnd({ animated: true });
  // }, []);

  const fallbackImage = require("../assets/images/icon.png");

  const toggleGifPlay = (id) => {
    setGifStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const openImageViewer = (index) => {
    const imageIndex = images?.findIndex(
      (img) => img.url === messages[index]?.image
    );
    setCurrentImageIndex(imageIndex);
    setVisible(true);
  };
  const closeImageViewer = () => {
    setVisible(false);
    setCurrentImageIndex(0);
  };

  const images = messages
    ?.filter((message) => message.image)
    .map((message, index) => ({
      url: message.image,
      index: index,
    }));

  const handleDeleteMessage = async () => {
    if (selectedMessage?.fromSelf) {
      try {
        const messageIdToDelete =
          selectedMessage?.messageId || selectedMessage?.id;

        if (selectedMessage.image) {
          const fileRef = storage.refFromURL(selectedMessage.image);
          await fileRef.delete();
        }

        await axios.post(deleteMessageRoute, {
          messageId: messageIdToDelete,
        });

        setMessages((prev) =>
          prev.filter(
            (message) => (message.messageId || message.id) !== messageIdToDelete
          )
        );

        setSelectedMessage(null);

        socket.emit("delete-msg", {
          to: contactId,
          from: currentUser,
          messageId: messageIdToDelete,
        });
      } catch (error) {
        console.error("Error deleting message:", error);
      } finally {
        setMessageMenu(false);
      }
    }
  };

  return (
    <View style={{ backgroundColor: colors.background }} className="p-3">
      <FlatList
        ref={(ref) => (this.flatList = ref)}
        onContentSizeChange={() =>
          this.flatList.scrollToEnd({ animated: true })
        }
        onLayout={() => this.flatList.scrollToEnd({ animated: true })}
        data={messages}
        className="mb-16"
        keyExtractor={(item) => item.id || item.messageId}
        renderItem={({ item, index }) => {
          return (
            <Pressable
              key={index}
              style={{
                alignSelf: item.fromSelf ? "flex-end" : "flex-start",
                backgroundColor: item.fromSelf
                  ? colors.primary
                  : colors.secondary,
                padding: !item.message && item.image ? 5 : 12,
              }}
              className="rounded-lg max-w-[75%] my-1"
              onLongPress={() => {
                setSelectedMessage(item);
                setMessageMenu(true);
              }}
            >
              {item.gif && (
                <View className="relative">
                  <TouchableOpacity
                    onLongPress={() => {
                      setSelectedMessage(item);
                      setMessageMenu(true);
                    }}
                  >
                    <View
                      style={{ overflow: "hidden" }}
                      className="w-44 h-44 rounded-xl relative"
                    >
                      {gifStates[item.id] ? (
                        <Image
                          source={{ uri: item.gif }}
                          className="w-[100%] h-[100%]"
                          resizeMode="cover"
                          onLoad={() => {
                            setTimeout(() => {
                              setGifStates((prev) => ({
                                ...prev,
                                [item.id]: false,
                              }));
                            }, 3000);
                          }}
                        />
                      ) : (
                        <Image
                          source={fallbackImage}
                          className="w-[100%] h-[100%] opacity-10"
                          resizeMode="cover"
                        />
                      )}
                    </View>
                    {!gifStates[item.id] && (
                      <Pressable
                        onPress={() => toggleGifPlay(item.id)}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: 10,
                        }}
                      >
                        <Text style={{ color: "white" }} className="text-2xl">
                          GIF
                        </Text>
                      </Pressable>
                    )}
                  </TouchableOpacity>
                </View>
              )}
              {item.image && (
                <TouchableOpacity
                  onPress={() => openImageViewer(index)}
                  onLongPress={() => {
                    setSelectedMessage(item);
                    setMessageMenu(true);
                  }}
                >
                  <Image
                    source={{ uri: item.image }}
                    className="rounded-lg w-48 h-48"
                    style={{
                      marginBottom: item.message ? 10 : 0,
                    }}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              )}
              {item.message !== "" && (
                <Text
                  style={{ color: item.fromSelf ? "white" : colors.text }}
                  className="text-[15px]"
                >
                  {item.message}
                </Text>
              )}
            </Pressable>
          );
        }}
      />
      <Modal
        visible={visible}
        transparent={true}
        onRequestClose={closeImageViewer}
      >
        <ImageViewer
          imageUrls={images}
          index={currentImageIndex}
          onClick={closeImageViewer}
        />
      </Modal>
      <Modal
        visible={messageMenu}
        transparent={true}
        onRequestClose={() => setMessageMenu(false)}
        animationType="slide"
      >
        <View
          className="flex-1 justify-end pb-10"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
        >
          <View className="bg-white rounded-3xl p-4 shadow-lg mx-4 space-y-5">
            {selectedMessage?.fromSelf && (
              <Pressable onPress={handleDeleteMessage} className="py-2">
                <View className="flex-row justify-center items-center gap-x-2">
                  <Text className="text-red-500 text-xl">Unsend</Text>
                </View>
              </Pressable>
            )}
            {!selectedMessage?.fromSelf && (
              <View>
                <Text>Dusro ka maal nhi dekhte</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Messages;
