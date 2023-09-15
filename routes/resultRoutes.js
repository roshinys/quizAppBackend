const express = require("express");

const router = express.Router();
const resultController = require("../controller/resultController");

router.post("/add-result", resultController.addResult);
router.get("/get-result/:gameId", resultController.getResult);

module.exports = router;
