import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { isLastMessage, isSameSender } from "../config/ChatLogic";
import { ChatState } from "../context/ChatProvider";
import { Avatar, Tooltip } from "@chakra-ui/react";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div
            key={m._id}
            style={{
              display: "flex",
              justifyContent:
                m.sender._id === user._id ? "flex-end" : "flex-start", // Align sender to the right, receiver to the left
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            {/* Space for avatar on the left */}
            {m.sender._id !== user._id && (
              <div style={{ width: "40px", marginRight: "10px" }}>
                {(isSameSender(messages, m, i, user._id) ||
                  isLastMessage(messages, i, user._id)) && (
                  <Tooltip
                    label={m.sender.name}
                    placement="bottom-start"
                    hasArrow
                  >
                    <Avatar
                      mt={"7px"}
                      size="sm"
                      cursor="pointer"
                      name={m.sender.name}
                      src={m.sender.pic}
                    />
                  </Tooltip>
                )}
              </div>
            )}

            {/* Display the message content */}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#B9F5D0" : "#BEE3F8"
                }`,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                alignSelf: "flex-start",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
