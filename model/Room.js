const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
  status: {
    type: String,
    enum: ["waiting", "active", "completed"],
    default: "waiting",
  },
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
