const Question = require("../model/Question");
const Room = require("../model/Room");
const GameResult = require("../model/GameResult");

const addToGameResult = async (roomId, userId, score) => {
  try {
    const { roomId, userId, score } = req.body;
    const gameInfo = await GameResult.findOne({ roomId: roomId });
    if (!gameInfo) {
      throw new Error("no room found");
    }
    gameInfo.results.push({ user: userId, score });
    await gameInfo.save();
    return gameInfo;
  } catch (err) {
    console.error(err);
  }
};

const getRoomById = async (roomId) => {
  try {
    const room = await Room.findById(roomId)
      .populate("users")
      .populate("questions")
      .exec();
    return room;
  } catch (err) {
    console.error("Error:", error);
  }
};

const updateRoomStatus = async (roomId, newStatus) => {
  try {
    const room = await Room.findById(roomId);
    if (!room || room.status === newStatus) {
      return;
    }
    room.status = newStatus;
    await room.save();
  } catch (error) {
    console.error("Error updating room status:", error);
  }
};

const generateRandomQuestion = async () => {
  try {
    const count = await Question.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const randomQuestion = await Question.findOne().skip(randomIndex);
    return randomQuestion;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  generateRandomQuestion,
  updateRoomStatus,
  getRoomById,
  addToGameResult,
};
