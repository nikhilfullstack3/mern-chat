import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuButton,
  Text,
  Tooltip,
  MenuList,
  MenuItem,
  MenuDivider,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  useDisclosure,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { ChatState } from "../../context/ChatProvider";
import ProfileModal from "./ProfileModal";
import axios from "axios"; // Import axios for making API requests
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../../config/ChatLogic";
import NotificationBadge, { Effect } from "react-notification-badge";

const SideDrawer = () => {
  const { user, setUser } = ChatState(); // Destructure user and setUser from ChatState
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]); // Ensure searchResult is initialized as an empty array
  const [loading, setLoading] = useState(false); // For showing loader while searching
  const [loadingChat, setLoadingChat] = useState();

  const navigate = useNavigate(); // Get the navigate function
  const toast = useToast(); // Initialize toast for notifications
  const { isOpen, onOpen, onClose } = useDisclosure(); // Manage drawer state
  const {
    chat,
    setChat,
    selectedChat,
    setSelectedChat,
    notification,
    setNotification,
  } = ChatState();
  // Logout handler
  const logoutHandler = () => {
    localStorage.removeItem("userInfo"); // Remove user data from localStorage
    setUser(null); // Optionally, reset user state in context
    navigate("/"); // Redirect to home or login page
  };

  // Handle search function
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter a search term.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      setLoading(true); // Set loading to true while fetching
      const { data } = await axios.get(`/api/user?search=${search}`, {
        headers: {
          Authorization: `Bearer ${user.token}`, // Assuming you have a token for authentication
        },
      });
      setLoading(false); // Stop loading after data is fetched
      //   console.log(data, "search result");
      setSearchResult(data || []); // Ensure searchResult is an array, fallback to empty array
      //implement throttling and kry down functionality
      toast({
        title: "Search complete!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error Occurred!",
        description: "Failed to load search results",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoading(true);

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/api/chat", { userId }, config);
      if (!chat.find((c) => c._id === data._id)) setChat([data, ...chat]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error Occurred!",
        description: "Failed to load chat results",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"white"}
        w={"100%"}
        p={"5px 10px"}
        borderWidth={"5px"}
      >
        <Tooltip label="Search Users to Chat" hasArrow placement="bottom-end">
          <Button variant={"ghost"} onClick={onOpen}>
            <i className="far fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search Text
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          Talk - a - Tive
        </Text>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.scale}
              />
              <BellIcon fontSize={"2xl"} m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {notification.length === 0 ? (
                <MenuItem>No New Messages</MenuItem>
              ) : (
                notification.map((notif) => (
                  <MenuItem
                    key={notif._id}
                    onClick={() => {
                      setSelectedChat(notif.chat);
                      setNotification(notification.filter((n) => n !== notif));
                    }}
                  >
                    {notif?.chat?.isGroupChat
                      ? `New Message in ${notif.chat.chatName}`
                      : `New Message from ${getSender(user, notif.chat.users)}`}
                  </MenuItem>
                ))
              )}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon color="gray.500" />}
              variant="ghost"
              _hover={{ bg: "gray.100" }}
            >
              <Avatar
                size="sm"
                cursor={"pointer"}
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>Your Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      {/* Drawer for Search */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search Users</DrawerHeader>

          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Enter username or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch} isLoading={loading}>
                Go
              </Button>
            </Box>

            {/* Display search results */}
            {loading ? (
              <ChatLoading />
            ) : (
              Array.isArray(searchResult) &&
              searchResult.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user} // Pass the user object correctly
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display={"flex"} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
