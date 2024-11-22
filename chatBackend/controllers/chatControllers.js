const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatmodel");
const User = require("../models/userModel");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  // Ensure userId is provided in the request body
  if (!userId) {
    console.log("userId param not sent with request");
    return res.sendStatus(400);
  }

  try {
    // Find if a one-on-one chat exists between the users
    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } }, // Logged-in user
        { users: { $elemMatch: { $eq: userId } } }, // Other user (from req.body)
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    if (isChat.length > 0) {
      // Chat found, return the chat
      res.send(isChat[0]);
    } else {
      // No chat found, create a new one
      let chatData = {
        chatName: "sender", // Not applicable for 1-on-1 chats
        isGroupChat: false,
        users: [req.user._id, userId],
      };

      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(fullChat);
    }
  } catch (error) {
    res.status(500).send({ message: "Error accessing chat" });
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    // Use await to fetch chats where the current user is a participant
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password") // Populate users, excluding the password field
      .populate("groupAdmin") // Populate groupAdmin (if any, for group chats)
      .populate("latestMessage"); // Populate the latestMessage

    // Further populate the sender of the latestMessage
    const populatedChats = await User.populate(chats, {
      path: "latestMessage.sender", // Populate the sender in the latestMessage
      select: "name pic email", // Only include name, pic, and email fields
    });

    // Send the fully populated chats as the response
    res.status(200).send(populatedChats);
  } catch (error) {
    // Handle errors
    res.status(400);
    throw new Error(error.message);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  const { users, name } = req.body;

  // Ensure the group name and users are provided
  if (!users || !name) {
    return res
      .status(400)
      .send({ message: "Please provide all required fields" });
  }

  // Parse the users array (in case it comes as a JSON string)
  let parsedUsers = JSON.parse(users);

  // Ensure that at least 2 users are provided to form a group chat
  if (parsedUsers.length < 2) {
    return res.status(400).send({
      message: "A group chat must have at least 2 other participants.",
    });
  }

  // Add the current user (creator) to the group
  parsedUsers.push(req.user);

  try {
    // Create a new group chat
    const groupChat = await Chat.create({
      chatName: name,
      users: parsedUsers,
      isGroupChat: true,
      groupAdmin: req.user._id, // Set the user who created the group as the group admin
    });

    // Populate the group chat details with users and admin info
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    // Return the newly created group chat
    res.status(200).json(fullGroupChat);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Failed to create group chat", error: error.message });
  }
});

const renameGroupChat = asyncHandler(async (req, res) => {
  const { chatId, newName } = req.body;

  // Check if chatId and newName are provided
  if (!chatId || !newName) {
    return res
      .status(400)
      .send({ message: "Chat ID and new name are required" });
  }

  try {
    // Find the group chat by ID and update the name
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName: newName },
      { new: true } // Return the updated document
    )
      .populate("users", "-password") // Populate the users (excluding passwords)
      .populate("groupAdmin", "-password"); // Populate the group admin (excluding password)

    // If the chat is not found or the update fails
    if (!updatedChat) {
      return res.status(404).send({ message: "Chat not found or not updated" });
    }

    // Send back the updated group chat
    res.status(200).json(updatedChat);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Failed to rename group chat", error: error.message });
  }
});

const addUserToGroupChat = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // Check if chatId and userId are provided
  if (!chatId || !userId) {
    return res
      .status(400)
      .send({ message: "Chat ID and User ID are required" });
  }

  try {
    // Find the chat by ID and add the user to the chat's users array
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $addToSet: { users: userId } }, // Use $addToSet to avoid duplicates
      { new: true } // Return the updated document
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    // If the chat is not found
    if (!updatedChat) {
      return res.status(404).send({ message: "Chat not found" });
    }

    // Send back the updated chat
    res.status(200).json(updatedChat);
  } catch (error) {
    res.status(500).send({
      message: "Failed to add user to group chat",
      error: error.message,
    });
  }
});
const removeUserFromGroupChat = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // Check if chatId and userId are provided
  if (!chatId || !userId) {
    return res
      .status(400)
      .send({ message: "Chat ID and User ID are required" });
  }

  try {
    // Find the chat by ID and remove the user from the chat's users array
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } }, // Use $pull to remove the user
      { new: true } // Return the updated document
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    // If the chat is not found
    if (!updatedChat) {
      return res.status(404).send({ message: "Chat not found" });
    }

    // Send back the updated chat
    res.status(200).json(updatedChat);
  } catch (error) {
    res.status(500).send({
      message: "Failed to remove user from group chat",
      error: error.message,
    });
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroupChat,
  addUserToGroupChat,
  removeUserFromGroupChat,
};
