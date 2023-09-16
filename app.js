require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT;
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

//routes
const authRoutes = require("./routes/authRoutes");
const middleware = require("./middleware/auth");
const questionRoutes = require("./routes/questionRoutes");
const roomRoutes = require("./routes/roomRoutes");
const resultRoutes = require("./routes/resultRoutes");
const util = require("./utils/util");

//endpoints
app.use("/auth", authRoutes);
app.use("/question", middleware.authenticate, questionRoutes);
app.use("/room", middleware.authenticate, roomRoutes);
app.use("/result", middleware.authenticate, resultRoutes);

//socket logic
const User = require("./model/User");
const rooms = {};

io.on("connection", (socket) => {
  socket.on("room", async (roomId, token) => {
    try {
      socket.join(roomId);
      const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
      const user = await User.findById(decoded.userId);
      if (!user) {
        return;
      }
      socket.user = user;
      if (!rooms[roomId]) {
        rooms[roomId] = [];
      }
      const userId = socket.user._id.toString();
      const index = rooms[roomId].indexOf(userId);
      if (index === -1) {
        rooms[roomId].push(userId);
      }
      if (rooms[roomId].length >= 2) {
        await util.updateRoomStatus(roomId, "active");
        const room = await util.getRoomById(roomId);
        const questions = room.questions;
        io.to(roomId).emit("startGame", {
          message: "active",
        });
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            const question = questions?.[i];
            io.to(roomId).emit("newQuestion", question, i);
          }, i * 10000);
        }
      }
      socket.on("disconnect", () => {
        const index = rooms[roomId]?.indexOf(userId);
        if (index !== -1) {
          rooms[roomId]?.splice(index, 1);
        }
      });
    } catch (err) {
      console.log(err);
    }
  });
  socket.on("completed", async (roomId) => {
    try {
      await util.updateRoomStatus(roomId, "completed");
      if (rooms[roomId]) {
        delete rooms[roomId];
      }
    } catch (err) {
      console.log(err);
    }
  });
  socket.on("createRoom", () => {
    socket.broadcast.emit("fetchRoom");
  });
});

app.use((req, res) => {
  res.json({ message: "Page Not Found" });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(port, () => {
      console.log("server started");
    });
  })
  .catch((err) => {
    console.log(err);
  });
