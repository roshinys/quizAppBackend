const mongoose = require("mongoose");

const gameResultSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
    unique: true,
  },
  results: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      score: {
        type: Number,
        required: true,
      },
    },
  ],
});

const GameResult = mongoose.model("GameResult", gameResultSchema);

module.exports = GameResult;
