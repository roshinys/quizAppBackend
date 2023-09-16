const GameResult = require("../model/GameResult");

const addResult = async (req, res) => {
  try {
    const { roomId, userId, score } = req.body;
    const gameInfo = await GameResult.findOne({ roomId: roomId });
    if (!gameInfo) {
      throw new Error("no room found");
    }
    gameInfo.results.push({ user: userId, score });
    await gameInfo.save();
    return res.json({ message: "Added Result", success: true, gameInfo });
  } catch (err) {
    console.log(err);
    return res.json({
      message: "Something went wrong",
      success: false,
    });
  }
};

const getResult = async (req, res) => {
  try {
    const { gameId } = req.params;
    const game = await GameResult.findById(gameId);
    const users = game.results.map((result) => ({
      userId: result.user.toString(),
      score: result.score,
    }));
    const score = {
      you:
        users.find((user) => user.userId === req.user._id.toString())?.score ||
        0,
      opponent:
        users.find((user) => user.userId !== req.user._id.toString())?.score ||
        0,
    };
    return res.json({ message: "Fetched Result", success: true, score });
  } catch (err) {
    console.log(err);
    return res.json({
      message: "Something went wrong",
      success: false,
    });
  }
};

module.exports = { addResult, getResult };
