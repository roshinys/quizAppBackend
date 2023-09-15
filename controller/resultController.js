const GameResult = require("../model/GameResult");

const addResult = async (req, res) => {
  try {
    const { roomId, userId, score } = req.body;
    let gameInfo = await GameResult.findOne({ roomId: roomId });
    if (!gameInfo) {
      gameInfo = await GameResult.create({ roomId });
    }
    const existingUserIndex = gameInfo.results.findIndex(
      (result) => result.user.toString() === userId
    );
    if (existingUserIndex !== -1) {
      gameInfo.results[existingUserIndex].score = score;
    } else {
      gameInfo.results.push({ user: userId, score });
    }
    await gameInfo.save();
    return res.json({ message: "Added Result", success: true, gameInfo });
  } catch (err) {
    console.log(err);
  }
};

const getResult = async (req, res) => {
  const { gameId } = req.params;
  const game = await GameResult.findById(gameId);
  const users = game.results.map((result) => ({
    userId: result.user.toString(),
    score: result.score,
  }));
  const score = {
    you:
      users.find((user) => user.userId === req.user._id.toString())?.score || 0,
    opponent:
      users.find((user) => user.userId !== req.user._id.toString())?.score || 0,
  };
  return res.json({ message: "Fetched Result", success: true, score });
};

module.exports = { addResult, getResult };
