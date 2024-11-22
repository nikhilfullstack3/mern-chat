const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/token");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter All Fields");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("user already exist");
  }

  const newUser = await User.create({
    name: name,
    email: email,
    password: password,
    pic: pic,
  });

  if (newUser) {
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      pic: newUser.pic,
      token: generateToken(newUser._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create user");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if both email and password are provided
  if (!email || !password) {
    res.status(400);
    throw new Error("Please enter both email and password");
  }

  // Find the user by email
  const user = await User.findOne({ email });

  // If user exists, check if the password matches
  if (user && (await user.matchPassword(password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401); // 401 Unauthorized
    throw new Error("Invalid email or password");
  }
});

const allUsers = asyncHandler(async (req, res) => {
  const keyword = (await req.query.search)
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword)
    .find({ _id: { $ne: req.user._id } })
    .select("-password");
  res.status(200).json(users);
});

module.exports = { registerUser, loginUser, allUsers };
