const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroupChat,
  addUserToGroupChat,
  removeUserFromGroupChat,
} = require("../controllers/chatControllers");

const router = express.Router();

router.route("/").post(protect, accessChat).get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroupChat);
router.route("/add-user").put(protect, addUserToGroupChat);
router.route("/remove-user").put(protect, removeUserFromGroupChat);

module.exports = router;
