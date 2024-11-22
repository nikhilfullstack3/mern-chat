const express = require("express");
// const { chats } = require("./data/data");
const cors = require("cors");
const chats = require("./data/data");
const dotenv = require("dotenv");
const path = require("path");
const connectDb = require("./config/db");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes.js");
const chatRoutes = require("./routes/chatRoutes.js");
const messageRoutes = require("./routes/messageRoutes.js");
const { notFound, errorHandler } = require("./middleware/errorMiddleware.js");

const app = express();
dotenv.config();
connectDb();
app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// const __dirname = path.resolve();

// ------------------------ DEPLOYMENT ----------------------------
const __dirname1 = path.resolve();
console.log(__dirname1);

if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname1, "../chatFrontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname1, "../chatFrontend/dist", "index.html")
    );
  });
} else {
  app.get("/", (req, res) => {
    res.send("API running Succesfully");
  });
}

// ------------------------DEPLOYMENT---------------------------------
app.use(notFound);
app.use(errorHandler);

const server = app.listen(
  process.env.PORT || 3000,
  console.log("Server is runnning on 3000".rainbow.bold)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://127.0.0.1:5173",
  },
});
io.on("connection", (socket) => {
  console.log("connected to socket".magenta.bold);

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id.cyan.bold);
    console.log(userData.email.cyan.bold);
    socket.emit("connected");
  });

  // socket.on("join chat", (room) => {
  //   socket.join(room);
  //   console.log(`User Joined Room ${room}`);
  // });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log(`User Joined Room ${room}`);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    let chat = newMessageRecieved.chat;
    if (!chat.users) {
      console.log("chat.users not defined");
      return;
    }
    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) {
        return;
      }
      socket.in(user._id).emit("message recieved", newMessageRecieved);
      console.log("message recieved");
      console.log(newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
