import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios"; // Import axios
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSender } from "../config/ChatLogic";
import GroupChatModal from "./mis/GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  // Initialize state for logged user
  const [loggedUser, setLoggedUser] = useState(null);

  // Destructure values from ChatState
  const { chat, setChat, selectedChat, user, setSelectedChat } = ChatState();

  // Initialize toast for notifications
  const toast = useToast();

  // Fetch chats from the API
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`, // Add Bearer token for authorization
        },
      };

      const { data } = await axios.get("/api/chat", config); // API call to fetch chats
      setChat(data); // Set chat data to state
      console.log(data);
    } catch (error) {
      toast({
        title: "Error fetching chats.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  // Use useEffect to load user info and fetch chats
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo"))); // Get user from localStorage
    if (user) {
      fetchChats();
      // Fetch chats if user is present
    }
  }, [fetchAgain]); // Run the effect whenever the user state changes

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir={"column"}
      alignItems={"center"}
      p={3}
      fontFamily={"Work sans"}
      bg="white"
      width={{ base: "100%", md: "31%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}
      //   justifyContent={"space-between"}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        display="flex"
        w="100%"
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        My Chats
        <GroupChatModal>
          <Button
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display={"flex"}
        flexDir={"column"}
        p={3}
        bg={"#F8F8F8"}
        w={"100%"}
        h={"100%"}
        borderRadius={"lg"}
        overflow={"hidden"}
      >
        {chat ? (
          <Stack overflowY={"scroll"}>
            {chat.map((singleChat) => (
              <Box
                onClick={() => setSelectedChat(singleChat)}
                cursor={"pointer"}
                bg={selectedChat === singleChat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === singleChat ? "white" : "black"}
                px={3}
                py={3}
                borderRadius={"lg"}
                key={singleChat._id}
              >
                <Text>
                  {!singleChat.isGroupChat
                    ? getSender(loggedUser, singleChat.users)
                    : singleChat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
