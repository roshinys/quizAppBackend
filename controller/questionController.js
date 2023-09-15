const Question = require("../model/Question");

const addSingleQuestion = async (question) => {
  try {
    const text = question.text;
    const options = question.options;
    const answer = question.answer;
    const q = new Question({
      text,
      options,
      answer,
    });
    await q.save();
    return q;
  } catch (err) {
    throw new Error(err);
  }
};

const addQuestion = async (req, res) => {
  try {
    const { questions } = req.body;
    await questions.forEach(async (question) => {
      await addSingleQuestion(question);
    });
    return res.json({
      message: "Added list of questions successfully",
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Something Went Wrong" });
  }
};

module.exports = { addQuestion };
