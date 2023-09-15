const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  options: [{ type: String }],
  answer: {
    type: String,
    require: true,
  },
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
