const express = require("express");

const router = express.Router();
const middleware = require("../middleware/auth");
const questionController = require("../controller/questionController");

router.post(
  "/add-question",
  middleware.adminAuthenticate,
  questionController.addQuestion
);

module.exports = router;
