const Question = require("../model/Question");
const Room = require("../model/Room");
const GameResult = require("../model/GameResult");

const getQuestionList = async (count) => {
  try {
    const questions = await Question.aggregate([
      { $sample: { size: count } },
      { $project: { _id: 1 } },
    ]).exec();
    return questions.map((question) => question._id);
  } catch (err) {
    console.log(err);
  }
};

const createRoom = async (req, res) => {
  try {
    const { name } = req.body;
    const questions = await getQuestionList(5);
    const room = new Room({
      name,
      users: [req.user._id],
      questions,
    });
    await room.save();
    await GameResult.create({ roomId: room._id });
    return res.json({
      message: "Created Room Successfully",
      success: true,
      room,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Something Went Wrong" });
  }
};

const fetchRoom = async (req, res) => {
  try {
    const rooms = await Room.aggregate([
      {
        $facet: {
          waitingRooms: [
            {
              $match: {
                status: "waiting",
                users: { $nin: [req.user._id] },
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                users: 1,
                status: 1,
              },
            },
          ],
          joinedRooms: [
            {
              $match: {
                status: { $in: ["waiting", "active"] },
                users: { $in: [req.user._id] },
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                users: 1,
                status: 1,
              },
            },
          ],
        },
      },
    ]);
    return res.json({
      message: "Fetched Rooms Successfully",
      success: true,
      availableRooms: rooms[0].waitingRooms,
      joinedRoom: rooms[0].joinedRooms,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Something Went Wrong" });
  }
};

const addUserToRoom = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const room = await Room.findById(roomId);
    if (!room) {
      return res.json({
        message: "Failed to add user to room",
        success: false,
      });
    }
    if (room.users.length >= 2) {
      return res.json({
        message: "Room is Full Can't join anymore",
        success: false,
      });
    }
    room.users.push(req.user._id);
    await room.save();
    return res.json({ message: "Added User to Room ", success: true, room });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Something Went Wrong" });
  }
};

module.exports = { createRoom, fetchRoom, addUserToRoom };
