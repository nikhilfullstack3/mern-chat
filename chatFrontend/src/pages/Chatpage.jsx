import axios from "axios";
import React, { useState } from "react";
import { ChatState } from "../context/ChatProvider";
import SideDrawer from "../components/mis/SideDrawer";
import { Box } from "@chakra-ui/react";
import ChatBox from "../components/ChatBox";
import MyChats from "../components/MyChats";

const Chatpage = () => {
  const { user } = ChatState(); // Destructure to get the user
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex" // Use full property name
        justifyContent="space-between"
        width="100%" // Ensure proper properties
        height="91.5vh" // Use vh for height to ensure responsiveness
        padding="10px" // Optional: You can add some padding for spacing
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chatpage;
